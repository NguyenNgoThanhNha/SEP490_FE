import { TBranch } from "./branch.type"
import { TProduct } from "./product.type"

export type TBranchProduct = {
    id: string,
    product: TProduct,
    branch: TBranch,
    promotion: number,
    status: string,
    stockQuantity: number
}