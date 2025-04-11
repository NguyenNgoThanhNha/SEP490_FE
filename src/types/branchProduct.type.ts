import { TBranch } from "./branch.type"
import { TProduct } from "./product.type"

export type TBranchProduct = {
    id: number,
    product: TProduct,
    branch: TBranch,
    promotion: number,
    status: string,
    stockQuantity: number
}