'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, LogOut, Settings, ChevronDown, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { createClient } from '@/lib/supabase/client'
import { PulseIndicator } from '@/components/shared/PulseIndicator'

export function TopBar() {
  const router = useRouter()
  const { openCommand } = useUIStore()
  const { user } = useAuthStore()
  const [clockStr, setClockStr] = useState('')
  useEffect(() => {
    const tick = () => setClockStr(new Date().toUTCString().slice(0, 25))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user?.email?.[0].toUpperCase() || '?'

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border/40 bg-[var(--obs-surface)] flex-shrink-0">
      {/* Left: Logo on mobile, live indicator on desktop */}
      <div className="flex items-center gap-3">
        {/* Mobile: OBSERVE logo (sidebar hidden on mobile) */}
        <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-md bg-[var(--obs-teal)] flex items-center justify-center glow-teal">
            <Globe className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold text-sm tracking-wider uppercase text-foreground">OBSERVE</span>
        </Link>

        {/* Desktop: live feed indicator */}
        <div className="hidden md:flex items-center gap-3">
          <PulseIndicator />
          <span className="text-xs font-mono text-muted-foreground hidden sm:block">
            LIVE FEED ACTIVE
          </span>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-4 bg-border/60" />
            <span className="text-xs text-muted-foreground">
              {clockStr}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search trigger */}
      <button
        onClick={openCommand}
        className="hidden md:flex items-center gap-2 bg-[var(--obs-surface-elevated)] hover:bg-white/5 border border-border/40 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors min-w-[280px]"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left text-xs">Search countries, events, assets…</span>
        <kbd className="text-xs bg-white/5 border border-border/40 rounded px-1.5 py-0.5 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Right: alerts + user */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <button
          onClick={openCommand}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 text-muted-foreground"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <Link href="/alerts">
          <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0 rounded-lg hover:bg-white/5">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[9px] bg-[var(--obs-red)] text-white border-0">
              3
            </Badge>
          </Button>
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors border-0 bg-transparent cursor-pointer">
            <div className="w-6 h-6 rounded-md bg-[var(--obs-teal)]/20 border border-[var(--obs-teal)]/30 flex items-center justify-center text-xs font-medium text-[var(--obs-teal)]">
              {initials}
            </div>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[var(--obs-surface-elevated)] border-border/50">
            <div className="px-3 py-2">
              <div className="text-sm font-medium text-foreground">
                {user?.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem
              render={<Link href="/settings" />}
              className="hover:bg-white/5 cursor-pointer flex items-center gap-2"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
