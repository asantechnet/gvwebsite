export const CMS_DRAFT_DIRTY_EVENT = 'cms:draft-dirty'
export const CMS_CHANGES_SAVED_EVENT = 'cms:changes-saved'
export const CMS_CHANGES_DISCARDED_EVENT = 'cms:changes-discarded'
export const CMS_DRAFT_STORAGE_PREFIX = 'globalvision-cms-draft:'

export function announceCmsDraftChange() {
  window.dispatchEvent(new Event(CMS_DRAFT_DIRTY_EVENT))
}

export function getCmsDraftStorageKey(scope) {
  return `${CMS_DRAFT_STORAGE_PREFIX}${scope}`
}

export function hasRecoverableCmsDraft(routeKey) {
  const routeStorageKeys = [
    getCmsDraftStorageKey(routeKey),
    getCmsDraftStorageKey(`collection:${routeKey}`),
  ]
  for (let index = 0; index < window.localStorage.length; index += 1) {
    if (routeStorageKeys.includes(window.localStorage.key(index))) return true
  }
  return false
}
