import React, { useState } from "react";
import { Appoinment } from "@/types/staff-calendar.type";
import { Button } from "@/components/atoms/ui/button";
import { Input } from "antd";

interface EventPopupProps {
  selectedTask: Appoinment | null;
  onClose: () => void;
  onComplete: (updatedTask: Appoinment) => void;
}

const EventPopup: React.FC<EventPopupProps> = ({ selectedTask, onClose, onComplete }) => {
  const [additionalService, setAdditionalService] = useState("");
  const [staff, setStaff] = useState(selectedTask?.orderDetail.staff || "");

  if (!selectedTask) return null;

  const handleUpdate = () => {
    const updatedTask: Appoinment = {
      ...selectedTask,
      service: { name: `${selectedTask.service.name}, ${additionalService}` }, 
      orderDetail: {
        ...selectedTask.orderDetail,
        staff: staff,
      },
    };

    onComplete(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-lg">
        <h2 className="text-xl font-semibold mb-2">Appointment Details</h2>
        <p className="text-sm">Status: {selectedTask.status ? "Completed" : "In Progress"}</p>
        <p className="text-sm">Service: {selectedTask.service.name}</p>
        <p className="text-sm">Duration: {selectedTask.orderDetail.duration} minute(s)</p>
        <p className="text-sm">Customer: {selectedTask.orderDetail.customerName}</p>
        <p className="text-sm">Note: {selectedTask.orderDetail.note}</p>

        <div className="mt-4">
          <label className="block text-sm font-medium">Additional Service</label>
          <Input 
            placeholder="Enter new service" 
            value={additionalService}
            onChange={(e) => setAdditionalService(e.target.value)}
          />

          <label className="block text-sm font-medium mt-4">Change Staff</label>
          <Input 
            placeholder="Enter new staff name" 
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Button className="w-full" onClick={handleUpdate}>
            Update Appointment
          </Button>
          <Button variant="outline" onClick={onClose} className="mt-2 w-full">
            Close 
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
