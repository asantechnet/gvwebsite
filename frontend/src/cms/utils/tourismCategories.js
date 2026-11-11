export const TOURISM_CATEGORIES = Object.freeze({
  afghanistan: Object.freeze({
    prs: 'سیاحت در افغانستان',
    ps: 'د افغانستان سیاحت',
    en: 'Tourism in Afghanistan',
  }),
  world: Object.freeze({
    prs: 'سیاحت در جهان',
    ps: 'نړیوال سیاحت',
    en: 'World Tourism',
  }),
})

export function getTourismCategories({ isAfghanistanTourism = false, isWorldTourism = false } = {}) {
  if (isAfghanistanTourism) return TOURISM_CATEGORIES.afghanistan
  if (isWorldTourism) return TOURISM_CATEGORIES.world
  return null
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
