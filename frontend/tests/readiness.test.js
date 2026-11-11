import assert from 'node:assert/strict'
import test from 'node:test'

import englishDashboard from '../src/cms/locales/en/dashboard.json' with { type: 'json' }
import englishMedia from '../src/cms/locales/en/media.json' with { type: 'json' }
import englishMessages from '../src/cms/locales/en/messages.json' with { type: 'json' }
import englishProfile from '../src/cms/locales/en/profile.json' with { type: 'json' }
import dariDashboard from '../src/cms/locales/prs/dashboard.json' with { type: 'json' }
import dariMedia from '../src/cms/locales/prs/media.json' with { type: 'json' }
import dariMessages from '../src/cms/locales/prs/messages.json' with { type: 'json' }
import dariProfile from '../src/cms/locales/prs/profile.json' with { type: 'json' }
import pashtoDashboard from '../src/cms/locales/ps/dashboard.json' with { type: 'json' }
import pashtoMedia from '../src/cms/locales/ps/media.json' with { type: 'json' }
import pashtoMessages from '../src/cms/locales/ps/messages.json' with { type: 'json' }
import pashtoProfile from '../src/cms/locales/ps/profile.json' with { type: 'json' }
import { ALL_CMS_PERMISSIONS, CMS_PERMISSIONS, can, canAccessCmsRoute, normalizeSession } from '../src/cms/auth/permissions.js'
import { applyTourismCategories, getTourismCategories } from '../src/cms/utils/tourismCategories.js'
import { normalizeContentRecord, serializeContentRecord } from '../src/shared/models/content.js'
import { normalizeMessage, serializeMessageState } from '../src/shared/models/message.js'
import { isSafeContentUrl } from '../src/shared/security/sanitizeRichText.js'
import { getUploadKind, validateUploadFile } from '../src/shared/uploads/files.js'
import { validateContactForm, validatePasswordChange } from '../src/shared/utils/validation.js'

test('content records expose stable language-neutral and translated fields', () => {
  const record = normalizeContentRecord({ id: 42, slug: 'example', status: 'unexpected', title: 'عنوان', savedStatus: 'published' })

  assert.equal(record.id, '42')
  assert.equal(record.status, 'draft')
  assert.equal(record.translations.prs.title, 'عنوان')
  assert.deepEqual(Object.keys(record.translations), ['prs', 'ps', 'en'])
  assert.equal('savedStatus' in serializeContentRecord(record), false)
})

test('message records normalize transport fields and read state', () => {
  const message = normalizeMessage({ id: 7, name: 'A User', subject: 'Consultation', message: 'Hello', created_at: '2026-11-04T08:30:00Z', read_at: null })

  assert.equal(message.id, '7')
  assert.equal(message.title, 'A User')
  assert.equal(message.service, 'Consultation')
  assert.equal(message.body, 'Hello')
  assert.equal(message.unread, true)
  assert.deepEqual(serializeMessageState(false), { unread: false })
})

test('CMS sessions normalize known permissions and enforce route access', () => {
  const session = normalizeSession({ user: { id: 7, role: 'editor' }, permissions: [CMS_PERMISSIONS.MANAGE_CONTENT, 'unknown'] })

  assert.deepEqual(session.permissions, [CMS_PERMISSIONS.MANAGE_CONTENT])
  assert.equal(can(session, CMS_PERMISSIONS.MANAGE_CONTENT), true)
  assert.equal(canAccessCmsRoute(session, 'home'), true)
  assert.equal(canAccessCmsRoute(session, 'settings'), false)
  assert.equal(ALL_CMS_PERMISSIONS.includes('unknown'), false)
})

test('contact and password validation normalize values and reject weak input', () => {
  const contact = validateContactForm({ name: '  A User  ', email: ' USER@EXAMPLE.COM ', subject: ' Hello ', message: ' A useful message. ' })
  assert.equal(contact.valid, true)
  assert.equal(contact.values.email, 'user@example.com')

  assert.equal(validateContactForm({}).valid, false)
  assert.equal(validatePasswordChange({ currentPassword: 'old', password: 'short', confirmPassword: 'different' }).valid, false)
  assert.equal(validatePasswordChange({ currentPassword: 'old', password: 'a-secure-passphrase', confirmPassword: 'a-secure-passphrase' }).valid, true)
})

test('rich-text URL policy rejects executable schemes', () => {
  assert.equal(isSafeContentUrl('javascript:alert(1)'), false)
  assert.equal(isSafeContentUrl('data:text/html;base64,PHNjcmlwdD4='), false)
  assert.equal(isSafeContentUrl('/assets/image.webp', { image: true }), true)
  assert.equal(isSafeContentUrl('https://example.com/page'), true)
})

test('upload policy uses MIME type and per-kind limits instead of extensions', () => {
  const image = new File(['image'], 'photo.jpg', { type: 'image/jpeg' })
  const disguisedSvg = new File(['<svg/>'], 'photo.jpg', { type: 'image/svg+xml' })
  const oversizedImage = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' })

  assert.equal(getUploadKind(image), 'image')
  assert.equal(validateUploadFile(image, ['image']).valid, true)
  assert.equal(validateUploadFile(disguisedSvg, ['image']).code, 'type')
  assert.equal(validateUploadFile(oversizedImage, ['image']).code, 'size')
})

test('Phase 4 interface labels retain locale parity', () => {
  for (const locale of [pashtoDashboard, englishDashboard]) assert.deepEqual(Object.keys(locale.auth).sort(), Object.keys(dariDashboard.auth).sort())
  for (const locale of [dariMedia, pashtoMedia, englishMedia]) assert.equal(typeof locale.uploadError, 'string')
  for (const locale of [dariProfile, pashtoProfile, englishProfile]) assert.equal(typeof locale.passwordValidation, 'string')
})

test('message workflow labels retain locale parity', () => {
  const keys = Object.keys(dariMessages).sort()
  for (const locale of [pashtoMessages, englishMessages]) assert.deepEqual(Object.keys(locale).sort(), keys)
})

test('tourism posts receive fixed localized categories', () => {
  const translations = {
    prs: { title: 'بامیان' },
    ps: { title: 'بامیان' },
    en: { title: 'Bamyan' },
  }
  const afghanistan = getTourismCategories({ isAfghanistanTourism: true })
  const categorized = applyTourismCategories(translations, afghanistan)

  assert.equal(categorized.prs.category, 'سیاحت در افغانستان')
  assert.equal(categorized.ps.category, 'د افغانستان سیاحت')
  assert.equal(categorized.en.category, 'Tourism in Afghanistan')
  assert.equal(translations.prs.category, undefined)

  const world = getTourismCategories({ isWorldTourism: true })
  assert.deepEqual(world, { prs: 'سیاحت در جهان', ps: 'نړیوال سیاحت', en: 'World Tourism' })
  assert.equal(getTourismCategories(), null)
})
