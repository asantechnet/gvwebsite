import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const distDirectory = path.resolve('dist')
const html = await readFile(path.join(distDirectory, 'index.html'), 'utf8')
const entryMatch = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)

if (!entryMatch) throw new Error('Could not find the production JavaScript entry in dist/index.html.')

const initialJavaScriptFiles = new Set()

async function collectStaticImports(filePath) {
  const normalizedPath = path.normalize(filePath)
  if (initialJavaScriptFiles.has(normalizedPath)) return

  initialJavaScriptFiles.add(normalizedPath)
  const source = await readFile(normalizedPath, 'utf8')
  const importPattern = /\bfrom\s*["']([^"']+)["']|\bimport\s*["']([^"']+)["']/g

  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1] || match[2]
    if (!specifier.startsWith('.')) continue
    await collectStaticImports(path.resolve(path.dirname(normalizedPath), specifier))
  }
}

await collectStaticImports(path.join(distDirectory, entryMatch[1].replace(/^\//, '')))

const fileSizes = await Promise.all(
  [...initialJavaScriptFiles].map(async (filePath) => ({
    filePath,
    size: (await stat(filePath)).size,
  })),
)
const totalBytes = fileSizes.reduce((total, file) => total + file.size, 0)
const budgetBytes = 300 * 1024

if (totalBytes > budgetBytes) {
  const files = fileSizes
    .sort((left, right) => right.size - left.size)
    .map(({ filePath, size }) => `${path.relative(distDirectory, filePath)} (${(size / 1024).toFixed(2)} kB)`)
    .join(', ')

  throw new Error(`Initial JavaScript exceeds the 300 kB budget: ${(totalBytes / 1024).toFixed(2)} kB across ${files}.`)
}

console.log(`Validated initial JavaScript: ${(totalBytes / 1024).toFixed(2)} kB across ${fileSizes.length} static chunks.`)
