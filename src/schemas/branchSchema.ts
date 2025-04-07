import { z } from "zod";

export const branchSchema = z.object({
  branchName: z.string().min(1, "Branch name is required"),
  branchAddress: z.string().min(1, "Address is required"),
  branchPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
  longAddress: z.string().min(1, "Longitude is required"),
  latAddress: z.string().min(1, "Latitude is required"),
  status: z.enum(["Active", "Inactive", "Pending"]), 
  managerId: z.number().nonnegative("Manager ID must be a non-negative number"),
  companyId: z.number().nonnegative("Company ID must be a non-negative number"),
  district: z.number().nonnegative("District must be a non-negative number"),
  wardCode: z.number().nonnegative("Ward code must be a non-negative number"),
});

export type BranchType = z.infer<typeof branchSchema>;
