import { del, get, post, ResponseProps } from './root'

interface BranchProps {
  page: number
  pageSize: number
  status: string
}

const getAllBranch = async ({ status, page, pageSize }: BranchProps): Promise<ResponseProps> => {
  return await get(`Branch/get-list?status=${status}&page=${page}&pageSize=${pageSize}`)
}

const deleteBranch = async ( branchId: number): Promise<ResponseProps> => {
  return await del(`Branch/delete/${branchId}`)
}

interface CreateBranchProps {
  branchName: string,
  branchAddress: string,
  branchPhone: string,
  longAddress: string,
  latAddress: string,
  status: string,
  managerId: number,
  companyId: number,
  district: number,
  wardCode: number
}
const createBranch = async (data: CreateBranchProps): Promise<ResponseProps> => {
  return await post(`Branch/create`, {data})
}


export default {
  getAllBranch,
  deleteBranch,
  createBranch
}
