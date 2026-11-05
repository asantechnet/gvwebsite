import { useEffect, useState } from 'react'

import ApplicationLoading from '@/shared/components/ApplicationLoading.jsx'
import WebsiteLayout from '@layout/WebsiteLayout.jsx'
import { loadWebsiteContent } from '@website/data/loadWebsiteContent.js'

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

  if (!content) return <ApplicationLoading />

  return <WebsiteLayout content={content} />
}

export default WebsiteApp
