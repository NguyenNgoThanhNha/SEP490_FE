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
}

const createService = async ({
  name,
  description,
  price,
  duration,
  images=[]
}: CreateServiceProps): Promise<ResponseProps> => {
  return await post('Service/create-service', {
    name,
    description,
    duration,
    price,
    images
  })
}


interface UpdateServiceProps {
  serviceId: number
  name?: string
  description?: string
  price?: number
  duration?: string
  status?: string
  images? : string[]
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
  return await put(`Service/update-service?serviceId=${serviceId}`, { name, description, price, duration, status , images})
}

const deleteService = async (serviceId: number): Promise<ResponseProps> => {
  return await del(`Service/delete-service?serviceId=${serviceId}`)
}

interface GetAllServiceForBranchProps {
  branchId: number,
  page: number,
  pageSize: number
}

const getAllServiceForBranch = async({branchId, page, pageSize}: GetAllServiceForBranchProps): Promise<ResponseProps> => {
  return await get(`Service/get-all-services-for-branch?branchId=${branchId}&page=${page}&pageSize=${pageSize}`)
}

const elasticSearchService =  async (keyword: string): Promise<ResponseProps> => {
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
