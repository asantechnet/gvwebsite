import { useEffect, useState } from 'react'

import WebsiteLayout from '@layout/WebsiteLayout.jsx'
import RouteProgress from '@website/components/shared/RouteProgress.jsx'
import { loadWebsiteContent } from '@website/data/loadWebsiteContent.js'
import { parseLocalizedPathname } from '@website/utils/language.js'
import { SNAPSHOT_UPDATED_EVENT, SNAPSHOT_UPDATED_STORAGE_KEY } from '@/shared/services/api/snapshots.js'

function WebsiteApp({ language }) {
  const [content, setContent] = useState(null)

  useEffect(() => {
    let active = true
    const load = (fresh = false) => loadWebsiteContent(language, { fresh }).then((loadedContent) => {
      if (active) setContent(loadedContent)
    })
    const refresh = () => load(true)
    const refreshFromStorage = (event) => {
      if (event.key === SNAPSHOT_UPDATED_STORAGE_KEY) refresh()
    }

    load()
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

  if (!content) return <RouteProgress path={parseLocalizedPathname(window.location.pathname).pagePath} />

  return <WebsiteLayout content={content} />
}

export default WebsiteApp
