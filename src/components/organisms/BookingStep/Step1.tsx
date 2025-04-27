import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardHeader } from "@/components/atoms/ui/card";
import { Form } from "@/components/atoms/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { Select, message } from "antd";
import { useTranslation } from "react-i18next";
import branchService from "@/services/branchService";
import serviceService from "@/services/serviceService";
import staffService from "@/services/staffService";
import { TBranch } from "@/types/branch.type";
import { TService } from "@/types/serviceType";
import { TStaff } from "@/types/staff.type";
import { TAppointment } from "@/types/appoinment.type";
import { formatPrice } from "@/utils/formatPrice";
import RegisterWithPhone from "./RegisterForm";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import voucherService from "@/services/voucherService";
import toast from "react-hot-toast";
import { TVoucher } from "@/types/voucher.type";

const { Option } = Select;
dayjs.extend(utc);

interface BookingFormProps {
  onSubmit: (data: any) => Promise<void>;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [, setBranches] = useState<TBranch[]>([]);
  const [services, setServices] = useState<TService[]>([]);
  const [staffs, setStaffs] = useState<Record<number, TStaff[]>>({});
  const [, setUserId] = useState<number | null>(null);
  const [vouchers, setVouchers] = useState<TVoucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);
  const branchIdRedux = useSelector((state: RootState) => state.branch.branchId);
  const branchId = branchIdRedux || Number(localStorage.getItem("branchId"));
  const [bonusPoint, setBonusPoint] = useState<number>(0);
  console.log("bonus point", bonusPoint)
  const form = useForm<TAppointment>({
    defaultValues: {
      name: "",
      phone: "",
      branchId: branchId || 0,
      date: "",
      time: "",
      notes: "",
      voucher: 0,
      userId: undefined,
      service: [],
    },
  });

  const selectedDate = useWatch({ control: form.control, name: "date" });
  const selectedTime = useWatch({ control: form.control, name: "time" });
  const selectedServices = useWatch({ control: form.control, name: "service" });

  useEffect(() => {
    branchService
      .getAllBranch({ status: "Active", page: 1, pageSize: 200 })
      .then((res) => setBranches(res.result?.data || []));
  }, []);

  useEffect(() => {
    if (!branchId) return;
    serviceService
      .getAllServiceForBranch({
        branchId: branchId,
        page: 1,
        pageSize: 50,
      })
      .then((res) => setServices(res.result?.data || []));
  }, [branchId]);

  useEffect(() => {
    voucherService.getAllVoucher({ Status: "Active" })
      .then((res) => {
        setVouchers(res.result?.data || []);
      });
  }, []);


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
          branchId: branchId,
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
    const currentServices = form.getValues("service");
    const updated = selectedIds.map((id) => {
      const existing = currentServices.find((s: any) => s.serviceId === id);
      return {
        serviceId: id,
        staffId: existing?.staffId || undefined,
        appointmentTime: "",
      };
    });
    form.setValue("service", updated);
  };

  const totalPrice = selectedServices.reduce((sum: number, s: any) => {
    const svc = services.find((sv) => sv.serviceId === s.serviceId);
    return sum + (svc?.price || 0);
  }, 0);

  const discountAmount =
    vouchers.find((v) => v.voucherId === selectedVoucher)?.discountAmount || 0;
  const finalPrice = totalPrice - discountAmount;
  const handleVoucherSelect = (voucherId: number) => {
    const voucher = vouchers.find((v) => v.voucherId === voucherId);

    if (voucher) {
      if (bonusPoint < voucher.requirePoint) {
        toast.error(t("notEnoughPoints")); // Sử dụng khóa dịch
        return;
      }

      if (totalPrice < voucher.minOrderAmount) {
        toast.error(t("orderAmountTooLow")); // Sử dụng khóa dịch
        return;
      }

      setSelectedVoucher(voucherId);
    }
  };
  const handleSubmit = (data: TAppointment) => {
    const payload = {
      userId: data.userId || 0,
      staffId: data.service.map((s) => s.staffId || 0),
      serviceId: data.service.map((s) => s.serviceId || 0),
      branchId: data.branchId || 0,

      appointmentsTime: data.service.map((s, index) => {
        const selectedService = services.find((sv) => sv.serviceId === s.serviceId);
        const duration = selectedService?.duration || 0;

        let appointmentTime = dayjs(`${data.date}T${data.time}`).local();

        // Only add duration if index is greater than 0
        if (index > 0) {
          appointmentTime = appointmentTime.add(duration * index, 'minute');
        }

        return appointmentTime.format('YYYY-MM-DDTHH:mm:ss');
      }),


      status: "Pending",
      notes: data.notes || "",
      feedback: "",
      voucherId: selectedVoucher || 0,
    };

    console.log("Payload gửi lên API:", payload);
    onSubmit(payload);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-lg font-semibold">{t("bookingForm")}</CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <RegisterWithPhone
              onRegisterSuccess={(id, points) => {
                setUserId(id);
                setBonusPoint(points);
                form.setValue("userId", id);
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("date")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("time")}</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>{t("service")}</FormLabel>
              <Select
                mode="multiple"
                placeholder={t("selectServices")}
                value={selectedServices.map((s: any) => s.serviceId)}
                onChange={handleServiceSelect}
                style={{ width: "100%" }}
              >
                {services.map((s) => (
                  <Option key={s.serviceId} value={s.serviceId}>
                    {s.name} - {formatPrice(s.price)} VND
                  </Option>
                ))}
              </Select>
            </FormItem>
            {selectedServices.map((s: any, idx: number) => (
              <FormItem key={s.serviceId}>
                <FormLabel>
                  {t("staffForService", {
                    serviceName: services.find((sv) => sv.serviceId === s.serviceId)?.name,
                  })}
                </FormLabel>
                <Select
                  placeholder={t("selectStaff")}
                  value={s.staffId}
                  onChange={(val) => {
                    const updated = [...form.getValues("service")];
                    updated[idx].staffId = Number(val);
                    form.setValue("service", updated);
                  }}
                  style={{ width: "100%" }}
                >
                  {staffs[s.serviceId]?.map((staff) => (
                    <Option key={staff.staffId} value={staff.staffId}>
                      {staff.staffInfo.userName}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            ))}
            <FormItem>
              <FormLabel>{t("voucher")}</FormLabel>
              <Select
                placeholder={t("selectVoucher")}
                value={selectedVoucher}
                onChange={(val) => handleVoucherSelect(val ? Number(val) : null)} // Cho phép bỏ chọn
                style={{ width: "100%" }}
              >
                <Option value={null}>{t("noVoucher")}</Option>
                {vouchers.map((voucher) => (
                  <Option key={voucher.voucherId} value={voucher.voucherId}>
                    {voucher.code} - {t("Discount")} {formatPrice(voucher.discountAmount)} VND
                  </Option>
                ))}
              </Select>
              <p className="text-right font-semibold mt-2">
                {t("totalPrice")}: {formatPrice(finalPrice)} VND
              </p>
            </FormItem>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("addNotes")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#516D19]">
              {t("bookAppointment")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;

