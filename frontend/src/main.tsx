import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'
import Config from './Config/Config.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-g5l48dss0htraab2.us.auth0.com"
      clientId="8hhC9yLVl4fihAcLMsDEwDQhnZdC8lgh"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "authenticated Api",
        scope: "openid profile email"
      }}>
      <Config>
        <App />
      </Config>
    </Auth0Provider>
  </StrictMode>,
)
