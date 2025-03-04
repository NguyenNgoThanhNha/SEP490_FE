import { TBranch } from "./branch.type"
import { TPromotion } from "./promotion.type"

export type TBranchPromotion = {
    promotionId: number,
    promotion: TPromotion,
    branchId: number,
    branch: TBranch,
    status: string,
    stockQuantity: number,
    createDate: string,
    updatedDate: string
}