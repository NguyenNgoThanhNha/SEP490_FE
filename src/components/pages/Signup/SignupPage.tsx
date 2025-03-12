import SignupForm from '@/components/organisms/Signup/SignupForm.tsx'
import Banner from '@/components/molecules/Banner.tsx'
import logo from '@/assets/images/solace.png'
const SignupPage = () => {
  return (
    <div className={'grid md:grid-cols-2 sm:grid-cols-1 gap-14 items-center h-screen'}
    style={{
      background: 'linear-gradient(to bottom, #ffffff, #dcede2)',

    }}>
      <div className={'md:col-span-1 sm:col-span-1 w-full'}>
        <Banner classContent={'w-full md:max-w-xs ml-8 sm:max-w-md max-h-[500px] object-cover'} images={[{ id: 1, url: "https://i.pinimg.com/736x/9e/2f/07/9e2f0743bf213db6b0b0353eb8701f80.jpg" }, { id: 2, url: "https://i.pinimg.com/736x/da/78/f4/da78f4ded0c964c07fa136f6268a1589.jpg" }]} />
      </div>
      <div className="md:col-span-1 sm:col-span-1 flex flex-col gap-6 my-auto bg-white shadow-lg rounded-lg p-6 max-w-lg mx-2 w-full">
      <div className="flex justify-center">
          <img src={logo} alt={'logo'} className="w-30 h-20" />
        </div>
        <div className="text-center">
          <p className="text-4xl tracking-wide font-bold py-2">Sign up</p>
          <span>Let’s get you all set up so you can access your personal account.</span>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupPage
