import { z } from 'zod';

export const BranchPromotionSchema = z.object({
  promotionId: z.number().min(1, 'Promotion ID is required'),
  branchId: z.number().min(1, 'Branch ID is required'),
  status: z.string().nonempty('Status is required'),
  stockQuantity: z
    .number()
    .min(0, 'Stock quantity must be at least 0')
    .refine((value) => value !== null && value !== undefined, 'Stock quantity is required'),
});

export type BranchPromotionType = z.infer<typeof BranchPromotionSchema>;
