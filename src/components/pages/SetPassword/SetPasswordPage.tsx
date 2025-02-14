import Banner from '@/components/molecules/Banner.tsx'
import SetPasswordForm from '@/components/organisms/SetPassword/SetPasswordForm.tsx'

const SetPasswordPage = () => {
  return (
    <div className={'container grid md:grid-cols-2 sm:grid-cols-1 gap-14 items-center h-screen'}>
      <div className={'md:col-span-1 sm:col-span-1 flex flex-col gap-6 py-10'}>
        <div>
          <img src={'/'} alt={'logo'} className={'w-20 h-20'} />
        </div>
        <div>
          <p className={'text-4xl tracking-wide font-bold py-2'}>Set your password! </p>
          <span>Your previous password has been reseted. Please set a new password for your account!</span>
        </div>
        <SetPasswordForm />
      </div>
      <div className={'md:col-span-1 sm:col-span-1'}>
        <Banner classContent={'max-w-md sm:ml-8'} images={[]} />
      </div>
    </div>
  )
}

export default SetPasswordPage
