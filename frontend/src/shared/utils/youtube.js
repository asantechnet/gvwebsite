const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/

export function normalizeYouTubeId(value = '') {
  const input = String(value).trim()
  if (youtubeIdPattern.test(input)) return input

  try {
    const url = new URL(input)
    const host = url.hostname.toLocaleLowerCase().replace(/^www\./, '')
    let candidate = ''

    if (host === 'youtu.be') candidate = url.pathname.split('/').filter(Boolean)[0] || ''
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      candidate = url.searchParams.get('v') || ''
      if (!candidate) {
        const [kind, id] = url.pathname.split('/').filter(Boolean)
        if (['embed', 'shorts', 'live'].includes(kind)) candidate = id || ''
      }
    }

    return youtubeIdPattern.test(candidate) ? candidate : ''
  } catch {
    return ''
  }
}

export function getYouTubeThumbnail(youtubeId = '') {
  return youtubeIdPattern.test(youtubeId)
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : ''
}
