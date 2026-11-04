import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(frontendRoot, 'dist')
const sitemap = await readFile(path.join(distRoot, 'sitemap.xml'), 'utf8')
const robots = await readFile(path.join(distRoot, 'robots.txt'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])

if (!urls.length || new Set(urls).size !== urls.length) throw new Error('Sitemap URLs must be present and unique.')
if (urls.some((url) => url.includes('/dashboard') || url.includes('/search'))) throw new Error('Sitemap contains a non-indexable route.')
if (!robots.includes('Disallow: /dashboard') || !robots.includes('Sitemap: https://')) throw new Error('robots.txt is missing required directives.')

for (const url of urls) {
  const parsed = new URL(url)
  const segments = parsed.pathname.split('/').filter(Boolean)
  const file = path.join(distRoot, ...segments, 'index.html')
  await access(file)
  const html = await readFile(file, 'utf8')
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const requiredPatterns = [
    /<title>[^<]+<\/title>/,
    /<meta name="description" content="[^"]+"/,
    /<meta name="robots" content="index, follow, max-image-preview:large"/,
    new RegExp(`<link rel="canonical" href="${escapedUrl}"`),
    /hreflang="fa-AF"/,
    /hreflang="ps-AF"/,
    /hreflang="en"/,
    /hreflang="x-default"/,
    /property="og:title"/,
    /name="twitter:card"/,
    /type="application\/ld\+json"/,
  ]
  if (requiredPatterns.some((pattern) => !pattern.test(html))) throw new Error(`Incomplete SEO snapshot: ${url}`)
  const schemaMatch = html.match(/<script type="application\/ld\+json" data-globalvision-schema>(.*?)<\/script>/s)
  JSON.parse(schemaMatch[1])
}

console.log(`Validated SEO metadata, structured data, robots.txt, and sitemap for ${urls.length} URLs.`)
