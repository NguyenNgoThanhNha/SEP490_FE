import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form copy";
import { Input } from "@/components/atoms/ui/input";
import FormDatePicker from "@/components/molecules/FormDatePicker";
import { VoucherSchema, VoucherType } from "@/schemas/voucherSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface VoucherFormProps {
  mode: "create" | "update";
  initialData?: VoucherType;
  onSubmit: (data: VoucherType) => Promise<void>;
}

const VoucherForm: React.FC<VoucherFormProps> = ({ mode, initialData, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<VoucherType>({
    resolver: zodResolver(VoucherSchema),
    defaultValues: initialData || {
      code: "",
      description: "",
      quantity: 1,
      discountAmount: 0,
      validFrom: "",
      validTo: "",
      status: "Active",
      remainQuantity: 0,
      minOrderAmount: 0,
      requirePoint: 0,
    },
  });

  const handleFormSubmit = async (data: VoucherType) => {
    setLoading(true);
    try {
      const now = dayjs().startOf("day");
      const validFrom = dayjs(data.validFrom).startOf("day");
      const validTo = dayjs(data.validTo).endOf("day");
      if (validFrom.isBefore(now)) {
        toast.error("Ngày bắt đầu không được nhỏ hơn ngày hiện tại.");
        setLoading(false);
        return;
      }

      if (validTo.isBefore(validFrom)) {
        toast.error("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
        setLoading(false);
        return;
      }

      const payload = {
        ...data,
        validFrom: validFrom.format("YYYY-MM-DDTHH:mm:ss"), 
        validTo: validTo.toISOString(),
        remainQuantity: data.quantity,
      };

      await onSubmit(payload);
      toast.success(`${mode === "create" ? "Created" : "Updated"} voucher successfully`);
      navigate("/voucher-management");
    } catch {
      toast.error("Something went wrong while submitting voucher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">
                {mode === "create" ? "Tạo mã giảm giá" : "Cập nhật mã giảm giá"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã giảm giá</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã giảm giá" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mô tả" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số lượng"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền ưu đãi (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số tiền ưu đãi"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minOrderAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền tối thiểu (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số tiền tối thiểu"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirePoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm yêu cầu</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập điểm yêu cầu"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormDatePicker name="validFrom" form={form} />

            <FormDatePicker name="validTo" form={form} />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/voucher-management")}
            className="rounded-full border-2 border-[#6a9727] text-[#6a9727] px-6 py-2 font-semibold hover:bg-[#6a9727] hover:text-white transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="relative rounded-full bg-[#6a9727] text-white px-6 py-2 font-semibold hover:bg-[#55841b] transition disabled:opacity-50"
          >
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="animate-spin h-5 w-5 text-white" />
              </div>
            ) : (
              mode === "create" ? "Tạo mã giảm giá" : "Cập nhật mã giảm giá"
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default VoucherForm;
