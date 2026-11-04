export const CONTENT_LOCALES = Object.freeze(['prs', 'ps', 'en'])
export const CONTENT_STATUSES = Object.freeze(['draft', 'published'])

const emptyTranslation = Object.freeze({
  title: '',
  excerpt: '',
  content: '',
  tags: [],
  seoTitle: '',
  metaDescription: '',
  imageAlt: '',
})

export function normalizeContentTranslation(value = {}) {
  return {
    ...emptyTranslation,
    ...value,
    tags: Array.isArray(value.tags) ? value.tags.filter(Boolean) : [],
  }
}

export function normalizeTranslations(translations = {}) {
  return Object.fromEntries(CONTENT_LOCALES.map((locale) => [locale, normalizeContentTranslation(translations[locale])]))
}

export function normalizeContentRecord(record = {}) {
  const status = CONTENT_STATUSES.includes(record.status) ? record.status : 'draft'
  const fallback = normalizeContentTranslation({
    title: record.title,
    excerpt: record.excerpt || record.description,
    content: record.content,
    tags: record.tags,
    seoTitle: record.seoTitle,
    metaDescription: record.metaDescription,
    imageAlt: record.imageAlt,
  })
  const translations = normalizeTranslations(record.translations)

  if (!record.translations) {
    translations.prs = fallback
  }

  return {
    ...record,
    id: String(record.id ?? record.slug ?? ''),
    slug: String(record.slug ?? ''),
    type: String(record.type ?? ''),
    category: String(record.category ?? ''),
    status,
    featured: Boolean(record.featured),
    image: String(record.image ?? ''),
    href: String(record.href ?? ''),
    translations,
  }
}

export function serializeContentRecord(record) {
  const normalized = normalizeContentRecord(record)
  const serialized = { ...normalized }
  delete serialized.savedStatus
  return serialized
}
