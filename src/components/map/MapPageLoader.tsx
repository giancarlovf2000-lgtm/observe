'use client'

import dynamic from 'next/dynamic'

const MapPageClient = dynamic(
  () => import('./MapPageClient').then(m => m.MapPageClient),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex h-full overflow-hidden items-center justify-center bg-[#080c10]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--obs-teal)] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Initializing map…</span>
        </div>
      </div>
    ),
  }
)

export function MapPageLoader() {
  return <MapPageClient />
}
