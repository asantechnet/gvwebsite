export const TOURISM_CATEGORIES = Object.freeze({
  afghanistan: Object.freeze({
    prs: 'سیاحت در افغانستان',
    ps: 'سیاحت په افغانستان کې',
    en: 'Tourism in Afghanistan',
  }),
  world: Object.freeze({
    prs: 'سیاحت در جهان',
    ps: 'نړیوال سیاحت',
    en: 'World Tourism',
  }),
})

export const DEFAULT_CONTENT_CATEGORIES = Object.freeze({
  services: Object.freeze({ prs: 'خدمات', ps: 'خدمتونه', en: 'Services' }),
  scholarships: Object.freeze({ prs: 'بورسیه‌ها', ps: 'بورسونه', en: 'Scholarships' }),
  exams: Object.freeze({ prs: 'امتحانات', ps: 'ازموینې', en: 'Exams' }),
  news: Object.freeze({ prs: 'خبر', ps: 'خبر', en: 'News' }),
  study: Object.freeze({ prs: 'فرصت‌های تحصیلی', ps: 'تحصیلي فرصتونه', en: 'Study Opportunities' }),
  migration: Object.freeze({ prs: 'فرصت‌های مهاجرت', ps: 'د مهاجرت فرصتونه', en: 'Migration Opportunities' }),
  work: Object.freeze({ prs: 'فرصت‌های کاری', ps: 'کاري فرصتونه', en: 'Work Opportunities' }),
  investment: Object.freeze({ prs: 'فرصت‌های سرمایه‌گذاری', ps: 'د پانګونې فرصتونه', en: 'Investment Opportunities' }),
})

export function getTourismCategories({ isAfghanistanTourism = false, isWorldTourism = false } = {}) {
  if (isAfghanistanTourism) return TOURISM_CATEGORIES.afghanistan
  if (isWorldTourism) return TOURISM_CATEGORIES.world
  return null
}

export function getTourismCategory(type, locale) {
  return TOURISM_CATEGORIES[type]?.[locale] || ''
}

export function getDefaultContentCategory(type, locale) {
  return DEFAULT_CONTENT_CATEGORIES[type]?.[locale] || ''
}

export function applyTourismCategories(translations, categories) {
  if (!categories) return translations

  return Object.fromEntries(
    Object.entries(translations).map(([language, translation]) => [
      language,
      { ...translation, category: categories[language] || categories.prs },
    ]),
  )
}
