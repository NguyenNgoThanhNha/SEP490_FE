import { del, get, post, put, ResponseProps } from './root'

const getAllBranchService = async (branchId: number,page: number, pageSize: number): Promise<ResponseProps> => {
  return await get(`BranchService/get-all-service-in-branch/${branchId}?page=${page}&pageSize=${pageSize}`)
}

const getBranchServiceDetail = async (ServiceBranchId: number): Promise<ResponseProps> => {
  return await get(`BranchService/get-by-id/${ServiceBranchId}`)
}

interface createBranchServiceProps {
  serviceId: number
  branchId: number
  status: string
}

const createBranchService = async (data: createBranchServiceProps): Promise<ResponseProps> => {
  return await post(`BranchService/create`, data)
}
interface updateBranchServiceProps {
  serviceBranchId: number
  status?: string
}
const updateBranchService = async ({
  serviceBranchId,
  status,
}: updateBranchServiceProps): Promise<ResponseProps> => {
  return await put(`BranchService/update/${serviceBranchId}`, { status})
}

const deleteBranchService = async (ServiceId: number): Promise<ResponseProps> => {
    return await del(`BranchService/delete/${ServiceId}`)
  }


export default {
  getAllBranchService,
  createBranchService,
  updateBranchService,
  deleteBranchService,
  getBranchServiceDetail
}
