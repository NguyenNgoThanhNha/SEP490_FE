import { del, get, post, put, ResponseProps } from './root'

interface ServiceProps {
  page: number
  pageSize: number
}

const getAllSerCate = async ({ page, pageSize }: ServiceProps): Promise<ResponseProps> => {
  return await get(`ServiceCategory/search?page=${page}&pageSize=${pageSize}`)
}

interface ServiceDetailProps {
  serviceCategoryId: number
}

const getSerCateDetail = async ({ serviceCategoryId }: ServiceDetailProps): Promise<ResponseProps> => {
  return await get(`ServiceCategory/${serviceCategoryId}`)
}

interface CreateServiceProps {
  name: string
  description: string
  thumbnail: File
  status: string
}

const createSerCate = async ({ name, description, thumbnail, status }: CreateServiceProps): Promise<ResponseProps> => {
  return await post('ServiceCategory/create', {
    name,
    description,
    thumbnail,
    status
  })
}

interface UpdateServiceProps {
  name?: string
  description?: string
  thumbnail?: File
  status?: string
  serviceCategoryId: number
}

const updateServiceCate = async ({
  serviceCategoryId,
  name,
  description,
  status,
  thumbnail
}: UpdateServiceProps): Promise<ResponseProps> => {
  return await put(`ServiceCategory/${serviceCategoryId}`, {
    name,
    description,
    status,
    thumbnail
  })
}

const deleteServiceCate = async (serviceCategoryId: number): Promise<ResponseProps> => {
  return await del(`ServiceCategory/${serviceCategoryId}`)
}

export default {
  getAllSerCate,
  getSerCateDetail,
  createSerCate,
  updateServiceCate,
  deleteServiceCate
}
