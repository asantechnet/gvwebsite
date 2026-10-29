import { getLanguageConfig } from './language.js'

const arabicCharacterVariants = /[يىك]/g
const characterMap = { ي: 'ی', ى: 'ی', ك: 'ک' }
const inferredDeadlineFilters = {
  'د ټاکل شوي پروګرام له مخې': 'دا میاشت',
  'د رسمي غوښتنلیک دورې مطابق': 'دا اوونۍ',
  'د کلني اعلان مطابق': 'درې ورځې',
  'د رسمي اعلان مطابق': 'دا میاشت',
  'د څېړنیز اعلان مطابق': 'دا اوونۍ',
}
const inferredDeadlineFiltersBySlug = {
  'invest-your-talent-italy': 'نن',
  'stipendium-hungaricum': 'دا میاشت',
}

export function normalizeSearchText(value, language = 'dr') {
  const { locale } = getLanguageConfig(language)

  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(arabicCharacterVariants, (character) => characterMap[character])
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase(locale)
}

export function searchCatalog(items, query, language = 'dr') {
  const normalizedQuery = normalizeSearchText(query, language)
  if (!normalizedQuery) return []

  return items.filter((item) => normalizeSearchText(`${item.title} ${item.description}`, language).includes(normalizedQuery))
}

export function filterScholarships(items, filters) {
  return items.filter((item) => (
    (!filters.country || item.country === filters.country)
    && (!filters.degree || item.degree === filters.degree)
    && (!filters.funding || item.funding === filters.funding)
    && (!filters.deadline || (item.deadlineFilter || inferredDeadlineFiltersBySlug[item.slug] || inferredDeadlineFilters[item.deadline]) === filters.deadline)
  ))
}
