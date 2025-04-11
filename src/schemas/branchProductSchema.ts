import { z } from "zod";

export const BranchProductSchema = z.object({
  stockQuantity: z.number().min(0, "Quantity must be greater than or equal to 0"),
  status: z.boolean(),
});

export type BranchProductType = z.infer<typeof BranchProductSchema>;
