import './App.css'
import { AppRouter } from '@/routes/routes.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const App = () => {
  
  return (
    <Router>
      <AppRouter />
      <Toaster
        position={'top-center'}
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
        containerClassName={'text-sm'}
      />
    </Router>
  )
}

export default App
