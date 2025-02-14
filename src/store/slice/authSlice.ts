import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TUser } from '@/types/user.type.ts'

interface auth {
  user: TUser | null;
  isAuthenticated: boolean;
}

const initialState: auth = {
  user: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    }
  }
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
