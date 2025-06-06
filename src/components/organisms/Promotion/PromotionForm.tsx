import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "antd";
import "dayjs/locale/vi"; // Import ngôn ngữ tiếng Việt cho Day.js
import "dayjs/locale/en"; // Import ngôn ngữ tiếng Anh cho Day.js
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PromotionSchema, PromotionType } from "@/schemas/promotionSchema";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import toast from "react-hot-toast";
import enUS from "antd/es/date-picker/locale/en_US";
import viVN from "antd/es/date-picker/locale/vi_VN";
import { useTranslation } from "react-i18next";

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
      status: "Active",
    },
  });
const { t, i18n } = useTranslation();
const currentLocale = i18n.language === "vi" ? viVN : enUS; 
  const handleFormSubmit = async (data: PromotionType) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success(
        mode === "create" ? t("createPromotion") : t("updatePromotion")
      );
      navigate("/promotions-management");
    } catch {
      toast.error(t("fetchError"));
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
                {mode === "create" ? t("createPromotion") : t("updatePromotion")}
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
                    <FormLabel>{t("PromotionName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterPromotionName")} {...field} value={field.value} />
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
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <TextArea
                        {...field}
                        placeholder={t("enterPromotionDescription")}
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
                    <FormLabel>{t("Discount")} (%)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder={t("Enterdiscount")}
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
                    <FormLabel>{t("StartDate")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        className="w-full"
                        showTime={false}
                        format="DD/MM/YYYY"
                        locale={currentLocale} // Sử dụng locale từ i18next
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
                    <FormLabel>{t("EndDate")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        className="w-full"
                        showTime={false}
                        locale={currentLocale}
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
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/promotions-management")}
            className="rounded-full border-2 border-[#6a9727] text-[#6a9727] px-6 py-2 font-semibold hover:bg-[#6a9727] hover:text-white transition"
          >
            {t("Cancel")}
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
              mode === "create" ? t("createPromotion") : t("updatePromotion")
            )}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default PromotionForm;
