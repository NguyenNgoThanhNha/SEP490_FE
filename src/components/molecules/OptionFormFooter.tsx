import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import authService from '@/services/authService';
import { loginSuccess } from '@/store/slice/authSlice';
import { ROUTES } from '@/constants/RouterEndpoint';
import { auth, provider, fbProvider } from '../../utils/firebaseConfig';

const OptionFormFooter = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const data = {
      email: user.email || '',
      userName: user.displayName || '',
      fullName: user.displayName || '',
      avatar: user.photoURL || '',
      typeAccount: 'Customer',
    };
    const response = await authService.loginWithGG({ data });
    setLoading(false);

    if (response.success) {
      localStorage.setItem('accessToken', response?.result?.data as string);
      const result = await authService.getUserInfo();
      if (result.success) {
        dispatch(loginSuccess(response?.result?.data));
        navigate(ROUTES.DASHBOARD);
      }
      toast.success('Google login successful!');
    } else {
      toast.error(response?.result?.message || 'Google login failed!');
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, fbProvider);
      const user = result.user;
      const data = {
        email: user.email || '',
        userName: user.displayName || '',
        fullName: user.displayName || '',
        avatar: user.photoURL || '',
        typeAccount: 'Customer',
      };
      const response = await authService.loginWithFB({ data });
      if (response.success) {
        localStorage.setItem('accessToken', response?.result?.data as string);
        const result = await authService.getUserInfo();
        if (result.success) {
          dispatch(loginSuccess(response?.result?.data));
          navigate(ROUTES.DASHBOARD);
        }
        toast.success('Facebook login successful!');
      } else {
        toast.error(response?.result?.message || 'Facebook login failed!');
      }
    } catch {
      toast.error('An error occurred during Facebook login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="justify-center mt-4 gap-4 items-center w-full flex">
      <div
        className={`hover:bg-slate-50 flex h-18 items-center justify-center max-w-xs w-full border border-orangeTheme rounded-2xl cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={async () => {
          if (!loading) {
            await handleGoogleLogin();
          }
        }}
      >
        <img
          src={
            'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'
          }
          alt={'google-logo'}
          className="w-8 my-2"
        />
        <p className="text-slate-700 text-sm px-2">{loading ? 'Loading...' : 'Google'}</p>
      </div>

      <div
        className={`hover:bg-slate-50 flex h-18 items-center justify-center max-w-xs w-full border border-orangeTheme rounded-2xl cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        onClick={async () => {
          if (!loading) {
            await handleFacebookLogin();
          }
        }}
      >
        <img
          src={
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/667px-2023_Facebook_icon.svg.png'
          }
          alt={'facebook-logo'}
          className="w-8 my-2 "
        />
        <p className="text-slate-700 text-sm px-2">{loading ? 'Loading...' : 'Facebook'}</p>
      </div>
    </div>
  );
};

export default OptionFormFooter;
