import { z } from "zod";

export const VoucherSchema = z
  .object({
    code: z.string().min(1, "Voucher code is required"),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().positive("Price must be positive"),
    discountAmount: z.number(),
    validFrom: z.string(),
    validTo: z.string(),
    status: z.literal('Active')
  })
  .refine(
    (data) => new Date(data.validTo) > new Date(data.validFrom),
    {
      message: "Valid to date must be later than valid from date",
      path: ["validTo"], 
    }
  );

export type VoucherType = z.infer<typeof VoucherSchema>;
