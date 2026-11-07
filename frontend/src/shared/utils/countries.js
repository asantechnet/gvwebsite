const destinationCodes = {
  europe: `AL AM AT AZ BA BE BG BY CH CY CZ DE DK EE ES FI FR GB GE GR HR HU IE IS IT LT LU LV MC MD MK MT NL NO PL PT RO RS RU SE SI SK SM UA XK`.split(' '),
  africa: `EG GH KE MA MU TN ZA`.split(' '),
  asia: `AE CN HK ID IN JP KZ KR MY PH QA SA SG TH TR TW VN`.split(' '),
  southAmerica: `AR BR CL CO PE UY`.split(' '),
  northAmerica: `CA MX US`.split(' '),
  oceania: `AU NZ`.split(' '),
}

const countryCodes = [...new Set(Object.values(destinationCodes).flat())]

const localeByLanguage = { prs: 'fa-AF', ps: 'ps-AF', en: 'en' }
const countryNameAliases = { آلمان: 'DE', بریتانیا: 'GB', ترکیه: 'TR', هنگری: 'HU', ایټالیا: 'IT', ایرلند: 'IE', Britain: 'GB' }
const afghanistanCountryNames = {
  prs: {
    AD: 'آندورا', AE: 'امارات متحده عربی', AL: 'آلبانیا', AM: 'ارمنستان', AR: 'ارجنتاین', AT: 'اتریش', AU: 'آسترالیا', AZ: 'آذربایجان', BA: 'بوسنی و هرزگوین', BE: 'بلجیم', BG: 'بلغاریا', BR: 'برازیل', BY: 'بلاروس', CA: 'کانادا', CH: 'سویس', CL: 'چیلی', CN: 'چین', CO: 'کلمبیا', CY: 'قبرس', CZ: 'چک', DE: 'آلمان', DK: 'دنمارک', EE: 'استونیا', EG: 'مصر', ES: 'هسپانیا', FI: 'فنلند', FR: 'فرانسه', GB: 'بریتانیا', GE: 'گرجستان', GH: 'گانا', GR: 'یونان', HK: 'هانگ کانگ', HR: 'کرواسی', HU: 'هنگری', ID: 'اندونیزیا', IE: 'ایرلند', IN: 'هندوستان', IS: 'آیسلند', IT: 'ایتالیا', JP: 'جاپان', KE: 'کنیا', KR: 'کوریای جنوبی', KZ: 'قزاقستان', LI: 'لیختن‌اشتاین', LT: 'لیتوانیا', LU: 'لوکزامبورگ', LV: 'لتونیا', MA: 'مراکش', MC: 'موناکو', MD: 'مولداوی', ME: 'مونته‌نگرو', MK: 'مقدونیه شمالی', MT: 'مالتا', MU: 'موریس', MX: 'مکسیکو', MY: 'مالیزیا', NL: 'هالند', NO: 'ناروی', NZ: 'نیوزیلند', PE: 'پیرو', PH: 'فیلیپین', PL: 'پولند', PT: 'پرتگال', QA: 'قطر', RO: 'رومانیا', RS: 'صربستان', RU: 'روسیه', SA: 'عربستان سعودی', SE: 'سویدن', SG: 'سنگاپور', SI: 'اسلوونیا', SK: 'سلواکیا', SM: 'سان مارینو', TH: 'تایلند', TN: 'تونس', TR: 'ترکیه', TW: 'تایوان', UA: 'اوکراین', US: 'ایالات متحده امریکا', UY: 'اروگوئه', VA: 'واتیکان', VN: 'ویتنام', XK: 'کوزوو', ZA: 'افریقای جنوبی',
  },
  ps: {
    AD: 'اندورا', AE: 'متحده عربي امارات', AL: 'البانیا', AM: 'ارمنستان', AR: 'ارجنټاین', AT: 'اتریش', AU: 'استرالیا', AZ: 'اذربایجان', BA: 'بوسنیا او هرزېګوینا', BE: 'بلجیم', BG: 'بلغاریا', BR: 'برازیل', BY: 'بېلاروس', CA: 'کاناډا', CH: 'سویس', CL: 'چیلي', CN: 'چین', CO: 'کولمبیا', CY: 'قبرس', CZ: 'چک', DE: 'جرمني', DK: 'ډنمارک', EE: 'استونیا', EG: 'مصر', ES: 'هسپانیه', FI: 'فنلنډ', FR: 'فرانسه', GB: 'بریتانیا', GE: 'ګرجستان', GH: 'ګانا', GR: 'یونان', HK: 'هانګ کانګ', HR: 'کروشیا', HU: 'هنګري', ID: 'اندونیزیا', IE: 'ایرلنډ', IN: 'هند', IS: 'آیسلنډ', IT: 'ایټالیا', JP: 'جاپان', KE: 'کینیا', KR: 'سویلي کوریا', KZ: 'قزاقستان', LI: 'لېختن‌اشتاین', LT: 'لېتوانیا', LU: 'لوکزامبورګ', LV: 'لاتویا', MA: 'مراکش', MC: 'موناکو', MD: 'مالدووا', ME: 'مونټینیګرو', MK: 'شمالي مقدونیه', MT: 'مالټا', MU: 'موریشس', MX: 'مکسیکو', MY: 'مالیزیا', NL: 'هالنډ', NO: 'ناروې', NZ: 'نیوزیلنډ', PE: 'پیرو', PH: 'فلیپین', PL: 'پولنډ', PT: 'پرتګال', QA: 'قطر', RO: 'رومانیا', RS: 'سربیا', RU: 'روسیه', SA: 'سعودي عربستان', SE: 'سویډن', SG: 'سنګاپور', SI: 'سلووینیا', SK: 'سلواکیا', SM: 'سان مارینو', TH: 'تایلنډ', TN: 'تونس', TR: 'ترکیه', TW: 'تایوان', UA: 'اوکراین', US: 'متحده ایالات', UY: 'یوروګوای', VA: 'واتیکان', VN: 'ویتنام', XK: 'کوسوو', ZA: 'سویلي افریقا',
  },
}

