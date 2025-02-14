import { get, post, ResponseProps } from './root'

interface BlogProps {
  page: number
  pageSize: number
  status: string
}

const getAllBlog = async ({status, page, pageSize }: BlogProps): Promise<ResponseProps> => {
  return await get(`Blog/get-all?status=${status}&page=${page}&pageSize=${pageSize}`)
}

interface BlogDetailProps {
  blogId: number;
}
const getBlogDetail = async ({ blogId }: BlogDetailProps): Promise<ResponseProps> => {
  return await get(`Blog/get-by-id/${blogId}`)
}

interface CreateBlogProps {
  title: string
  content: string
  authorId: number
  note: string
  createdDate: string
  updatedDate: string
  status:string
}

const createBlog = async ({ title, content,authorId,note,createdDate,updatedDate, status }: CreateBlogProps): Promise<ResponseProps> => {
  return await post('Blog/create', { title, content,authorId,note,createdDate,updatedDate , status});
};

export default {
  getAllBlog,
  createBlog,
  getBlogDetail
}