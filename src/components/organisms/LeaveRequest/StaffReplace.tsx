import { useState } from "react";
import { Button } from "@/components/atoms/ui/button";
import { useTranslation } from "react-i18next";

interface StaffReplaceModalProps {
  availableStaff: {
    staffId: number;
    staffInfo: {
      userId: number;
      userName: string;
      fullName: string;
    };
  }[];
  onClose: () => void;
  onReplaceStaff: (newStaffId: number) => void;
}

export function StaffReplaceModal({
  availableStaff,
  onClose,
  onReplaceStaff,
}: StaffReplaceModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const { t } = useTranslation();

  

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-xl font-semibold mb-4">{t("select_replacement_staff")}</h2>

        {availableStaff.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {t("no_available_staff")}
          </div>
        ) : (
          <div className="space-y-3">
            {availableStaff.map((staff) => (
              <div
                key={staff.staffId}
                onClick={() => setSelectedStaffId(staff.staffId)}
                className={`cursor-pointer p-4 border rounded-lg ${selectedStaffId === staff.staffId
                    ? "border-purple-500 bg-purple-50"
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
            onClick={() => selectedStaffId && onReplaceStaff(selectedStaffId)}
            disabled={!selectedStaffId}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {t("confirm_replacement")}
          </Button>
        </div>
      </div>
    </div>
  );
}
