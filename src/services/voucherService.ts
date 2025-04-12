import { del, get, post, put, ResponseProps } from './root'

interface GetAllVoucherProps {
  Status: string; 
}

const getAllVoucher = async ({ Status }: GetAllVoucherProps): Promise<ResponseProps> => {
  return await get(`Voucher/get-all-vouchers?Status=${Status}`);
};

interface CreateVoucherProps {
  code: string
  quantity: number
  description: string
  discountAmount: number
  validFrom: string
  validTo: string
  status: 'Active',
  remainQuantity: number
}
const createVoucher = async (data: CreateVoucherProps): Promise<ResponseProps> => {
  return await post('Voucher/create-voucher', data)
}

interface UpdateVoucherProps {
  voucherId: number
  code?: string
  quantity?: number
  description?: string
  discountAmount?: number
  validFrom?: string
  validTo?: string
  status?: string
}

const updateVoucher = async (data: UpdateVoucherProps): Promise<ResponseProps> => {
  return await put('Voucher/update-voucher', data)
}

const deleteVoucher = async (voucherId: number): Promise<ResponseProps> => {
  return await del(`Voucher/delete-voucher/${voucherId}`)
}
export default {
  getAllVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher
}
