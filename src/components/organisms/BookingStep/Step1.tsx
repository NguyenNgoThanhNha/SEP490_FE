import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent, CardHeader } from "@/components/atoms/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Form } from "@/components/atoms/ui/form copy";
import { Input } from "@/components/atoms/ui/input";
import branchService from "@/services/branchService";
import serviceService from "@/services/serviceService";
import staffService from "@/services/staffService";
import { TBranch } from "@/types/branch.type";
import { TService } from "@/types/serviceType";
import { TStaff } from "@/types/staff.type";
import { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { Select } from "antd";
import { TAppointment } from "@/types/appoinment.type";
import { formatPrice } from "@/utils/formatPrice";

const { Option } = Select;

interface BookingFormProps {
  onSubmit: (data: TAppointment) =>  Promise<void>;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  const [branches, setBranches] = useState<TBranch[] | null>(null);
  const [staffs, setStaff] = useState<TStaff[] | null>(null);
  const [services, setServices] = useState<TService[] | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const form = useForm({
    defaultValues: {
      name: "",
      branch: "",
      staff: "",
      service: [],
      date: "",
      time: "",
      notes: "",
      voucher: "",
    },
  });

  const selectedBranch = useWatch({ control: form.control, name: "branch" });
  useEffect(() => {
    if (form.watch("service").length > 0 && services) {
      const selectedServices = form.watch("service").map((id) =>
        services.find((s) => s.serviceId === id)
      );
      const price = selectedServices.reduce((sum, service) => sum + (service?.price || 0), 0);
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [form.watch("service"), services]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchRes = await branchService.getAllBranch({
          status: "Active",
          page: 1,
          pageSize: 200,
        });
        setBranches(branchRes.result?.data || []);
      } catch (error) {
        console.error("Error fetching branches", error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;

    const fetchStaffAndServices = async () => {
      try {
        const [staffRes, serviceRes] = await Promise.all([
          staffService.getStaffByBranch({ branchId: Number(selectedBranch) }),
          serviceService.getAllServiceForBranch({
            branchId: Number(selectedBranch),
            page: 1,
            pageSize: 50,
          }),
        ]);
        setStaff(staffRes.result?.data);
        setServices(serviceRes.result?.data);
      } catch (error) {
        console.error("Error fetching staff or services", error);
      }
    };

    fetchStaffAndServices();
  }, [selectedBranch]);

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-lg font-semibold">Booking Appointment Form</CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branch"
              render={() => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Controller
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <Select
                        placeholder="Select branch"
                        value={field.value}
                        onChange={(value) => field.onChange(Number(value))}
                        style={{ width: "100%" }}
                      >
                        {branches?.map((branch) => (
                          <Option key={branch.branchId} value={branch.branchId}>
                            {branch.branchName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="staff"
              render={() => (
                <FormItem>
                  <FormLabel>Staff</FormLabel>
                  <Controller
                    control={form.control}
                    name="staff"
                    render={({ field }) => (
                      <Select
                        placeholder="Select staff"
                        value={field.value}
                        onChange={(value) => field.onChange(Number(value))}
                        style={{ width: "100%" }}
                      >
                        {staffs?.map((staff) => (
                          <Option key={staff.staffId} value={staff.staffId}>
                            {staff.staffInfo.userName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service"
              render={() => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Controller
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <>
                        <Select
                          mode="multiple"
                          allowClear
                          placeholder="Select service"
                          value={field.value}
                          onChange={(values) => field.onChange(values.map(Number))}
                          style={{ width: "100%" }}
                        >
                          {services?.map((service) => (
                            <Option key={service.serviceId} value={service.serviceId}>
                              {service.name} -  {formatPrice(service.price)} VND
                            </Option>
                          ))}
                        </Select>
                        <p className="text-right font-semibold mt-2">Total Price: {formatPrice(totalPrice)} VND</p>
                      </>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
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
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Note" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Book Now
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
