import { TBranch } from './branch.type'
import { TCustomer } from './customer.type'
import { TService } from './serviceType'
import { TStaff } from './staff.type'

export type TAppointment = {
  userId: number
  appointmentId: number
  orderId: number
  customerId: number
  customer: TCustomer
  staffId: number
  staff: TStaff
  serviceId: number
  service: TService
  appointmentsTime: string
  appointmentEndTime: string
  status: string
  notes: string
  feedback: string
  quantity: number
  unitPrice: number
  subTotal: number
  statusPayment: string
  branchId: number
  branch: TBranch
  promotionId: number
}
