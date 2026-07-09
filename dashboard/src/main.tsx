import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { ConfigError } from './components/ConfigError'
import { supabaseConfigError } from './lib/supabase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {supabaseConfigError ? (
      <ConfigError message={supabaseConfigError} />
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>,
)
