import { lazy, Suspense, useEffect } from 'react'

import { isCmsPath } from '@cms/routes.js'
import CmsRouteProgress from '@cms/components/CmsRouteProgress.jsx'
import MaintenanceProgress from '@/shared/components/MaintenanceProgress.jsx'
import RouteProgress from '@website/components/shared/RouteProgress.jsx'
import { localizeHref, parseLocalizedPathname } from '@website/utils/language.js'
import { dataSourceMode } from '@/shared/services/api/config.js'

const CmsApp = lazy(() => import('@cms/CmsApp.jsx'))
const WebsiteApp = lazy(() => import('@website/WebsiteApp.jsx'))

function DefaultLanguageRedirect({ pagePath }) {
  useEffect(() => {
    const stored = window.localStorage.getItem('globalvision-default-language')
    const fallback = stored === 'ps' || stored === 'en' ? stored : 'dr'
    const resolveLanguage = async () => {
      if (dataSourceMode !== 'api') return fallback
      try {
        const { snapshotsApi } = await import('@/shared/services/api/snapshots.js')
        const snapshots = await snapshotsApi.publicList()
        const configured = snapshots.find((snapshot) => snapshot.key === 'settings')?.payload?.settings?.defaultLanguage
        return configured === 'prs' ? 'dr' : configured === 'ps' || configured === 'en' ? configured : fallback
      } catch {
        return fallback
      }
    }
    resolveLanguage().then((language) => {
      window.location.replace(`${localizeHref(pagePath, language)}${window.location.search}${window.location.hash}`)
    })
  }, [pagePath])

  return <RouteProgress path={pagePath} />
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (isCmsPath(path)) return <Suspense fallback={<CmsRouteProgress standalone />}><CmsApp /></Suspense>

  const route = parseLocalizedPathname(window.location.pathname)
  const maintenanceModeHint = window.localStorage.getItem('globalvision-maintenance-mode') === 'true'
  const savedMaintenanceLanguage = window.sessionStorage.getItem('globalvision-maintenance-language')
  const maintenanceLanguage = ['dr', 'ps', 'en'].includes(savedMaintenanceLanguage) ? savedMaintenanceLanguage : route.language
  if (maintenanceModeHint && path === '/') return <Suspense fallback={<MaintenanceProgress />}><WebsiteApp language={maintenanceLanguage} /></Suspense>
  const canonicalPath = localizeHref(route.pagePath, route.language)
  if (!route.isCanonical) return <DefaultLanguageRedirect pagePath={route.pagePath} />
  if (window.location.pathname !== canonicalPath) {
    window.location.replace(`${canonicalPath}${window.location.search}${window.location.hash}`)
    return null
  }

  return <Suspense fallback={maintenanceModeHint ? <MaintenanceProgress /> : <RouteProgress path={route.pagePath} />}><WebsiteApp language={route.language} /></Suspense>
}

export default App
