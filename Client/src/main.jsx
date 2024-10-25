import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import SocketProvider from './Providers/SocketProvider.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import {config} from 'dotenv'
import UserProvider from './Providers/UserProvider.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
       <UserProvider>
        {/* <ClerkProvider publishableKey= {PUBLISHABLE_KEY} afterSignOutUrl="/"> */}
          <SocketProvider>
            <App />
          </SocketProvider>
          </UserProvider>
        {/* </ClerkProvider> */}
     </BrowserRouter>
  </StrictMode>,
)
