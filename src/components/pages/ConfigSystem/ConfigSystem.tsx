import { Play } from "lucide-react"
import { configService } from "@/services/configService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table"
import { Button } from "@/components/atoms/ui/button"
import { useTranslation } from "react-i18next"

const apiDescriptions = [
  {
    name: "Cập nhật bước routine của người dùng",
    key: "updateUserRoutineStep",
    handler: "updateUserRoutineStep",
    description: "Cập nhật tiến độ các bước routine của người dùng theo lịch trình",
  },
  {
    name: "Cập nhật trạng thái đơn hàng routine",
    key: "updateStatusOrderRoutine",
    handler: "updateStatusOrderRoutine",
    description: "Tự động cập nhật trạng thái đơn hàng routine dựa trên tiến độ",
  },
  {
    name: "Hủy lịch hẹn đơn hàng đã quá hạn",
    key: "cancelAppointment",
    handler: "cancelAppointment",
    description: "Tự động hủy các lịch hẹn đã quá thời gian cho phép",
  },
  {
    name: "Nhắc khách hàng chọn chuyên viên ",
    key: "reminderAppointment",
    handler: "reminderAppointment",
    description: "Nhắc khách hàng chọn chuyên viên cho lịch hẹn",
  },
]

export default function CronJobTable() {
  const { t } = useTranslation()

  const handleRunJob = async (handlerKey: string) => {
    try {
      if (handlerKey in configService) {
        await configService[handlerKey as keyof typeof configService]()
        console.log(`Đã chạy ${handlerKey}`)
      } else {
        console.warn("Handler không tồn tại:", handlerKey)
      }
    } catch (error) {
      console.error("Lỗi khi chạy job:", error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("cronjobadminpanel")}</CardTitle>
        <CardDescription>{t("cronjobdes")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>{t("task")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiDescriptions.map((api, index) => (
              <TableRow key={api.key}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{api.name}</TableCell>
                <TableCell>{api.description}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleRunJob(api.handler)}
                    size="sm"
                    className="bg-[#516d19] hover:bg-[#3e5214]"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {t("run")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
