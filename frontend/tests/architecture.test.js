import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import englishDashboard from '../src/cms/locales/en/dashboard.json' with { type: 'json' }
import englishSettings from '../src/cms/locales/en/settings.json' with { type: 'json' }
import dariDashboard from '../src/cms/locales/prs/dashboard.json' with { type: 'json' }
import dariSettings from '../src/cms/locales/prs/settings.json' with { type: 'json' }
import pashtoDashboard from '../src/cms/locales/ps/dashboard.json' with { type: 'json' }
import pashtoSettings from '../src/cms/locales/ps/settings.json' with { type: 'json' }
import { CMS_PATHS, CMS_QUICK_ROUTE_KEYS, getCmsHref, getCmsRouteKey, isCmsPath } from '../src/cms/routes.js'

test('CMS paths resolve from one canonical route table', () => {
  assert.equal(isCmsPath('/dashboard'), true)
  assert.equal(isCmsPath('/dashboard/opportunities/example'), true)
  assert.equal(isCmsPath('/dr/dashboard'), false)
  assert.equal(getCmsRouteKey('/dashboard'), 'overview')
  assert.equal(getCmsRouteKey('/dashboard/tourism/world'), 'tourism')
  assert.equal(getCmsRouteKey('/dashboard/unknown'), 'placeholder')
  assert.equal(getCmsHref('messages'), CMS_PATHS.messages)
  for (const routeKey of CMS_QUICK_ROUTE_KEYS) {
    assert.ok(CMS_PATHS[routeKey])
    assert.notEqual(getCmsRouteKey(getCmsHref(routeKey)), 'placeholder')
  }
})

test('new CMS collection and branding labels have locale parity', () => {
  const dashboardKeys = Object.keys(dariDashboard.opportunities.collection).sort()
  const settingsKeys = Object.keys(dariSettings.branding).sort()

  for (const locale of [pashtoDashboard, englishDashboard]) {
    assert.deepEqual(Object.keys(locale.opportunities.collection).sort(), dashboardKeys)
  }
  for (const locale of [pashtoSettings, englishSettings]) {
    assert.deepEqual(Object.keys(locale.branding).sort(), settingsKeys)
  }
})

test('CMS card icons are resolved through the shared trusted icon allowlist', async () => {
  const sections = [
    '../src/website/components/sections/home/OpportunitySection.jsx',
    '../src/website/components/sections/home/ProcessSection.jsx',
    '../src/website/components/sections/home/ServicesSection.jsx',
  ]

  for (const section of sections) {
    const source = await readFile(new URL(section, import.meta.url), 'utf8')
    assert.match(source, /resolveContentIcon\(item\.icon, /, `${section} must resolve its saved CMS icon`)
  }

  const picker = await readFile(new URL('../src/cms/components/IconPicker.jsx', import.meta.url), 'utf8')
  const registry = await readFile(new URL('../src/shared/icons/contentIcons.js', import.meta.url), 'utf8')
  assert.match(picker, /contentIconOptions/)
  assert.match(registry, /new Map\(contentIconOptions\)/)
})

test('CMS collection cards preserve complete records and public home collections normalize legacy labels', async () => {
  const modal = await readFile(new URL('../src/cms/components/CollectionItemModal.jsx', import.meta.url), 'utf8')
  const loader = await readFile(new URL('../src/website/data/loadWebsiteContent.js', import.meta.url), 'utf8')

  assert.match(modal, /structuredClone\(localizedItem\)/)
  assert.match(modal, /if \(isCountry\).*savedItem\.name = languageDraft\.title/)
  assert.match(loader, /name: country\.name \|\| country\.title/)
  assert.match(loader, /title: item\.title \|\| item\.name/)
})

test('published CMS snapshots remain authoritative on public collection routes', async () => {
  const loader = await readFile(new URL('../src/website/data/loadWebsiteContent.js', import.meta.url), 'utf8')
  const snapshotsApi = await readFile(new URL('../src/shared/services/api/snapshots.js', import.meta.url), 'utf8')
  const websiteApp = await readFile(new URL('../src/website/WebsiteApp.jsx', import.meta.url), 'utf8')

  assert.match(loader, /cards: opportunities\.filter\(\(record\) => record\.type === type\)/)
  assert.match(loader, /cmsManaged: true/)
  assert.match(loader, /!managedTypes\.has\(type\)/)
  assert.match(loader, /content\.guides\.exams = exams\.map/)
  assert.doesNotMatch(loader, /fallbackWhatsApp/)
  assert.match(snapshotsApi, /cache: 'no-store'/)
  assert.match(websiteApp, /loadId === latestLoad\.current/)

  const blogPost = await readFile(new URL('../src/website/components/pages/BlogPostPage.jsx', import.meta.url), 'utf8')
  assert.match(blogPost, /usesCmsRecordContent/)
  assert.match(blogPost, /html=\{post\.content \|\| ''\}/)
})

test('public reload restoration does not use staged proportional scrolling', async () => {
  const layout = await readFile(new URL('../src/website/components/layout/WebsiteLayout.jsx', import.meta.url), 'utf8')
  const restoration = await readFile(new URL('../src/website/utils/scrollRestoration.js', import.meta.url), 'utf8')
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')

  assert.doesNotMatch(layout, /restoreScrollPosition\('proportional'\)/)
  assert.match(layout, /<ScrollRestorationFinalizer \/>/)
  assert.match(restoration, /finishReloadScrollRestoration/)
  assert.match(restoration, /sectionIndex/)
  assert.match(restoration, /data-route-skeleton/)
  assert.match(html, /data-restoring-scroll/)
  assert.doesNotMatch(html, /data-restoring-scroll[^}]+visibility:\s*hidden/)
  assert.match(html, /data-restoring-scroll[^}]+overflow-anchor:\s*none/)
})

test('testimonial cards use the shared profile avatar only as a missing or failed image fallback', async () => {
  const card = await readFile(new URL('../src/website/components/ui/TestimonialCard.jsx', import.meta.url), 'utf8')
  assert.match(card, /avatar \|\| defaultTestimonialAvatar/)
  assert.match(card, /\/assets\/images\/avatar\.png/)
  assert.match(card, /onError=/)
})
