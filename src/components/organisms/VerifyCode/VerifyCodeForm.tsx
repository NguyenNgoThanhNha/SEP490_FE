import { SubmitHandler, useForm } from 'react-hook-form'
import { UserVerifyCodeSchema, UserVerifyCodeType } from '@/schemas/userSchema.ts'
import { Form } from '@/components/atoms/ui/form.tsx'
import FormInput from '@/components/molecules/FormInput.tsx'
import { Button } from '@/components/atoms/ui/button.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from '@/components/templates/Loading.tsx'
import auth from '@/services/authService.ts'
import toast from 'react-hot-toast'
import { ROUTES } from '@/constants/RouterEndpoint.ts'

const VerifyCodeForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const location = useLocation()
  const email: string = location.state?.email
  const navigate = useNavigate()
  const form = useForm<UserVerifyCodeType>({
    resolver: zodResolver(UserVerifyCodeSchema),
    defaultValues: {
      otp: ''
    }
  })
  const onSubmit: SubmitHandler<UserVerifyCodeType> = async (data: UserVerifyCodeType) => {
    setLoading(true)
    const response = await auth.verify({ email, ...data })
    setLoading(false)
    if (response.success) {
      toast.success(response?.result?.message as string)
      if (location.state?.nextState === 'SET_PASSWORD')
        return navigate(ROUTES.SET_PASSWORD, { state: { email } })
      else return navigate(ROUTES.LOGIN)
    } else {
      toast.error(response?.result?.message as string)
    }
  }
  const onResendOTP = async () => {
    setLoading(true)
    const response = await auth.resendOTP({ email })
    setLoading(false)
    if (response.success) {
      toast.success(response?.result?.message as string)
    } else {
      toast.error(response?.result?.message as string)
    }
  }
  return (
    <Form {...form}>
      {loading && <Loading />}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={'grid grid-cols-2  gap-x-2 gap-y-4'}>
          <FormInput name={'otp'} form={form} placeholder={'Ex: 16538'} classContent={'col-span-2'} autoFocus />
        </div>
        <div className={'flex flex-col gap-2'}>
          <Button className={'bg-orangeTheme w-full hover:bg-orangeTheme/90'} type={'submit'}>
            Verify
          </Button>
          <div className={'text-sm justify-center flex gap-1'}>
            Didn't received any code?{' '}
            <span className={'text-orangeTheme font-semibold cursor-pointer'} onClick={onResendOTP}>
              {' '}
              Resend
            </span>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default VerifyCodeForm
