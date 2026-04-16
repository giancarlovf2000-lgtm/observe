'use client'

/**
 * Client-only wrapper for OnboardingWizard.
 * ssr:false prevents React 19 hydration fatal crash caused by
 * framer-motion AnimatePresence diverging between server and client.
 */

import dynamic from 'next/dynamic'

const OnboardingWizard = dynamic(
  () => import('./OnboardingWizard').then(m => ({ default: m.OnboardingWizard })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm font-mono animate-pulse">
          Loading…
        </div>
      </div>
    ),
  }
)

export function OnboardingShell() {
  return <OnboardingWizard />
}
