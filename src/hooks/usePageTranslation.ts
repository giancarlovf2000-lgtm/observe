'use client'

import { useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export function usePageTranslation<T extends Record<string, string | null | undefined>>(items: T[]) {
  const { language }              = useLanguage()
  const [translated, setTranslated] = useState<T[] | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const translate = useCallback(async () => {
    if (language === 'en' || isTranslating) return
    setIsTranslating(true)

    try {
      // Collect all non-null string fields across items
      const fields = Object.keys(items[0] ?? {}) as (keyof T)[]
      const textFields = fields.filter(f =>
        items.some(item => typeof item[f] === 'string' && item[f])
      )

      // Flatten all texts for batch translation
      const allTexts: string[] = []
      const indexMap: Array<{ itemIdx: number; field: keyof T }> = []

      for (let i = 0; i < items.length; i++) {
        for (const field of textFields) {
          const val = items[i][field]
          if (typeof val === 'string' && val) {
            allTexts.push(val)
            indexMap.push({ itemIdx: i, field })
          }
        }
      }

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: allTexts, language }),
      })
      const { translations } = await res.json()

      // Rebuild items with translated text
      const copy = items.map(item => ({ ...item }))
      for (let j = 0; j < indexMap.length; j++) {
        const { itemIdx, field } = indexMap[j]
        if (translations[j]) (copy[itemIdx] as Record<keyof T, unknown>)[field] = translations[j]
      }
      setTranslated(copy)
    } catch {
      // silent fail — keep original
    } finally {
      setIsTranslating(false)
    }
  }, [items, language, isTranslating])

  const reset = useCallback(() => setTranslated(null), [])

  return {
    items: translated ?? items,
    isTranslating,
    isTranslated: translated !== null,
    translate,
    reset,
    language,
  }
}
