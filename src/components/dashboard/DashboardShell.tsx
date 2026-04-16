'use client'

/**
 * Thin client wrapper around DashboardClient.
 * Uses ssr:false so framer-motion / complex hooks never hydrate from the
 * server — React 19 treats hydration mismatches as fatal tree unmounts
 * (showing a black screen). Client-only rendering avoids that entirely.
 */

import dynamic from 'next/dynamic'
import type { DashboardClientProps } from './DashboardClient'

const DashboardClient = dynamic<DashboardClientProps>(
  () => import('./DashboardClient').then(m => ({ default: m.DashboardClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground text-sm font-mono animate-pulse">
          Loading command center…
        </div>
      </div>
    ),
  }
)

export function DashboardShell(props: DashboardClientProps) {
  return <DashboardClient {...props} />
}
