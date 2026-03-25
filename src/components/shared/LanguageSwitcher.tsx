'use client'

import { useLanguageStore, type Language } from '@/store/languageStore'
import { cn } from '@/lib/utils'

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <div className="flex items-center gap-0.5 bg-[var(--obs-surface-elevated)] border border-border/40 rounded-lg p-0.5">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all',
            language === lang.code
              ? 'bg-[var(--obs-teal)]/20 text-[var(--obs-teal)] border border-[var(--obs-teal)]/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          )}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  )
}
