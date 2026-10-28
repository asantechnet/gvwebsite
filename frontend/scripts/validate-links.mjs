import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(projectRoot, 'src')
const websiteRoot = path.join(sourceRoot, 'website')
const publicRoot = path.join(projectRoot, 'public')

const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(websiteRoot, relativePath), 'utf8'))
const localeData = ['prs', 'ps', 'en'].map((locale) => ({
  locale,
  scholarships: readJson(`locales/${locale}/scholarships.json`),
  guides: readJson(`locales/${locale}/guides.json`),
  services: readJson(`locales/${locale}/services.json`),
  magazine: readJson(`locales/${locale}/magazine.json`),
  tourism: readJson(`locales/${locale}/tourism.json`),
}))

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(entryPath) : [entryPath]
  })
}

function collectStrings(value, key = '', results = []) {
  if (typeof value === 'string') results.push({ key, value })
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, key, results))
  else if (value && typeof value === 'object') Object.entries(value).forEach(([childKey, child]) => collectStrings(child, childKey, results))
  return results
}

function validInternalRoute(route, data) {
  const pathname = route.split(/[?#]/)[0].replace(/\/$/, '') || '/'
  const exactRoutes = ['/', '/about', '/contact', '/services', '/scholarships', '/magazine', '/search']
  if (exactRoutes.includes(pathname)) return true
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) return true
  if (/^\/opportunities\/(study|work|migration|investment|exams)$/.test(pathname)) return true
  if (/^\/tourism\/(afghanistan|world)$/.test(pathname)) return true

  const tourismMatch = pathname.match(/^\/tourism\/(afghanistan|world)\/([^/]+)$/)
  if (tourismMatch && data.tourism[tourismMatch[1]].cards.some((item) => item.slug === tourismMatch[2])) return true

  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/)
  if (serviceMatch && data.services.services.some((item) => item.slug === serviceMatch[1] || item.aliases?.includes(serviceMatch[1]))) return true

  const scholarshipMatch = pathname.match(/^\/scholarships\/([^/]+)$/)
  if (scholarshipMatch && data.scholarships.items.some((item) => item.slug === scholarshipMatch[1])) return true

  const countryMatch = pathname.match(/^\/opportunities\/(?:study|work|migration|investment)\/([^/]+)$/)
  if (countryMatch && data.guides.countries.some((item) => item.slug === countryMatch[1])) return true

  const examMatch = pathname.match(/^\/opportunities\/exams\/([^/]+)$/)
  if (examMatch && data.guides.exams.some((item) => item.slug === examMatch[1])) return true

  const postMatch = pathname.match(/^\/magazine\/post\/([^/]+)$/)
  return Boolean(postMatch && data.magazine.news.items.some((item) => item.slug === postMatch[1]))
}

const failures = []
const sourceFiles = walk(sourceRoot).filter((file) => /\.(jsx|js|json)$/.test(file))

for (const data of localeData) {
  const localeDirectory = path.join(websiteRoot, 'locales', data.locale)
  for (const file of walk(localeDirectory).filter((entry) => entry.endsWith('.json'))) {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    for (const { key, value } of collectStrings(parsed)) {
      if ((key === 'href' || key === 'officialHref') && (!value.trim() || value === '#' || /^javascript:/i.test(value))) {
        failures.push(`${data.locale}: empty or placeholder link ${JSON.stringify(value)} in ${path.relative(projectRoot, file)}`)
      }
      if ((key === 'href' || key === 'officialHref') && value.startsWith('/')) {
        if (!validInternalRoute(value, data)) failures.push(`${data.locale}: invalid route ${value} in ${path.relative(projectRoot, file)}`)
      }
      if ((key === 'href' || key === 'officialHref') && /^https?:/.test(value)) {
        try { assert.ok(new URL(value).hostname) } catch { failures.push(`${data.locale}: malformed URL ${value}`) }
      }
      if (value.startsWith('/assets/') && !fs.existsSync(path.join(publicRoot, value))) {
        failures.push(`${data.locale}: missing asset ${value} in ${path.relative(projectRoot, file)}`)
      }
    }
  }

  const generatedRoutes = [
    ...data.services.services.map((item) => `/services/${item.slug}`),
    ...data.scholarships.items.map((item) => `/scholarships/${item.slug}`),
    ...data.magazine.news.items.map((item) => `/magazine/post/${item.slug}`),
    ...data.tourism.afghanistan.cards.map((item) => `/tourism/afghanistan/${item.slug}`),
    ...data.tourism.world.cards.map((item) => `/tourism/world/${item.slug}`),
    ...data.guides.countries.flatMap((item) => ['study', 'work', 'migration', 'investment'].map((type) => `/opportunities/${type}/${item.slug}`)),
    ...data.guides.exams.map((item) => `/opportunities/exams/${item.slug}`),
  ]
  for (const route of generatedRoutes) {
    if (!validInternalRoute(route, data)) failures.push(`${data.locale}: invalid generated route ${route}`)
  }
}

for (const file of sourceFiles.filter((entry) => entry.endsWith('.jsx'))) {
  const source = fs.readFileSync(file, 'utf8')
  for (const match of source.matchAll(/(?:href|src)="(\/(?!\/)[^"]+)"/g)) {
    const value = match[1]
    if (value.startsWith('/assets/')) {
      if (!fs.existsSync(path.join(publicRoot, value))) failures.push(`missing asset ${value} in ${path.relative(projectRoot, file)}`)
    } else if (!validInternalRoute(value, localeData[0])) {
      failures.push(`invalid static route ${value} in ${path.relative(projectRoot, file)}`)
    }
  }
  if (/href=["']#["']/.test(source)) failures.push(`placeholder hash link in ${path.relative(projectRoot, file)}`)
  if (/href=["'](?:\s*|javascript:[^"']*)["']/i.test(source)) failures.push(`empty or unsafe static link in ${path.relative(projectRoot, file)}`)
}

assert.deepEqual(failures, [], failures.join('\n'))
console.log(`Validated localized links and assets across ${sourceFiles.length} frontend source files.`)
