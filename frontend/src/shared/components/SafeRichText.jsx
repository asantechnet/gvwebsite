import { forwardRef, useMemo } from 'react'

import { sanitizeRichText } from '@/shared/security/sanitizeRichText.js'

function renderMediaGrids(html) {
  if ((!html.includes('data-media-grid') && !html.includes('data-editor-media')) || typeof DOMParser === 'undefined') return html
  const document = new DOMParser().parseFromString(`<div id="rich-text-root">${html}</div>`, 'text/html')
  const root = document.getElementById('rich-text-root')
  root?.querySelectorAll('figure[data-editor-media]').forEach((figure) => {
    const container = document.createElement('div')
    for (const attribute of figure.attributes) container.setAttribute(attribute.name, attribute.value)
    container.innerHTML = figure.innerHTML
    figure.replaceWith(container)
  })
  root?.querySelectorAll('[data-media-grid]').forEach((grid) => {
    let items
    try { items = JSON.parse(grid.getAttribute('data-items') || '[]') } catch { return }
    if (!Array.isArray(items)) return
    grid.setAttribute('data-media-grid', grid.getAttribute('data-layout') || 'two')
    items.filter((item) => item?.src).forEach((item) => {
      const figure = document.createElement('figure')
      const mediaType = ['audio', 'video'].includes(item.mediaType) ? item.mediaType : 'image'
      const media = document.createElement(mediaType === 'image' ? 'img' : mediaType)
      media.setAttribute('src', item.src)
      if (mediaType === 'image') media.setAttribute('alt', item.alt || item.title || item.name || '')
      else {
        media.setAttribute('controls', '')
        media.setAttribute('preload', 'metadata')
        if (mediaType === 'video' && item.poster) media.setAttribute('poster', item.poster)
      }
      figure.appendChild(media)
      const caption = item.caption || item.title || item.name
      if (caption) {
        const figcaption = document.createElement('figcaption')
        figcaption.textContent = caption
        figure.appendChild(figcaption)
      }
      grid.appendChild(figure)
    })
  })
  return root?.innerHTML || ''
}

const SafeRichText = forwardRef(function SafeRichText({ as: Component = 'div', html = '', className = '', ...props }, ref) {
  const sanitizedHtml = useMemo(() => renderMediaGrids(sanitizeRichText(html)), [html])
  return <Component {...props} ref={ref} className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
})

export default SafeRichText
