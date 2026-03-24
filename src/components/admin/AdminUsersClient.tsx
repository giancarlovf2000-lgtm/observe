'use client'

import { useState } from 'react'
import { Users, Search } from 'lucide-react'
import type { UserRole } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: string
  tier: string | null
  last_seen_at: string | null
  created_at: string
}

const ROLE_COLORS: Record<string, string> = {
  admin:    'var(--obs-red)',
  analyst:  'var(--obs-purple)',
  user:     'var(--obs-teal)',
  visitor:  'var(--obs-amber)',
}

const TIER_COLORS: Record<string, string> = {
  enterprise: 'var(--obs-amber)',
  pro:        'var(--obs-purple)',
  free:       'var(--obs-teal)',
}

export function AdminUsersClient({ users: initial }: { users: Profile[] }) {
  const [users, setUsers] = useState(initial)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  async function updateRole(id: string, role: string) {
    await supabase.from('profiles').update({ role: role as UserRole }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
  }

  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--obs-teal)]" />
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {users.length} total users
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          placeholder="Search users…"
          className="w-full bg-surface rounded-xl border border-border/30 pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--obs-teal)]/50"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Users table */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="divide-y divide-border/10">
          {filtered.map(user => (
            <div key={user.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[var(--obs-purple)]/20 border border-[var(--obs-purple)]/30 flex items-center justify-center text-sm font-bold text-[var(--obs-purple)] flex-shrink-0">
                {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{user.full_name || user.email || 'Unknown'}</div>
                {user.full_name && (
                  <div className="text-xs text-muted-foreground font-mono">{user.email}</div>
                )}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                <Badge
                  className="text-[10px] px-1.5 py-0"
                  style={{
                    background: `${ROLE_COLORS[user.role] || 'var(--obs-teal)'}20`,
                    color: ROLE_COLORS[user.role] || 'var(--obs-teal)',
                    border: `1px solid ${ROLE_COLORS[user.role] || 'var(--obs-teal)'}40`,
                  }}
                >
                  {user.role}
                </Badge>
                {user.tier && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-border/30"
                    style={{ color: TIER_COLORS[user.tier] || 'var(--obs-teal)' }}
                  >
                    {user.tier}
                  </Badge>
                )}
              </div>

              {/* Last seen */}
              <div className="text-[10px] text-muted-foreground/60 font-mono text-right flex-shrink-0 w-24">
                {user.last_seen_at
                  ? formatDistanceToNow(new Date(user.last_seen_at), { addSuffix: true })
                  : 'never'
                }
              </div>

              {/* Role selector */}
              <select
                value={user.role}
                onChange={e => updateRole(user.id, e.target.value)}
                className="bg-surface border border-border/30 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-[var(--obs-teal)]/50 flex-shrink-0"
              >
                {['visitor', 'user', 'analyst', 'admin'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No users match &ldquo;{search}&rdquo;
        </div>
      )}
    </div>
  )
}
