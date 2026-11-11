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
