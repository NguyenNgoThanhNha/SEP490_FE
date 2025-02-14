import { SubmitHandler, useForm } from 'react-hook-form'
import { UserSetPasswordSchema, UserSetPasswordType } from '@/schemas/userSchema.ts'
import { Form } from '@/components/atoms/ui/form.tsx'
import FormInput from '@/components/molecules/FormInput.tsx'
import { Button } from '@/components/atoms/ui/button.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import auth from '@/services/authService.ts'
import toast from 'react-hot-toast'
import { ROUTES } from '@/constants/RouterEndpoint.ts'
import Loading from '@/components/templates/Loading.tsx'

const SetPasswordForm = () => {
  const location = useLocation()
  const email: string = location.state?.email
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const form = useForm<UserSetPasswordType>({
    resolver: zodResolver(UserSetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: ''
    }
  })
  const onSubmit: SubmitHandler<UserSetPasswordType> = async (data: UserSetPasswordType) => {
    setLoading(true)
    const response = await auth.updatePassword({ ...data, email })
    setLoading(false)
    if (response.success) {
      toast.success(response?.result?.message as string)
      navigate(ROUTES.LOGIN)
    } else {
      toast.error(response?.result?.message as string)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col gap-y-3'}>
        <div className={'grid grid-cols-2  gap-x-2 gap-y-4'}>
          <FormInput name={'newPassword'} form={form} type={'password'} classContent={'col-span-2'} autoFocus />
          <FormInput name={'confirmNewPassword'} form={form} type={'password'} classContent={'col-span-2'} />
        </div>
        <div className={'flex flex-col gap-2'}>
          <Button className={'bg-orangeTheme w-full hover:bg-orangeTheme/90'} type={'submit'}>
            Set password
          </Button>
        </div>
      </form>
      {loading && <Loading />}
    </Form>
  )
}

export default SetPasswordForm
