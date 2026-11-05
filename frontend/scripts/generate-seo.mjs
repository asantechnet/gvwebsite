import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(frontendRoot, 'dist')
const localeRoots = { dr: 'prs', ps: 'ps', en: 'en' }
const languageDetails = {
  dr: { htmlLang: 'fa-AF', direction: 'rtl', hreflang: 'fa-AF', ogLocale: 'fa_AF' },
  ps: { htmlLang: 'ps-AF', direction: 'rtl', hreflang: 'ps-AF', ogLocale: 'ps_AF' },
  en: { htmlLang: 'en', direction: 'ltr', hreflang: 'en', ogLocale: 'en_US' },
}
const siteOrigin = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://globalvision.af').replace(/\/$/, '')
const cmsApiUrl = (process.env.CMS_API_URL || '').replace(/\/$/, '')
const logo = `${siteOrigin}/assets/branding/new%20logo.webp`

const readJson = async (language, name) => JSON.parse(await readFile(path.join(frontendRoot, 'src/website/locales', localeRoots[language], `${name}.json`), 'utf8'))
const escapeHtml = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const absolute = (value) => value ? new URL(value, `${siteOrigin}/`).href : logo
const localizedUrl = (language, route) => `${siteOrigin}/${language}${route === '/' ? '' : route}`
const format = (pattern, values) => pattern.replace(/\{(\w+)\}/g, (token, key) => values[key] ?? token)

const snapshotPromise = cmsApiUrl
  ? fetch(`${cmsApiUrl}/site/snapshots`, { headers: { Accept: 'application/json' } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`Snapshot API returned ${response.status}`)))
      .then((payload) => new Map((payload.data || []).map((snapshot) => [snapshot.key, snapshot.payload])))
  : Promise.resolve(new Map())

const localizedRecords = (records, locale) => (records || [])
  .filter((record) => record.status !== 'draft' && record.translations?.[locale])
  .map((record) => ({ ...record, ...record.translations[locale], description: record.translations[locale].excerpt || record.description || '' }))

async function getRoutes(language) {
  let [header, home, about, contact, magazine, scholarships, opportunities, guides, services, search, tourism] = await Promise.all(
    ['header', 'home', 'about', 'contact', 'magazine', 'scholarships', 'opportunities', 'guides', 'services', 'search', 'tourism'].map((name) => readJson(language, name)),
  )
  const snapshots = await snapshotPromise
  const locale = localeRoots[language]
  home = snapshots.get('home')?.[locale] || home
  about = snapshots.get('about')?.[locale] || about
  contact = snapshots.get('contact')?.[locale] || contact
  magazine = snapshots.get('magazine')?.[locale] || magazine
  scholarships = snapshots.get('scholarships')?.[locale] || scholarships
  const savedServices = localizedRecords(snapshots.get('collection:services'), locale)
  if (savedServices.length) services = { ...services, services: savedServices }
  for (const record of localizedRecords(snapshots.get('collection:opportunities'), locale)) {
    if (opportunities[record.type]?.post) opportunities[record.type].post = { ...opportunities[record.type].post, ...record }
  }
  for (const type of Object.keys(tourism)) {
    const records = localizedRecords(snapshots.get('collection:tourism'), locale).filter((record) => record.type === type)
    if (records.length) tourism[type].cards = records.map((record) => ({ ...record, name: record.title }))
  }
  const routes = [
    { route: '/', title: header.navigation.home, description: home.hero.description },
    { route: '/about', title: header.navigation.about, description: about.introduction.description },
    { route: '/contact', title: header.navigation.contact, description: contact.contact.form.description },
    { route: '/services', title: services.ui.indexTitle, description: services.ui.indexDescription },
    { route: '/scholarships', title: scholarships.hero.title, description: scholarships.hero.description },
    { route: '/magazine', title: header.navigation.magazine, description: magazine.hero.description || search.description },
  ]

  for (const type of ['study', 'work', 'migration', 'investment']) {
    const opportunity = opportunities[type]
    routes.push({ route: `/opportunities/${type}`, title: opportunity.post.category, description: opportunity.post.description, image: opportunity.post.image })
    for (const country of guides.countries) {
      routes.push({
        route: `/opportunities/${type}/${country.slug}`,
        title: format(header.pageTitles.opportunityInCountry, { opportunity: opportunity.post.category, country: country.name }),
        description: country.summary || opportunity.post.description,
        image: country.image || opportunity.post.image,
      })
    }
  }
  for (const exam of guides.exams) routes.push({ route: `/opportunities/exams/${exam.slug}`, title: exam.name, description: exam.summary, image: exam.image })
  for (const [type, directory] of Object.entries(tourism)) {
    routes.push({ route: `/tourism/${type}`, title: directory.post.title, description: directory.post.description, image: directory.post.image })
    for (const card of directory.cards) routes.push({ route: `/tourism/${type}/${card.slug}`, title: format(header.pageTitles.tourismInDestination, { destination: card.name }), description: card.description, image: card.image })
  }
  for (const service of services.services) routes.push({ route: `/services/${service.slug}`, title: service.title, description: service.description, image: service.image, schemaType: 'Service' })
  for (const scholarship of scholarships.items) routes.push({ route: `/scholarships/${scholarship.slug}`, title: scholarship.title, description: scholarship.summary, image: scholarship.image })
  for (const post of magazine.news.items) routes.push({ route: `/magazine/post/${post.slug}`, title: post.title, description: post.description, image: post.image, schemaType: 'BlogPosting', datePublished: post.date })

  return { brandName: header.brandName, homeName: header.navigation.home, routes }
}

