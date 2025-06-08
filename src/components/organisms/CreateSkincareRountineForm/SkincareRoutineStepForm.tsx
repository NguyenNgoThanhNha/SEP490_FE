import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SkincareStepSchema, SkincareStepType } from "@/schemas/skincareRoutineStepSchema";
import skincareRoutineStepService from "@/services/skincareRoutineStepService";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Button } from "@/components/atoms/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import TextArea from "antd/es/input/TextArea";
import { TRoutine } from "@/types/routine.type";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ServiceAndProductSelect } from "./ServiceAndProductSelect";
import skincareRoutineService from "@/services/skincareRoutineService";

export function SkincareStepForm({ routineData }: { routineData: TRoutine }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<SkincareStepType[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<
    { serviceId: number; serviceName: string; productIds: number[] }[]
  >([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isComplete) return;

    form.reset({
      skincareRoutineId: routineData.skincareRoutineId,
      name: "",
      description: "",
      step: currentStep,
      intervalBeforeNextStep: 0,
      productIds: [],
      serviceIds: [],
    });
    setSelectedServices([]);
  }, [currentStep, isComplete, routineData.skincareRoutineId, form]);

  const handleFormSubmit = async (data: SkincareStepType) => {
    setLoading(true);
    try {
      const newStep = {
        ...data,
        step: currentStep,
        serviceIds: selectedServices.map((s) => s.serviceId),
        productIds: selectedServices.flatMap((s) => s.productIds),
      };

      console.log("Payload gửi đi:", newStep);

      const response = await skincareRoutineStepService.createSkincareRoutineStep(newStep);
      if (response.success) {
        toast.success(t("stepAddedSuccess", { step: currentStep }));
        setSteps((prev) => [...prev, newStep]);

        if (currentStep >= routineData.totalSteps) {
          setIsComplete(true);
        } else {
          setCurrentStep((prev) => prev + 1);
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

  const handleFinish = async () => {
    try {
      toast.success(t("routineComplete"));

      const response = await skincareRoutineService.updateSkincareRoutineStatus(routineData.skincareRoutineId);
      if (response.success) {
        toast.success(t("routineUpdatedSuccess"));
        navigate("/routine-management");
      } else {
        toast.error(t("routineUpdateError"));
      }
    } catch (error) {
      console.error(t("routineUpdateError"), error);
      toast.error(t("routineUpdateError"));
    }
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
              <Button onClick={handleFinish} className="w-full bg-[#516d19] rounded-full" disabled={loading}>
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
            <CardTitle>{t("addStepTitle", { currentStep, totalSteps: routineData.totalSteps })}</CardTitle>
            <CardDescription>{t("addStepDescription", { currentStep, routineName: routineData.name })}</CardDescription>
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
                        <TextArea placeholder={t("enterStepDescription")} className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <ServiceAndProductSelect
                    onServiceChange={(services) => setSelectedServices(services)}
                  />
                </div>
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