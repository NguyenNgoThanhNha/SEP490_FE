import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SkincareStepSchema, SkincareStepType } from "@/schemas/skincareRoutineStepSchema";
import skincareRoutineStepService from "@/services/skincareRoutineStepService";
import { MultiSelect } from "@/components/molecules/MultiSelect";
import productService from "@/services/productService";
import serviceService from "@/services/serviceService";
import { TProduct } from "@/types/product.type";
import { TService } from "@/types/serviceType";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import TextArea from "antd/es/input/TextArea";
import { TRoutine } from "@/types/routine.type";

export function SkincareStepForm({ routineData }: { routineData: TRoutine }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<SkincareStepType[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SkincareStepType>({
    resolver: zodResolver(SkincareStepSchema),
    defaultValues: {
      skincareRoutineId: routineData.skincareRoutineId,
      name: "",
      description: "",
      step: currentStep,
      intervalBeforeNextStep: 0,
      productIds: [],
      serviceIds: [],
    },
  });

  const handleFormSubmit = async (data: SkincareStepType) => {
    setLoading(true);

    try {
      const newStep = {
        ...data,
        step: currentStep,
      };

      const response = await skincareRoutineStepService.createSkincareRoutineStep(newStep);
      if (response.success) {
        toast.success(`Bước ${currentStep} đã được thêm thành công!`);
        setSteps([...steps, newStep]);

        if (currentStep >= routineData.totalSteps) {
          setIsComplete(true);
        } else {
          setCurrentStep(currentStep + 1);
          form.reset();
        }
      } else {
        toast.error("Không thể thêm bước. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm bước:", error);
      toast.error("Đã xảy ra lỗi khi thêm bước.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    toast.success("Routine đã hoàn thành!");
  };

  if (isComplete) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">Routine Hoàn Thành!</CardTitle>
              <CardDescription className="text-center">
                Bạn đã tạo thành công routine chăm sóc da với tất cả các bước.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Chi tiết Routine:</h3>
                <p>
                  <strong>Tên:</strong> {routineData.name}
                </p>
                <p>
                  <strong>Mô tả:</strong> {routineData.description}
                </p>
                <p>
                  <strong>Số bước:</strong> {routineData.totalSteps}
                </p>

                <h3 className="text-lg font-medium mt-6">Các bước:</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <h4 className="font-medium">
                        Bước {step.step}: {step.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleFinish} className="w-full">
                Hoàn thành
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              Thêm Bước {currentStep} / {routineData.totalSteps}
            </CardTitle>
            <CardDescription>
              Điền thông tin chi tiết cho bước {currentStep} của routine "{routineData.name}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên Bước</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Làm sạch" {...field} />
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
                        <TextArea
                          placeholder="Mô tả chi tiết bước này..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn Sản Phẩm</FormLabel>
                      <FormControl>
                        <MultiSelect
                          label="Chọn sản phẩm"
                          fetchOptions={async (keyword) => {
                            const res = await productService.elasticSearchProduct(keyword);
                            return (
                              res?.data?.map((p: TProduct) => ({
                                label: p.productName,
                                value: p.productId,
                              })) || []
                            );
                          }}
                          selected={field.value || []}
                          onChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chọn Dịch Vụ</FormLabel>
                      <FormControl>
                        <MultiSelect
                          label="Chọn dịch vụ"
                          fetchOptions={async (keyword) => {
                            const res = await serviceService.elasticSearchService(keyword);
                            return (
                              res?.result?.data.map((s: TService) => ({
                                label: s.name,
                                value: s.serviceId,
                              })) || []
                            );
                          }}
                          selected={field.value || []} // Giá trị được chọn
                          onChange={(value) => field.onChange(value)} // Cập nhật giá trị khi thay đổi
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intervalBeforeNextStep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian giữa các bước (ngày)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {currentStep === routineData.totalSteps ? "Hoàn thành Routine" : "Thêm Bước"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
