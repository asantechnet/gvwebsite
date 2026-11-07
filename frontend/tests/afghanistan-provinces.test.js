import assert from 'node:assert/strict'
import test from 'node:test'

import { getAfghanistanProvinceCode, getAfghanistanProvinces } from '../src/shared/utils/afghanistanProvinces.js'

test('Afghanistan province picker contains all 34 provinces', () => {
  const provinces = getAfghanistanProvinces('en')
  assert.equal(provinces.length, 34)
  assert.equal(new Set(provinces.map(({ code }) => code)).size, 34)
})

test('Afghanistan provinces are localized and alphabetized', () => {
  const locales = { prs: 'fa-AF', ps: 'ps-AF', en: 'en' }

  Object.entries(locales).forEach(([language, locale]) => {
    const collator = new Intl.Collator(locale, { sensitivity: 'base', usage: 'sort' })
    const names = getAfghanistanProvinces(language).map(({ name }) => name)
    assert.equal(names.every((name, index) => index === 0 || collator.compare(names[index - 1], name) <= 0), true)
  })

  assert.equal(getAfghanistanProvinceCode('میدان وردګ'), 'wardak')
  assert.equal(getAfghanistanProvinceCode('Panjshir'), 'panjshir')
})
