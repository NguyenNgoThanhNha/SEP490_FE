import { get, post, put, del, ResponseProps } from './root'

interface ProductProps {
  page: number
  pageSize: number
}

const getAllProduct = async ({ page, pageSize }: ProductProps): Promise<ResponseProps> => {
  return await get(`Product/get-all-products?page=${page}&pageSize=${pageSize}`)
}

interface ProductDetailProps {
  productId: number
}

const getProductDetail = async ({ productId }: ProductDetailProps): Promise<ResponseProps> => {
  return await get(`Product/${productId}`)
}

interface CreateProductProps {
  productName: string
  productDescription: string
  dimension: string
  volume: number
  price: number
  quantity: number
  discount: number
  categoryId: number
  companyId: number
  skintypesuitable: string,
  images: string[]
}

const createProduct = async ({
  productName,
  productDescription,
  dimension,
  volume,
  price,
  quantity,
  discount,
  categoryId,
  companyId,
  skintypesuitable,
  images
}: CreateProductProps): Promise<ResponseProps> => {
  return await post('Product/create', {
    productName,
    productDescription,
    dimension,
    discount,
    categoryId,
    companyId,
    price,
    volume,
    quantity,
    skintypesuitable,
    images
  })
}

interface UpdateProductProps {
  productId: number
  productName?: string
  productDescription?: string
  dimension?: string
  volume?: number
  price?: number
  quantity?: number
  discount?: number
  categoryId?: number
  companyId?: number
  images?: string[]
}

const updateProduct = async ({
  productId,
  productName,
  productDescription,
  price,
  dimension,
  discount,
  quantity,
  volume,
  categoryId,
  companyId,
  images = []
}: UpdateProductProps): Promise<ResponseProps> => {
  return await put(`Product/update/${productId}`, {
    price,
    categoryId,
    companyId,
    dimension,
    discount,
    volume,
    productDescription,
    productName,
    quantity,
    images
  })
}

const deleteProduct = async (productId: number): Promise<ResponseProps> => {
  return await del(`Product/${productId}`)
}
interface FilterProductProps {
  branchId: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
}

const filterProducts = async (params: FilterProductProps): Promise<ResponseProps> => {
  const query = new URLSearchParams(params as any).toString();
  return await get(`Product/filter?${query}`);
};

export default {
  getAllProduct,
  createProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
  filterProducts,

}
