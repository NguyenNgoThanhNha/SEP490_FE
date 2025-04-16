import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import skincareRoutineStepService from "@/services/skincareRoutineStepService";
import { Input } from "@/components/atoms/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { TProduct } from "@/types/product.type";
import productService from "@/services/productService";
import { TService } from "@/types/serviceType";
import serviceService from "@/services/serviceService";
import { SkincareStepSchema, SkincareStepType } from "@/schemas/skincareRoutineStepSchema";
import { MultiSelect } from "@/components/molecules/MultiSelect";
import { Button } from "@/components/atoms/ui/button";
import { Card, CardContent } from "@/components/atoms/ui/card";
import toast from "react-hot-toast";

export function SkincareStepForm({ routineId, step }: { routineId: number, step: number }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<SkincareStepType>({
    resolver: zodResolver(SkincareStepSchema),
    defaultValues: {
      skincareRoutineId: routineId,
      name: "",
      description: "",
      step: step,
      intervalBeforeNextStep: 0,
      productIds: [],
      serviceIds: [],
    },
  });

  const onSubmit = async (data: SkincareStepType) => {
    setLoading(true);
    try {

      const payload = {
        ...data,
        productIds: data.productIds || [],
        serviceIds: data.serviceIds || [],
      };

      const response = await skincareRoutineStepService.createSkincareRoutineStep(payload);
      toast.success("Tạo skincare routine step thành công!");
      console.log("Step created:", response.result?.data);
      form.reset();
    } catch (error) {
      console.error("Failed to create step:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        <Card>
          <CardContent className="grid grid-cols-1 gap-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Tên bước</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Ví dụ: Làm sạch" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Mô tả chi tiết bước này" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="productIds" render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn sản phẩm</FormLabel>
                <FormControl>
                  <MultiSelect
                    label="Chọn sản phẩm"
                    fetchOptions={async (keyword) => {
                      const res = await productService.elasticSearchProduct(keyword);
                      return res?.data?.map((p: TProduct) => ({
                        label: p.productName,
                        value: p.productId,
                      })) || [];
                    }}
                    selected={field.value || []}
                    onChange={value => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="serviceIds" render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn dịch vụ</FormLabel>
                <FormControl>
                  <MultiSelect
                    label="Chọn dịch vụ"
                    fetchOptions={async (keyword) => {
                      const res = await serviceService.elasticSearchService(keyword);
                      return res?.data?.map((s: TService) => ({
                        label: s.name,
                        value: s.serviceId,
                      })) || [];
                    }}
                    selected={field.value || []}
                    onChange={value => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="step" render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự bước</FormLabel>
                <FormControl>
                  <Input disabled={loading} type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="intervalBeforeNextStep" render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian nghỉ (phút)</FormLabel>
                <FormControl>
                  <Input disabled={loading} min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Tạo bước"}
        </Button>
      </form>
    </Form>
  );
}
