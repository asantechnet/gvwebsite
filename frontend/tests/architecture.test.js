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

test('persisted CMS card and record deletions use the shared confirmation dialog', async () => {
  const deletionSources = [
    '../src/cms/components/sections/ContactEditorSection.jsx',
    '../src/cms/components/sections/AboutEditorSection.jsx',
    '../src/cms/components/sections/HomeEditorSection.jsx',
    '../src/cms/components/sections/MagazineEditorSection.jsx',
    '../src/cms/components/sections/ScholarshipsEditorSection.jsx',
    '../src/cms/components/pages/OpportunitiesPage.jsx',
    '../src/cms/components/pages/MediaLibraryPage.jsx',
    '../src/cms/components/sections/MessagesSection.jsx',
  ]

  for (const sourcePath of deletionSources) {
    const source = await readFile(new URL(sourcePath, import.meta.url), 'utf8')
    assert.match(source, /cmsConfirmDelete/, `${sourcePath} must confirm destructive record deletion`)
  }

  const contactEditor = await readFile(new URL('../src/cms/components/sections/ContactEditorSection.jsx', import.meta.url), 'utf8')
  assert.match(contactEditor, /const deleteSocial = async[\s\S]+cmsConfirmDelete[\s\S]+deleteCollectionItemWithUndo/)
})

test('contact social links stay shared, clickable, and reflected by the loading skeleton', async () => {
  const contactEditor = await readFile(new URL('../src/cms/components/sections/ContactEditorSection.jsx', import.meta.url), 'utf8')
  const contactSection = await readFile(new URL('../src/website/components/sections/contact/ContactSection.jsx', import.meta.url), 'utf8')
  const routeProgress = await readFile(new URL('../src/website/components/shared/RouteProgress.jsx', import.meta.url), 'utf8')
  const websiteLayout = await readFile(new URL('../src/website/components/layout/WebsiteLayout.jsx', import.meta.url), 'utf8')

  assert.match(contactEditor, /const updateSharedSocials = \(update\) => setDrafts/)
  assert.match(contactEditor, /Object\.entries\(current\).*socials: socials\.map/)
  assert.match(contactSection, /<a key=\{`\$\{social\.type\}-\$\{social\.href\}`\} href=\{social\.href\}/)
  assert.match(routeProgress, /ContactSkeleton\(\{ socialCount = 0 \}\)/)
  assert.match(routeProgress, /list\(socialCount\)/)
  assert.match(websiteLayout, /contactSocialCount=\{contactContent\.contact\.visibility\?\.social === false \? 0 : contactContent\.contact\.socials\.length\}/)
})

test('homepage skeleton matches the real desktop hero spacing', async () => {
  const skeleton = await readFile(new URL('../src/website/components/shared/RouteProgress.jsx', import.meta.url), 'utf8')
  const hero = await readFile(new URL('../src/website/components/sections/home/HeroSection.jsx', import.meta.url), 'utf8')

  assert.match(skeleton, /lg:min-h-screen lg:grid-cols-2 lg:pb-6 lg:pt-10 xl:pb-8 xl:pt-4/)
  assert.match(skeleton, /md:px-6 lg:py-0/)
  assert.match(hero, /lg:min-h-screen lg:grid-cols-2 lg:gap-8 lg:pb-6 lg:pt-10 xl:pb-8 xl:pt-4/)
})

