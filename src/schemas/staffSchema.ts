import { z } from 'zod'

export const StaffSchema = z.object({
  userName: z.string().min(5, 'Staff name is required'),
  email: z.string().email('Invalid email'),
  fullName: z.string().min(5, 'Full name is requires'),
  branchId: z.number().optional(),
})

export type StaffType = z.infer<typeof StaffSchema>