import { del, get, post, put, ResponseProps } from './root'

const getAllBranchProduct = async (branchId: number): Promise<ResponseProps> => {
  return await get(`BranchProduct/get-all-product-in-branch/${branchId}`)
}

interface createBranchProductProps {
  productId: number
  branchId: number
  status: string
  stockQuantity: number
}

const createBranchProduct = async (data: createBranchProductProps): Promise<ResponseProps> => {
  return await post(`BranchProduct/create`, data)
}
interface updateBranchProductProps {
  productBranchId: number
  status?: ''
  stockQuantity?: number
}
const updateBranchProduct = async ({
  productBranchId,
  status,
  stockQuantity
}: updateBranchProductProps): Promise<ResponseProps> => {
  return await put(`BranchProduct/update/${productBranchId}`, { status, stockQuantity })
}

const deleteBranchProduct = async (branchId: number): Promise<ResponseProps> => {
    return await del(`BranchProduct/get-all-product-in-branch/${branchId}`)
  }
export default {
  getAllBranchProduct,
  createBranchProduct,
  updateBranchProduct,
  deleteBranchProduct
}
