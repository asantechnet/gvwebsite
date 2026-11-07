const provinceNames = {
  badakhshan: { prs: 'بدخشان', ps: 'بدخشان', en: 'Badakhshan' },
  badghis: { prs: 'بادغیس', ps: 'بادغیس', en: 'Badghis' },
  baghlan: { prs: 'بغلان', ps: 'بغلان', en: 'Baghlan' },
  balkh: { prs: 'بلخ', ps: 'بلخ', en: 'Balkh' },
  bamyan: { prs: 'بامیان', ps: 'بامیان', en: 'Bamyan' },
  daykundi: { prs: 'دایکندی', ps: 'دایکنډي', en: 'Daykundi' },
  farah: { prs: 'فراه', ps: 'فراه', en: 'Farah' },
  faryab: { prs: 'فاریاب', ps: 'فاریاب', en: 'Faryab' },
  ghazni: { prs: 'غزنی', ps: 'غزني', en: 'Ghazni' },
  ghor: { prs: 'غور', ps: 'غور', en: 'Ghor' },
  helmand: { prs: 'هلمند', ps: 'هلمند', en: 'Helmand' },
  herat: { prs: 'هرات', ps: 'هرات', en: 'Herat' },
  jowzjan: { prs: 'جوزجان', ps: 'جوزجان', en: 'Jowzjan' },
  kabul: { prs: 'کابل', ps: 'کابل', en: 'Kabul' },
  kandahar: { prs: 'کندهار', ps: 'کندهار', en: 'Kandahar' },
  kapisa: { prs: 'کاپیسا', ps: 'کاپیسا', en: 'Kapisa' },
  khost: { prs: 'خوست', ps: 'خوست', en: 'Khost' },
  kunar: { prs: 'کنر', ps: 'کونړ', en: 'Kunar' },
  kunduz: { prs: 'کندز', ps: 'کندوز', en: 'Kunduz' },
  laghman: { prs: 'لغمان', ps: 'لغمان', en: 'Laghman' },
  logar: { prs: 'لوگر', ps: 'لوګر', en: 'Logar' },
  nangarhar: { prs: 'ننگرهار', ps: 'ننګرهار', en: 'Nangarhar' },
  nimroz: { prs: 'نیمروز', ps: 'نیمروز', en: 'Nimroz' },
  nuristan: { prs: 'نورستان', ps: 'نورستان', en: 'Nuristan' },
  paktia: { prs: 'پکتیا', ps: 'پکتیا', en: 'Paktia' },
  paktika: { prs: 'پکتیکا', ps: 'پکتیکا', en: 'Paktika' },
  panjshir: { prs: 'پنجشیر', ps: 'پنجشېر', en: 'Panjshir' },
  parwan: { prs: 'پروان', ps: 'پروان', en: 'Parwan' },
  samangan: { prs: 'سمنگان', ps: 'سمنګان', en: 'Samangan' },
  sar_e_pol: { prs: 'سرپل', ps: 'سرپل', en: 'Sar-e Pol' },
  takhar: { prs: 'تخار', ps: 'تخار', en: 'Takhar' },
  uruzgan: { prs: 'ارزگان', ps: 'اروزګان', en: 'Uruzgan' },
  wardak: { prs: 'میدان وردک', ps: 'میدان وردګ', en: 'Wardak' },
  zabul: { prs: 'زابل', ps: 'زابل', en: 'Zabul' },
}

const locales = { prs: 'fa-AF', ps: 'ps-AF', en: 'en' }

export function getAfghanistanProvinces(language = 'prs') {
  const collator = new Intl.Collator(locales[language] || locales.prs, { sensitivity: 'base', usage: 'sort' })
  return Object.entries(provinceNames)
    .map(([code, names]) => ({ code, value: code, name: names[language] || names.prs, names }))
    .sort((first, second) => collator.compare(first.name, second.name))
}

export function getAfghanistanProvinceCode(value = '') {
  const normalizedValue = value.toLocaleLowerCase().trim()
  return Object.entries(provinceNames).find(([code, names]) => code === normalizedValue || Object.values(names).some((name) => name.toLocaleLowerCase() === normalizedValue))?.[0] || ''
}
