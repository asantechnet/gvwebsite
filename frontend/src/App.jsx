import DashboardLayout from '@cms/components/layout/DashboardLayout.jsx'
import WebsiteLayout from '@layout/WebsiteLayout.jsx'
import { localizeHref, parseLocalizedPathname } from '@website/utils/language.js'

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/dashboard' || path.startsWith('/dashboard/')) return <DashboardLayout />

  const route = parseLocalizedPathname(window.location.pathname)
  const canonicalPath = localizeHref(route.pagePath, route.language)
  if (!route.isCanonical || window.location.pathname !== canonicalPath) {
    window.location.replace(`${canonicalPath}${window.location.search}${window.location.hash}`)
    return null
  }

  return <WebsiteLayout />
}

export default App
