import { useEffect, useRef, useState } from 'react'

import WebsiteLayout from '@layout/WebsiteLayout.jsx'
import MaintenanceProgress from '@/shared/components/MaintenanceProgress.jsx'
import RouteProgress from '@website/components/shared/RouteProgress.jsx'
import { loadWebsiteContent } from '@website/data/loadWebsiteContent.js'
import { parseLocalizedPathname } from '@website/utils/language.js'
import { SNAPSHOT_UPDATED_EVENT, SNAPSHOT_UPDATED_STORAGE_KEY } from '@/shared/services/api/snapshots.js'

const contactSocialCountKey = (language) => `globalvision-contact-social-count:${language}`

function WebsiteApp({ language }) {
  const [content, setContent] = useState(null)
  const latestLoad = useRef(0)

  useEffect(() => {
    let active = true
    const load = (fresh = false) => {
      const loadId = ++latestLoad.current
      return loadWebsiteContent(language, { fresh }).then((loadedContent) => {
        if (active && loadId === latestLoad.current) {
          const socialCount = loadedContent.contact.contact.visibility?.social === false ? 0 : loadedContent.contact.contact.socials.length
          window.localStorage.setItem(contactSocialCountKey(language), String(socialCount))
          setContent(loadedContent)
        }
      })
    }
    const refresh = () => { load(true).catch(() => {}) }
    const refreshFromStorage = (event) => {
      if (event.key === SNAPSHOT_UPDATED_STORAGE_KEY) refresh()
    }

    load().catch(() => {})
    window.addEventListener(SNAPSHOT_UPDATED_EVENT, refresh)
    window.addEventListener('storage', refreshFromStorage)
    window.addEventListener('focus', refresh)

    return () => {
      active = false
      window.removeEventListener(SNAPSHOT_UPDATED_EVENT, refresh)
      window.removeEventListener('storage', refreshFromStorage)
      window.removeEventListener('focus', refresh)
    }
  }, [language])

  if (!content) {
    const maintenanceModeHint = window.localStorage.getItem('globalvision-maintenance-mode') === 'true'
    const socialCountHint = Number.parseInt(window.localStorage.getItem(contactSocialCountKey(language)) || '0', 10)
    return maintenanceModeHint
      ? <MaintenanceProgress />
      : <RouteProgress path={parseLocalizedPathname(window.location.pathname).pagePath} contactSocialCount={socialCountHint} />
  }

  return <WebsiteLayout content={content} />
}

export default WebsiteApp
