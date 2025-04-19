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
  price: number
  quantity: number
  categoryId: number
  companyId: number
  brand: string,
  images: File[]}


const createProduct = async (data: CreateProductProps): Promise<ResponseProps> => {
  const formData = new FormData();
  formData.append('ProductName', data.productName);
  formData.append('ProductDescription', data.productDescription);
  formData.append('Dimension', data.dimension);
  formData.append('Price', data.price.toString());
  formData.append('Quantity', data.quantity.toString());
  formData.append('Brand', data.brand);
  formData.append('CategoryId', data.categoryId.toString());
  formData.append('CompanyId', data.companyId.toString());
  data.images.forEach((image) => {
    formData.append('Images', image);
  });
  return await post('Product/create', formData);
};


interface UpdateProductProps {
  productId: number
  productName?: string
  productDescription?: string
  dimension?: string
  price?: number
  brand?: string
  quantity?: number
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
  quantity,
  brand,
  categoryId,
  companyId,
  images = []
}: UpdateProductProps): Promise<ResponseProps> => {
  return await put(`Product/update/${productId}`, {
    price,
    categoryId,
    companyId,
    dimension,
    productDescription,
    productName,
    quantity,
    images,
    brand
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

const elasticSearchProduct =  async (keyword: string): Promise<ResponseProps> => {
  return await get(`Product/elasticsearch?keyword=${keyword}`)
}
export default {
  getAllProduct,
  createProduct,
  getProductDetail,
  updateProduct,
  deleteProduct,
  filterProducts,
  elasticSearchProduct

}
