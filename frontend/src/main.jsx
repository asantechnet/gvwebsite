import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import './index.css'

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  const recoveryKey = 'globalvision-preload-recovery'
  const previousRecovery = Number(window.sessionStorage.getItem(recoveryKey))
  if (Date.now() - previousRecovery < 10_000) return
  window.sessionStorage.setItem(recoveryKey, String(Date.now()))
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
