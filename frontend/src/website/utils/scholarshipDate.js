const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/

const dateLocales = {
  dr: 'fa-AF-u-ca-persian-nu-latn',
  prs: 'fa-AF-u-ca-persian-nu-latn',
  ps: 'fa-AF-u-ca-persian-nu-latn',
  en: 'en-US-u-nu-latn',
}

const pashtoSolarMonths = {
  حمل: 'وری',
  ثور: 'غویی',
  جوزا: 'غبرګولی',
  سرطان: 'چنګاښ',
  اسد: 'زمری',
  سنبله: 'وږی',
  میزان: 'تله',
  عقرب: 'لړم',
  قوس: 'لیندۍ',
  جدی: 'مرغومی',
  دلو: 'سلواغه',
  حوت: 'کب',
}

// Canonical dates for bundled legacy records whose localized source files
// predate ISO storage. CMS-managed records already store ISO dates directly.
const legacyDeadlinesBySlug = {
  'daad-graduate-scholarships': '2026-11-16',
  'chevening-scholarship': '2026-11-24',
  'turkiye-scholarships': '2026-12-31',
  'stipendium-hungaricum': '2027-02-07',
  'invest-your-talent-italy': '2027-02-21',
  'government-of-ireland-postgraduate': '2027-04-04',
}

export function formatScholarshipDeadline(value, language = 'dr', slug = '') {
  const canonicalValue = legacyDeadlinesBySlug[slug] || value
  const match = String(canonicalValue || '').match(isoDatePattern)
  if (!match) return value || ''

  const [, year, month, day] = match
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  if (Number.isNaN(date.getTime())
    || date.getUTCFullYear() !== Number(year)
    || date.getUTCMonth() !== Number(month) - 1
    || date.getUTCDate() !== Number(day)) return canonicalValue

  const formatter = new Intl.DateTimeFormat(dateLocales[language] || dateLocales.dr, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]))

  if (language === 'en') return formatter.format(date)
  const pashtoMonth = Object.entries(pashtoSolarMonths).find(([dariMonth]) => parts.month.startsWith(dariMonth))?.[1]
  const monthName = language === 'ps' ? pashtoMonth || parts.month : parts.month
  return `${parts.day} ${monthName} ${parts.year}`
}
