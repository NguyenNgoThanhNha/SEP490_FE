import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/ui/button";
import { useTranslation } from "react-i18next";
import staffService from "@/services/staffService";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Appointment {
  appointmentTime: string;      
  appointmentEndTime: string;   
}

interface StaffSwapModalProps {
  staffLeaveId: number;
  appointment: Appointment;
  onClose: () => void;
  onSuccess?: () => void;
}

export function StaffSwapModal({
  staffLeaveId,
  appointment,
  onClose,
  onSuccess,
}: StaffSwapModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);
  const [shiftId, setShiftId] = useState<number | null>(null);
  const { t } = useTranslation();
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [date, startTime] = appointment.appointmentTime.split("T");
        const [, endTime] = appointment.appointmentEndTime.split("T");

        const shiftRes = await staffService.getListShift();
        const shifts = shiftRes?.result?.data || [];

        const matchedShift = shifts.find((shift: any) => {
          return shift.startTime === startTime && shift.endTime === endTime;
        });

        if (!matchedShift) {
          toast.error(t("no_matching_shift"));
          return;
        }

        setShiftId(matchedShift.shiftId);

        const payload = {
          branchId,
          date,
          startTime,
          endTime,
        };
        const staffRes = await staffService.unassignStaff(payload);
        if (staffRes?.success && staffRes.result?.data) {
          setAvailableStaff(staffRes.result.data);
        } else {
          setAvailableStaff([]);
          toast.error(t("cannotLoadAvailableStaff"));
        }
      } catch (error) {
        console.error(error);
        toast.error(t("something_went_wrong"));
        setAvailableStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointment, branchId]);

  const handleConfirmSwap = async () => {
    if (!selectedStaffId || !shiftId) {
      toast.error(t("please_select_staff_or_shift"));
      return;
    }

    setLoading(true);
    try {
      const [date] = appointment.appointmentTime.split("T");
      const response = await staffService.updateWorkSchedule({
        staffLeaveId,
        staffReplaceId: selectedStaffId,
        shiftId,
        workDate: date,
      });

      if (response?.success) {
        toast.success(t("swap_successful"));
        onSuccess?.();
        onClose();
      } else {
        toast.error(t("swap_failed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{t("select_staff_to_swap")}</h2>
        {loading ? (
          <div className="text-center py-8 text-slate-500">{t("loading")}</div>
        ) : availableStaff.length === 0 ? (
          <div className="text-center py-8 text-slate-500">{t("no_available_staff")}</div>
        ) : (
          <div className="space-y-3">
            {availableStaff.map((staff) => (
              <div
                key={staff.staffId}
                onClick={() => setSelectedStaffId(staff.staffId)}
                className={`cursor-pointer p-4 border rounded-lg ${selectedStaffId === staff.staffId
                  ? "border-green-500 bg-green-50"
                  : "hover:bg-slate-50"
                  }`}
              >
                <div className="font-medium">{staff.staffInfo.fullName}</div>
                <div className="text-sm text-slate-500">{staff.staffInfo.userName}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirmSwap}
            disabled={!selectedStaffId || loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? t("swapping") + "..." : t("confirm_swap")}
          </Button>
        </div>
      </div>
    </div>
  );
}
