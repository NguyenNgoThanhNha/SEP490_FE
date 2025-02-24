import { get, post,ResponseProps } from './root'

interface OrderProps {
  pageIndex: number
  pageSize: number
}

const getAllPurchase = async ({ pageIndex, pageSize }: OrderProps): Promise<ResponseProps> => {
  return await get(`Purchasae/get-list?page=${pageIndex}&pageSize=${pageSize}`)
}

interface CreatePurchaseProps {
  orderCode: number
  customerId: number
  voucherId: number
  status: string
}

const createPurchase = async ({
  customerId,
  orderCode,
  voucherId,
  status
}: CreatePurchaseProps): Promise<ResponseProps> => {
  return await post('Purchase/create-order', {
    orderCode,
    customerId,
    voucherId,
    status
  })
}

export default {
  getAllPurchase,
  createPurchase
}