test('saved theme branding drives every public and CMS brand surface', async () => {
  const branding = await readFile(new URL('../src/shared/utils/branding.js', import.meta.url), 'utf8')
  const settings = await readFile(new URL('../src/cms/components/sections/SettingsSection.jsx', import.meta.url), 'utf8')
  const dashboard = await readFile(new URL('../src/cms/components/layout/DashboardLayout.jsx', import.meta.url), 'utf8')
  const sidebar = await readFile(new URL('../src/cms/components/layout/DashboardSidebar.jsx', import.meta.url), 'utf8')
  const topbar = await readFile(new URL('../src/cms/components/layout/DashboardTopbar.jsx', import.meta.url), 'utf8')
  const maintenance = await readFile(new URL('../src/website/components/MaintenancePage.jsx', import.meta.url), 'utf8')
  const website = await readFile(new URL('../src/website/components/layout/WebsiteLayout.jsx', import.meta.url), 'utf8')

  assert.match(branding, /export function readBrandLogo/)
  assert.match(branding, /export function applyBrandFavicon/)
  assert.match(branding, /export function watchBrowserBrandFavicon/)
  assert.match(branding, /matchMedia\('\(prefers-color-scheme: dark\)'\)/)
  assert.match(branding, /export function readBrandColors/)
  assert.match(branding, /export function applyBrandColors/)
  assert.match(settings, /dispatchEvent\(new Event\(BRANDING_UPDATED_EVENT\)\)/)
  assert.match(dashboard, /brandIcon=\{brandIcon\}/)
  assert.match(dashboard, /logo=\{brandLogo\}/)
  assert.match(sidebar, /src=\{brandIcon\}/)
  assert.match(topbar, /src=\{brandIcon\}/)
  assert.doesNotMatch(sidebar, /assets\/branding\/icon/)
  assert.doesNotMatch(topbar, /assets\/branding\/icon/)
  assert.match(maintenance, /src=\{logo\}/)
  assert.match(website, /logo=\{activeLogo\}/)
  assert.match(website, /watchBrowserBrandFavicon\(lightFavicon, darkFavicon\)/)
  assert.match(dashboard, /watchBrowserBrandFavicon\(lightFavicon, darkFavicon\)/)

  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  assert.match(html, /<link rel="icon" href="data:,"/)
  assert.match(html, /publishedBranding = null \/\*__GLOBALVISION_PUBLISHED_BRANDING__\*\//)
  assert.match(html, /style\.setProperty\('--brand-orange', primary\)/)
  assert.match(html, /style\.setProperty\('--brand-red', secondary\)/)
  assert.match(html, /document\.title = ''/)
  assert.doesNotMatch(html, /Global Vision Website Management/)
  assert.match(dashboard, /document\.title = cmsDocumentTitle\(language, companyName\)/)
})

test('public header controls use a focus border without an outer glow', async () => {
  const header = await readFile(new URL('../src/website/components/layout/Header.jsx', import.meta.url), 'utf8')
  const maintenance = await readFile(new URL('../src/website/components/MaintenancePage.jsx', import.meta.url), 'utf8')

  const languageSwitcher = await readFile(new URL('../src/shared/components/LanguageSwitcher.jsx', import.meta.url), 'utf8')
  const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8')

  assert.match(header, /focus-visible:border-focus focus-visible:shadow-none!/)
  assert.match(maintenance, /focus-visible:border-focus focus-visible:shadow-none!/)
  assert.equal(languageSwitcher.match(/focus-visible:shadow-none!/g)?.length, 2)
  assert.match(styles, /\.website-root :where\(a, button, \[role="button"\]\):focus-visible \{[\s\S]*?box-shadow: none;/)
  assert.doesNotMatch(styles, /:where\(a, button, \[role="button"\], input, textarea, select\):focus-visible/)
  assert.doesNotMatch(header, /0_0_0_3px_color-mix\(in_srgb,var\(--theme-focus\)/)
  assert.doesNotMatch(maintenance, /0_0_0_3px_color-mix\(in_srgb,var\(--theme-focus\)/)
  assert.doesNotMatch(languageSwitcher, /focus-visible:shadow-\[0_0_0/)
})

test('public and CMS header searches submit and navigate reliably', async () => {
  const header = await readFile(new URL('../src/website/components/layout/Header.jsx', import.meta.url), 'utf8')
  const cmsTopbar = await readFile(new URL('../src/cms/components/layout/DashboardTopbar.jsx', import.meta.url), 'utf8')

  assert.match(header, /action=\{action\}/)
  assert.match(header, /method="get"/)
  assert.match(header, /name="q"/)
  assert.match(header, /new FormData\(event\.currentTarget\)/)
  assert.match(header, /destination\.searchParams\.set\('q', trimmedQuery\)/)
  assert.match(cmsTopbar, /const normalizeSearchValue =/)
  assert.match(cmsTopbar, /onClick=\{\(\) => openResult\(item\.key\)\}/)
  assert.match(cmsTopbar, /if \(match\) openResult\(match\.key\)/)
})

test('CMS clickable controls use focus borders without faded glow rings', async () => {
  const styles = await readFile(new URL('../src/cms/styles.css', import.meta.url), 'utf8')
  const topbar = await readFile(new URL('../src/cms/components/layout/DashboardTopbar.jsx', import.meta.url), 'utf8')
  const tabs = await readFile(new URL('../src/cms/components/SectionTabBar.jsx', import.meta.url), 'utf8')
  const auth = await readFile(new URL('../src/cms/components/pages/AuthPage.jsx', import.meta.url), 'utf8')

  assert.match(styles, /\.cms-root :where\(a, button, \[role="button"\]\):focus-visible \{[\s\S]*?box-shadow: none !important;/)
  assert.match(topbar, /focus-visible:shadow-none!/)
  assert.match(tabs, /focus-visible:shadow-none!/)
  assert.match(auth, /focus-visible:shadow-none!/)
})

test('saved branding colors survive reloads and drive both website themes', async () => {
  const branding = await readFile(new URL('../src/shared/utils/branding.js', import.meta.url), 'utf8')
  const dashboard = await readFile(new URL('../src/cms/components/layout/DashboardLayout.jsx', import.meta.url), 'utf8')
  const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8')
  const cmsStyles = await readFile(new URL('../src/cms/styles.css', import.meta.url), 'utf8')

  assert.match(dashboard, /snapshots\.get\("settings"\)/)
  assert.match(dashboard, /applyBrandColors\(readBrandColors\(\)\)/)
  assert.match(dashboard, /snapshots\.get\("settings"\)/)
  assert.match(styles, /--active-brand: var\(--brand-orange\)/)
  assert.match(styles, /\.dark \{[\s\S]*--active-brand: var\(--brand-red\)/)
  assert.match(styles, /--theme-primary: var\(--active-brand\)/)
  assert.match(styles, /--theme-secondary: var\(--active-brand\)/)
  assert.match(styles, /--theme-background: color-mix\(in srgb, var\(--active-brand\) 3%, white\)/)
  assert.match(styles, /--theme-surface-muted: color-mix\(in srgb, var\(--active-brand\) 9%, white\)/)
  assert.match(styles, /--theme-background: color-mix\(in srgb, var\(--active-brand\) 8%, #111827\)/)
  assert.doesNotMatch(styles, /#(?:fffaf5|fff1e2|ead5c9|221515|432b23|55312b)/i)
  assert.match(branding, /document\.documentElement\.style\.setProperty\('--brand-orange', primary\)/)
  assert.match(branding, /document\.documentElement\.style\.setProperty\('--brand-red', secondary\)/)
  assert.doesNotMatch(branding, /setProperty\('--admin-brand'/)
  assert.match(branding, /removeProperty\('--admin-brand'\)/)
  assert.match(cmsStyles, /--admin-brand: var\(--active-brand\)/)
  assert.match(cmsStyles, /--admin-secondary: var\(--active-brand\)/)
  assert.match(styles, /--theme-primary-hover: color-mix\(in srgb, var\(--active-brand\) 82%, white\)/)
  assert.match(styles, /\.dark \{[\s\S]*--theme-primary-hover: color-mix\(in srgb, var\(--active-brand\) 82%, black\)/)
  assert.match(styles, /\.bg-primary:not\(:disabled\):hover/)
  assert.match(cmsStyles, /--admin-brand-hover: color-mix\(in srgb, var\(--admin-brand\) 84%, white\)/)
  assert.match(cmsStyles, /--admin-brand-hover: color-mix\(in srgb, var\(--admin-brand\) 84%, black\)/)
  assert.match(cmsStyles, /\.bg-admin-brand:not\(:disabled\):hover/)
  assert.doesNotMatch(cmsStyles, /--admin-brand: #f7a33a/)

  const draftEvents = await readFile(new URL('../src/cms/utils/draftEvents.js', import.meta.url), 'utf8')
  const unsavedChanges = await readFile(new URL('../src/cms/components/UnsavedChangesBar.jsx', import.meta.url), 'utf8')
  assert.match(draftEvents, /if \(!detail\.handled\) reject/)
  assert.match(unsavedChanges, /CMS_CHANGES_COMMITTED_EVENT/)
  assert.match(unsavedChanges, /const markCommitted = \(\) =>/)
  assert.equal(unsavedChanges.match(/hover:bg-admin-brand-hover/g)?.length, 2)
  assert.doesNotMatch(unsavedChanges, /hover:bg-orange-500/)

  const draftState = await readFile(new URL('../src/cms/hooks/useCmsDraftState.js', import.meta.url), 'utf8')
  assert.match(draftState, /const draftRef = useRef\(initial\.value\)/)
  assert.match(draftState, /const latestDraft = draftRef\.current/)
  assert.doesNotMatch(draftState, /\[commit, draft, scope, storageKey\]/)
})

test('directional icons follow their own resolved text direction', async () => {
  const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8')

  assert.match(styles, /\.lucide-arrow-right:dir\(ltr\)/)
  assert.match(styles, /\.lucide-chevrons-right:dir\(ltr\)/)
  assert.match(styles, /\.cms-root \.lucide-external-link:dir\(rtl\)/)
  assert.doesNotMatch(styles, /html:dir\((?:ltr|rtl)\) \.lucide-(?:arrow|chevron|external-link)/)
})

test('published CMS snapshots remain authoritative on public collection routes', async () => {
  const loader = await readFile(new URL('../src/website/data/loadWebsiteContent.js', import.meta.url), 'utf8')
  const snapshotsApi = await readFile(new URL('../src/shared/services/api/snapshots.js', import.meta.url), 'utf8')
  const websiteApp = await readFile(new URL('../src/website/WebsiteApp.jsx', import.meta.url), 'utf8')

  assert.match(loader, /cards: opportunities\.filter\(\(record\) => record\.type === type\)/)
  assert.match(loader, /cmsManaged: true/)
  assert.match(loader, /!managedTypes\.has\(type\)/)
  assert.match(loader, /content\.guides\.exams = exams\.map/)
  assert.match(loader, /getTourismCategory\(type, locale\)/)
  assert.match(loader, /\{ \.\.\.record, category, name: record\.title \}/)
  assert.match(loader, /getDefaultContentCategory\('services', locale\)/)
  assert.match(loader, /getDefaultContentCategory\('news', locale\)/)
  assert.match(loader, /getDefaultContentCategory\(type, locale\) \|\| record\.category/)
  assert.match(loader, /function normalizeDefaultCategories\(content, locale\)/)
  assert.match(loader, /dataSourceMode !== 'api'\) return normalizeDefaultCategories/)
  assert.doesNotMatch(loader, /fallbackWhatsApp/)
  assert.doesNotMatch(loader, /catch\s*[{(]/)
  assert.match(loader, /const snapshots = await snapshotsApi\.publicList\(\)[\s\S]*return applySnapshots/)
  assert.match(snapshotsApi, /cache: 'no-store'/)
  assert.match(websiteApp, /loadId === latestLoad\.current/)
  assert.match(websiteApp, /if \(!content\)[\s\S]*<RouteProgress/)

  const blogPost = await readFile(new URL('../src/website/components/pages/BlogPostPage.jsx', import.meta.url), 'utf8')
  assert.match(blogPost, /usesCmsRecordContent/)
  assert.match(blogPost, /html=\{post\.content \|\| ''\}/)
})

test('mobile magazine loading shapes mirror the live carousel and article grid', async () => {
  const progress = await readFile(new URL('../src/website/components/shared/RouteProgress.jsx', import.meta.url), 'utf8')
  const layout = await readFile(new URL('../src/website/components/layout/WebsiteLayout.jsx', import.meta.url), 'utf8')

  assert.match(progress, /magazineNewsCount = 9, magazineArticleCount = 9/)
  assert.match(progress, /MagazineSkeleton newsCount=\{magazineNewsCount\} articleCount=\{magazineArticleCount\}/)
  assert.match(progress, /getVisibleCardCount\(articleCount, getMagazinePostsPerPage\(\)\)/)
  assert.match(layout, /magazineNewsCount=\{magazineContent\.news\.items\.length\}/)
  assert.match(layout, /magazineArticleCount=\{magazineContent\.articles\.items\.length\}/)
})

test('opening an unread CMS message persists it as read', async () => {
  const messages = await readFile(new URL('../src/cms/components/sections/MessagesSection.jsx', import.meta.url), 'utf8')

  assert.match(messages, /const openMessage = \(message\) =>/)
  assert.match(messages, /message\.unread && !isPending\(message\.id\)[^\n]+setUnread\(message\.id, false\)/)
  assert.match(messages, /onClick=\{\(\) => openMessage\(message\)\}/)
  assert.doesNotMatch(messages, /content\.(?:selectDescription|noMessagesDescription)/)
})

test('CMS record and media deletions provide a five-second undo window', async () => {
  const toast = await readFile(new URL('../src/cms/utils/toast.js', import.meta.url), 'utf8')
  const undoDelete = await readFile(new URL('../src/cms/utils/undoDelete.js', import.meta.url), 'utf8')
  const media = await readFile(new URL('../src/cms/components/pages/MediaLibraryPage.jsx', import.meta.url), 'utf8')
  const opportunities = await readFile(new URL('../src/cms/components/pages/OpportunitiesPage.jsx', import.meta.url), 'utf8')

  assert.match(toast, /showDeleteUndoToast/)
  assert.match(toast, /remaining = 5/)
  assert.match(toast, /setTimeout[\s\S]*5000/)
  assert.match(undoDelete, /deleteLocalizedSnapshotItemWithUndo/)
  assert.match(undoDelete, /showDeleteUndoToast\(\{ onUndo: restore, onCommit: commit \}\)/)
  assert.match(media, /deleteWithUndo\(\{[\s\S]*commit:[\s\S]*removeUpload/)
  assert.match(opportunities, /deleteWithUndo\(\{ remove: \(\) => removePost\(card\), restore: \(\) => restorePost/)
  assert.deepEqual(Object.keys(dariDashboard.operationNotifications).sort(), Object.keys(pashtoDashboard.operationNotifications).sort())
  assert.deepEqual(Object.keys(dariDashboard.operationNotifications).sort(), Object.keys(englishDashboard.operationNotifications).sort())
})

test('media library actions persist immediately without the draft save control', async () => {
  const media = await readFile(new URL('../src/cms/components/pages/MediaLibraryPage.jsx', import.meta.url), 'utf8')
  const unsavedChanges = await readFile(new URL('../src/cms/components/UnsavedChangesBar.jsx', import.meta.url), 'utf8')

  assert.match(media, /await uploadFile\(/)
  assert.match(media, /removeUpload\(item\.id\)/)
  assert.match(media, /border-admin-brand bg-admin-brand/)
  assert.match(media, /hover:bg-admin-brand-hover/)
  assert.match(unsavedChanges, /const routeSavesImmediately = \(\) => \['media', 'messages'\]\.includes\(getCmsRouteKey\(window\.location\.pathname\)\)/)
  assert.equal(unsavedChanges.match(/routeSavesImmediately\(\)/g)?.length, 2)
})

test('media preview uses the shared blurred backdrop and freezes the page', async () => {
  const media = await readFile(new URL('../src/cms/components/pages/MediaLibraryPage.jsx', import.meta.url), 'utf8')

  assert.match(media, /className="cms-modal-backdrop/)
  assert.match(media, /document\.documentElement\.style\.overflow = 'hidden'/)
  assert.match(media, /document\.documentElement\.classList\.add\('cms-modal-open'\)/)
  assert.match(media, /className="absolute inset-0 border-0 bg-transparent"/)
  assert.doesNotMatch(media, /bg-black\/70 backdrop-blur-md/)
})

test('CMS record action groups share their dark-mode edit treatment', async () => {
  const actions = await readFile(new URL('../src/cms/components/RecordActionButtons.jsx', import.meta.url), 'utf8')
  const consumers = await Promise.all([
    '../src/cms/components/pages/OpportunitiesPage.jsx',
    '../src/cms/components/sections/ScholarshipsEditorSection.jsx',
    '../src/cms/components/sections/MagazineEditorSection.jsx',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')))

  assert.match(actions, /dark:text-\[color-mix\(in_srgb,var\(--admin-brand\)_55%,white\)\]/)
  assert.match(actions, /dark:hover:text-\[color-mix\(in_srgb,var\(--admin-brand\)_30%,white\)\]/)
  consumers.forEach((source) => assert.match(source, /RecordActionButtons/))
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
