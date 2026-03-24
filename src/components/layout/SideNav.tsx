'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, LayoutDashboard, Map, BookOpen, Star, Bell, Newspaper,
  Sword, TrendingUp, CloudLightning, Ship, Settings, Shield, Folders,
  ChevronLeft, ChevronRight, Globe2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/map', icon: Map, label: 'World Map' },
  { href: '/briefings', icon: BookOpen, label: 'Briefings' },
  { href: '/conflicts', icon: Sword, label: 'Conflicts' },
  { href: '/news', icon: Newspaper, label: 'News' },
  { href: '/markets', icon: TrendingUp, label: 'Markets' },
  { href: '/weather', icon: CloudLightning, label: 'Weather' },
  { href: '/transport', icon: Ship, label: 'Transport' },
  { href: '/watchlists', icon: Star, label: 'Watchlists' },
  { href: '/alerts', icon: Bell, label: 'Alerts' },
  { href: '/workspaces', icon: Folders, label: 'Workspaces' },
]

const BOTTOM_ITEMS = [
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function SideNav() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 56 : 200 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex flex-shrink-0 flex-col bg-[var(--obs-surface)] border-r border-border/40 relative overflow-hidden"
    >
      {/* Logo area */}
      <div className={cn(
        'flex items-center h-14 border-b border-border/40 px-3 flex-shrink-0',
        sidebarCollapsed ? 'justify-center' : 'gap-2.5'
      )}>
        <div className="w-7 h-7 rounded-md bg-[var(--obs-teal)] flex items-center justify-center flex-shrink-0 glow-teal">
          <Globe className="w-4 h-4 text-background" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-sm tracking-wider uppercase text-foreground whitespace-nowrap overflow-hidden"
            >
              OBSERVE
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                {sidebarCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-lg transition-all mx-auto',
                            isActive
                              ? 'bg-[var(--obs-teal)]/15 text-[var(--obs-teal)]'
                              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                          )}
                        />
                      }
                    >
                      <item.icon className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-1">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all',
                      isActive
                        ? 'bg-[var(--obs-teal)]/12 text-[var(--obs-teal)] font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <AnimatePresence>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    </AnimatePresence>
                    {isActive && (
                      <div className="ml-auto w-1 h-4 rounded-full bg-[var(--obs-teal)]" />
                    )}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom items */}
      <div className="border-t border-border/40 py-3 px-2">
        {BOTTOM_ITEMS.map((item) => (
          sidebarCollapsed ? (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all mx-auto"
                  />
                }
              >
                <item.icon className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-1">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          )
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--obs-surface-elevated)] border border-border/60 flex items-center justify-center hover:bg-[var(--obs-surface-elevated)]/80 transition-colors z-10"
      >
        {sidebarCollapsed
          ? <ChevronRight className="w-3 h-3 text-muted-foreground" />
          : <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        }
      </button>
    </motion.aside>
  )
}
