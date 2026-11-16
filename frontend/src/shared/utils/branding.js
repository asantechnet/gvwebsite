export const BRANDING_UPDATED_EVENT = 'globalvision:branding-updated'

const defaultCompanyNames = {
  prs: 'گلوبل ویژن',
  ps: 'ګلوبل ویژن',
  en: 'Global Vision',
}

const defaultBrandIcons = {
  light: '/assets/branding/icon.webp',
  dark: '/assets/branding/icon%20white.webp',
}

const defaultBrandLogos = {
  light: '/assets/branding/new%20logo.webp',
  dark: '/assets/branding/new%20logo%20white.webp',
}

const defaultBrandColors = {
  primary: '#f47e26',
  secondary: '#80027f',
}

export function normalizeBrandColor(value, fallback) {
  const normalized = String(value || '').trim().toUpperCase()
  if (/^#[0-9A-F]{6}$/.test(normalized)) return normalized

  const normalizedFallback = String(fallback || '').trim().toUpperCase()
  return /^#[0-9A-F]{6}$/.test(normalizedFallback) ? normalizedFallback : null
}

export function readCompanyNames() {
  try {
    return {
      ...defaultCompanyNames,
      ...JSON.parse(window.localStorage.getItem('globalvision-company-names') || '{}'),
    }
  } catch {
    return defaultCompanyNames
  }
}

export function readBrandIcon(theme) {
  const key = theme === 'dark' ? 'globalvision-brand-icon-dark' : 'globalvision-brand-icon-light'
  return window.localStorage.getItem(key) || defaultBrandIcons[theme === 'dark' ? 'dark' : 'light']
}

export function readBrandLogo(theme) {
  const key = theme === 'dark' ? 'globalvision-brand-logo-dark' : 'globalvision-brand-logo-light'
  return window.localStorage.getItem(key) || defaultBrandLogos[theme === 'dark' ? 'dark' : 'light']
}

export function applyBrandFavicon(icon) {
  const favicon = document.querySelector('link[rel="icon"]')
  if (favicon && icon) favicon.setAttribute('href', icon)
}

export function watchBrowserBrandFavicon(lightIcon, darkIcon) {
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
  const update = () => applyBrandFavicon(colorScheme.matches ? darkIcon : lightIcon)

  update()
  colorScheme.addEventListener('change', update)
  return () => colorScheme.removeEventListener('change', update)
}

export function readBrandColors() {
  return {
    primary: normalizeBrandColor(window.localStorage.getItem('globalvision-brand-primary'), defaultBrandColors.primary),
    secondary: normalizeBrandColor(window.localStorage.getItem('globalvision-brand-secondary'), defaultBrandColors.secondary),
  }
}

export function applyBrandColors({ primary, secondary }) {
  document.documentElement.style.setProperty('--brand-orange', primary)
  document.documentElement.style.setProperty('--brand-red', secondary)
  document.querySelectorAll('.cms-root').forEach((root) => {
    root.style.removeProperty('--brand-orange')
    root.style.removeProperty('--brand-red')
    root.style.removeProperty('--admin-brand')
  })
}
