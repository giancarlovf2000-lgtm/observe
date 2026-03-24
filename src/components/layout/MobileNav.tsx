'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, BookOpen, Bell, MoreHorizontal,
  Sword, Newspaper, TrendingUp, CloudLightning, Ship,
  Star, Folders, Settings, X, Globe,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PRIMARY_TABS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/briefings', icon: BookOpen, label: 'Briefings' },
  { href: '/alerts', icon: Bell, label: 'Alerts' },
]

const MORE_ITEMS = [
  { href: '/conflicts', icon: Sword, label: 'Conflicts' },
  { href: '/news', icon: Newspaper, label: 'News' },
  { href: '/markets', icon: TrendingUp, label: 'Markets' },
  { href: '/weather', icon: CloudLightning, label: 'Weather' },
  { href: '/transport', icon: Ship, label: 'Transport' },
  { href: '/watchlists', icon: Star, label: 'Watchlists' },
  { href: '/workspaces', icon: Folders, label: 'Workspaces' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function MobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isMoreActive = MORE_ITEMS.some(item => pathname.startsWith(item.href))

  return (
    <div className="md:hidden">
      {/* More sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 bg-[var(--obs-surface)] border-t border-border/40 rounded-t-2xl z-50"
              style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/15" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[var(--obs-teal)] flex items-center justify-center">
                    <Globe className="w-3.5 h-3.5 text-background" />
                  </div>
                  <span className="text-sm font-bold tracking-wider text-foreground uppercase">OBSERVE</span>
                </div>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of nav items */}
              <div className="grid grid-cols-4 gap-1 p-3">
                {MORE_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all active:scale-95',
                        isActive
                          ? 'bg-[var(--obs-teal)]/12 text-[var(--obs-teal)]'
                          : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-[var(--obs-surface)]/95 backdrop-blur-xl border-t border-border/40 z-30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex h-16">
          {PRIMARY_TABS.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== '/dashboard' && pathname.startsWith(tab.href))
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 active:opacity-60 transition-opacity"
              >
                <div
                  className={cn(
                    'w-11 h-6 rounded-full flex items-center justify-center transition-all',
                    isActive ? 'bg-[var(--obs-teal)]/20' : ''
                  )}
                >
                  <tab.icon
                    className={cn(
                      'w-[18px] h-[18px] transition-colors',
                      isActive ? 'text-[var(--obs-teal)]' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-[var(--obs-teal)]' : 'text-muted-foreground'
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}

          {/* More */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex-1 flex flex-col items-center justify-center gap-1 active:opacity-60 transition-opacity"
          >
            <div
              className={cn(
                'w-11 h-6 rounded-full flex items-center justify-center transition-all',
                isMoreActive || moreOpen ? 'bg-[var(--obs-teal)]/20' : ''
              )}
            >
              <MoreHorizontal
                className={cn(
                  'w-[18px] h-[18px] transition-colors',
                  isMoreActive || moreOpen ? 'text-[var(--obs-teal)]' : 'text-muted-foreground'
                )}
              />
            </div>
            <span
              className={cn(
                'text-[10px] font-medium transition-colors',
                isMoreActive || moreOpen ? 'text-[var(--obs-teal)]' : 'text-muted-foreground'
              )}
            >
              More
            </span>
          </button>
        </div>
      </nav>
    </div>
  )
}
