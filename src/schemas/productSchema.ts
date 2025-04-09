import { z } from 'zod'

export const ProductSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  productDescription: z.string().min(1, 'Description is required'),
  dimension: z.string().min(1, 'Product name is required'),
  volume: z.number().positive('Volume must be positive'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  discount: z.number().min(0, 'Discount cannot be negative'),
  categoryId: z.number().positive('Category ID is required'),
  companyId: z.number().positive('Company ID is required'),
  images: z.array(z.string()).optional(),
  skintypesuitable: z.string()
})
export type ProductType = z.infer<typeof ProductSchema>
