export const CMS_ROUTE_KEYS = [
  'home',
  'about',
  'contact',
  'opportunities',
  'tourism',
  'scholarships',
  'services',
  'magazine',
  'messages',
  'media',
  'settings',
  'profile',
]

export const CMS_PATHS = Object.freeze({
  overview: '/dashboard',
  ...Object.fromEntries(CMS_ROUTE_KEYS.map((key) => [key, `/dashboard/${key}`])),
})

export function isCmsPath(pathname) {
  return pathname === CMS_PATHS.overview || pathname.startsWith(`${CMS_PATHS.overview}/`)
}

export function getCmsRouteKey(pathname) {
  if (pathname === CMS_PATHS.overview || pathname === `${CMS_PATHS.overview}/`) return 'overview'

  const routeKey = pathname.slice(`${CMS_PATHS.overview}/`.length).split('/')[0]
  return CMS_ROUTE_KEYS.includes(routeKey) ? routeKey : 'placeholder'
}

export function getCmsHref(routeKey) {
  return CMS_PATHS[routeKey] || `${CMS_PATHS.overview}/${routeKey}`
}
