import { TProduct } from "./product.type"

export type TOrderDetail = {
    orderDetailId: number,
    orderId: number,
    productId: number,
    product: TProduct,
    promotionId: number,
    
}