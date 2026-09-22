import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { content, ui, metadata, isLanguage, resolveLanguage, storageKey } from './locales.js'
const LanguageContext = createContext(null)
function readLanguage() {
  if (typeof window === 'undefined') return 'bs'
  let saved
  try { saved = window.localStorage.getItem(storageKey) } catch { /* Storage can be disabled. */ }
  return resolveLanguage(new URL(window.location.href).searchParams.get('lang'), saved)
}
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readLanguage)
  const setLanguage = useCallback((next) => {
    if (!isLanguage(next)) return
    setLanguageState(next)
    const url = new URL(window.location.href)
    url.searchParams.set('lang', next)
    if (url.href !== window.location.href) window.history.pushState(null, '', url)
  }, [])
  useEffect(() => {
    const sync = () => setLanguageState(readLanguage())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  useEffect(() => {
    document.documentElement.lang = language
    const meta = metadata[language]
    document.title = meta.title
    const setMeta = (attribute, name, value) => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.appendChild(element) }
      element.content = value
    }
    setMeta('name', 'description', meta.description)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:locale', meta.locale)
    try { window.localStorage.setItem(storageKey, language) } catch { /* The switch still works without persistence. */ }
  }, [language])
  const value = useMemo(() => ({ language, setLanguage, ...content[language], ui: ui[language] }), [language, setLanguage])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
