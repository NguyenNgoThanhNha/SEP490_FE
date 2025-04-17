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
import { TBranch } from '@/types/branch.type'
import staffService from '@/services/staffService'

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
    setLoading(true);
  
    try {
      const formattedData = {
        identifier: data.emailOrPhone,
        password: data.password
      };
  
      // 1. Gọi API login
      const response = await authService.login(formattedData);
      if (!response.success) {
        toast.error(response?.result?.message as string);
        return;
      }
  
      // 2. Lưu accessToken vào localStorage
      const accessToken = response?.result?.data;
      localStorage.setItem('accessToken', accessToken);
  
      // 3. Gọi song song userInfo và staffInfo
      const [userInfo, staffInfo] = await Promise.all([
        authService.getUserInfo(),
        staffService.getStaffInfo()
      ]);
  
      if (!userInfo.success && !staffInfo.success) {
        toast.error("Failed to fetch user or staff info");
        return;
      }
  
      const userId = userInfo?.result?.data?.userId;
      const staffData = staffInfo?.result?.data;
  
      // 4. Gọi danh sách chi nhánh
      const branchRes = await branchService.getAllBranch({
        status: "Active",
        page: 1,
        pageSize: 100
      });
      const branches = branchRes?.result?.data || [];
  
      // 5. Ưu tiên tìm chi nhánh theo manager
      const managedBranch = branches.find(
        (branch: TBranch) => branch.managerId === userId
      );
  
      if (managedBranch) {
        localStorage.setItem("branchId", managedBranch.branchId.toString());
        localStorage.setItem("role", "manager");
      } else if (staffData?.branchId) {
        // Nếu không phải manager thì check theo staff
        localStorage.setItem("branchId", staffData.branchId.toString());
        localStorage.setItem("role", "staff");
      }
        localStorage.setItem("user", JSON.stringify(userInfo?.result?.data));
      dispatch(
        loginSuccess({
          user: userInfo?.result?.data,
          token: accessToken
        })
      );
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch  {
      toast.error("Something went wrong, please try again!");
    } finally {
      setLoading(false);
    }
  };
  
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
