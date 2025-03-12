import { get, post, put, ResponseProps } from './root'

interface BranchPromotionProps {
  page: number
  pageSize: number
  branchId: number
}

const getAllBranchPromotion = async ({ branchId, page, pageSize }: BranchPromotionProps): Promise<ResponseProps> => {
  return await get(`BranchPromotion/get-all-promotion-of-branch/${branchId}?page=${page}&pageSize=${pageSize}`)
}

interface BranchPromotionDetailProps {
  branchPromotionId: number
}

const getBranchPromotionDetail = async ({ branchPromotionId }: BranchPromotionDetailProps): Promise<ResponseProps> => {
  return await get(`BranchPromotion/get-by-id/${branchPromotionId}`)
}

interface CreateBranchPromotionProps {
  promotionId: number,
  branchId: number,
  status: string,
  stockQuantity: number
}

const createBranchPromotion = async ({
    promotionId,
    branchId,
    status,
    stockQuantity
}: CreateBranchPromotionProps): Promise<ResponseProps> => {
  return await post('BranchPromotion/create', {
    promotionId,
    branchId,
    status,
    stockQuantity
  })
}

interface UpdateBranchPromotionProps {
    branchPromotionId: number,
    promotionId?: number,
    branchId?: number,
    status?: string,
    stockQuantity?: number
}

const updateBranchPromotion = async ({
    branchPromotionId,
    promotionId,
    branchId,
    status,
    stockQuantity
}: UpdateBranchPromotionProps): Promise<ResponseProps> => {
  return await put(`BranchPromotion/update/${branchPromotionId}`, {
    branchId,
    promotionId,
    status,
    stockQuantity
  })
}

const deleteBranchPromotion = async (id: number): Promise<ResponseProps> => {
  return await put(`BranchPromotion/delete/${id}`)
}


export default {
  getAllBranchPromotion,
  getBranchPromotionDetail,
  createBranchPromotion,
  updateBranchPromotion,
  deleteBranchPromotion
}
