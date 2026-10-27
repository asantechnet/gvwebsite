import assert from 'node:assert/strict'
import test from 'node:test'

import dariScholarships from '../src/website/locales/prs/scholarships.json' with { type: 'json' }
import pashtoScholarships from '../src/website/locales/ps/scholarships.json' with { type: 'json' }
import { filterScholarships, normalizeSearchText, searchCatalog } from '../src/website/utils/catalog.js'

test('search ignores surrounding whitespace and Arabic/Persian character variants', () => {
  const items = [{ title: 'ویزای تحصیلی', description: 'راهنمای کشور ترکیه' }]

  assert.equal(searchCatalog(items, '  ويزاي   تحصيلي ', 'prs').length, 1)
  assert.equal(normalizeSearchText('كشور'), normalizeSearchText('کشور'))
})

test('an empty search query returns no results', () => {
  assert.deepEqual(searchCatalog([{ title: 'بورسیه', description: '' }], '   '), [])
})

for (const [language, content] of [['Dari', dariScholarships], ['Pashto', pashtoScholarships]]) {
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
