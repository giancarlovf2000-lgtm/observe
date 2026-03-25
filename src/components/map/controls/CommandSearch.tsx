'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Command, CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command'
import {
  Map, LayoutDashboard, BookOpen, Sword, Newspaper,
  TrendingUp, CloudLightning, Ship, Star, Bell, Settings,
  Clock,
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { formatDistanceToNow } from 'date-fns'
import type { SeverityLevel } from '@/types'

const NAV_COMMANDS = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard' },
  { icon: Map,             label: 'World Map',    href: '/map' },
  { icon: BookOpen,        label: 'Briefings',    href: '/briefings' },
  { icon: Sword,           label: 'Conflicts',    href: '/conflicts' },
  { icon: Newspaper,       label: 'News',         href: '/news' },
  { icon: TrendingUp,      label: 'Markets',      href: '/markets' },
  { icon: CloudLightning,  label: 'Weather',      href: '/weather' },
  { icon: Ship,            label: 'Transport',    href: '/transport' },
  { icon: Star,            label: 'Watchlists',   href: '/watchlists' },
  { icon: Bell,            label: 'Alerts',       href: '/alerts' },
  { icon: Settings,        label: 'Settings',     href: '/settings' },
]

const EVENT_TYPE_ICON: Record<string, React.ElementType> = {
  conflict:     Sword,
  news:         Newspaper,
  weather:      CloudLightning,
  market:       TrendingUp,
  political:    Map,
  humanitarian: Bell,
  default:      Bell,
}

interface SearchResult {
  id:          string
  type:        string
  title:       string
  severity:    SeverityLevel
  country_id:  string | null
  region:      string | null
  occurred_at: string
}

export function CommandSearch() {
  const router = useRouter()
  const { commandOpen, openCommand, closeCommand } = useUIStore()

  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Debounced live search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
        if (res.ok) setResults(await res.json())
      } finally {
        setLoading(false)
      }
    }, 280)

    return () => clearTimeout(timer)
  }, [query])

  // Reset on close
  useEffect(() => {
    if (!commandOpen) {
      setQuery('')
      setResults([])
    }
  }, [commandOpen])

  // Global ⌘K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        commandOpen ? closeCommand() : openCommand()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandOpen, openCommand, closeCommand])

  const handleSelect = useCallback((href: string) => {
    closeCommand()
    router.push(href)
  }, [closeCommand, router])

  const showNav = query.length < 2

  return (
    <CommandDialog open={commandOpen} onOpenChange={(open) => open ? openCommand() : closeCommand()}>
      <CommandInput
        placeholder="Search events, countries, assets…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {/* Live event search results */}
        {query.length >= 2 && (
          <>
            {loading && (
              <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">
                Searching live events…
              </div>
            )}

            {!loading && results.length === 0 && (
              <CommandEmpty>No events found for &ldquo;{query}&rdquo;</CommandEmpty>
            )}

            {!loading && results.length > 0 && (
              <CommandGroup heading={`Events (${results.length})`}>
                {results.map((event) => {
                  const Icon = EVENT_TYPE_ICON[event.type] ?? EVENT_TYPE_ICON.default
                  const location = event.country_id ?? event.region
                  return (
                    <CommandItem
                      key={event.id}
                      value={event.id}
                      onSelect={() => handleSelect(`/events/${event.id}`)}
                      className="flex items-start gap-2.5 py-2.5 cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <SeverityBadge severity={event.severity} />
                          {location && (
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">
                              {location}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-foreground leading-snug truncate">
                          {event.title}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground/60">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                        </div>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </>
        )}

        {/* Navigation — shown when no query typed */}
        {showNav && (
          <>
            <CommandGroup heading="Navigation">
              {NAV_COMMANDS.map((cmd) => (
                <CommandItem
                  key={cmd.href}
                  onSelect={() => handleSelect(cmd.href)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <cmd.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{cmd.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => handleSelect('/briefings?generate=world')}>
                <BookOpen className="w-4 h-4 text-[var(--obs-purple)] mr-2" />
                Generate World Briefing
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/alerts?new=true')}>
                <Bell className="w-4 h-4 text-[var(--obs-amber)] mr-2" />
                Create New Alert
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/watchlists?new=true')}>
                <Star className="w-4 h-4 text-[var(--obs-teal)] mr-2" />
                Add to Watchlist
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
