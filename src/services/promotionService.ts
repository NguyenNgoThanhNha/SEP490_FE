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
  PromotionName: string;
  PromotionDescription: string;
  DiscountPercent?: number;
  StartDate?: string;
  EndDate?: string;
  Status?: string;
}

const createPromotion = async (
  data: CreatePromotionProps
): Promise<ResponseProps> => {
  const formData = new FormData();

  formData.append('PromotionName', data.PromotionName);
  formData.append('PromotionDescription', data.PromotionDescription);
  if (data.DiscountPercent !== undefined) {
    formData.append('DiscountPercent', data.DiscountPercent.toString());
  }
  if (data.StartDate) {
    formData.append('StartDate', data.StartDate);
  }
  if (data.EndDate) {
    formData.append('EndDate', data.EndDate);
  }
  if (data.Status) {
    formData.append('Status', data.Status);
  }

  return await post('Promotion/create', formData);
};


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
  const formData = new FormData();

  if (promotionName !== undefined) formData.append("PromotionName", promotionName);
  if (promotionDescription !== undefined) formData.append("PromotionDescription", promotionDescription);
  if (discountPercent !== undefined) formData.append("DiscountPercent", discountPercent.toString());
  if (startDate) formData.append("StartDate", startDate);
  if (endDate) formData.append("EndDate", endDate);
  if (status) formData.append("Status", status);

  return await put(`Promotion/update/${promotionId}`, formData);
};


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
