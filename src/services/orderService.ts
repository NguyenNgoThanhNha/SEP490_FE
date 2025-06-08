import { get, patch, post, put, ResponseProps } from './root'

interface OrderProps {
  pageIndex: number
  pageSize: number
}

const getAllPurchase = async ({ pageIndex, pageSize }: OrderProps): Promise<ResponseProps> => {
  return await get(`Purcharse/get-list?pageIndex=${pageIndex}&pageSize=${pageSize}`)
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
  orderId: number
  totalAmount: string
  request: {
    returnUrl: string
    cancelUrl: string
  }
}

const confirmAppointment = async (data: ConfirmAppointmentProps): Promise<ResponseProps> => {
  return await post('Order/confirm-order', data)
}

interface UpdatePaymentMethodProps {
  orderId: number
  paymentMethod?: string
  note?: string
}

const updatePaymentMethod = async ({
  orderId,
  paymentMethod,
  note
}: UpdatePaymentMethodProps): Promise<ResponseProps> => {
  return await put('Order/update-payment-method-or-note', { orderId, paymentMethod, note })
}
interface CreateOrderFullProps {
  userId: number
  totalAmount?: number
  paymentMethod: string
  shippingCost: number
  products: {
    productBranchId: number
    quantity: number
  }[]
}
const createOrderFull = async (data: CreateOrderFullProps): Promise<ResponseProps> => {
  return await post('Order/create-full', data)
}

interface ConfirmOrderProduct {
  orderId: number
  totalAmount: string
  request: {
    returnUrl: string
    cancelUrl: string
  }
}
const confirmOrderProduct = async (data: ConfirmOrderProduct): Promise<ResponseProps> => {
  return await post('Order/confirm-order', data)
}

const updateOrderStatus = async (orderId: number, orderStatus: string): Promise<ResponseProps> => {
  console.log('Payload gửi đến API:', { orderId, orderStatus })
  return await patch(`Order/update-order-status?orderId=${orderId}&orderStatus=${orderStatus}`)
}

interface GetAllOrderProps {
  OrderType?: string
  OrderStatus?: string
  PaymentStatus?: string
  BranchId?: number
  PageSize?: number
  PageIndex?: number
}
const getAllOrder = async (params: GetAllOrderProps = {}): Promise<ResponseProps> => {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return await get(`Order/get-all-order?${queryString}`)
}
const revenueByBranch = async (month: number, year: number): Promise<ResponseProps> => {
  return await get(`Auth/revenue-by-branch?month=${month}&year=${year}`)
}
interface OrderDetailProps {
  orderId: number
}

const getOrderDetail = async ({ orderId }: OrderDetailProps): Promise<ResponseProps> => {
  return await get(`Order/detail-booking?orderId=${orderId}`)
}

interface updateOrderDetailProps {
  orderDetailsIds: number[]
  status: string
}
const updateOrderDetail = async ({ orderDetailsIds, status }: updateOrderDetailProps): Promise<ResponseProps> => {
  return await put('Order/update-order-details-status', { orderDetailsIds, status })
}

const top3Revenue = async (month: number, year: number): Promise<ResponseProps> => {
  return await get(`Auth/top-3-revenue-branches?month=${month}&year=${year}`)
}

const getOrderByOrderType = async (): Promise<ResponseProps> => {
  return await get(`Order/count-by-order-type`)
}
interface ConfirmOrderDeposit {
  orderId: number
  totalAmount: string
  percent: number
  request: {
    returnUrl: string
    cancelUrl: string
  }
}
const confirmOrderDeposit = async (data: ConfirmOrderDeposit): Promise<ResponseProps> => {
  return await post(`Order/confirm-order-deposit`, data)
}

interface CreateAppointmentMoreData {
  userId: number
  staffId: number[]
  branchId: number
  appointmentsTime: number[]
  status: string
  notes: string
  feedback: string
  voucherId: number
  serviceId: number[]
}

const createAppointmentMore = async (data: CreateAppointmentMoreData, orderId: number): Promise<ResponseProps> => {
  return await post(`Order/create-order-appointment-more/${orderId}`, data)
}

interface CreateProductMoreData {
  userId: number
  productIds: number[]
  quantity: number[]
  branchId: number
  status: string
  promotionId: number
  statusPayment: string
}
const CreateProductMore = async (data: CreateProductMoreData, orderId: number): Promise<ResponseProps> => {
  return await post(`Order/create-order-product-more/${orderId}`, data)
}


const updatePaymentStatus = async (orderId: number, status: string): Promise<ResponseProps> => {
  return await put(`Order/update-order-payment-status`, {
    orderId, status }
  )
}

export default {
  getAllPurchase,
  createPurchase,
  confirmAppointment,
  updatePaymentMethod,
  createOrderFull,
  confirmOrderProduct,
  updateOrderStatus,
  getAllOrder,
  getOrderDetail,
  revenueByBranch,
  updateOrderDetail,
  top3Revenue,
  getOrderByOrderType,
  confirmOrderDeposit,
  createAppointmentMore,
  CreateProductMore,
  updatePaymentStatus
}
