export const DEFAULT_LANGUAGE = 'dr'
export const WEBSITE_LANGUAGE_STORAGE_KEY = 'globalvision-website-language'

export const languageConfig = {
  dr: { id: 'dr', htmlLang: 'fa-AF', locale: 'fa-AF', direction: 'rtl' },
  ps: { id: 'ps', htmlLang: 'ps-AF', locale: 'ps-AF', direction: 'rtl' },
  en: { id: 'en', htmlLang: 'en', locale: 'en', direction: 'ltr' },
}

export function normalizeLanguage(language) {
  if (language === 'da' || language === 'prs' || language === 'fa' || language === 'fa-AF') return 'dr'
  return languageConfig[language] ? language : DEFAULT_LANGUAGE
}

export function getLanguageConfig(language) {
  return languageConfig[normalizeLanguage(language)]
}

export function parseLocalizedPathname(pathname) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const [, possibleLanguage, ...remainingSegments] = normalizedPath.split('/')
  const language = normalizeLanguage(possibleLanguage)
  const hasLanguagePrefix = Boolean(languageConfig[possibleLanguage])
  const hasLegacyDariPrefix = ['da', 'prs'].includes(possibleLanguage)
  const pagePath = hasLanguagePrefix || hasLegacyDariPrefix
    ? `/${remainingSegments.join('/')}`.replace(/\/$/, '') || '/'
    : normalizedPath.replace(/\/$/, '') || '/'

  return {
    language: hasLanguagePrefix || hasLegacyDariPrefix ? language : DEFAULT_LANGUAGE,
    pagePath,
    isCanonical: hasLanguagePrefix,
  }
}

export function localizeHref(href, language) {
  if (!href || href.startsWith('#') || href.startsWith('//') || !href.startsWith('/')) return href

  const [pathAndQuery, hash = ''] = href.split('#')
  const [pathname, query = ''] = pathAndQuery.split('?')
  const { pagePath } = parseLocalizedPathname(pathname)
  const languageId = normalizeLanguage(language)
  const localizedPath = `/${languageId}${pagePath === '/' ? '' : pagePath}`

  return `${localizedPath}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`
}

export function localizeContentHrefs(value, language) {
  if (Array.isArray(value)) return value.map((item) => localizeContentHrefs(item, language))
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    key === 'href' && typeof item === 'string'
      ? localizeHref(item, language)
      : localizeContentHrefs(item, language),
  ]))
}
