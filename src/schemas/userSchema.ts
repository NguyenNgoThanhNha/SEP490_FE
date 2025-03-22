import { z } from 'zod'
//signup
export const UserSignupSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .min(1, 'Email is required')
    .email({ message: 'Email is not a valid email' }),
  userName: z
    .string({
      required_error: 'Username is required'
    })
    .min(1, 'Username is required'),
  fullName: z
    .string({
      required_error: 'Full Name is required'
    })
    .min(1, 'Username is required'),
  address: z
    .string({
      required_error: 'Address is required'
    })
    .min(1, 'Address is required'),
  city: z
    .string({
      required_error: 'City is required'
    })
    .min(1, 'City is required'),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(1, 'Password is required'),
  confirmPassword: z
    .string({
      required_error: 'Confirm password is required'
    })
    .min(1, 'Confirm password is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits')
    .refine((val) => val.length === 10, { message: 'Phone number must be exactly 10 digits' }),
  policy: z.boolean().refine((val) => val, {
    message: 'You must accept the policy'
  })
})

export type UserSignupType = z.infer<typeof UserSignupSchema>
//login
export const UserLoginSchema = z.object({
  identifier: z
    .string({
      required_error: 'Email is required'
    })
    .min(1, 'Email is required')
    .email({ message: 'Email is not a valid email' }),
  password: z
    .string({
      required_error: 'Password is required'
    })
    .min(1, 'Password is required')
})
export type UserLoginType = z.infer<typeof UserLoginSchema>
//forgot-password
export const UserForgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .min(1, 'Email is required')
})
export type UserForgotPasswordType = z.infer<typeof UserForgotPasswordSchema>
//verify-code
export const UserVerifyCodeSchema = z.object({
  otp: z
    .string({
      required_error: 'Code is required'
    })
    .min(1, 'Code is required')
})
export type UserVerifyCodeType = z.infer<typeof UserVerifyCodeSchema>
//set password
export const UserSetPasswordSchema = z.object({
  newPassword: z
    .string({
      required_error: 'Password is required'
    })
    .min(1, 'Password is required'),
  confirmNewPassword: z
    .string({
      required_error: 'Confirm password is required'
    })
    .min(1, 'Confirm password is required')
})
export type UserSetPasswordType = z.infer<typeof UserSetPasswordSchema>
//get promote code
export const UserGetPromoteCodeSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .min(1, 'Email is required'),
  username: z
    .string({
      required_error: 'Username is required'
    })
    .min(1, 'Username is required'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits')
    .refine((val) => val.length === 10, { message: 'Phone number must be exactly 10 digits' })
})

export type UserGetPromoteCodeType = z.infer<typeof UserGetPromoteCodeSchema>

//SignInGG
export const UserSignInGGSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required'
    })
    .min(1, 'Email is required')
    .email({ message: 'Email is not a valid email' }),
  userName: z
    .string({
      required_error: 'Username is required'
    })
    .min(1, 'Username is required'),
  fullName: z
    .string({
      required_error: 'FullName is required'
    })
    .min(1, 'FullName is required'),
  avatar: z
    .string({
      required_error: 'Avatar is required'
    })
    .min(1, 'Avatar is required'),
  typeAccount: z
    .string({
      required_error: 'TypeAccount is required'
    })
    .min(1, 'TypeAccount is required')
})

export type UserSignInGGType = z.infer<typeof UserSignInGGSchema>

export const UpdateInfoSchema = z.object({
  senderName: z.string({}).min(1, 'Sender name is required'),
  senderPhone: z.string({}).min(10, 'Sender phone number is required'),
  receiverName: z.string({}).min(1, 'Receiver name is required'),
  receiverPhone: z.string({}).min(10, 'Receiver phone number is required'),
  orderDetailId: z.string(),
  deliveryInfoId: z.string()
})

export type UpdateInfoType = z.infer<typeof UpdateInfoSchema>
