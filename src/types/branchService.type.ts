import { TBranch } from "./branch.type"
import { TService } from "./serviceType"

export type TBranchService = {
    id: number,
    branch: TBranch,
    service: TService
    status: string 
}