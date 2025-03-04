import { get, ResponseProps } from './root'

interface BranchProps {
  page: number
  pageSize: number
  status: string
}

const getAllBranch = async ({ status, page, pageSize }: BranchProps): Promise<ResponseProps> => {
  return await get(`Branch/get-list?status=${status}&page=${page}&pageSize=${pageSize}`)
}

export default {
  getAllBranch
}
