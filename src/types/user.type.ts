export type TUser = {
  userId: string
  email: string
  userName: string
  phone: number
  fullName: string
  city: string
  address: string
  avatar?: string
  password?: string
  link: string
  otp: string
  roleID: number
  gender: string
  phoneNumber: string
  status: "Active" | "Inactive"
  birthDate: string
}
