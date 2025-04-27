import React, { useState } from "react";
import { Button } from "@/components/atoms/ui/button";
import { Input } from "antd";
import { TAppointment } from "@/types/appoinment.type";
import { useTranslation } from "react-i18next";

interface EventPopupProps {
  selectedTask: TAppointment | null;
  onClose: () => void;
  onComplete: (updatedTask: TAppointment) => void;
  roleId: number;
}

const EventPopup: React.FC<EventPopupProps> = ({ selectedTask, onClose, onComplete, roleId }) => {
  const { t } = useTranslation();
  const [additionalService, setAdditionalService] = useState("");
  const [staff, setStaff] = useState(selectedTask?.staff.name || "");
  const [showButtons, setShowButtons] = useState(true);

  if (!selectedTask) return null;

  const handleUpdate = () => {
    const updatedTask: TAppointment = {
      ...selectedTask,
      service: {
        ...selectedTask.service,
        name: `${selectedTask.service.name}, ${additionalService}`,
      },
      staff: {
        ...selectedTask.staff,
        name: staff,
      },
    };

    onComplete(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("appointmentDetails")}</h2>

        <div className="mb-4">
          <p className="text-sm font-medium">
            {t("Status")}:{" "}
            <span
              className={`px-2 py-1 rounded ${selectedTask.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {selectedTask.status === "Completed" ? t("Completed") : t("inProgress")}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">{t("service")}:</span> {selectedTask.service.name}
          </p>
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">{t("Duration")}:</span> {selectedTask.service.duration} {t("minutes")}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">{t("StaffName")}:</span> {selectedTask.staff.staffInfo.fullName}
          </p>
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">{t("Email")}:</span> {selectedTask.staff.staffInfo.email || t("noData")}
          </p>
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">{t("PhoneNumber")}:</span> {selectedTask.staff.staffInfo.phoneNumber || t("noData")}
          </p>
          <p className="text-sm font-medium text-gray-600 mt-4">
            <span className="font-semibold text-gray-800">{t("startTime")}:</span>{" "}
            {new Date(selectedTask.appointmentsTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">{t("endTime")}:</span>{" "}
            {new Date(selectedTask.appointmentEndTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {roleId !== 2 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">{t("addService")}</label>
            <Input
              placeholder={t("enterNewService")}
              value={additionalService}
              onChange={(e) => setAdditionalService(e.target.value)}
              className="mt-2"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">{t("changeStaff")}</label>
            <Input
              placeholder={t("enterNewStaff")}
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              className="mt-2"
            />
          </div>
        )}

        {/* Buttons */}
        {roleId !== 2 && showButtons && (
          <div className="mt-6">
            <Button className="w-full bg-[#516d19] text-white py-2 rounded hover:bg-blue-600" onClick={handleUpdate}>
              {t("updateAppointment")}
            </Button>
          </div>
        )}
        <Button
          variant="outline"
          onClick={onClose}
          className="mt-2 w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100"
        >
          {t("close")}
        </Button>
      </div>
    </div>
  );
};

export default EventPopup;