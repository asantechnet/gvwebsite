import { localizeContentHrefs, normalizeLanguage } from '@website/utils/language.js'
import { dataSourceMode } from '@/shared/services/api/config.js'
import { snapshotsApi } from '@/shared/services/api/snapshots.js'

const contentLoaders = {
  dr: () => import('./localizedContent/dari.js'),
  ps: () => import('./localizedContent/pashto.js'),
  en: () => import('./localizedContent/english.js'),
}

const contentPromises = new Map()

const snapshotLocale = { dr: 'prs', ps: 'ps', en: 'en' }
const directSnapshotKeys = ['home', 'about', 'contact', 'magazine', 'scholarships']

function localizedCollection(records, locale) {
  const flattened = (Array.isArray(records) ? records : []).flat(Infinity).filter((record) => record && typeof record === 'object' && !Array.isArray(record))
  return flattened.filter((record) => record.status !== 'draft').flatMap((record) => {
    const translation = record?.translations?.[locale]
    if (!translation) return []
    return [{
      ...record,
      ...translation,
      description: translation.description || translation.excerpt || record.description || '',
    }]
  })
}

// CMS snapshots are allowed to evolve independently from the bundled fallback.
// Merge object payloads instead of replacing the whole page so a partial/older
// snapshot cannot erase sections that the public renderer still expects.
function mergeSnapshot(base, override) {
  // Null values and shape changes from an editor must not replace a renderable
  // fallback object/array. Scalar authored values are still allowed to change.
  if (override === null || override === undefined) return base
  if (Array.isArray(base)) return Array.isArray(override) ? override : base
  if (Array.isArray(override)) return base && typeof base === 'object' ? base : override
  if (typeof override !== 'object') return override
  if (!base || typeof base !== 'object' || Array.isArray(base)) return structuredClone(override)

  return Object.fromEntries(
    Object.keys({ ...base, ...override }).map((key) => [
      key,
      key in override ? mergeSnapshot(base[key], override[key]) : base[key],
    ]),
  )
}

function publishedPage(fallback, payload, key) {
  if (!payload || typeof payload !== 'object') return payload
  const merged = mergeSnapshot(fallback, payload)
  if (key === 'magazine') return {
    ...merged,
    news: { ...merged.news, items: (merged.news?.items || []).filter((item) => item.status !== 'draft') },
    articles: { ...merged.articles, items: (merged.articles?.items || []).filter((item) => item.status !== 'draft') },
  }
  if (key === 'scholarships') return { ...merged, items: (merged.items || []).filter((item) => item.status !== 'draft') }
  return merged
}

export function applySnapshots(staticContent, snapshots, language) {
  const locale = snapshotLocale[language]
  const content = structuredClone(staticContent)
  const byKey = new Map((snapshots || []).map((snapshot) => [snapshot.key, snapshot.payload]))

  directSnapshotKeys.forEach((key) => {
    if (byKey.get(key)?.[locale]) content[key] = publishedPage(content[key], byKey.get(key)[locale], key)
  })

  const fallbackWhatsApp = staticContent.contact.contact.details.find((detail) => detail.type === 'whatsapp')
  if (fallbackWhatsApp && !content.contact.contact.details.some((detail) => detail.type === 'whatsapp')) {
    content.contact.contact.details.push(structuredClone(fallbackWhatsApp))
  }

  if (byKey.has('collection:services')) {
    content.services.services = localizedCollection(byKey.get('collection:services'), locale)
  }

  if (byKey.has('collection:tourism')) {
    const tourism = localizedCollection(byKey.get('collection:tourism'), locale)
    Object.keys(content.tourism).forEach((type) => {
    const records = tourism.filter((record) => record.type === type)
      content.tourism[type].cards = records.map((record) => ({ ...record, name: record.title }))
    })
  }

  if (byKey.has('collection:opportunities')) {
    const opportunities = localizedCollection(byKey.get('collection:opportunities'), locale)
    const byType = new Map(opportunities.map((record) => [record.type, record]))
    Object.keys(content.opportunities).forEach((type) => {
      if (!content.opportunities[type]?.post) return
      const record = byType.get(type)
      if (record) content.opportunities[type].post = { ...content.opportunities[type].post, ...record }
    })
    const exams = opportunities.filter((record) => record.type === 'exams')
    if (exams.length || opportunities.some((record) => record.type === 'exams')) {
      content.guides.exams = exams.map((record) => ({ ...record, name: record.title, summary: record.description }))
    }
  }

  // Settings/profile snapshots may also be partial. Keep bundled branding and
  // layout defaults available when an editor has not populated every field.
  content.siteSettings = mergeSnapshot(content.siteSettings, byKey.get('settings'))
  content.profile = mergeSnapshot(content.profile, byKey.get('profile'))
  if (content.profile?.[locale]) content.header.brandName = content.profile[locale]
  return localizeContentHrefs(content, language)
}

export function invalidateWebsiteContent(language) {
  if (language) contentPromises.delete(normalizeLanguage(language))
  else contentPromises.clear()
}

export function loadWebsiteContent(language, { fresh = false } = {}) {
  const normalizedLanguage = normalizeLanguage(language)

  if (fresh) contentPromises.delete(normalizedLanguage)

  if (!contentPromises.has(normalizedLanguage)) {
    contentPromises.set(
      normalizedLanguage,
      contentLoaders[normalizedLanguage]().then(async (module) => {
        if (dataSourceMode !== 'api') return module.default
        try {
          const snapshots = await snapshotsApi.publicList()
          return applySnapshots(module.default, snapshots, normalizedLanguage)
        } catch {
          return module.default
        }
      }),
    )
  }

  return contentPromises.get(normalizedLanguage)
}
