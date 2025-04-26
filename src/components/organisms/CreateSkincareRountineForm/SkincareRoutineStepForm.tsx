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
import { useTranslation } from "react-i18next";

export function SkincareStepForm({ routineData }: { routineData: TRoutine }) {
  const { t } = useTranslation();
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
        toast.success(t("stepAddedSuccess", { step: currentStep }));
        setSteps([...steps, newStep]);

        if (currentStep >= routineData.totalSteps) {
          setIsComplete(true);
        } else {
          setCurrentStep(currentStep + 1);
          form.reset();
        }
      } else {
        toast.error(t("stepAddError"));
      }
    } catch (error) {
      console.error(t("unexpectedError"), error);
      toast.error(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    toast.success(t("routineComplete"));
  };

  if (isComplete) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">{t("routineCompleteTitle")}</CardTitle>
              <CardDescription className="text-center">{t("routineCompleteDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("routineDetails")}</h3>
                <p>
                  <strong>{t("name")}:</strong> {routineData.name}
                </p>
                <p>
                  <strong>{t("description")}:</strong> {routineData.description}
                </p>
                <p>
                  <strong>{t("totalSteps")}:</strong> {routineData.totalSteps}
                </p>

                <h3 className="text-lg font-medium mt-6">{t("steps")}</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <h4 className="font-medium">
                        {t("step")} {step.step}: {step.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleFinish} className="w-full">
                {t("finish")}
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
              {t("addStepTitle", { currentStep, totalSteps: routineData.totalSteps })}
            </CardTitle>
            <CardDescription>
              {t("addStepDescription", { currentStep, routineName: routineData.name })}
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
                      <FormLabel>{t("stepName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("enterStepName")} {...field} />
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
                      <FormLabel>{t("description")}</FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder={t("enterStepDescription")}
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
                      <FormLabel>{t("selectProducts")}</FormLabel>
                      <FormControl>
                        <MultiSelect
                          label={t("selectProducts")}
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
                      <FormLabel>{t("selectServices")}</FormLabel>
                      <FormControl>
                        <MultiSelect
                          label={t("selectServices")}
                          fetchOptions={async (keyword) => {
                            const res = await serviceService.elasticSearchService(keyword);
                            return (
                              res?.result?.data.map((s: TService) => ({
                                label: s.name,
                                value: s.serviceId,
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
                  name="intervalBeforeNextStep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("intervalBeforeNextStep")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-[#516d19] rounded-full" disabled={loading}>
                  {currentStep === routineData.totalSteps ? t("finishRoutine") : t("addStep")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
