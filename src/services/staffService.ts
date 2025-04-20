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
  roleId: number
}

const createStaff = async ({
  userName,
  fullName,
  email,
  branchId,
  roleId
}: CreateStaffProps): Promise<ResponseProps> => {
  return await post(`Staff/create`, { userName, fullName, email, branchId, roleId })
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
  return await put(`Staff/update/${staffId}`, { userName, fullName, email, avatar, branchId })
}

const deleteStaff = async (staffId: number): Promise<ResponseProps> => {
  return await del(`Staff/delete/${staffId}`)
}

interface GetStaffByServiceCategoryProps {
  branchId: number
  serviceCategoryIds: number[]
}

const getStaffByServiceCategory = async (data: GetStaffByServiceCategoryProps): Promise<ResponseProps> => {
  return await post(`Staff/staff-by-service-category`, data)
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
  return await get(`Staff/staff-busy-times?staffId=${staffId}&date=${date}`)
}

interface GetStaffFreeInTimeProps {
  branchId: number
  serviceIds: number[]
  startTimes: string
}

const getStaffFreeInTime = async (data: GetStaffFreeInTimeProps): Promise<ResponseProps> => {
  return await post(`Staff/staff-free-in-time`, data)
}

interface AssignStaffRoleProps {
  staffId: number
  roleId: number
}

const assignStaffRole = async ({ staffId, roleId }: AssignStaffRoleProps): Promise<ResponseProps> => {
  return await get(`Staff/assign-role?staffId=${staffId}&roleId=${roleId}`)
}

const staffWorkingSlot = async (branchId: number, month: number, year: number): Promise<ResponseProps> => {
  return await get(`Staff/working-slots?branchId=${branchId}&month=${month}&year=${year}`)
}
const getStaffInfo = async (): Promise<ResponseProps> => {
  return await get('Staff/get-staff-info')
}
interface GetListStaffAvailableProps {
  serviceId: number
  branchId: number
  workDate: string
  startTime: string
}

const getListStaffAvailable = async (data: GetListStaffAvailableProps): Promise<ResponseProps> => {
  return await post('Staff/get-list-staff-available-by-service-and-time', data)
}

const getListShift = async (): Promise<ResponseProps> => {
  return await get(`Staff/get-list-shifts`)
}

const staffLeaveOfBranch = async (branchId: number, month: number): Promise<ResponseProps> => {
  return await post(`Staff/get-staff-leave-of-branch`, { branchId, month })
}
const approveLeave = async (staffLeaveId: number): Promise<ResponseProps> => {
  return await put(`Staff/approve-staff-leave/${staffLeaveId}`)
}

const rejectLeave = async (staffLeaveId: number): Promise<ResponseProps> => {
  return await put(`Staff/reject-staff-leave/${staffLeaveId}`)
}

const getStaffLeaveAppointments = async (staffLeaveId: number): Promise<ResponseProps> => {
  return await get(`Staff/get-staff-leave-appointments/?staffLeaveId=${staffLeaveId}`)
}
export default {
  createStaff,
  updateStaff,
  deleteStaff,
  getAllStaff,
  getStaffDetail,
  getStaffByBranch,
  getStaffBusyTime,
  assignStaffRole,
  staffWorkingSlot,
  getStaffByServiceCategory,
  getStaffFreeInTime,
  getStaffInfo,
  getListStaffAvailable,
  getListShift,
  staffLeaveOfBranch,
  rejectLeave,
  approveLeave,
  getStaffLeaveAppointments
}
