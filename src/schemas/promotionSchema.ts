import { z } from 'zod';

export const PromotionSchema = z.object({
  promotionName: z.string().min(5, 'Promotion name is required'),
  promotionDescription: z.string().min(5, 'Promotion description is required'), 
  startDate: z
    .string()
    .nonempty('Start date is required')
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid start date format'), 
  endDate: z
    .string()
    .nonempty('End date is required') 
    .refine((date) => !isNaN(Date.parse(date)), 'Invalid end date format'), 
  status: z.string().nonempty('Status is required'), 
  discountPercent: z
    .number()
    .min(0, 'Discount percent must be at least 0') 
    .max(100, 'Discount percent cannot exceed 100') 
    .refine((value) => value !== null && value !== undefined, 'Discount percent is required'), 
});

export type PromotionType = z.infer<typeof PromotionSchema>;
