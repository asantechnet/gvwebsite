import { normalizeLanguage } from '@website/utils/language.js'
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
  return records.filter((record) => record.status !== 'draft').flatMap((record) => {
    const translation = record?.translations?.[locale]
    if (!translation) return []
    return [{
      ...record,
      ...translation,
      description: translation.excerpt || record.description || '',
    }]
  })
}

function applySnapshots(staticContent, snapshots, language) {
  const locale = snapshotLocale[language]
  const content = structuredClone(staticContent)
  const byKey = new Map((snapshots || []).map((snapshot) => [snapshot.key, snapshot.payload]))

  directSnapshotKeys.forEach((key) => {
    if (byKey.get(key)?.[locale]) content[key] = byKey.get(key)[locale]
  })

  const services = localizedCollection(byKey.get('collection:services') || [], locale)
  if (services.length) content.services.services = services

  const tourism = localizedCollection(byKey.get('collection:tourism') || [], locale)
  if (tourism.length) Object.keys(content.tourism).forEach((type) => {
    const records = tourism.filter((record) => record.type === type)
    if (records.length) content.tourism[type].cards = records.map((record) => ({ ...record, name: record.title }))
  })

  const opportunities = localizedCollection(byKey.get('collection:opportunities') || [], locale)
  opportunities.forEach((record) => {
    if (content.opportunities[record.type]?.post) content.opportunities[record.type].post = { ...content.opportunities[record.type].post, ...record }
  })

  content.siteSettings = byKey.get('settings') || null
  content.profile = byKey.get('profile') || null
  if (content.profile?.[locale]) content.header.brandName = content.profile[locale]
  return content
}

export function loadWebsiteContent(language) {
  const normalizedLanguage = normalizeLanguage(language)

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
