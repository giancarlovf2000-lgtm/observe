'use client'

import { useLanguageStore } from '@/store/languageStore'
import { translations } from '@/lib/i18n/translations'

type DeepValue<T> = T extends string
  ? string
  : T extends Record<string, unknown>
  ? { [K in keyof T]: DeepValue<T[K]> }
  : never

export function useT() {
  const language = useLanguageStore((s) => s.language)
  const dict = translations[language] as typeof translations.en

  /** Type-safe section accessor — e.g. t('nav'), t('dashboard'), etc. */
  function t<K extends keyof typeof translations.en>(section: K): (typeof translations.en)[K] {
    return (dict as typeof translations.en)[section]
  }

  return { t, language }
}
