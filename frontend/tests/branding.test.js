import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeBrandColor } from '../src/shared/utils/branding.js'

test('brand colors normalize complete values and repair incomplete recovered drafts', () => {
  assert.equal(normalizeBrandColor('#f47e26', '#000000'), '#F47E26')
  assert.equal(normalizeBrandColor('#F47E', '#f47e26'), '#F47E26')
  assert.equal(normalizeBrandColor('not-a-color', '#80027f'), '#80027F')
  assert.equal(normalizeBrandColor('', ''), null)
})
