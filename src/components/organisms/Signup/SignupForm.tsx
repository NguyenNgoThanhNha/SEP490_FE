import { Form } from '@/components/atoms/ui/form.tsx'
import { SubmitHandler, useForm } from 'react-hook-form'
import FormInput from '@/components/molecules/FormInput.tsx'
import { UserSignupSchema, UserSignupType } from '@/schemas/userSchema.ts'
import FormSwitch from '@/components/molecules/FormSwitch.tsx'
import { Button } from '@/components/atoms/ui/button.tsx'
import { Separator } from '@/components/atoms/ui/separator.tsx'
import OptionFormFooter from '@/components/molecules/OptionFormFooter.tsx'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import auth from '@/services/authService.ts'
import { ResponseProps } from '@/services/root.ts'
import { ROUTES } from '@/constants/RouterEndpoint.ts'
import toast from 'react-hot-toast'
import Loading from '@/components/templates/Loading.tsx'
import { useState } from 'react'

const SignupForm = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const form = useForm<UserSignupType>({
    resolver: zodResolver(UserSignupSchema),
    defaultValues: {
      email: '',
      userName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      policy: true
    }
  })
  const onSubmit: SubmitHandler<UserSignupType> = async (data: UserSignupType): Promise<void> => {
    setLoading(true)
    const result: ResponseProps = await auth.register({ data })
    setLoading(false)
    if (result.success) {
      toast.success(result?.result?.message as string)
      navigate(ROUTES.VERIFY_CODE, { state: { email: form.getValues('email') } })
    } else {
      toast.error(result?.result?.message as string)
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col gap-y-3'}>
          <div className={'grid md:grid-cols-6 sm:grid-cols-2 gap-x-2 gap-y-4'}>
            <FormInput
              name={'email'}
              form={form}
              placeholder={'Ex:customer@gmail.com'}
              classContent={'md:col-span-3'}
              autoFocus
            />
            <FormInput name={'userName'} form={form} placeholder={'Ex:customer'} classContent={'md:col-span-3'} />
            
            <FormInput name={'fullName'} form={form} placeholder={'Ex:Tran Van A'} classContent={'md:col-span-3'} />
            
            <FormInput name={'address'} form={form} placeholder={'Ex:157 Le Xuan, Phu Tho'} classContent={'md:col-span-3'} />
            <FormInput name={'city'} form={form} placeholder={'Ex: Phu Tho'} classContent={'md:col-span-3'} />
            <FormInput name={'phone'} form={form} placeholder={'Ex:0867 653 653'} classContent={'md:col-span-3'} />
            <FormInput name={'password'} form={form} type={'password'} classContent={'md:col-span-6'} />
            <FormInput name={'confirmPassword'} form={form} type={'password'} classContent={'md:col-span-6'} />
            <FormSwitch
              name={'policy'}
              content={'I agree to all Term and Policy'}
              form={form}
              classContent={'md:col-span-6'}
            />
          </div>
          <div className={'flex flex-col gap-2'}>
            <Button className={'bg-orangeTheme w-full hover:bg-orangeTheme/90'} type={'submit'}>
              Create account
            </Button>
            <div className={'text-sm justify-center flex gap-1'}>
              Already have an account?
              <Link to={'/login'} className={'text-orangeTheme font-semibold'}>
                Login
              </Link>
            </div>
          </div>
          <div className={'text-sm font-extralight flex items-center justify-center gap-4'}>
            <Separator className={'w-1/3'} />
            <span> Or Sign up with</span>
            <Separator className={'w-1/3'} />
          </div>
          <OptionFormFooter />
        </form>
      </Form>
      {loading && <Loading />}
    </>
  )
}

export default SignupForm
