import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form copy";
import FileUpload from "@/components/atoms/ui/image-upload";
import { Input } from "@/components/atoms/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { ServiceSchema, ServiceType } from "@/schemas/serviceSchema";
import serviceCategory from "@/services/serviceCategory";
import { TServiceCategory } from "@/types/serviceCategory.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  const [categories, setCategories] = useState<TServiceCategory[] | null>(null);
  const [, setImages] = useState<string[]>(initialData?.images || []);

  const form = useForm<ServiceType>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      duration: "",
      price: 0,
      images: [],
      serviceCategoryId: 0,
      steps: []
    },
  });
  const handleFormSubmit = async (data: ServiceType) => {
    console.log("Form data:", data);
    setLoading(true);
    try {
      await onSubmit(data);
      navigate("/services-management");
    } catch {
      toast.error("Error submitting form:");
    } finally {
      setLoading(false);
    }
  };
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await serviceCategory.getAllSerCate({ page: 1, pageSize: 100 });
        if (response.success) {
          setCategories(response.result?.data || []);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch {
        toast.error("An error occurred while fetching categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData?.images) {
      setImages(initialData.images);
      form.setValue("images", initialData.images);
    }
  }, [initialData]);

  const handleImageUpload = (files: File[]) => {
    const previews = files.map(file => URL.createObjectURL(file));
    setImages(previews);
    form.setValue("images", files);
  };

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

            <FileUpload onImageUpload={handleImageUpload} multiple={true} initialData={initialData?.images} />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ServiceDescription')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enterservicedescription")}{...field} />
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
                  <FormLabel>{t("Price")} (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value.replace(/,/g, "")))}
                      placeholder={t("Enterprice")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Category')}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Selectcategory")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.serviceCategoryId}
                          value={category.serviceCategoryId.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Steps")}</FormLabel>
                  <FormControl>
                    <textarea
                    {...field}
                      rows={5}
                      placeholder={t("EnterStepsEachLine")}
                      className="w-full p-2 border rounded-md"
                      value={Array.isArray(field.value) ? field.value.join("\n") : ""}
                      onChange={(e) => field.onChange(
                        e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                      )}
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
            onClick={() => navigate("/services-management")}
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