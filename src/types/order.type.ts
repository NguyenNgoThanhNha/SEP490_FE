import { TCustomer } from "./customer.type"
import { TOrderDetail } from "./orderDetail.type"
import { TRoutine } from "./routine.type"

export type TOrder = {
    orderId: number,
    orderDetailId: number,
    productId: number,
    unitPrice: number,
    quantity: number,
    status: string,
    customerId: number,
    customer: TCustomer,
    routineId: number,
    routine: TRoutine,
    totalAmount: number,
    discountAmount: number,
    orderType: string,
    statusPayment: string,
    note: string,
    orderDetails: TOrderDetail
}