import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import './index.css'
// import './styles/auth.css'
// import App from './App.tsx'
// import { AppRoutes } from './routes.tsx'
import { AppRoutes } from './routes/AppRoutes'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
