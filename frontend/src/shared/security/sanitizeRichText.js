import DOMPurify from 'dompurify'

const allowedTags = [
  'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote',
  'ul', 'ol', 'li', 'a', 'div', 'span', 'figure', 'figcaption', 'img', 'video', 'audio', 'source',
]

const allowedAttributes = [
  'alt', 'controls', 'dir', 'href', 'loading', 'preload', 'poster', 'rel', 'src', 'target', 'title', 'type', 'style',
  'data-highlight-box', 'data-icon', 'data-columns', 'data-editor-media', 'data-src', 'data-media-type',
  'data-name', 'data-title', 'data-caption', 'data-alt', 'data-author', 'data-avatar', 'data-poster',
  'data-mime-type', 'data-media-grid', 'data-layout', 'data-items', 'data-editor-button', 'data-label', 'data-href',
]

const urlAttributes = new Set(['href', 'src', 'poster', 'data-src', 'data-avatar', 'data-poster', 'data-href'])
const safeProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:', 'blob:'])
const safeDataImage = /^data:image\/(?:gif|jpe?g|png|webp);base64,[a-z0-9+/=]+$/i

export function isSafeContentUrl(value, { image = false } = {}) {
  const url = String(value || '').trim()
  if (!url) return true
  if (url.startsWith('/') && !url.startsWith('//')) return true
  if (url.startsWith('#')) return true
  if (image && safeDataImage.test(url)) return true
  try {
    const parsed = new URL(url, 'https://globalvision.invalid')
    return safeProtocols.has(parsed.protocol)
  } catch {
    return false
  }
}

function sanitizeMediaItems(value) {
  try {
    const items = JSON.parse(value)
    if (!Array.isArray(items)) return '[]'
    return JSON.stringify(items.slice(0, 12).map((item) => {
      if (!item || typeof item !== 'object') return null
      const clean = { ...item }
      for (const key of ['src', 'avatar', 'poster']) {
        if (!isSafeContentUrl(clean[key], { image: key !== 'src' || clean.mediaType === 'image' })) clean[key] = ''
      }
      return clean
    }))
  } catch {
    return '[]'
  }
}

export function sanitizeRichText(html) {
  if (typeof window === 'undefined') return ''
  const purifier = DOMPurify(window)
  const attributeHook = (_node, data) => {
    if (urlAttributes.has(data.attrName) && !isSafeContentUrl(data.attrValue, { image: ['src', 'poster', 'data-avatar', 'data-poster'].includes(data.attrName) })) data.keepAttr = false
    if (data.attrName === 'data-items') data.attrValue = sanitizeMediaItems(data.attrValue)
    if (data.attrName === 'target' && data.attrValue !== '_blank') data.keepAttr = false
    if (data.attrName === 'style') {
      const alignment = data.attrValue.match(/^\s*text-align\s*:\s*(left|center|right)\s*;?\s*$/i)
      if (alignment) data.attrValue = `text-align: ${alignment[1].toLowerCase()}`
      else data.keepAttr = false
    }
  }
  const elementHook = (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') node.setAttribute('rel', 'noopener noreferrer')
  }
  purifier.addHook('uponSanitizeAttribute', attributeHook)
  purifier.addHook('afterSanitizeAttributes', elementHook)
  try {
    return purifier.sanitize(String(html || ''), {
      ALLOWED_ATTR: allowedAttributes,
      ALLOWED_TAGS: allowedTags,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['form', 'iframe', 'math', 'object', 'script', 'style', 'svg', 'template'],
    })
  } finally {
    purifier.removeHook('uponSanitizeAttribute')
    purifier.removeHook('afterSanitizeAttributes')
  }
}
