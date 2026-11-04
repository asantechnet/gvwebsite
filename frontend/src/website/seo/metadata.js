import { getLanguageConfig, localizeHref } from '@website/utils/language.js'

export const WEBSITE_LANGUAGES = ['dr', 'ps', 'en']
export const DEFAULT_SOCIAL_IMAGE = '/assets/branding/new%20logo.webp'

const HREFLANG_BY_LANGUAGE = { dr: 'fa-AF', ps: 'ps-AF', en: 'en' }
const OG_LOCALE_BY_LANGUAGE = { dr: 'fa_AF', ps: 'ps_AF', en: 'en_US' }

export function getSiteOrigin() {
  const configuredOrigin = import.meta.env.VITE_SITE_URL?.trim()
  return (configuredOrigin || window.location.origin).replace(/\/$/, '')
}

export function toAbsoluteUrl(value, origin = getSiteOrigin()) {
  if (!value) return undefined
  return new URL(value, `${origin}/`).href
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

export function buildAlternateLinks(pagePath, origin = getSiteOrigin()) {
  const links = WEBSITE_LANGUAGES.map((language) => ({
    hreflang: HREFLANG_BY_LANGUAGE[language],
    href: toAbsoluteUrl(localizeHref(pagePath, language), origin),
  }))
  links.push({ hreflang: 'x-default', href: toAbsoluteUrl(localizeHref(pagePath, 'dr'), origin) })
  return links
}

export function buildStructuredData({
  language,
  canonicalUrl,
  title,
  description,
  image,
  brandName,
  logo = DEFAULT_SOCIAL_IMAGE,
  email,
  pageType = 'WebPage',
  breadcrumbs = [],
  article,
  service,
}) {
  const origin = new URL(canonicalUrl).origin
  const organizationId = `${origin}/#organization`
  const websiteId = `${origin}/#website`
  const webpageId = `${canonicalUrl}#webpage`
  const inLanguage = getLanguageConfig(language).htmlLang
  const graph = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: brandName,
      url: `${origin}/`,
      logo: { '@type': 'ImageObject', url: toAbsoluteUrl(logo, origin) },
      ...(email ? { email } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${origin}/`,
      name: brandName,
      inLanguage,
      publisher: { '@id': organizationId },
    },
    {
      '@type': pageType,
      '@id': webpageId,
      url: canonicalUrl,
      name: title,
      description,
      inLanguage,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: toAbsoluteUrl(image, origin) } } : {}),
    },
  ]

  if (breadcrumbs.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: toAbsoluteUrl(localizeHref(item.path, language), origin),
      })),
    })
  }

  if (article) {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      headline: article.headline || title,
      description,
      mainEntityOfPage: { '@id': webpageId },
      inLanguage,
      publisher: { '@id': organizationId },
      ...(image ? { image: toAbsoluteUrl(image, origin) } : {}),
      ...(article.datePublished ? { datePublished: article.datePublished } : {}),
      ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    })
  }

  if (service) {
    graph.push({
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: service.name || title,
      description,
      url: canonicalUrl,
      provider: { '@id': organizationId },
      areaServed: 'AF',
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function applySeoMetadata({
  language,
  pagePath,
  title,
  description,
  image = DEFAULT_SOCIAL_IMAGE,
  brandName,
  indexable = true,
  type = 'website',
  canonicalPath = pagePath,
  canonicalUrl: canonicalUrlOverride,
  structuredData,
}) {
  const origin = getSiteOrigin()
  const canonicalUrl = canonicalUrlOverride
    ? toAbsoluteUrl(canonicalUrlOverride, origin)
    : toAbsoluteUrl(localizeHref(canonicalPath, language), origin)
  const imageUrl = toAbsoluteUrl(image, origin)
  const fullTitle = title.includes(brandName) ? title : `${title} | ${brandName}`
  const robots = indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'

  document.title = fullTitle
  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: OG_LOCALE_BY_LANGUAGE[language] })
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })
  upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((element) => element.remove())
  buildAlternateLinks(canonicalPath, origin).forEach(({ hreflang, href }) => {
    const element = document.createElement('link')
    element.rel = 'alternate'
    element.hreflang = hreflang
    element.href = href
    document.head.appendChild(element)
  })

  let schema = document.head.querySelector('script[data-globalvision-schema]')
  if (!schema) {
    schema = document.createElement('script')
    schema.type = 'application/ld+json'
    schema.dataset.globalvisionSchema = ''
    document.head.appendChild(schema)
  }
  schema.textContent = JSON.stringify(structuredData).replace(/</g, '\\u003c')

  return canonicalUrl
}
