export const CMS_PERMISSIONS = Object.freeze({
  VIEW_DASHBOARD: 'dashboard.view',
  MANAGE_CONTENT: 'content.manage',
  MANAGE_MESSAGES: 'messages.manage',
  MANAGE_MEDIA: 'media.manage',
  MANAGE_SETTINGS: 'settings.manage',
  MANAGE_PROFILE: 'profile.manage',
})

export const CMS_ROUTE_PERMISSIONS = Object.freeze({
  overview: CMS_PERMISSIONS.VIEW_DASHBOARD,
  home: CMS_PERMISSIONS.MANAGE_CONTENT,
  about: CMS_PERMISSIONS.MANAGE_CONTENT,
  contact: CMS_PERMISSIONS.MANAGE_CONTENT,
  opportunities: CMS_PERMISSIONS.MANAGE_CONTENT,
  tourism: CMS_PERMISSIONS.MANAGE_CONTENT,
  scholarships: CMS_PERMISSIONS.MANAGE_CONTENT,
  services: CMS_PERMISSIONS.MANAGE_CONTENT,
  magazine: CMS_PERMISSIONS.MANAGE_CONTENT,
  messages: CMS_PERMISSIONS.MANAGE_MESSAGES,
  media: CMS_PERMISSIONS.MANAGE_MEDIA,
  settings: CMS_PERMISSIONS.MANAGE_SETTINGS,
  profile: CMS_PERMISSIONS.MANAGE_PROFILE,
})

export const ALL_CMS_PERMISSIONS = Object.freeze([...new Set(Object.values(CMS_PERMISSIONS))])

export function normalizeSession(session) {
  if (!session?.user?.id) return null
  return {
    user: {
      id: String(session.user.id),
      name: String(session.user.name || ''),
      email: String(session.user.email || ''),
      role: String(session.user.role || 'editor'),
    },
    permissions: [...new Set((session.permissions || []).filter((permission) => ALL_CMS_PERMISSIONS.includes(permission)))],
  }
}

export function can(session, permission) {
  return Boolean(session && (!permission || session.permissions.includes(permission)))
}

export function canAccessCmsRoute(session, routeKey) {
  return can(session, CMS_ROUTE_PERMISSIONS[routeKey])
}
