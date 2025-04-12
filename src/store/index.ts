import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slice/authSlice'
import blogReducer from './slice/blogSlice'
import productReducer from './slice/productSlice'
import serviceReducer from './slice/serviceSlice'
import branchReducer from './slice/branchSlice'
import chatReducer from './slice/chatSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    product: productReducer,
    service: serviceReducer,
    branch: branchReducer,
    chat: chatReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store
