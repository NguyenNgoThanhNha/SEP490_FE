import { del, get, post, put, ResponseProps } from './root'

interface ServiceProps {
  page: number
  pageSize: number
}

const getAllService = async ({ page, pageSize }: ServiceProps): Promise<ResponseProps> => {
  return await get(`Service/get-all-services?page=${page}&pageSize=${pageSize}`)
}

interface ServiceDetailProps {
  serviceId: number
}

const getServiceDetail = async ({ serviceId }: ServiceDetailProps): Promise<ResponseProps> => {
  return await get(`Service/get-service-by-id?id=${serviceId}`)
}

interface CreateServiceProps {
  name: string
  description: string
  price: number
  duration: string
  images: File[]
  steps: string[]
  serviceCategoryId: number
}

const createService = async (data: CreateServiceProps): Promise<ResponseProps> => {
  const formData = new FormData()
  formData.append('Name', data.name)
  formData.append('Description', data.description)
  formData.append('Price', data.price.toString())
  formData.append('Duration', data.duration.toString())
  formData.append('Steps', data.steps.toString())
  formData.append('ServiceCategoryId', data.serviceCategoryId.toString())
  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((file: File) => {
      formData.append('images', file)
    })
  }
  return await post('Service/create-service', formData)
}

interface UpdateServiceProps {
  serviceId: number
  name?: string
  description?: string
  price?: number
  duration?: string
  status?: string
  images?: string[]
}

const updateService = async ({
  serviceId,
  name,
  description,
  price,
  duration,
  status,
  images = []
}: UpdateServiceProps): Promise<ResponseProps> => {
  const formData = new FormData()
  if (name) formData.append('Name', name) 
  if (description) formData.append('Description', description)
  if (price !== undefined) formData.append('Price', price.toString())
  if (duration) formData.append('Duration', duration)
  if (status) formData.append('Status', status)
  if (images && Array.isArray(images)) {
    images.forEach((image) => {
      formData.append('Images', image) 
    })
  }

  return await put(`Service/update-service?serviceId=${serviceId}`, formData)
}

const deleteService = async (serviceId: number): Promise<ResponseProps> => {
  return await del(`Service/delete-service?serviceId=${serviceId}`)
}

interface GetAllServiceForBranchProps {
  branchId: number
  page: number
  pageSize: number
}

const getAllServiceForBranch = async ({
  branchId,
  page,
  pageSize
}: GetAllServiceForBranchProps): Promise<ResponseProps> => {
  return await get(`Service/get-all-services-for-branch?branchId=${branchId}&page=${page}&pageSize=${pageSize}`)
}

const elasticSearchService = async (keyword: string): Promise<ResponseProps> => {
  return await get(`Service/elasticsearch?keyword=${keyword}`)
}

export default {
  getAllService,
  getServiceDetail,
  createService,
  updateService,
  deleteService,
  getAllServiceForBranch,
  elasticSearchService
}
