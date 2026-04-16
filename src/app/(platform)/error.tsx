'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function PlatformError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[platform error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
        <div>
          <h1 className="text-lg font-semibold text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-mono break-all">
            {error.message}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/60 mt-1">Digest: {error.digest}</p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/login'}
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  )
}
