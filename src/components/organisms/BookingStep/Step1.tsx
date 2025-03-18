import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches, setBranchId } from "@/store/slice/branchSlice";
import { RootState, AppDispatch } from "@/store";
import { Select} from "antd";
import toast from "react-hot-toast";
import authService from "@/services/authService";
import serviceService from "@/services/serviceService";
import staffService from "@/services/staffService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Input } from "@/components/atoms/ui/input";
import dayjs from "dayjs";

interface FormValues {
  phone: string;
  name: string;
  branchId: number;
  serviceId: number;
  staffId: number;
  appointmentTime: string;
}

const BookingForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { branches, branchId, loading } = useSelector((state: RootState) => state.branch);
  const [services, setServices] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [customerExists, setCustomerExists] = useState<boolean | null>(null);
  const form = useForm<FormValues>();
  const { handleSubmit, watch, setValue } = form;
  const phoneNumber = watch("phone");
  const appointmentTime = watch("appointmentTime");

  useEffect(() => {
    dispatch(fetchBranches({ status: "active", page: 1, pageSize: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (branchId) {
      fetchServicesForTime(appointmentTime);
      fetchStaffsByBranch(branchId);
    }
  }, [branchId, appointmentTime]);

  const fetchServicesForTime = async (time: string) => {
    if (!time) return;
    const hour = dayjs(time).hour();
    if (hour < 9 || hour >= 17) {
      toast.error("Lịch hẹn chỉ được đặt từ 9h - 17h");
      return;
    }
    try {
      const response = await serviceService.getServiceByTime({ hour });
      setServices(response.result?.data || []);
    } catch {
      toast.error("Lỗi lấy danh sách dịch vụ.");
    }
  };

  const fetchStaffsByBranch = async (branchId: number) => {
    try {
      const response = await staffService.getStaffByBranch({ branchId });
      setStaffs(response.result?.data || []);
    } catch {
      toast.error("Lỗi lấy danh sách nhân viên.");
    }
  };

  const checkCustomerExists = async () => {
    try {
      if (!phoneNumber) return;
      const response = await authService.checkCustomer({ phone: phoneNumber });
      setCustomerExists(response.exists);
      if (response.exists) toast.success("Khách hàng đã có tài khoản.");
    } catch {
      setCustomerExists(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Lịch hẹn đã đặt:", data);
    toast.success("Đặt lịch thành công!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg w-[600px] space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Đặt Lịch Hẹn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nhập số điện thoại"
              {...form.register("phone")}
              onBlur={checkCustomerExists}
            />
            {customerExists === false && (
              <Input placeholder="Nhập tên khách hàng" {...form.register("name")} />
            )}

            <Select value={branchId} onChange={(value) => dispatch(setBranchId(value))} loading={loading} placeholder="Chọn chi nhánh">
              {branches.map((branch) => (
                <Select.Option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName}
                </Select.Option>
              ))}
            </Select>

            
            <Select placeholder="Chọn dịch vụ" {...form.register("serviceId")} className="mr-2">
              {services.map((service) => (
                <Select.Option key={service.serviceId} value={service.serviceId}>
                  {service.serviceName}
                </Select.Option>
              ))}
            </Select>

            <Select placeholder="Chọn nhân viên" {...form.register("staffId")}>
              {staffs.map((staff) => (
                <Select.Option key={staff.staffId} value={staff.staffId}>
                  {staff.staffInfo?.userName}
                </Select.Option>
              ))}
            </Select>
            <Input type="datetime-local" {...form.register("appointmentTime")} onChange={(e) => fetchServicesForTime(e.target.value)} />

          </CardContent>
          <div className="flex justify-center p-4">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
              Đặt lịch
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default BookingForm;
