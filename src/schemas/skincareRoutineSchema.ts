import { z } from "zod";

export const SkincareRoutineSchema = z.object({
  name: z.string().min(1, "Tên routine là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  totalSteps: z
  .number({ invalid_type_error: "Phải là số hợp lệ" })
  .int("Phải là số nguyên")
  .positive("Số bước phải là số nguyên dương"),

totalPrice: z
  .number({ invalid_type_error: "Phải là số hợp lệ" })
  .nonnegative("Tổng giá phải lớn hơn hoặc bằng 0"),

  targetSkinTypes: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một loại da phù hợp"),
});

export type SkincareRoutineType = z.infer<typeof SkincareRoutineSchema>;
