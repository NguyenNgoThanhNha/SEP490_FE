import { z } from "zod";

export const SkincareStepSchema = z.object({
  skincareRoutineId: z.number().min(1, "Routine ID không hợp lệ"),
  name: z.string().min(1, "Tên bước không được bỏ trống"),
  description: z.string(),
  step: z.number().min(1, "Step phải lớn hơn 0")
  .transform(val => Number(val))
  .refine(val => !isNaN(val), { message: "Phải là số hợp lệ" })
  ,
  productIds: z.array(z.number()),
  serviceIds: z.array(z.number()),
  intervalBeforeNextStep: z.preprocess(
    (val) => val === '' ? undefined : Number(val),
    z.number().min(0, "Thời gian nghỉ phải >= 0")
  ),
});

export type SkincareStepType = z.infer<typeof SkincareStepSchema>;
