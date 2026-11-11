import { isCmsPath } from './routes.js'

export const CMS_NAVIGATION_EVENT = 'globalvision:cms-navigation'

export function navigateCms(href, { replace = false } = {}) {
  const url = new URL(href, window.location.href)

  if (url.origin !== window.location.origin || !isCmsPath(url.pathname)) {
    window.location.assign(url.href)
    return
  }

  const destination = `${url.pathname}${url.search}${url.hash}`
  if (destination === `${window.location.pathname}${window.location.search}${window.location.hash}`) return

  window.history[replace ? 'replaceState' : 'pushState'](window.history.state, '', destination)
  window.dispatchEvent(new CustomEvent(CMS_NAVIGATION_EVENT, { detail: { destination } }))
}
