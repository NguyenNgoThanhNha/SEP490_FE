import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "antd";
import { Switch } from "@/components/atoms/ui/switch";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PromotionSchema, PromotionType } from "@/schemas/promotionSchema";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

interface PromotionFormProps {
  mode: "create" | "update";
  initialData?: PromotionType;
  onSubmit: (data: PromotionType) => Promise<void>;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ mode, initialData, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<PromotionType>({
    resolver: zodResolver(PromotionSchema),
    defaultValues: initialData || {
      promotionName: "",
      promotionDescription: "",
      startDate: "",
      endDate: "",
      discountPercent: 0,
      status: "Inactive",
    },
  });

  const handleFormSubmit = async (data: PromotionType) => {
    setLoading(true);
    try {
      await onSubmit(data);
      navigate("/promotions-management");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between mt-2">
              <CardTitle className="text-xl font-bold">
                {mode === "create" ? "Create Promotion" : "Update Promotion"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="promotionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter promotion name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promotionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TextArea
                        {...field}
                        placeholder="Enter promotion description"
                        rows={4}
                        className="text-sm font-normal"
                        style={{ borderRadius: "8px", padding: "10px", fontFamily: "inherit" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percent(%)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter discount percentage"
                        min={0}
                        max={100}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        className="w-full"
                        showTime={false}
                        format="DD/MM/YYYY"
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        value={field.value ? dayjs(field.value) : null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        className="w-full"
                        showTime={false}
                        format="DD/MM/YYYY"
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        value={field.value ? dayjs(field.value) : null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === "Active"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "Active" : "Inactive")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/promotions-management")}
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
              mode === "create" ? "Create Promotion" : "Update Promotion"
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default PromotionForm;
