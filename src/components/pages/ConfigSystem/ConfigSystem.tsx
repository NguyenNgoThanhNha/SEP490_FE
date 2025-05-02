import { configService } from "@/services/configService";
import { useState } from "react";
import { Play} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/ui/table";
import { Button } from "@/components/atoms/ui/button";

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
];

export default function CronJobTable() {
  const [lastRunTimes, setLastRunTimes] = useState<Record<string, Date | null>>(() => {
    const initialTimes: Record<string, Date | null> = {};
    apiDescriptions.forEach((api) => {
      initialTimes[api.handler] = null;
    });
    return initialTimes;
  });

  const handleRunJob = async (handlerKey: string) => {
    try {
      if (handlerKey in configService) {
        await configService[handlerKey as keyof typeof configService]();
        setLastRunTimes((prev) => ({
          ...prev,
          [handlerKey]: new Date(),
        }));
      } else {
        console.warn("Handler không tồn tại:", handlerKey);
      }
    } catch (error) {
      console.error("Lỗi khi chạy job:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cron Job Admin Panel</CardTitle>
        <CardDescription>Quản lý và chạy thủ công các tác vụ tự động của hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Tác vụ</TableHead>
              <TableHead className="hidden md:table-cell">Mô tả</TableHead>
              <TableHead className="hidden md:table-cell">Lần chạy cuối</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiDescriptions.map((api, index) => (
              <TableRow key={api.key}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{api.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{api.description}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{api.description}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {lastRunTimes[api.handler]
                    ? lastRunTimes[api.handler]?.toLocaleString()
                    : "Chưa chạy"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleRunJob(api.handler)}
                    size="sm"
                    className="bg-[#516d19]"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Chạy ngay
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
