'use client'

import { Languages, Loader2, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

interface TranslateBannerProps {
  isTranslated: boolean
  isTranslating: boolean
  onTranslate: () => void
  onReset: () => void
  className?: string
}

export function TranslateBanner({
  isTranslated, isTranslating, onTranslate, onReset, className
}: TranslateBannerProps) {
  const { language } = useLanguage()

  if (language === 'en') return null

  return (
    <div className={cn('flex items-center gap-2 p-2.5 rounded-lg bg-[var(--obs-teal)]/8 border border-[var(--obs-teal)]/20', className)}>
      <Languages className="w-3.5 h-3.5 text-[var(--obs-teal)] flex-shrink-0" />
      <span className="text-xs text-muted-foreground flex-1">
        {isTranslated
          ? 'Contenido traducido al español · '
          : 'Este contenido proviene de fuentes en inglés · '}
        <button
          onClick={isTranslated ? onReset : onTranslate}
          disabled={isTranslating}
          className="text-[var(--obs-teal)] hover:underline font-medium disabled:opacity-50"
        >
          {isTranslating ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin inline" /> Traduciendo…
            </span>
          ) : isTranslated ? (
            <span className="inline-flex items-center gap-1">
              <RotateCcw className="w-3 h-3 inline" /> Ver original
            </span>
          ) : (
            'Traducir al español'
          )}
        </button>
      </span>
    </div>
  )
}
