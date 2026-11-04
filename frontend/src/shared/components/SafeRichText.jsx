import { useMemo } from 'react'

import { sanitizeRichText } from '@/shared/security/sanitizeRichText.js'

function SafeRichText({ as: Component = 'div', html = '', className = '', ...props }) {
  const sanitizedHtml = useMemo(() => sanitizeRichText(html), [html])
  return <Component {...props} className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export default SafeRichText
