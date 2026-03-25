'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/lib/i18n/translations'

export function useT() {
  const { language, setLanguage } = useLanguage()

  function t<K extends keyof typeof translations.en>(section: K): (typeof translations.en)[K] {
    return translations[language][section] as (typeof translations.en)[K]
  }

  return { t, language, setLanguage }
}
