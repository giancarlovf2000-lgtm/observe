'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-[var(--obs-teal)] flex items-center justify-center glow-teal">
            <Globe className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold text-foreground tracking-wider text-sm uppercase">
            OBSERVE
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', href: '#features' },
            { label: 'Intelligence Layers', href: '#layers' },
            { label: 'How It Works', href: '#how' },
            { label: 'Pricing', href: '#pricing' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
            Log in
          </Link>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: 'sm' }), 'bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 glow-teal font-medium')}
          >
            Get Access
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-t border-white/5 px-6 py-4 space-y-3"
          >
            {[
              { label: 'Features', href: '#features' },
              { label: 'Intelligence Layers', href: '#layers' },
              { label: 'How It Works', href: '#how' },
              { label: 'Pricing', href: '#pricing' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex gap-3">
              <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex-1')}>
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: 'sm' }), 'flex-1 bg-[var(--obs-teal)] text-background')}
              >
                Get Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
