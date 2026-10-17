export function getCurrentRoute() {
  const hashRoute = window.location.hash.startsWith('#/')
    ? window.location.hash.slice(1)
    : ''
  const routeUrl = new URL(hashRoute || window.location.pathname + window.location.search, window.location.origin)

  return {
    pathname: routeUrl.pathname.replace(/\/$/, '') || '/',
    searchParams: routeUrl.searchParams,
  }
}

export function toStaticHostHref(href) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/#')) {
    return href
  }

  return `/#${href}`
}
