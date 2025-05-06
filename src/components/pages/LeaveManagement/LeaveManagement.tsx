import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import staffService from "@/services/staffService"
import type { TAppointment } from "@/types/appoinment.type"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/ui/tabs"
import { AffectedAppointmentsModal } from "./AffectedAppointment"
import { StaffReplaceModal } from "@/components/organisms/LeaveRequest/StaffReplace"
import { MonthSelector } from "@/components/organisms/LeaveRequest/MonthSelect"
import { LeaveRequestCard } from "@/components/organisms/LeaveRequest/LeaveRequestCard"
import appoinmentService from "@/services/appoinmentService"
import toast from "react-hot-toast"
import { TStaff } from "@/types/staff.type"
import { useTranslation } from "react-i18next"

export interface StaffLeave {
  leaveDate: string
  staff: TStaff
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
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false)
  const [showReplaceModal, setShowReplaceModal] = useState(false)
  const [affectedAppointments, setAffectedAppointments] = useState<TAppointment[]>([])
  const [selectedRequest, setSelectedRequest] = useState<StaffLeave | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null)
  const [availableStaff, setAvailableStaff] = useState<TStaff[]>([])
  const {t} = useTranslation()
  useEffect(() => {
    fetchLeaveRequests()
  }, [branchId, selectedMonth])

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
    } catch {
      toast.error(t("cannotLoadLeaveRequests"))
    }
  }

  const handleApprove = async (staffLeaveId: number) => {
    try {
      const response = await staffService.approveLeave(staffLeaveId)
      if (response.success) {
        toast.success(t("approvedLeaveRequest"))
        setLeaveRequests((prev) =>
          prev.map((leave) => (leave.id === staffLeaveId ? { ...leave, status: "approved" } : leave)),
        )
      } else {
        toast.error("cannotApproveLeaveRequest")
      }
    } catch {
      toast.error("errorApprovingLeaveRequest")
    }
  }

  const handleReject = async (staffLeaveId: number) => {
    try {
      const response = await staffService.rejectLeave(staffLeaveId)
      if (response.success) {
        toast.success("rejectedLeaveRequest")
        setLeaveRequests((prev) =>
          prev.map((leave) => (leave.id === staffLeaveId ? { ...leave, status: "rejected" } : leave)),
        )
      } else {
        toast.error("cannotRejectLeaveRequest")
      }
    } catch  {
      toast.error("errorRejectingLeaveRequest")
    }
  }

  const handleViewAppointments = async (staffLeaveId: number) => {
    try {
      const response = await staffService.getStaffLeaveAppointments(staffLeaveId)
      if (response.success && response.result?.data) {
        setAffectedAppointments(response.result.data.appointments)
        const selected = leaveRequests.find((leave) => leave.id === staffLeaveId)
        setSelectedRequest(selected || null)
        setShowAppointmentsModal(true)
      } else {
        toast.error("cannotLoadLeaveAppointments")
      }
    } catch {
      toast.error("errorLoadingLeaveAppointments")
    }
  }

  const handleOpenReplaceModal = async (appointment: TAppointment) => {
    setSelectedAppointment(appointment);

    try {
      const [date, startTime] = appointment.appointmentsTime.split("T");
      const [, endTime] = appointment.appointmentEndTime.split("T");

      const payload: StaffReplacementProps = {
        branchId: branchId,
        startTime,
        endTime,
        date,
      };



      const response = await staffService.staffReplacement(payload);

      if (response?.data) {

        setAvailableStaff(response.data);
      } else {
        setAvailableStaff([]);
        toast("cannotLoadAvailableStaff");
      }

      setShowReplaceModal(true);
      setShowAppointmentsModal(false);
    } catch  {
      toast.error(t("cannotLoadAvailableStaff"));
      setAvailableStaff([]);
      setShowReplaceModal(true);
      setShowAppointmentsModal(false);
    }
  };

  const handleReplaceStaff = async (newStaffId: number) => {
    if (!selectedAppointment) return;

    // Kiểm tra nếu staffId mới trùng với staffId hiện tại
    if (selectedAppointment.staffId === newStaffId) {
      toast.error(t("staffAlreadyAssigned")); // Hiển thị thông báo lỗi
      return;
    }

    const appointmentId = selectedAppointment.appointmentId;
    const updateData: UpdateAppointmentProps = {
      id: appointmentId,
      customerId: selectedAppointment.customerId,
      staffId: newStaffId,
      serviceId: selectedAppointment.serviceId,
      branchId: selectedAppointment.branchId,
      appointmentsTime: selectedAppointment.appointmentsTime,
      status: selectedAppointment.status,
      statusPayment: selectedAppointment.statusPayment,
      notes: selectedAppointment.notes,
      feedback: selectedAppointment.feedback,
    };

    try {
      const response = await appoinmentService.updateAppointment(appointmentId, updateData);
      if (response.success) {
        toast.success(t("staffReplacedSuccessfully"));
        setShowReplaceModal(false);
        setSelectedAppointment(null);
        setAffectedAppointments((prev) =>
          prev.map((app) =>
            app.appointmentId === appointmentId
              ? { ...app, staffId: newStaffId }
              : app
          )
        );
      } else {
        toast.error(t("cannotReplaceStaff"));
      }
    } catch {
      toast.error(t("errorReplacingStaff"));
    }
  };


  const renderLeaveRequests = (requests: StaffLeave[]) => {
    if (requests.length === 0) {
      return <div className="text-center text-gray-500">{t("noData")}</div>
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <LeaveRequestCard
            key={request.id}
            request={request}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewAppointments={handleViewAppointments}
            canApproveOrReject={request.status === "pending"}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="pending">{t("Pending")}</TabsTrigger>
          <TabsTrigger value="approved">{t("approved")}</TabsTrigger>
          <TabsTrigger value="rejected">{t("rejected")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderLeaveRequests(leaveRequests)}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {renderLeaveRequests(leaveRequests.filter((r) => r.status === "pending"))}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {renderLeaveRequests(leaveRequests.filter((r) => r.status === "approved"))}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {renderLeaveRequests(leaveRequests.filter((r) => r.status === "rejected"))}
        </TabsContent>
      </Tabs>

      {showAppointmentsModal && selectedRequest && (
        <AffectedAppointmentsModal
          appointments={affectedAppointments}
          request={{
            staffName: selectedRequest.staffName,
            startDate: selectedRequest.startDate,
            endDate: selectedRequest.endDate,
          }}
          onClose={() => setShowAppointmentsModal(false)}
          onReplaceStaff={handleOpenReplaceModal}
        />
      )}

      {showReplaceModal && selectedAppointment && (
        <StaffReplaceModal
          availableStaff={availableStaff}
          onClose={() => {
            setShowReplaceModal(false)
            setShowAppointmentsModal(true)
          }}
          onReplaceStaff={(newStaffId) => handleReplaceStaff(newStaffId)}
        />
      )}
    </div>
  )
}
