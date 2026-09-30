import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import MainLayout from '@layout/MainLayout.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>,
)
