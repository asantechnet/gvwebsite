import { Toaster } from 'sonner'

import './ToastViewport.css'

function ToastViewport({ theme, language }) {
  const isRtl = language !== 'en'
  const offset = isRtl ? { top: '5rem', left: '1rem' } : { top: '5rem', right: '1rem' }
  const mobileOffset = isRtl ? { top: '4.75rem', left: '.75rem' } : { top: '4.75rem', right: '.75rem' }

  return <Toaster theme={theme} position={isRtl ? 'top-left' : 'top-right'} dir={isRtl ? 'rtl' : 'ltr'} offset={offset} mobileOffset={mobileOffset} richColors closeButton expand={false} visibleToasts={5} duration={4000} toastOptions={{ style: { borderRadius: '12px' } }} />
}

export default ToastViewport
