import { useEffect, useState } from 'react'

import DashboardLayout from '@cms/components/layout/DashboardLayout.jsx'
import { AuthProvider } from '@cms/auth/AuthContext.jsx'
import { CMS_NAVIGATION_EVENT, navigateCms } from '@cms/navigation.js'

function CmsApp() {
  const [, setLocation] = useState(() => `${window.location.pathname}${window.location.search}${window.location.hash}`)

  useEffect(() => {
    const syncLocation = () => setLocation(`${window.location.pathname}${window.location.search}${window.location.hash}`)
    const navigate = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest?.('a[href]')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || !url.pathname.startsWith('/dashboard')) return
      event.preventDefault()
      navigateCms(url.href)
    }

    window.addEventListener('click', navigate)
    window.addEventListener('popstate', syncLocation)
    window.addEventListener(CMS_NAVIGATION_EVENT, syncLocation)
    return () => {
      window.removeEventListener('click', navigate)
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener(CMS_NAVIGATION_EVENT, syncLocation)
    }
  }, [])

  return <AuthProvider><DashboardLayout /></AuthProvider>
}

export default CmsApp
