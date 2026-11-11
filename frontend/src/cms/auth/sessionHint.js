const CMS_SESSION_HINT_KEY = 'globalvision-cms-session-active'

export function hasCmsSessionHint() {
  return window.sessionStorage.getItem(CMS_SESSION_HINT_KEY) === 'true'
}

export function setCmsSessionHint(active) {
  if (active) window.sessionStorage.setItem(CMS_SESSION_HINT_KEY, 'true')
  else window.sessionStorage.removeItem(CMS_SESSION_HINT_KEY)
}
