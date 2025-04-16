import {
  Card,
  CardContent,
} from "@/components/atoms/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/ui/form";
import { Input } from "@/components/atoms/ui/input";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/atoms/ui/select";
import skincareRoutineService from "@/services/skincareRoutineService";
import { SkincareRoutineSchema, SkincareRoutineType } from "@/schemas/skincareRoutineSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { TRoutine } from "@/types/routine.type";

const SkincareRoutineForm = ({
  onCreated,
}: {
  onCreated: (routine: TRoutine) => Promise<void>;
}) => {
  const [skinTypes, setSkinTypes] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRoutineCreated, setIsRoutineCreated] = useState(false);

  const form = useForm<SkincareRoutineType>({
    resolver: zodResolver(SkincareRoutineSchema),
    defaultValues: {
      name: "",
      description: "",
      totalSteps: 0,
      totalPrice: 0,
      targetSkinTypes: []
    },
  });

  useEffect(() => {
    form.setValue("targetSkinTypes", selectedSkinTypes);
  }, [selectedSkinTypes]);

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
    if (selectedSkinTypes.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 loại da phù hợp");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...data,
        targetSkinTypes: selectedSkinTypes,
      };

      const res = await skincareRoutineService.createSkincareRoutine(payload);

      if (res.success) {
        toast.success("Tạo skincare routine thành công!");
        setIsRoutineCreated(true);
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <Card>
          <CardContent className="grid grid-cols-1 gap-6 mt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Routine</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên routine" {...field} />
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
                    <Input placeholder="Mô tả routine" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalSteps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tổng số bước</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      onChange={(e) => {
                        const value = e.target.value;
                        const parsed = value === "" ? undefined : parseInt(value, 10);
                        field.onChange(parsed);
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
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
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      onChange={(e) => {
                        const value = e.target.value;
                        const parsed = value === "" ? undefined : parseFloat(value);
                        field.onChange(parsed);
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Loại da phù hợp</FormLabel>
              <Select onValueChange={(value) => {
                if (!selectedSkinTypes.includes(value)) {
                  setSelectedSkinTypes((prev) => [...prev, value]);
                }
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại da" />
                </SelectTrigger>
                <SelectContent>
                  {skinTypes.map((type) => (
                    <SelectItem value={type} key={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSkinTypes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkinTypes.map((type) => (
                    <span
                      key={type}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm cursor-pointer"
                      onClick={() =>
                        setSelectedSkinTypes((prev) =>
                          prev.filter((t) => t !== type)
                        )
                      }
                    >
                      {type} ✕
                    </span>
                  ))}
                </div>
              )}
            </FormItem>
          </CardContent>
        </Card>

        {!isRoutineCreated && (
          <div className="flex justify-end space-x-4">
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
                "Tạo Routine"
              )}
            </button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default SkincareRoutineForm;
