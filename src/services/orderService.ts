import { get, post,put,ResponseProps } from './root'

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

interface ConfirmAppointmentProps {
  orderId: number,
  totalAmount: string,
}

const confirmAppointment = async ({orderId, totalAmount}:ConfirmAppointmentProps) : Promise<ResponseProps> =>{
  return await post('Order/confirm-order-appointment', {orderId,totalAmount})
}

interface UpdatePaymentMethodProps {
  orderId: number,
  paymentMethod?: string,
  note? : string
}

const updatePaymentMethod = async ({orderId, paymentMethod, note}: UpdatePaymentMethodProps) : Promise<ResponseProps> =>{
  return await put('Order/confirm-order-appointment', {orderId,paymentMethod, note})
}
export default {
  getAllPurchase,
  createPurchase,
  confirmAppointment,
  updatePaymentMethod
}
