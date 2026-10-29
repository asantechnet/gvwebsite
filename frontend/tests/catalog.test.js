import assert from 'node:assert/strict'
import test from 'node:test'

import dariScholarships from '../src/website/locales/prs/scholarships.json' with { type: 'json' }
import pashtoScholarships from '../src/website/locales/ps/scholarships.json' with { type: 'json' }
import englishScholarships from '../src/website/locales/en/scholarships.json' with { type: 'json' }
import { filterScholarships, normalizeSearchText, searchCatalog } from '../src/website/utils/catalog.js'
import { getLanguageConfig, localizeContentHrefs, localizeHref, normalizeLanguage, parseLocalizedPathname } from '../src/website/utils/language.js'

test('public language identifiers normalize to dr, ps, and en with the correct direction', () => {
  assert.equal(normalizeLanguage('prs'), 'dr')
  assert.equal(normalizeLanguage('da'), 'dr')
  assert.equal(getLanguageConfig('dr').direction, 'rtl')
  assert.equal(getLanguageConfig('ps').direction, 'rtl')
  assert.equal(getLanguageConfig('en').direction, 'ltr')
})

test('localized public routes preserve pages, queries, and hashes', () => {
  assert.deepEqual(parseLocalizedPathname('/ps/contact'), {
    language: 'ps',
    pagePath: '/contact',
    isCanonical: true,
  })
  assert.deepEqual(parseLocalizedPathname('/contact'), {
    language: 'dr',
    pagePath: '/contact',
    isCanonical: false,
  })
  assert.equal(localizeHref('/dr/search?q=visa#results', 'en'), '/en/search?q=visa#results')
  assert.equal(localizeHref('/', 'dr'), '/dr')
  assert.equal(localizeHref('https://example.com', 'ps'), 'https://example.com')
})

test('localized content prefixes internal href fields without changing external links', () => {
  const content = localizeContentHrefs({
    action: { href: '/contact' },
    source: { href: 'https://example.com' },
  }, 'ps')

  assert.equal(content.action.href, '/ps/contact')
  assert.equal(content.source.href, 'https://example.com')
})

test('search ignores surrounding whitespace and Arabic/Persian character variants', () => {
  const items = [{ title: 'ویزای تحصیلی', description: 'راهنمای کشور ترکیه' }]

  assert.equal(searchCatalog(items, '  ويزاي   تحصيلي ', 'dr').length, 1)
  assert.equal(normalizeSearchText('كشور'), normalizeSearchText('کشور'))
})

test('an empty search query returns no results', () => {
  assert.deepEqual(searchCatalog([{ title: 'بورسیه', description: '' }], '   '), [])
})

for (const [language, content] of [['Dari', dariScholarships], ['Pashto', pashtoScholarships], ['English', englishScholarships]]) {
  test(`${language} scholarship options map to actual records`, () => {
    for (const option of content.options.countries) {
      assert.ok(filterScholarships(content.items, { country: option }).length > 0, `No country record for ${option}`)
    }
    for (const option of content.options.degrees) {
      assert.ok(filterScholarships(content.items, { degree: option }).length > 0, `No degree record for ${option}`)
    }
    for (const option of content.options.funding) {
      assert.ok(filterScholarships(content.items, { funding: option }).length > 0, `No funding record for ${option}`)
    }
    for (const option of content.options.deadlines) {
      assert.ok(filterScholarships(content.items, { deadline: option }).length > 0, `No deadline record for ${option}`)
    }
  })
}

test('combined scholarship filters use AND semantics and reset restores all records', () => {
  const first = dariScholarships.items[0]
  const filters = { country: first.country, degree: first.degree, funding: first.funding, deadline: first.deadlineFilter }

  assert.ok(filterScholarships(dariScholarships.items, filters).some((item) => item.slug === first.slug))
  assert.equal(filterScholarships(dariScholarships.items, { country: '', degree: '', funding: '', deadline: '' }).length, dariScholarships.items.length)
})
