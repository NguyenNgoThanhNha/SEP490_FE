import { z } from 'zod'

export const BranchProductSchema = z.object({
  stockQuantity: z.preprocess((val) => Number(val), z.number().min(0, 'Quantity must be greater than or equal to 0')),
  status: z.string()
})

export type BranchProductType = z.infer<typeof BranchProductSchema>
