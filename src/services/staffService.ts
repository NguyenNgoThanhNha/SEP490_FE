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
  branchId: number,
  roleId: number
}

const createStaff = async ({
  userName,
  fullName,
  email,
  branchId,
  roleId
}: CreateStaffProps): Promise<ResponseProps> => {
  return await post(`Staff/create`, { userName, fullName, email, branchId, roleId})
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
  branchId
}: UpdateStaffProps): Promise<ResponseProps> => {
  return await put(`Staff/${staffId}`, { userName, fullName, email, avatar, branchId })
}

const deleteStaff = async (staffId: number): Promise<ResponseProps> => {
  return await del(`Staff/${staffId}`)
}

interface GetStaffByBranchAndServiceProps {
  branchId: number
  serviceId: number
}

const getStaffByBranchAndService = async ({
  branchId,
  serviceId
}: GetStaffByBranchAndServiceProps): Promise<ResponseProps> => {
  return await get(`Staff/get-list?branchId=${branchId}&serviceId=${serviceId}`)
}

interface StaffByBranchProps {
  branchId: number
}

const getStaffByBranch = async ({ branchId }: StaffByBranchProps): Promise<ResponseProps> => {
  return await get(`Staff/by-branch/${branchId}`)
}

interface StaffBusyTimeProps {
  staffId: number
  date: string
}

const getStaffBusyTime = async ({ staffId, date }: StaffBusyTimeProps): Promise<ResponseProps> => {
  return await get(`Staff/staff-busy-time?staffId=${staffId}&date=${date}`)
}
interface AssignStaffRoleProps {
  staffId: number,
  roleId: number
}

const assignStaffRole = async ({ staffId, roleId}: AssignStaffRoleProps): Promise<ResponseProps> => {
  return await get(`Staff/assign-role?staffId=${staffId}&roleId=${roleId}`)
}

export default {
  createStaff,
  updateStaff,
  deleteStaff,
  getAllStaff,
  getStaffDetail,
  getStaffByBranchAndService,
  getStaffByBranch,
  getStaffBusyTime,
  assignStaffRole
}