const flagFromCode = (code) => code.replace(/[A-Z]/g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))

export function getCountries(language = 'prs') {
  const locale = localeByLanguage[language] || localeByLanguage.prs
  const names = new Intl.DisplayNames([locale, 'en'], { type: 'region' })
  const localizedNames = Object.fromEntries(Object.entries(localeByLanguage).map(([key, countryLocale]) => [key, new Intl.DisplayNames([countryLocale, 'en'], { type: 'region' })]))
  const collator = new Intl.Collator(locale, { sensitivity: 'base', usage: 'sort' })

  return countryCodes
    .map((code) => ({
      code,
      value: code,
      name: afghanistanCountryNames[language]?.[code] || names.of(code) || code,
      flag: flagFromCode(code),
      names: Object.fromEntries(Object.entries(localizedNames).map(([key, displayNames]) => [key, afghanistanCountryNames[key]?.[code] || displayNames.of(code) || code])),
    }))
    .sort((first, second) => collator.compare(first.name, second.name))
}

export function normalizeCountrySearch(value = '') {
  return value.normalize('NFKD').replace(/[\u064B-\u065F\u0670]/g, '').toLocaleLowerCase().trim()
}

export function getCountryCode(name = '') {
  if (countryNameAliases[name]) return countryNameAliases[name]
  const normalizedName = normalizeCountrySearch(name)
  const localizedMatch = Object.values(afghanistanCountryNames).flatMap((countryNames) => Object.entries(countryNames)).find(([, countryName]) => normalizeCountrySearch(countryName) === normalizedName)
  if (localizedMatch) return localizedMatch[0]
  for (const [language, locale] of Object.entries(localeByLanguage)) {
    const displayNames = new Intl.DisplayNames([locale, 'en'], { type: 'region' })
    const match = countryCodes.find((code) => normalizeCountrySearch(displayNames.of(code)) === normalizedName)
    if (match) return match
    if (language === 'en' && /^[A-Z]{2}$/.test(name)) return name
  }
  return ''
}
