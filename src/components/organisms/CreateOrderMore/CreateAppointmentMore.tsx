import { useState, useEffect } from "react";
import { Select, message } from "antd";
import { Button } from "@/components/atoms/ui/button";
import serviceService from "@/services/serviceService";
import staffService from "@/services/staffService";
import { TService } from "@/types/serviceType";
import { TStaff } from "@/types/staff.type";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";


const { Option } = Select;

interface CreateServiceMoreProps {
  branchId: number;
  onSubmit: (data: any) => void;
}

const CreateServiceMore: React.FC<CreateServiceMoreProps> = ({ branchId, onSubmit }) => {

  const { t } = useTranslation();
  const [services, setServices] = useState<TService[]>([]);
  const [staffs, setStaffs] = useState<Record<number, TStaff[]>>({});
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (!branchId) return;
    serviceService
      .getAllServiceForBranch({ branchId, page: 1, pageSize: 50 })
      .then((res) => setServices(res.result?.data || []));
  }, [branchId]);

  useEffect(() => {
    const fetchStaffs = async () => {
      if (!branchId || !selectedDate || !selectedTime || selectedServices.length === 0) return;

      const baseDate = dayjs(`${selectedDate}T${selectedTime}`);
      let currentTime = baseDate;

      const staffMap: Record<number, TStaff[]> = {};

      for (let s of selectedServices) {
        const service = services.find((sv) => sv.serviceId === s.serviceId);
        if (!service) continue;

        const res = await staffService.getListStaffAvailable({
          branchId,
          serviceId: s.serviceId,
          workDate: currentTime.format("YYYY-MM-DD HH:mm:ss.SSSSSS"),
          startTime: currentTime.format("HH:mm:ss"),
        });

        if (res.success && res.result?.data) {
          staffMap[s.serviceId] = res.result.data;
          if (res.result.data.length === 0) {
            message.warning(t("noStaffForService", { serviceName: service.name }));
          }
        } else {
          staffMap[s.serviceId] = [];
          message.error(t("errorFetchingStaff", { serviceName: service.name }));
        }

        if (service.duration) {
          const durationInMinutes = Number(service.duration);
          currentTime = currentTime.add(durationInMinutes + 7, "minute");
        }
      }

      setStaffs(staffMap);
    };

    fetchStaffs();
  }, [branchId, selectedDate, selectedTime, selectedServices]);

  const handleServiceSelect = (selectedIds: number[]) => {
    const updated = selectedIds.map((id) => ({
      serviceId: id,
      staffId: undefined,
      appointmentTime: "",
    }));
    setSelectedServices(updated);
  };

  const handleSubmit = () => {
    const payload = {
      userId: 0, // Thay bằng userId thực tế nếu có
      branchId,
      staffId: selectedServices.map((s) => s.staffId || 0), // Mảng staffId
      serviceId: selectedServices.map((s) => s.serviceId), // Mảng serviceId
      appointmentsTime: selectedServices.map((s, index) => {
        const service = services.find((sv) => sv.serviceId === s.serviceId);
        const duration = service?.duration || 0;

        let appointmentTime = dayjs(`${selectedDate}T${selectedTime}`).local();

        // Cộng dồn thời gian dựa trên index
        if (index > 0) {
          appointmentTime = appointmentTime.add(duration * index, "minute");
        }

        return appointmentTime.format("YYYY-MM-DDTHH:mm:ss");
      }),
      status: "Pending", 
      notes: "", 
      feedback: "", 
      voucherId: 0, 
    };

    console.log("Payload gửi đi:", payload); 
    onSubmit(payload);
  };

  return (
    <div className="space-y-4">
     
      <Select
        mode="multiple"
        placeholder={t("selectServices")}
        value={selectedServices.map((s) => s.serviceId)}
        onChange={handleServiceSelect}
        style={{ width: "100%" }}
      >
        {services.map((s) => (
          <Option key={s.serviceId} value={s.serviceId}>
            {s.name}
          </Option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {selectedServices.map((s, idx) => (
        <Select
          key={s.serviceId}
          placeholder={t("selectStaff")}
          value={s.staffId}
          onChange={(val) => {
            const updated = [...selectedServices];
            updated[idx].staffId = val;
            setSelectedServices(updated);
          }}
          style={{ width: "100%" }}
        >
          {staffs[s.serviceId]?.map((staff) => (
            <Option key={staff.staffId} value={staff.staffId}>
              {staff.staffInfo.userName}
            </Option>
          ))}
        </Select>
      ))}
      <Button onClick={handleSubmit}>{t("addServices")}</Button>
    </div>
  );
};

export default CreateServiceMore;