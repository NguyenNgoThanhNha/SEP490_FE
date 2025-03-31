import { get, ResponseProps } from "./root"

interface CateProps {
    page: number,
    pageSize: number
}
const getAllCate = async ({ page, pageSize }: CateProps): Promise<ResponseProps> => {
    return await get(`Category/get-all?page=${page}&pageSize=${pageSize}`)
  }
  
export default {
    getAllCate
}