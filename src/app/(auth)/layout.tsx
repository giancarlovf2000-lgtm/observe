import Link from 'next/link'
import { Globe } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--obs-teal)]/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-[var(--obs-purple)]/5 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-[var(--obs-teal)] flex items-center justify-center">
            <Globe className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold text-sm tracking-wider uppercase text-foreground">
            OBSERVE
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  )
}
