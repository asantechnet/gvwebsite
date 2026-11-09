export const seedMedia = [
  ['/assets/images/home/hero-globe.webp', 'hero-globe.webp', 'image'],
  ['/assets/images/destinations/germany.webp', 'germany.webp', 'image'],
  ['/assets/images/destinations/turkiye.webp', 'turkiye.webp', 'image'],
  ['/assets/images/destinations/italy.webp', 'italy.webp', 'image'],
  ['/assets/images/destinations/france.webp', 'france.webp', 'image'],
  ['/assets/images/destinations/netherlands.webp', 'netherlands.webp', 'image'],
  ['/assets/images/team/murtaza.webp', 'murtaza.webp', 'image'],
  ['/assets/branding/new logo.webp', 'global-vision-logo.webp', 'image'],
].map(([url, name, type], index) => ({ id: `seed-${index}`, url, name, type, meta: 'Image', local: false }))

export const formatMediaBytes = (size = 0) => size < 1024 * 1024
  ? `${Math.max(0.1, size / 1024).toFixed(1)} KB`
  : `${(size / 1024 / 1024).toFixed(1)} MB`

export const getMediaType = (name = '') => /\.(mp4|webm|ogg|mov)$/i.test(name)
  ? 'video'
  : /\.(mp3|wav|m4a|aac|flac)$/i.test(name)
    ? 'audio'
    : /\.pdf$/i.test(name) ? 'file' : 'image'

export const getMediaFormat = (name = '', type = '') => {
  const extension = name.match(/\.([a-z0-9]+)$/i)?.[1]
  return (extension || type || 'file').toUpperCase()
}
