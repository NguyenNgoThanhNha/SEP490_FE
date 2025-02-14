import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA-a2xFsB53xUb80PxBILAu4tj1Nk1r5X4',
  authDomain: 'sep490-e5df6.firebaseapp.com',
  projectId: 'sep490-e5df6',
  storageBucket: 'sep490-e5df6.firebaseapp.com',
  messagingSenderId: '1078728661950',
  appId: '1:1078728661950:web:d10d03c30dc19da87637ef',
  measurementId: 'G-YRG8BZFPW3',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

export { auth, provider, fbProvider };
