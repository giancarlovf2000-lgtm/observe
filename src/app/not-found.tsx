import Link from 'next/link'
import { Globe, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--obs-teal)]/5 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6 max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-[var(--obs-teal)]/10 border border-[var(--obs-teal)]/20 flex items-center justify-center mx-auto">
          <Globe className="w-7 h-7 text-[var(--obs-teal)]" />
        </div>

        <div className="space-y-2">
          <div className="text-6xl font-bold font-mono text-foreground/20">404</div>
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--obs-teal)] text-background text-sm font-medium hover:bg-[var(--obs-teal)]/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/50 text-foreground text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