function metadataMarkup({ language, brandName, homeName, record }) {
  const details = languageDetails[language]
  const canonical = localizedUrl(language, record.route)
  const title = record.title.includes(brandName) ? record.title : `${record.title} | ${brandName}`
  const image = absolute(record.image)
  const alternates = Object.entries(languageDetails).map(([id, item]) => `<link rel="alternate" hreflang="${item.hreflang}" href="${localizedUrl(id, record.route)}" />`).join('\n    ')
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${siteOrigin}/#organization`, name: brandName, url: `${siteOrigin}/`, logo: { '@type': 'ImageObject', url: logo } },
      { '@type': 'WebSite', '@id': `${siteOrigin}/#website`, name: brandName, url: `${siteOrigin}/`, inLanguage: details.htmlLang, publisher: { '@id': `${siteOrigin}/#organization` } },
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, name: record.title, description: record.description, url: canonical, inLanguage: details.htmlLang, isPartOf: { '@id': `${siteOrigin}/#website` } },
      ...(record.route === '/' ? [] : [{ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: homeName, item: localizedUrl(language, '/') }, { '@type': 'ListItem', position: 2, name: record.title, item: canonical }] }]),
      ...(record.schemaType === 'Service' ? [{ '@type': 'Service', name: record.title, description: record.description, url: canonical, provider: { '@id': `${siteOrigin}/#organization` }, areaServed: 'AF' }] : []),
      ...(record.schemaType === 'BlogPosting' ? [{ '@type': 'BlogPosting', headline: record.title, description: record.description, url: canonical, image, inLanguage: details.htmlLang, ...(record.datePublished ? { datePublished: record.datePublished } : {}), publisher: { '@id': `${siteOrigin}/#organization` } }] : []),
    ],
  }

  return {
    details,
    title,
    head: `<meta name="description" content="${escapeHtml(record.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    ${alternates}
    <link rel="alternate" hreflang="x-default" href="${localizedUrl('dr', record.route)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(record.description)}" />
    <meta property="og:type" content="${record.schemaType === 'BlogPosting' ? 'article' : 'website'}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:locale" content="${details.ogLocale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(record.description)}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json" data-globalvision-schema>${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`,
  }
}

function renderRouteHtml(template, language, brandName, homeName, record) {
  const { details, title, head } = metadataMarkup({ language, brandName, homeName, record })
  return template
    .replace(/<html[^>]*>/, `<html lang="${details.htmlLang}" dir="${details.direction}" data-language="${language}">`)
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript><main><h1>${escapeHtml(record.title)}</h1><p>${escapeHtml(record.description)}</p></main></noscript>`)
}

async function main() {
  const template = await readFile(path.join(distRoot, 'index.html'), 'utf8')
  const sitemapEntries = []

  for (const language of Object.keys(languageDetails)) {
    const { brandName, homeName, routes } = await getRoutes(language)
    for (const record of routes) {
      const outputDirectory = path.join(distRoot, language, ...record.route.split('/').filter(Boolean))
      await mkdir(outputDirectory, { recursive: true })
      await writeFile(path.join(outputDirectory, 'index.html'), renderRouteHtml(template, language, brandName, homeName, record))
      sitemapEntries.push({ language, route: record.route })
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.map(({ language, route }) => `  <url>
    <loc>${localizedUrl(language, route)}</loc>
${Object.entries(languageDetails).map(([id, details]) => `    <xhtml:link rel="alternate" hreflang="${details.hreflang}" href="${localizedUrl(id, route)}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl('dr', route)}" />
  </url>`).join('\n')}
</urlset>
`
  const robots = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /dr/search
Disallow: /ps/search
Disallow: /en/search

Sitemap: ${siteOrigin}/sitemap.xml
`
  await Promise.all([
    writeFile(path.join(distRoot, 'sitemap.xml'), sitemap),
    writeFile(path.join(distRoot, 'robots.txt'), robots),
    writeFile(path.join(distRoot, 'route-manifest.json'), JSON.stringify([...new Set(sitemapEntries.map(({ language, route }) => `/${language}${route === '/' ? '' : route}`))].sort(), null, 2)),
  ])
  console.log(`Generated SEO snapshots for ${sitemapEntries.length} localized URLs using ${siteOrigin}`)
}

await main()
