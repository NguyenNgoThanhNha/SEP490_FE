import { SubmitHandler, useForm } from 'react-hook-form'
import { UserForgotPasswordSchema, UserForgotPasswordType } from '@/schemas/userSchema.ts'
import { Form } from '@/components/atoms/ui/form.tsx'
import FormInput from '@/components/molecules/FormInput.tsx'
import { Button } from '@/components/atoms/ui/button.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import auth from '@/services/authService.ts'
import toast from 'react-hot-toast'
import { ROUTES } from '@/constants/RouterEndpoint.ts'
import Loading from '@/components/templates/Loading.tsx'

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const form = useForm<UserForgotPasswordType>({
    resolver: zodResolver(UserForgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit: SubmitHandler<UserForgotPasswordType> = async (data: UserForgotPasswordType) => {
    setLoading(true)
    const response = await auth.forgotPassword(data)
    setLoading(false)
    if (response.success) {
      toast.success(response?.result?.message as string)
      navigate(ROUTES.VERIFY_CODE, { state: { email: form.getValues('email'), nextState: 'SET_PASSWORD' } })
    } else {
      toast.error(response?.result?.message as string)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col gap-y-3'}>
        <div className={'grid grid-cols-2  gap-x-2 gap-y-4'}>
          <FormInput
            name={'email'}
            form={form}
            placeholder={'Ex:customer@gmail.com'}
            classContent={'col-span-2'}
            autoFocus={true}
          />
        </div>
        <div className={'flex flex-col gap-2'}>
          <Button className={'bg-orangeTheme w-full hover:bg-orangeTheme/90'} type={'submit'}>
            Submit
          </Button>
        </div>
      </form>
      {loading && <Loading />}
    </Form>
  )
}

export default ForgotPasswordForm
