export function getScrollStorageKey() {
  return `globalvision-scroll:${window.location.pathname}${window.location.search}`
}

export function readScrollPosition() {
  const stored = window.sessionStorage.getItem(getScrollStorageKey())
  if (!stored) return { top: 0, progress: 0 }

  try {
    const value = JSON.parse(stored)
    if (typeof value === 'number') return { top: value, progress: null }
    return {
      top: Number.isFinite(value?.top) ? value.top : 0,
      progress: Number.isFinite(value?.progress) ? value.progress : null,
    }
  } catch {
    const top = Number(stored)
    return { top: Number.isFinite(top) ? top : 0, progress: null }
  }
}

export function saveScrollPosition() {
  const scrollableHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const top = window.scrollY
  const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, top / scrollableHeight)) : 0
  window.sessionStorage.setItem(getScrollStorageKey(), JSON.stringify({ top, progress }))
}

export function restoreScrollPosition(mode = 'exact') {
  const saved = readScrollPosition()
  const scrollableHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const top = mode === 'proportional' && saved.progress !== null
    ? saved.progress * scrollableHeight
    : saved.top
  window.scrollTo({ top, behavior: 'auto' })
}

export function isReloadNavigation() {
  return window.performance.getEntriesByType('navigation')[0]?.type === 'reload'
}
