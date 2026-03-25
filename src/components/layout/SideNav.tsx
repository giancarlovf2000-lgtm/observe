'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, LayoutDashboard, Map, BookOpen, Star, Bell, Newspaper,
  Sword, TrendingUp, CloudLightning, Ship, Settings, Folders,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useT } from '@/hooks/useT'

// Nav structure uses translation keys resolved inside the component
const NAV_GROUP_DEFS = [
  {
    key: 'core' as const,
    items: [
      { href: '/dashboard', icon: LayoutDashboard, key: 'dashboard' as const },
      { href: '/map',       icon: Map,             key: 'worldMap'  as const },
      { href: '/briefings', icon: BookOpen,         key: 'briefings' as const },
    ],
  },
  {
    key: 'intelligence' as const,
    items: [
      { href: '/conflicts', icon: Sword,         key: 'conflicts' as const },
      { href: '/news',      icon: Newspaper,      key: 'news'      as const },
      { href: '/markets',   icon: TrendingUp,     key: 'markets'   as const },
      { href: '/weather',   icon: CloudLightning, key: 'weather'   as const },
      { href: '/transport', icon: Ship,           key: 'transport' as const },
    ],
  },
  {
    key: 'personal' as const,
    items: [
      { href: '/watchlists', icon: Star,    key: 'watchlists' as const },
      { href: '/alerts',     icon: Bell,    key: 'alerts'     as const },
      { href: '/workspaces', icon: Folders, key: 'workspaces' as const },
    ],
  },
]

export function SideNav() {
  const pathname            = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { t }               = useT()
  const nav                 = t('nav')

  function isActive(href: string) {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  function NavItem({ item }: { item: { href: string; icon: React.ElementType; label: string } }) {
    const active = isActive(item.href)

    if (sidebarCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={item.href}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all mx-auto',
                  active
                    ? 'bg-[var(--obs-teal)]/15 text-[var(--obs-teal)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              />
            }
          >
            <item.icon className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-1">{item.label}</TooltipContent>
        </Tooltip>
      )
    }

    return (
      <Link
        href={item.href}
        className={cn(
          'relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all',
          active
            ? 'bg-[var(--obs-teal)]/10 text-[var(--obs-teal)] font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        <span className="whitespace-nowrap">{item.label}</span>
        {active && (
          <motion.div
            layoutId="nav-active-pill"
            className="ml-auto w-1 h-4 rounded-full bg-[var(--obs-teal)]"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
      </Link>
    )
  }

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 56 : 200 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex flex-shrink-0 flex-col bg-[var(--obs-surface)] border-r border-border/40 relative overflow-hidden"
    >
      {/* Logo */}
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
              className="font-bold text-sm tracking-[0.15em] uppercase text-foreground whitespace-nowrap overflow-hidden"
            >
              OBSERVE
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden space-y-1">
        {NAV_GROUP_DEFS.map((group) => (
          <div key={group.key} className="px-2">
            {!sidebarCollapsed && (
              <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.15em] px-2.5 pb-1 pt-2">
                {nav[group.key]}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavItem item={{ href: item.href, icon: item.icon, label: nav[item.key] }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-border/40 py-3 px-2">
        {sidebarCollapsed ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/settings"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all mx-auto"
                />
              }
            >
              <Settings className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-1">{nav.settings}</TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all',
              isActive('/settings')
                ? 'bg-[var(--obs-teal)]/10 text-[var(--obs-teal)] font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{nav.settings}</span>
          </Link>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--obs-surface-elevated)] border border-border/60 flex items-center justify-center hover:bg-[var(--obs-surface-elevated)]/80 transition-colors z-10"
      >
        {sidebarCollapsed
          ? <ChevronRight className="w-3 h-3 text-muted-foreground" />
          : <ChevronLeft  className="w-3 h-3 text-muted-foreground" />}
      </button>
    </motion.aside>
  )
}
