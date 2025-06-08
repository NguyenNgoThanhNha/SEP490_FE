import { z } from "zod";

export const ServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().positive("Price must be positive"),
  images: z.array(z.any()).optional(),
  steps:z.array(z.any()).optional(),
  serviceCategoryId: z.number().positive('Company ID is required'),

});

export type ServiceType = z.infer<typeof ServiceSchema>;
