import { useState } from "react"
import { CheckCircle2, Play, AlertCircle, Loader2 } from "lucide-react"
import { configService } from "@/services/configService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table"
import { Button } from "@/components/atoms/ui/button"
import { Badge } from "@/components/atoms/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/atoms/ui/tooltip"
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

type JobStatus = "idle" | "running" | "success" | "error"

interface JobState {
  lastRunTime: Date | null
  status: JobStatus
  error?: string
}

export default function CronJobTable() {
  const {t} = useTranslation()
  const [jobStates, setJobStates] = useState<Record<string, JobState>>(() => {
    const initialStates: Record<string, JobState> = {}
    apiDescriptions.forEach((api) => {
      initialStates[api.handler] = {
        lastRunTime: null,
        status: "idle",
      }
    })
    return initialStates
  })

  const handleRunJob = async (handlerKey: string) => {
    setJobStates((prev) => ({
      ...prev,
      [handlerKey]: {
        ...prev[handlerKey],
        status: "running",
      },
    }))

    try {
      if (handlerKey in configService) {
        await configService[handlerKey as keyof typeof configService]()
        setJobStates((prev) => ({
          ...prev,
          [handlerKey]: {
            lastRunTime: new Date(),
            status: "success",
          },
        }))
      } else {
        console.warn("Handler không tồn tại:", handlerKey)
        setJobStates((prev) => ({
          ...prev,
          [handlerKey]: {
            ...prev[handlerKey],
            status: "error",
            error: "Handler không tồn tại",
          },
        }))
      }
    } catch (error) {
      console.error("Lỗi khi chạy job:", error)

      setJobStates((prev) => ({
        ...prev,
        [handlerKey]: {
          ...prev[handlerKey],
          status: "error",
          error: error instanceof Error ? error.message : "Lỗi không xác định",
        },
      }))
    }
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case "running":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {t("running")}
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {t("done")}
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {t("error")}
          </Badge>
        )
      default:
        return null
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
              <TableHead className="hidden md:table-cell">{t('description')}</TableHead>
              <TableHead className="hidden md:table-cell">{t('Status')} </TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiDescriptions.map((api, index) => {
              const jobState = jobStates[api.handler]

              return (
                <TableRow key={api.key}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{api.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{api.description}</div>

                      <div className="flex items-center gap-2 mt-1 md:hidden">
                        {jobState.status !== "idle" && (
                          <>
                            {getStatusBadge(jobState.status)}
                            {jobState.lastRunTime && (
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(jobState.lastRunTime)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{api.description}</TableCell>

                  <TableCell className="hidden md:table-cell">
                    {getStatusBadge(jobState.status)}

                    {jobState.status === "error" && jobState.error && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-4 w-4 text-red-500 ml-1 inline cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{jobState.error}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>

               

                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleRunJob(api.handler)}
                      size="sm"
                      className="bg-[#516d19] hover:bg-[#3e5214]"
                      disabled={jobState.status === "running"}
                    >
                      {jobState.status === "running" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("running")}
                        </>
                      ) : jobState.status === "success" ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          {t("runagain")}
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          {t("run")}  
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
