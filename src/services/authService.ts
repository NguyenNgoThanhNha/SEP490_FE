import { get, post, ResponseProps } from '@/services/root.ts'
import { UserSignInGGType, UserSignupType } from '@/schemas/userSchema.ts'

interface RegisterProps {
  data: UserSignupType
}

const FRONT_END = import.meta.env.VITE_FRONTEND_VERIFY || ''

const register = async ({ data }: RegisterProps): Promise<ResponseProps> => {
  return await post('Auth/first-step', { ...data, typeAccount: 'Customer', link: FRONT_END })
}

interface VerifyProps {
  email: string
  otp: string
}

const verify = async ({ email, otp }: VerifyProps): Promise<ResponseProps> => {
  return await post('Auth/submit-otp', { email, otp })
}

interface LoginProps {
  identifier: string
  password: string
}

const login = async ({ identifier, password }: LoginProps): Promise<ResponseProps> => {
  return await post('Auth/login', { identifier, password })
}

interface ForgotPasswordProps {
  email: string
}

const forgotPassword = async ({ email }: ForgotPasswordProps): Promise<ResponseProps> => {
  return await post(`Auth/forget-password?email=${email}`, {})
}

interface ResendOTPProps {
  email: string
}

const resendOTP = async ({ email }: ResendOTPProps): Promise<ResponseProps> => {
  return await post(`Auth/resend-otp?email=${email}`, {})
}

interface UpdatePasswordProps {
  email: string
  newPassword: string
  confirmNewPassword: string
}

const updatePassword = async ({
  email,
  newPassword,
  confirmNewPassword
}: UpdatePasswordProps): Promise<ResponseProps> => {
  return await post(`Auth/update-password?email=${email}`, {
    password: newPassword,
    confirmPassword: confirmNewPassword
  })
}

interface LoginWithGGProps {
  data: UserSignInGGType
}

const loginWithGG = async ({ data }: LoginWithGGProps): Promise<ResponseProps> => {
  return await post('Auth/login-google', data)
}

const getUserInfo = async (): Promise<ResponseProps> => {
  return await get('Auth/user-info')
}

const getRefresh = async (): Promise<ResponseProps> => {
  return await get('Auth/refresh-token')
}

interface DeleteAccountProps {
  email: string
}

const deleteAccount = async ({ email }: DeleteAccountProps): Promise<ResponseProps> => {
  return await post('User/delete-account', { email })
}

interface ConfirmDeleteAccountProps {
  email: string,
  otp: string
}

const confirmDeleteAccount = async ({ email, otp }: ConfirmDeleteAccountProps): Promise<ResponseProps> => {
  return await post('User/confirm-delete', { email, otp })
}

const loginWithFB = async ({ data }: LoginWithGGProps): Promise<ResponseProps> => {
  return await post('Auth/login-facebook', data)
}
interface CreateAccountWithPhoneProps {
  phoneNumber: string,
  userName: string,
  password: string
}

const createAccountWithPhone = async ( data :CreateAccountWithPhoneProps): Promise<ResponseProps> => {
  return await post('Auth/create-account-with-phone', data)
}

interface GetUserByPhoneEmailProps {
  phone?: string,
  email?: string
}

const getUserByPhone = async ({ phone, email }: GetUserByPhoneEmailProps): Promise<ResponseProps> => {
  const queryParams = new URLSearchParams();

  if (phone) queryParams.append("Phone", phone);
  if (email) queryParams.append("Email", email);

  const queryString = queryParams.toString();
  return await get(`Auth/get-user-by-phone-email?${queryString}`);
};

export default {
  register,
  verify,
  login,
  forgotPassword,
  resendOTP,
  updatePassword,
  loginWithGG,
  getUserInfo,
  getRefresh,
  deleteAccount,
  loginWithFB,
  confirmDeleteAccount,
  createAccountWithPhone,
  getUserByPhone

}
