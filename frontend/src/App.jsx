import { lazy, Suspense } from 'react'

import { isCmsPath } from '@cms/routes.js'
import CmsRouteProgress from '@cms/components/CmsRouteProgress.jsx'
import RouteProgress from '@website/components/shared/RouteProgress.jsx'
import { localizeHref, parseLocalizedPathname } from '@website/utils/language.js'

const CmsApp = lazy(() => import('@cms/CmsApp.jsx'))
const WebsiteApp = lazy(() => import('@website/WebsiteApp.jsx'))

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (isCmsPath(path)) return <Suspense fallback={<CmsRouteProgress standalone />}><CmsApp /></Suspense>

  const route = parseLocalizedPathname(window.location.pathname)
  const canonicalPath = localizeHref(route.pagePath, route.language)
  if (!route.isCanonical || window.location.pathname !== canonicalPath) {
    window.location.replace(`${canonicalPath}${window.location.search}${window.location.hash}`)
    return null
  }

  return <Suspense fallback={<RouteProgress path={route.pagePath} />}><WebsiteApp language={route.language} /></Suspense>
}

export default App
