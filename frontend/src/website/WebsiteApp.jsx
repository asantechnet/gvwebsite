import { useEffect, useState } from 'react'

import WebsiteLayout from '@layout/WebsiteLayout.jsx'
import RouteProgress from '@website/components/shared/RouteProgress.jsx'
import { loadWebsiteContent } from '@website/data/loadWebsiteContent.js'
import { parseLocalizedPathname } from '@website/utils/language.js'

function WebsiteApp({ language }) {
  const [content, setContent] = useState(null)

  useEffect(() => {
    let active = true

    loadWebsiteContent(language).then((loadedContent) => {
      if (active) setContent(loadedContent)
    })

    return () => {
      active = false
    }
  }, [language])

  if (!content) return <RouteProgress path={parseLocalizedPathname(window.location.pathname).pagePath} />

  return <WebsiteLayout content={content} />
}

export default WebsiteApp
