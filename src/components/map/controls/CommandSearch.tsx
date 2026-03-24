'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Command, CommandDialog, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList, CommandSeparator
} from '@/components/ui/command'
import {
  Map, LayoutDashboard, BookOpen, Sword, Newspaper,
  TrendingUp, CloudLightning, Ship, Star, Bell, Settings
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const NAV_COMMANDS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Map, label: 'World Map', href: '/map' },
  { icon: BookOpen, label: 'Briefings', href: '/briefings' },
  { icon: Sword, label: 'Conflicts', href: '/conflicts' },
  { icon: Newspaper, label: 'News', href: '/news' },
  { icon: TrendingUp, label: 'Markets', href: '/markets' },
  { icon: CloudLightning, label: 'Weather', href: '/weather' },
  { icon: Ship, label: 'Transport', href: '/transport' },
  { icon: Star, label: 'Watchlists', href: '/watchlists' },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function CommandSearch() {
  const router = useRouter()
  const { commandOpen, openCommand, closeCommand } = useUIStore()

  // Global keyboard shortcut
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

  function handleSelect(href: string) {
    closeCommand()
    router.push(href)
  }

  return (
    <CommandDialog open={commandOpen} onOpenChange={(open) => open ? openCommand() : closeCommand()}>
      <CommandInput placeholder="Search countries, events, assets, pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

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
      </CommandList>
    </CommandDialog>
  )
}
