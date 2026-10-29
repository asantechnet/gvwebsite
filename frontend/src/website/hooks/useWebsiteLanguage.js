import { createContext, useContext } from 'react'
import { localizeHref } from '@website/utils/language.js'

export const WebsiteLanguageContext = createContext('dr')

export default function useWebsiteLanguage() {
  return useContext(WebsiteLanguageContext)
}

export function useLocalizedHref(href) {
  return localizeHref(href, useWebsiteLanguage())
}
