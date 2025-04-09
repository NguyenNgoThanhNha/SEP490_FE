import { SubmitHandler, useForm } from 'react-hook-form'
import { UserLoginSchema, UserLoginType } from '@/schemas/userSchema.ts'
import { Form } from '@/components/atoms/ui/form.tsx'
import FormInput from '@/components/molecules/FormInput.tsx'
import { Button } from '@/components/atoms/ui/button.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Loading from '@/components/templates/Loading.tsx'
import authService from '@/services/authService.ts'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '@/store/slice/authSlice.ts'
import { ROUTES } from '@/constants/RouterEndpoint.ts'
import branchService from '@/services/branchService'

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  // const location = useLocation()
  const form = useForm<UserLoginType>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: ''
    }
  })
  const dispatch = useDispatch()
  const onSubmit: SubmitHandler<UserLoginType> = async (data) => {
    setLoading(true)
    try {
      const formattedData = {
        identifier: data.emailOrPhone,
        password: data.password
      }
      
      const response = await authService.login(formattedData)

      if (!response.success) {
        toast.error(response?.result?.message as string)
        return
      }

      localStorage.setItem('accessToken', response?.result?.data as string)
      const userInfo = await authService.getUserInfo()
      const userId = userInfo?.result?.data?.userId;
      const branchRes = await branchService.getAllBranch({ status: "Active",  page: 1, pageSize: 100});
      const branches = branchRes?.result?.data || [];
      const userBranch = branches.find((branch) => branch.userId === userId);
      if (userBranch) {
        localStorage.setItem("branchId", userBranch.branchId);
    
      }
      if (!userInfo.success) {
        toast.error('Failed to fetch user info')
        return
      }
      localStorage.setItem("user", JSON.stringify(userInfo?.result?.data));
      dispatch(loginSuccess({ user: userInfo?.result?.data, token: response?.result?.data }));
      toast.success('Login successful!')
      navigate('/dashboard')

    } catch  {
      toast.error('Something went wrong, please try again!')
    } finally {
      setLoading(false)
    }
  }
return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className={'w-full flex flex-col gap-y-3'}>
      <div className={'grid grid-cols-2  gap-x-2 gap-y-4'}>
        <FormInput
          name={'emailOrPhone'}
          form={form}
          placeholder={'Enter email or phone number'}
          classContent={'col-span-2'}
          autoFocus
        />
        <FormInput name={'password'} form={form} classContent={'col-span-2'} type={'password'} />
        <div className={'justify-end flex text-orangeTheme text-sm col-span-2 -mt-4 font-semibold'}>
          <Link to={ROUTES.FORGOT_PASSWORD}>Forgot password</Link>
        </div>
      </div>
      <div className={'flex flex-col gap-2'}>
        <Button
          className={'bg-orangeTheme w-full hover:bg-orangeTheme/90'}
          type={'submit'}
          disabled={form.formState.isSubmitting}
        >
          Login
        </Button>
        <div className={'text-sm justify-center flex gap-1'}>
          Don’t have an account?{' '}
          <Link to={ROUTES.SIGN_UP} className={'text-orangeTheme font-semibold'}>
            Sign up
          </Link>
        </div>
      </div>
    </form>
    {loading && <Loading />}
  </Form>
)
}

export default LoginForm
