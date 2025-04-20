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


const SkincareRoutineForm = ({
  onCreated,
}: {
  onCreated: (routine: TRoutine) => Promise<void>;
}) => {
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
        toast.error("Không lấy được danh sách loại da");
      }
    };
    fetchSkinTypes();
  }, []);

  const handleFormSubmit = async (data: SkincareRoutineType) => {
    if (data.targetSkinTypes.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 loại da phù hợp");
      return;
    }

    setLoading(true);
    try {
      const res = await skincareRoutineService.createSkincareRoutine(data);

      if (res.success) {
        toast.success("Tạo skincare routine thành công!");
        onCreated(res.result?.data);
        form.reset();
      } else {
        toast.error("Tạo skincare routine thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tạo routine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Tạo Routine Chăm Sóc Da</CardTitle>
            <CardDescription>Điền thông tin chi tiết cho routine chăm sóc da của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên Routine</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên routine" {...field} />
                      </FormControl>
                      <FormDescription>Đặt tên cho routine chăm sóc da của bạn.</FormDescription>
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
                          placeholder="Routine này giúp dưỡng ẩm và bảo vệ da vào buổi sáng..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Mô tả mục đích và lợi ích của routine này.</FormDescription>
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
                        <FormLabel>Số bước</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={10} {...field} />
                        </FormControl>
                        <FormDescription>Số bước trong routine này.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá tiền (VND)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={1000} {...field} />
                        </FormControl>
                        <FormDescription>Tổng chi phí ước tính của các sản phẩm.</FormDescription>
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
                      <FormLabel>Loại da phù hợp</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          if (!field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại da" />
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
                      <FormDescription>Routine này dành cho loại da nào?</FormDescription>
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang tạo..." : "Tạo Routine"}
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
