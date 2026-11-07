import assert from 'node:assert/strict'
import test from 'node:test'

import { getCountries } from '../src/shared/utils/countries.js'

test('country choices use the curated study-destination catalogue', () => {
  const countries = getCountries('en')
  const codes = new Set(countries.map(({ code }) => code))

  assert.equal(codes.has('AF'), false)
  assert.equal(codes.has('IL'), false)
  assert.equal(codes.has('AD'), false)
  assert.equal(codes.has('LI'), false)
  assert.equal(codes.has('ME'), false)
  assert.equal(codes.has('VA'), false)
  assert.equal(codes.has('EG'), true)
  assert.equal(codes.has('MA'), true)
  assert.equal(codes.has('ZA'), true)
  assert.equal(codes.has('AR'), true)
  assert.equal(codes.has('BR'), true)
  assert.equal(codes.has('AU'), true)
  assert.equal(codes.has('NZ'), true)
})

test('country choices remain alphabetized in every supported language', () => {
  const locales = { prs: 'fa-AF', ps: 'ps-AF', en: 'en' }

  Object.entries(locales).forEach(([language, locale]) => {
    const collator = new Intl.Collator(locale, { sensitivity: 'base', usage: 'sort' })
    const names = getCountries(language).map(({ name }) => name)
    assert.equal(names.every((name, index) => index === 0 || collator.compare(names[index - 1], name) <= 0), true)
  })
})

test('Dari and Pashto use Afghanistan-localized country names', () => {
  const dari = Object.fromEntries(getCountries('prs').map(({ code, name }) => [code, name]))
  const pashto = Object.fromEntries(getCountries('ps').map(({ code, name }) => [code, name]))

  assert.equal(dari.AU, 'آسترالیا')
  assert.equal(dari.JP, 'جاپان')
  assert.equal(dari.NL, 'هالند')
  assert.equal(dari.SE, 'سویدن')
  assert.equal(dari.HU, 'هنگری')
  assert.equal(dari.ES, 'هسپانیا')
  assert.equal(dari.NZ, 'نیوزیلند')
  assert.equal(pashto.AU, 'استرالیا')
  assert.equal(pashto.DE, 'جرمني')
  assert.equal(pashto.NL, 'هالنډ')
  assert.equal(pashto.SE, 'سویډن')
  assert.equal(pashto.NZ, 'نیوزیلنډ')
})
