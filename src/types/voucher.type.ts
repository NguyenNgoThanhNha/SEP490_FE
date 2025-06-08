export type TVoucher = {
  voucherId: number
  code: string
  quantity: number
  remainQuantity: number
  status: string
  description: string
  discountAmount: number
  validFrom: string
  validTo: string
  minOrderAmount: number
  requirePoint: number
}
