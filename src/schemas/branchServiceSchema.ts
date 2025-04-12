import { z } from "zod";

export const BranchServiceSchema = z.object({
 status: z.string(),
});

export type BranchServiceType = z.infer<typeof BranchServiceSchema>;
