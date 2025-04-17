import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form copy";
import FileUpload from "@/components/atoms/ui/image-upload";
import { Input } from "@/components/atoms/ui/input";
import { ServiceSchema, ServiceType } from "@/schemas/serviceSchema";
import { formatPrice } from "@/utils/formatPrice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ServiceFormProps {
  mode: "create" | "update";
  initialData?: ServiceType;
  onSubmit: (data: ServiceType) => Promise<void>;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ mode, initialData, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ServiceType>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      duration: "",
      price: 0,
      images: []
    },
  });
  const handleFormSubmit = async (data: ServiceType) => {
    console.log("Form data:", data);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("duration", data.duration);
      formData.append("price", data.price.toString());

      data.images.forEach((image) => {
        formData.append("images", image);
      });

      await onSubmit(formData as never);
      navigate("/services-management");
    } catch {
      toast.error("Error submitting form:");
    } finally {
      setLoading(false);
    }
  };
  const { t } = useTranslation();


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">
                {mode === "create" ? t("CreateService") : t("UpdateService")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ServiceName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enterservicename")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      multiple={true}
                      onImageUpload={(selectedFiles) => {
                        field.onChange(selectedFiles);
                      }}
                    />
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
                  <FormLabel>{t('ServiceDescription')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enterservicedescription" )}{...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Duration")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enterserviceduration")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Price")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={formatPrice(field.value)}
                      onChange={(e) => field.onChange(Number(e.target.value.replace(/,/g, "")))}
                      placeholder={t("Enterprice")}
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
            onClick={() => navigate("/dashboard/services")}
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
              mode === "create" ? t("CreateService") : t("UpdateService")
            )}
          </button>
        </div>
      </form>
    </Form>
  );
}
export default ServiceForm;