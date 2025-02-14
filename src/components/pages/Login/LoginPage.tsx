import Banner from '@/components/molecules/Banner.tsx'
import LoginForm from '@/components/organisms/Login/LoginForm.tsx'
import logo from '@/assets/images/solace.png';

const LoginPage = () => {
  return (
    <div 
      className={'grid md:grid-cols-2 sm:grid-cols-1 gap-14 items-center h-screen'}
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #dcede2)',

      }}
    >
      <div className={'md:col-span-1 sm:col-span-1 flex flex-col gap-6 py-10 container'}>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <div className="mb-6">
            <img src={logo} alt={'logo'} className={'w-30 h-20 mx-auto'} />
            <p className={'text-4xl tracking-wide font-bold py-2'}>Welcome to Solace Spa</p>
            <span>Login to access our website.</span>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className={'md:col-span-1 sm:col-span-1'}>
        <Banner classContent={'max-w-md sm:ml-8'} images={[{ id: 1, url: "https://i.pinimg.com/736x/9e/2f/07/9e2f0743bf213db6b0b0353eb8701f80.jpg" }, { id: 2, url: "https://i.pinimg.com/736x/da/78/f4/da78f4ded0c964c07fa136f6268a1589.jpg" }]} />
      </div>
    </div>
  );
}

export default LoginPage;
