import { useEffect, useState } from "react";
import { StaffSwapModal } from "./StaffSwapModal";
import { StaffReplaceModal } from "./StaffReplace";


interface ModalWrapperProps {
  availableStaff: any[];
  appointment: {
    appointmentTime: string;
    appointmentEndTime: string;
  };
  staffLeaveId: number;
  onClose: () => void;
  onReplaceStaff: (newStaffId: number) => void;
  onSwapSuccess?: () => void;
}

export function StaffModalController({
  availableStaff,
  appointment,
  staffLeaveId,
  onClose,
  onReplaceStaff,
  onSwapSuccess,
}: ModalWrapperProps) {
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    if (availableStaff.length === 0) {
      setShowSwapModal(true);
    }
  }, [availableStaff]);

  if (showSwapModal) {
    return (
      <StaffSwapModal
        staffLeaveId={staffLeaveId}
        appointment={appointment}
        onClose={onClose}
        onSuccess={onSwapSuccess}
      />
    );
  }

  return (
    <StaffReplaceModal
      availableStaff={availableStaff}
      onClose={onClose}
      onReplaceStaff={onReplaceStaff}
    />
  );
}
