import { useEffect, useState } from "react"
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/ui/tabs"
import { User, Calendar } from "lucide-react"
import staffService from "@/services/staffService"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Select, message } from "antd"
import { TAppointment } from "@/types/appoinment.type"
import { AffectedAppointmentsModal } from "./AffectedAppointment"; // Import modal

const { Option } = Select

interface StaffLeave {
  staff: any
  id: number
  staffLeaveId: number
  staffName: string
  staffId: string
  startDate: string
  endDate: string
  status: string
  reason: string
  affectedAppointments: TAppointment[]
}

export function LeaveRequestList() {
  const [leaveRequests, setLeaveRequests] = useState<StaffLeave[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId)
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"))
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái hiển thị modal
  const [affectedAppointments, setAffectedAppointments] = useState<TAppointment[]>([]); // Lưu danh sách cuộc hẹn bị ảnh hưởng
  const [selectedRequest, setSelectedRequest] = useState<StaffLeave | null>(null); // Lưu yêu cầu nghỉ phép được chọn

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await staffService.staffLeaveOfBranch(branchId, selectedMonth)
        if (response.success) {
          const staffLeaves = response.result?.data.staffLeaves.map((leave: StaffLeave) => ({
            id: leave.staffLeaveId,
            staffName: leave.staff?.staffInfo.fullName,
            staffId: leave.staff.staffInfo.userName,
            startDate: leave.leaveDate,
            endDate: leave.leaveDate,
            status: leave.status.toLowerCase(),
            reason: leave.reason,
            affectedAppointments: [],
          }))
          setLeaveRequests(staffLeaves)
        }
      } catch (error) {
        console.error("Failed to fetch leave requests:", error)
      }
    }

    fetchLeaveRequests()
  }, [branchId, selectedMonth])

  const handleApprove = async (staffLeaveId: number) => {
    try {
      const response = await staffService.approveLeave(staffLeaveId)
      if (response.success) {
        message.success("Leave approved successfully!")
        setLeaveRequests((prev) =>
          prev.map((leave) =>
            leave.id === staffLeaveId ? { ...leave, status: "approved" } : leave
          )
        )
      } else {
        message.error("Failed to approve leave.")
      }
    } catch (error) {
      console.error("Error approving leave:", error)
      message.error("An error occurred while approving leave.")
    }
  }

  const handleReject = async (staffLeaveId: number) => {
    try {
      const response = await staffService.rejectLeave(staffLeaveId)
      if (response.success) {
        message.success("Leave rejected successfully!")
        setLeaveRequests((prev) =>
          prev.map((leave) =>
            leave.id === staffLeaveId ? { ...leave, status: "rejected" } : leave
          )
        )
      } else {
        message.error("Failed to reject leave.")
      }
    } catch (error) {
      console.error("Error rejecting leave:", error)
      message.error("An error occurred while rejecting leave.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Đang chờ</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Đã từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewAppointments = async (staffLeaveId: number) => {
    try {
      const response = await staffService.getStaffLeaveAppointments(staffLeaveId);
      if (response.success && response.result?.data) {
        setAffectedAppointments(response.result.data.appointments);
        const selected = leaveRequests.find((leave) => leave.id === staffLeaveId);
        setSelectedRequest(selected || null);
        setShowModal(true);
      } else {
        message.error("Không thể lấy danh sách cuộc hẹn bị ảnh hưởng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cuộc hẹn bị ảnh hưởng:", error);
      message.error("Đã xảy ra lỗi khi lấy danh sách cuộc hẹn.");
    }
  };

  return (
    <div>
      {/* Dropdown chọn tháng */}
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="month-select" className="font-medium">
          Chọn tháng:
        </label>
        <Select
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
          style={{ width: 150 }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("vi", { month: "long" })}
            </Option>
          ))}
        </Select>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Đang chờ</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {leaveRequests.length === 0 ? (
            <div className="text-center text-gray-500">No data</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leaveRequests.map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={request}
                  statusBadge={getStatusBadge(request.status)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewAppointments={handleViewAppointments}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {leaveRequests.filter((r) => r.status === "pending").length === 0 ? (
            <div className="text-center text-gray-500">No data</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leaveRequests
                .filter((r) => r.status === "pending")
                .map((request) => (
                  <LeaveRequestCard
                    key={request.id}
                    request={request}
                    statusBadge={getStatusBadge(request.status)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewAppointments={handleViewAppointments}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {leaveRequests.filter((r) => r.status === "approved").length === 0 ? (
            <div className="text-center text-gray-500">No data</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leaveRequests
                .filter((r) => r.status === "approved")
                .map((request) => (
                  <LeaveRequestCard
                    key={request.id}
                    request={request}
                    statusBadge={getStatusBadge(request.status)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewAppointments={handleViewAppointments} // Truyền hàm vào
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {leaveRequests.filter((r) => r.status === "rejected").length === 0 ? (
            <div className="text-center text-gray-500">No data</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leaveRequests
                .filter((r) => r.status === "rejected")
                .map((request) => (
                  <LeaveRequestCard
                    key={request.id}
                    request={request}
                    statusBadge={getStatusBadge(request.status)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onViewAppointments={handleViewAppointments} // Truyền hàm vào
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Hiển thị modal */}
      {showModal && selectedRequest && (
        <AffectedAppointmentsModal
          appointments={affectedAppointments}
          request={{
            staffName: selectedRequest.staffName,
            startDate: selectedRequest.startDate,
            endDate: selectedRequest.endDate,
          }}
          onClose={() => setShowModal(false)} // Đóng modal
          onReplaceStaff={(appointment) => {
            console.log("Replace staff for appointment:", appointment);
          }}
        />
      )}
    </div>
  )
}

function LeaveRequestCard({ request, statusBadge, onApprove, onReject, onViewAppointments }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{request.staffName}</CardTitle>
          {statusBadge}
        </div>
        <CardDescription className="flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          {request.staffId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Lý do:</span> {request.reason}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {request.status === "pending" && ( // Chỉ hiển thị nút nếu status là "pending"
          <>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full bg-green-100 text-green-800 hover:bg-green-200"
                onClick={() => onApprove(request.id)}
              >
                Duyệt
              </Button>
              <Button
                variant="outline"
                className="w-full bg-red-100 text-red-800 hover:bg-red-200"
                onClick={() => onReject(request.id)}
              >
                Từ chối
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onViewAppointments(request.id)} // Gọi hàm khi nhấn
            >
              Xem lịch hẹn bị ảnh hưởng
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
