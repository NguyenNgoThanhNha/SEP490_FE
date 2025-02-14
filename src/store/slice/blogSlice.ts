import { TBlog } from '@/types/blog.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BlogState {
  blogs: TBlog[]
  blogDetail: TBlog | null
}

const initialState: BlogState = {
  blogs: [],
  blogDetail: null
}

const BlogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<TBlog[]>) => {
      state.blogs = action.payload
    },
    setBlogDetail: (state, action: PayloadAction<TBlog>) => {
      state.blogDetail = action.payload
    },
    addBlog: (state, action: PayloadAction<TBlog>) => {
      state.blogs.push(action.payload)
    },
    updateBlog: (state, action: PayloadAction<TBlog>) => {
      const index = state.blogs.findIndex((blog) => blog.blogId === action.payload.blogId)
      if (index !== -1) {
        state.blogs[index] = action.payload
      }
    },
    deleteBlog: (state, action: PayloadAction<number>) => {
      state.blogs = state.blogs.filter((blog) => blog.blogId!== action.payload)
    }
  }
});
export const {setBlogs, setBlogDetail, addBlog, updateBlog, deleteBlog} = BlogSlice.actions;
export default BlogSlice.reducer;
