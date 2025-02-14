import { del, get, post, put, ResponseProps } from './root'

interface StaffProps {
  pageIndex: number
  pageSize: number
}

const getAllStaff = async ({ pageIndex, pageSize }: StaffProps): Promise<ResponseProps> => {
  return await get(`Staff/get-list?pageIndex=${pageIndex}&pageSize=${pageSize}`)
}

interface StaffDetailProps {
  staffId: number
}

const getStaffDetail = async ({ staffId }: StaffDetailProps): Promise<ResponseProps> => {
  return await get(`Staff/${staffId}`)
}

interface CreateStaffProps {
  userName: string
  fullName: string
  email: string
  branchId: number
  createdDate: string
  updatedDate: string
}

const createStaff = async ({
  userName,
  fullName,
  email,
  branchId,
  createdDate,
  updatedDate
}: CreateStaffProps): Promise<ResponseProps> => {
  return await post(`Staff`, { userName, fullName, email, branchId, createdDate, updatedDate })
}

interface UpdateStaffProps {
  staffId: number
  userName?: string
  fullName?: string
  email?: string
  avatar?: string
  branchId?: number
}

const updateStaff = async ({
  staffId,
  userName,
  fullName,
  email,
  avatar,
  branchId,
}: UpdateStaffProps): Promise<ResponseProps> => {
  return await put(`Staff/${staffId}`, { userName, fullName, email, avatar, branchId})
}

const deleteStaff = async (staffId: number): Promise<ResponseProps> => {
  return await del(`Staff/${staffId}`)
}

export default {
    createStaff,
    updateStaff,
    deleteStaff,
    getAllStaff,
    getStaffDetail
}