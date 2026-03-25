'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Language = 'en' | 'es'

const LS_KEY = 'observe-language'

interface LanguageCtx {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageCtx>({
  language: 'en',
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('en')

  // Load persisted choice after mount (localStorage unavailable on server)
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY) as Language | null
    if (saved === 'en' || saved === 'es') setLang(saved)
  }, [])

  function setLanguage(lang: Language) {
    setLang(lang)
    localStorage.setItem(LS_KEY, lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
