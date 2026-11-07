import { createContext, createElement, useContext, useState } from 'react'

const supportedLanguages = new Set(['prs', 'ps', 'en'])
const CmsLanguageContext = createContext('prs')

export function CmsLanguageProvider({ language, children }) {
  const resolvedLanguage = supportedLanguages.has(language) ? language : 'prs'
  return createElement(CmsLanguageContext.Provider, { value: resolvedLanguage }, children)
}

export function useCmsInterfaceLanguage() {
  return useContext(CmsLanguageContext)
}

export function useCmsContentLanguage(initialLanguage) {
  const interfaceLanguage = useCmsInterfaceLanguage()
  const [selection, setSelection] = useState(() => ({
    interfaceLanguage,
    language: supportedLanguages.has(initialLanguage) ? initialLanguage : interfaceLanguage,
  }))
  const contentLanguage = selection.interfaceLanguage === interfaceLanguage ? selection.language : interfaceLanguage
  const setContentLanguage = (nextLanguage) => setSelection((current) => ({
    interfaceLanguage,
    language: typeof nextLanguage === 'function' ? nextLanguage(current.language) : nextLanguage,
  }))

  return [contentLanguage, setContentLanguage]
}
