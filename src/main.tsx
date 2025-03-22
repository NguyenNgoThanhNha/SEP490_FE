import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/index.ts'
import "./i18next/index.ts"
import { ChatProvider } from './context/ChatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ChatProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ChatProvider>
  </Provider>
)
