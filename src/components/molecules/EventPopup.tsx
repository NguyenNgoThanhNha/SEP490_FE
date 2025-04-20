import React, { useState } from "react";
import { Button } from "@/components/atoms/ui/button";
import { Input } from "antd";
import { TAppointment } from "@/types/appoinment.type";

interface EventPopupProps {
  selectedTask: TAppointment | null;
  onClose: () => void;
  onComplete: (updatedTask: TAppointment) => void;
  roleId: number;
}

const EventPopup: React.FC<EventPopupProps> = ({ selectedTask, onClose, onComplete, roleId }) => {
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
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết lịch hẹn</h2>

        {/* Status */}
        <div className="mb-4">
          <p className="text-sm font-medium">
            Trạng thái:{" "}
            <span
              className={`px-2 py-1 rounded ${selectedTask.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {selectedTask.status === "Completed" ? "Hoàn thành" : "Đang tiến hành"}
            </span>
          </p>
        </div>

        {/* Service Details */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Dịch vụ:</span> {selectedTask.service.name}
          </p>
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Thời lượng:</span> {selectedTask.service.duration} phút
          </p>
        </div>

        {/* Staff Details */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Nhân viên:</span> {selectedTask.staff.staffInfo.fullName}
          </p>
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Email:</span> {selectedTask.staff.staffInfo.email || "Không có"}
          </p>
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Số điện thoại:</span> {selectedTask.staff.staffInfo.phoneNumber || "Không có"}
          </p>
          <p className="text-sm font-medium text-gray-600 mt-4">
            <span className="font-semibold text-gray-800">Thời gian bắt đầu:</span>{" "}
            {new Date(selectedTask.appointmentsTime).toLocaleTimeString("vi-VN")}
          </p>
          <p className="text-sm font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Thời gian kết thúc:</span>{" "}
            {new Date(selectedTask.appointmentEndTime).toLocaleTimeString("vi-VN")}
          </p>
        </div>

        {/* Inputs for Additional Service and Staff */}
        {roleId !== 2 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Thêm dịch vụ</label>
            <Input
              placeholder="Nhập dịch vụ mới"
              value={additionalService}
              onChange={(e) => setAdditionalService(e.target.value)}
              className="mt-2"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Thay đổi nhân viên</label>
            <Input
              placeholder="Nhập tên nhân viên mới"
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
              Cập nhật lịch hẹn
            </Button>

          </div>
        )}
        <Button
          variant="outline"
          onClick={onClose}
          className="mt-2 w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100"
        >
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default EventPopup;