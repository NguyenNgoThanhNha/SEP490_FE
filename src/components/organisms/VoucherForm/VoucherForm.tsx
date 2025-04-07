import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form copy";
import { Input } from "@/components/atoms/ui/input";
import { VoucherSchema, VoucherType } from "@/schemas/voucherSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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
      status: "Active"
    },
  });

  const handleFormSubmit = async (data: VoucherType) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success(`${mode === "create" ? "Created" : "Updated"} voucher successfully`);
      navigate("/voucher-management");
    } catch {
      toast("Something went wrong while submitting voucher");
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
                {mode === "create" ? "Create Voucher" : "Update Voucher"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voucher Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter voucher code" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
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
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
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
                  <FormLabel>Discount Amount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discount amount"
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
              name="validFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid From</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid To</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/vouchers")}
            className="rounded-full border-2 border-[#6a9727] text-[#6a9727] px-6 py-2 font-semibold hover:bg-[#6a9727] hover:text-white transition"
          >
            Cancel
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
              mode === "create" ? "Create Voucher" : "Update Voucher"
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default VoucherForm;
