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
  return flattened.filter((record) => record.status !== 'draft' && record.status !== 'deleted').flatMap((record) => {
    const translation = record?.translations?.[locale]
    if (!translation) return []
    return [{
      ...record,
      ...translation,
      cmsManaged: true,
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
    news: { ...merged.news, items: (merged.news?.items || []).filter((item) => item.status !== 'draft').map((item) => ({ ...item, cmsManaged: true })) },
    articles: { ...merged.articles, items: (merged.articles?.items || []).filter((item) => item.status !== 'draft').map((item) => ({ ...item, cmsManaged: true })) },
  }
  if (key === 'scholarships') return { ...merged, items: (merged.items || []).filter((item) => item.status !== 'draft').map((item) => ({ ...item, cmsManaged: true })) }
  if (key === 'home') return normalizeHomeCollections(merged)
  return merged
}

function normalizeHomeCollections(home) {
  const normalizeTitledItems = (items) => (Array.isArray(items) ? items : []).map((item) => ({
    ...item,
    title: item.title || item.name || '',
  }))

  return {
    ...home,
    opportunities: { ...home.opportunities, cards: normalizeTitledItems(home.opportunities?.cards) },
    destinations: {
      ...home.destinations,
      countries: (Array.isArray(home.destinations?.countries) ? home.destinations.countries : []).map((country) => ({
        ...country,
        name: country.name || country.title || '',
        imageAlt: country.imageAlt || country.name || country.title || '',
      })),
    },
    process: { ...home.process, steps: normalizeTitledItems(home.process?.steps) },
    services: { ...home.services, cards: normalizeTitledItems(home.services?.cards) },
  }
}

export function applySnapshots(staticContent, snapshots, language) {
  const locale = snapshotLocale[language]
  const content = structuredClone(staticContent)
  const byKey = new Map((snapshots || []).map((snapshot) => [snapshot.key, snapshot.payload]))

  directSnapshotKeys.forEach((key) => {
    if (byKey.get(key)?.[locale]) content[key] = publishedPage(content[key], byKey.get(key)[locale], key)
  })

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
    const opportunityPayload = (Array.isArray(byKey.get('collection:opportunities')) ? byKey.get('collection:opportunities') : [])
      .flat(Infinity)
      .filter((record) => record && typeof record === 'object' && !Array.isArray(record))
    const managedTypes = new Set(opportunityPayload.map((record) => record.type).filter(Boolean))
    const opportunities = localizedCollection(opportunityPayload, locale)
    Object.keys(content.opportunities).forEach((type) => {
      if (!content.opportunities[type]?.post || !managedTypes.has(type)) return
      content.opportunities[type] = {
        ...content.opportunities[type],
        cards: opportunities.filter((record) => record.type === type).map((record) => ({
          ...record,
          cmsManaged: true,
          name: record.title,
          summary: record.description,
          href: `/opportunities/${type}/${record.slug}`,
          flag: record.flag || (record.countryCode ? `/assets/flags/${record.countryCode.toLocaleLowerCase()}.svg` : ''),
        })),
      }
    })
    const exams = opportunities.filter((record) => record.type === 'exams')
    if (managedTypes.has('exams')) content.guides.exams = exams.map((record) => ({ ...record, name: record.title, summary: record.description }))
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
        const snapshots = await snapshotsApi.publicList()
        return applySnapshots(module.default, snapshots, normalizedLanguage)
      }),
    )
  }

  return contentPromises.get(normalizedLanguage)
}
