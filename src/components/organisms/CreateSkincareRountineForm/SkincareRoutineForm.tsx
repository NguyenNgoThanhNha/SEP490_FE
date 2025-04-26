import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SkincareRoutineSchema, SkincareRoutineType } from "@/schemas/skincareRoutineSchema";
import skincareRoutineService from "@/services/skincareRoutineService";
import { TRoutine } from "@/types/routine.type";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import TextArea from "antd/es/input/TextArea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/ui/select";
import { Button } from "@/components/atoms/ui/button";
import { useTranslation } from "react-i18next";

const SkincareRoutineForm = ({
  onCreated,
}: {
  onCreated: (routine: TRoutine) => Promise<void>;
}) => {
  const { t } = useTranslation();
  const [skinTypes, setSkinTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<SkincareRoutineType>({
    resolver: zodResolver(SkincareRoutineSchema),
    defaultValues: {
      name: "",
      description: "",
      totalSteps: 0,
      totalPrice: 0,
      targetSkinTypes: [],
    },
  });

  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const res = await skincareRoutineService.getTargetSkinType();
        if (res.success) {
          setSkinTypes(res.result?.data || []);
        }
      } catch {
        toast.error(t("fetchSkinTypesError"));
      }
    };
    fetchSkinTypes();
  }, [t]);

  const handleFormSubmit = async (data: SkincareRoutineType) => {
    if (data.targetSkinTypes.length === 0) {
      toast.error(t("selectAtLeastOneSkinType"));
      return;
    }

    setLoading(true);
    try {
      const res = await skincareRoutineService.createSkincareRoutine(data);

      if (res.success) {
        toast.success(t("createRoutineSuccess"));
        onCreated(res.result?.data);
        form.reset();
      } else {
        toast.error(t("createRoutineError"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t("createRoutineTitle")}</CardTitle>
            <CardDescription>{t("createRoutineDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("routineName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("enterRoutineName")} {...field} />
                      </FormControl>
                      <FormDescription>{t("routineNameDescription")}</FormDescription>
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
                          placeholder={t("enterRoutineDescription")}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{t("routineDescriptionDescription")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="totalSteps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("totalSteps")}</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={10} {...field} />
                        </FormControl>
                        <FormDescription>{t("totalStepsDescription")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("totalPrice")}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={1000} {...field} />
                        </FormControl>
                        <FormDescription>{t("totalPriceDescription")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="targetSkinTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("targetSkinTypes")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          if (!field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectSkinTypes")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skinTypes.map((type) => (
                            <SelectItem value={type} key={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>{t("targetSkinTypesDescription")}</FormDescription>
                      <FormMessage />
                      {field.value.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {field.value.map((type: string) => (
                            <span
                              key={type}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm cursor-pointer"
                              onClick={() =>
                                field.onChange(field.value.filter((t: string) => t !== type))
                              }
                            >
                              {type} ✕
                            </span>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-[#516d19] rounded-full" disabled={loading}>
                  {loading ? t("creating") : t("createRoutine")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkincareRoutineForm;
