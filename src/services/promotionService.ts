import { get, post, put, ResponseProps } from './root'

interface PromotionProps {
  page: number
  pageSize: number
}

const getAllPromotion = async ({ page, pageSize }: PromotionProps): Promise<ResponseProps> => {
  return await get(`Promotion/get-all?page=${page}&pageSize=${pageSize}`)
}

interface PromotionDetailProps {
  promotionId: number
}

const getPromotionDetail = async ({ promotionId }: PromotionDetailProps): Promise<ResponseProps> => {
  return await get(`Promotion/get-by-id/${promotionId}`)
}

interface CreatePromotionProps {
  promotionName: string
  promotionDescription: string
  discountPercent?: number
  startDate?: string
  endDate?: string
  status?: string
}

const createPromotion = async ({
  promotionName,
  promotionDescription,
  discountPercent,
  startDate,
  endDate,
  status
}: CreatePromotionProps): Promise<ResponseProps> => {
  return await post('Promotion/create', {
    promotionName,
    promotionDescription,
    discountPercent,
    startDate,
    endDate,
    status
  })
}

interface UpdatePromotionProps {
  promotionId: number
  promotionName?: string
  promotionDescription?: string
  discountPercent?: number
  startDate?: string
  endDate?: string
  status?: string
}

const updatePromotion = async ({
  promotionId,
  promotionName,
  promotionDescription,
  discountPercent,
  startDate,
  endDate,
  status
}: UpdatePromotionProps): Promise<ResponseProps> => {
  return await put(`Promotion/update/${promotionId}`, {
    promotionDescription,
    promotionName,
    discountPercent,
    startDate,
    endDate,
    status
  })
}

const deletePromotion = async (promotionId: number): Promise<ResponseProps> => {
  return await put(`Promotion/delete/${promotionId}`)
}

export default {
  getAllPromotion,
  getPromotionDetail,
  createPromotion,
  updatePromotion,
  deletePromotion
}
