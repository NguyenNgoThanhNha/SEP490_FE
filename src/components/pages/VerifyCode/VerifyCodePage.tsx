import Banner from '@/components/molecules/Banner.tsx'
import { ChevronLeft } from 'lucide-react'
import VerifyCodeForm from '@/components/organisms/VerifyCode/VerifyCodeForm.tsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/RouterEndpoint.ts'

const VerifyCodePage = () => {
  return (
    <div className={'container grid md:grid-cols-2 sm:grid-cols-1 gap-14 items-center h-screen'}>
      <div className={'md:col-span-1 sm:col-span-1 flex flex-col gap-6 py-10'}>
        <div>
          <img src={'/'} alt={'logo'} className={'w-20 h-20'} />
        </div>
        <Link to={ROUTES.LOGIN} className={'flex space-x-2 cursor-pointer items-center'}>
          <ChevronLeft />
          <span>Back to login</span>
        </Link>
        
        <div>
          <p className={'text-4xl tracking-wide font-bold py-2'}>Verify code </p>
          <span>An authentication code has been sent to your email.</span>
        </div>
        <VerifyCodeForm />
      </div>
      <div className={'md:col-span-1 sm:col-span-1'}><Banner classContent={'max-w-md sm:ml-8'} images={[]} />
      </div>
    </div>
  )
}

export default VerifyCodePage
