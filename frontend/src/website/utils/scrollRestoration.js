export function getScrollStorageKey() {
  return `globalvision-scroll:${window.location.pathname}${window.location.search}`
}

export function readScrollPosition() {
  const stored = window.sessionStorage.getItem(getScrollStorageKey())
  if (!stored) return { top: 0, progress: 0, sectionIndex: null, sectionProgress: null }

  try {
    const value = JSON.parse(stored)
    if (typeof value === 'number') return { top: value, progress: null, sectionIndex: null, sectionProgress: null }
    return {
      top: Number.isFinite(value?.top) ? value.top : 0,
      progress: Number.isFinite(value?.progress) ? value.progress : null,
      sectionIndex: Number.isInteger(value?.sectionIndex) ? value.sectionIndex : null,
      sectionProgress: Number.isFinite(value?.sectionProgress) ? value.sectionProgress : null,
    }
  } catch {
    const top = Number(stored)
    return { top: Number.isFinite(top) ? top : 0, progress: null, sectionIndex: null, sectionProgress: null }
  }
}

function getPageSections(selector = 'main > section') {
  return [...document.querySelectorAll(selector)].filter((section) => section.offsetHeight > 0)
}

export function saveScrollPosition() {
  const scrollableHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const top = window.scrollY
  const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, top / scrollableHeight)) : 0
  const sections = getPageSections()
  const sectionIndex = sections.findIndex((section) => {
    const sectionTop = section.getBoundingClientRect().top + top
    return top >= sectionTop && top < sectionTop + section.offsetHeight
  })
  const section = sectionIndex >= 0 ? sections[sectionIndex] : null
  const sectionTop = section ? section.getBoundingClientRect().top + top : 0
  const sectionProgress = section ? Math.min(1, Math.max(0, (top - sectionTop) / section.offsetHeight)) : null
  window.sessionStorage.setItem(getScrollStorageKey(), JSON.stringify({ top, progress, sectionIndex: sectionIndex >= 0 ? sectionIndex : null, sectionProgress }))
}

export function restoreScrollPosition(mode = 'exact') {
  const saved = readScrollPosition()
  const scrollableHeight = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const skeletonSections = mode === 'section' ? getPageSections('[data-route-skeleton] > section') : []
  const savedSection = saved.sectionIndex === null ? null : skeletonSections[saved.sectionIndex]
  const top = savedSection && saved.sectionProgress !== null
    ? savedSection.getBoundingClientRect().top + window.scrollY + (saved.sectionProgress * savedSection.offsetHeight)
    : mode === 'proportional' && saved.progress !== null
      ? saved.progress * scrollableHeight
      : saved.top
  window.scrollTo({ top, behavior: 'auto' })
}

export function finishReloadScrollRestoration() {
  if (!isReloadNavigation()) return () => {}

  let firstFrame = 0
  let secondFrame = 0
  restoreScrollPosition('exact')

  firstFrame = window.requestAnimationFrame(() => {
    restoreScrollPosition('exact')
    secondFrame = window.requestAnimationFrame(() => {
      restoreScrollPosition('exact')
      window.clearTimeout(window.__globalVisionScrollRestoreFallback)
      delete window.__globalVisionScrollRestoreFallback
      delete document.documentElement.dataset.restoringScroll
      document.documentElement.style.removeProperty('min-height')
      document.documentElement.style.removeProperty('scroll-behavior')
    })
  })

  return () => {
    if (firstFrame) window.cancelAnimationFrame(firstFrame)
    if (secondFrame) window.cancelAnimationFrame(secondFrame)
  }
}

export function isReloadNavigation() {
  return window.performance.getEntriesByType('navigation')[0]?.type === 'reload'
}
