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
import staffService from '@/services/staffService.ts'

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
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
        password: data.password,
      };
      const response = await authService.login(formattedData);
      if (!response.success) {
        toast.error(response?.result?.message as string);
        return;
      }

      const accessToken = response?.result?.data;
      localStorage.setItem("accessToken", accessToken);

      const userInfo = await authService.getUserInfo();
      if (!userInfo.success) {
        toast.error("Không thể lấy thông tin người dùng");
        return;
      }

      const roleId = userInfo?.result?.data?.roleID;
      console.log("Role ID:", roleId);

      const userId = userInfo?.result?.data?.userId;

      const branchRes = await branchService.getAllBranch({
        status: "Active",
        page: 1,
        pageSize: 100,
      });
      const branches = branchRes?.result?.data || [];

      const managedBranch = branches.find(
        (branch: TBranch) => branch.managerId === userId
      );
    
      if (roleId === 2 && managedBranch) {
        localStorage.setItem("branchId", managedBranch.branchId.toString());
        localStorage.setItem("managerId", managedBranch.managerId.toString()); 

      }console.log("Managed Branch:", managedBranch);

      if (roleId === 4) {
        const staffInfo = await staffService.getStaffInfo();
        if (!staffInfo.success) {
          toast.error("Không thể lấy thông tin nhân viên");
          return;
        }

        const staffBranchId = staffInfo?.result?.data?.branchId;
        if (staffBranchId) {
          localStorage.setItem("branchId", staffBranchId.toString());

        }
      }

      localStorage.setItem("roleId", roleId.toString());
      localStorage.setItem("user", JSON.stringify(userInfo?.result?.data));

      dispatch(
        loginSuccess({
          user: userInfo?.result?.data,
          token: accessToken,
        })
      );

      toast.success("Đăng nhập thành công!");

      if (roleId === 1) {
        navigate("/dashboard"); 
      } else if (roleId === 2) {
        navigate("/manager-dashboard"); 
      } else if (roleId === 4) {
        navigate("/booking-form"); 
      } else {
        toast.error("Vai trò không hợp lệ, vui lòng liên hệ hỗ trợ.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-3">
        <div className="grid grid-cols-2 gap-x-2 gap-y-4">
          <FormInput
            name="emailOrPhone"
            form={form}
            placeholder="Nhập email hoặc số điện thoại"
            classContent="col-span-2"
            autoFocus
          />
          <FormInput
            name="password"
            form={form}
            classContent="col-span-2"
            type="password"
          />
          <div className="justify-end flex text-orangeTheme text-sm col-span-2 -mt-4 font-semibold">
            <Link to={ROUTES.FORGOT_PASSWORD}>Quên mật khẩu</Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="bg-orangeTheme w-full hover:bg-orangeTheme/90"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Đăng nhập
          </Button>
          <div className="text-sm justify-center flex gap-1">
            Chưa có tài khoản?{' '}
            <Link to={ROUTES.SIGN_UP} className="text-orangeTheme font-semibold">
              Đăng ký
            </Link>
          </div>
        </div>
      </form>
      {loading && <Loading />}
    </Form>
  )
}

export default LoginForm
