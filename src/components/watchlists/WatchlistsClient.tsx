'use client'

import { useState } from 'react'
import type { Json } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Plus, Trash2, Globe2, TrendingUp, Sword, Newspaper, Tag, ChevronDown, ChevronRight, Edit3, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface WatchlistItem {
  id: string
  entity_type: string
  entity_id: string
  metadata: Json | null
}

interface Watchlist {
  id: string
  name: string
  description: string | null
  is_default: boolean | null
  watchlist_items: WatchlistItem[]
}

const ENTITY_TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  country:  { icon: Globe2,     color: 'var(--obs-teal)',   label: 'Country' },
  asset:    { icon: TrendingUp, color: 'var(--obs-amber)',  label: 'Market Asset' },
  conflict: { icon: Sword,      color: 'var(--obs-red)',    label: 'Conflict' },
  region:   { icon: Globe2,     color: 'var(--obs-blue)',   label: 'Region' },
  topic:    { icon: Tag,        color: 'var(--obs-purple)', label: 'Topic' },
  news:     { icon: Newspaper,  color: 'var(--obs-green)',  label: 'News Source' },
}

function WatchlistCard({
  watchlist,
  onDelete,
  onRename,
}: {
  watchlist: Watchlist
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(watchlist.name)

  function handleRename() {
    if (name.trim() && name !== watchlist.name) onRename(watchlist.id, name.trim())
    setEditing(false)
  }

  return (
    <motion.div
      layout
      className="glass rounded-xl border border-white/5 overflow-hidden"
    >
      <div
        className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-white/3 transition-colors"
        onClick={() => !editing && setExpanded(e => !e)}
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}

        {editing ? (
          <input
            autoFocus
            className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none border-b border-[var(--obs-teal)]/50 pb-0.5"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setName(watchlist.name); setEditing(false) } }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm font-semibold text-foreground">{watchlist.name}</span>
        )}

        {watchlist.is_default && (
          <Badge className="text-[10px] bg-[var(--obs-teal)]/15 text-[var(--obs-teal)] border-[var(--obs-teal)]/25 flex-shrink-0">
            Default
          </Badge>
        )}
        <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground flex-shrink-0">
          {watchlist.watchlist_items.length} items
        </Badge>

        <div className="flex items-center gap-1 ml-1" onClick={e => e.stopPropagation()}>
          {editing ? (
            <>
              <button onClick={handleRename} className="p-1 rounded hover:bg-white/10 transition-colors text-[var(--obs-teal)]">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => { setName(watchlist.name); setEditing(false) }} className="p-1 rounded hover:bg-white/10 transition-colors text-muted-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {!watchlist.is_default && (
                <button onClick={() => onDelete(watchlist.id)} className="p-1 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {watchlist.watchlist_items.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground border-t border-border/10">
                No items yet. Add countries, assets, conflicts, or topics to track.
              </div>
            ) : (
              <div className="border-t border-border/10 divide-y divide-border/10">
                {watchlist.watchlist_items.map(item => {
                  const config = ENTITY_TYPE_CONFIG[item.entity_type] || ENTITY_TYPE_CONFIG.topic
                  const Icon = config.icon
                  const metaObj = (item.metadata && typeof item.metadata === 'object' && !Array.isArray(item.metadata))
                    ? item.metadata as Record<string, unknown>
                    : null
                  const label = (metaObj?.name as string | undefined)
                    || (metaObj?.symbol as string | undefined)
                    || item.entity_id
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/3 transition-colors">
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: config.color }} />
                      <span className="flex-1 text-sm text-foreground/85">{label}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-border/20 px-1.5 py-0"
                        style={{ color: config.color, borderColor: `${config.color}30` }}
                      >
                        {config.label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function WatchlistsClient({
  watchlists: initial,
  userId,
}: {
  watchlists: Watchlist[]
  userId: string
}) {
  const [watchlists, setWatchlists] = useState(initial)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const supabase = createClient()

  async function createWatchlist() {
    if (!newName.trim()) return
    const { data, error } = await supabase
      .from('watchlists')
      .insert({ name: newName.trim(), user_id: userId })
      .select('*, watchlist_items(*)')
      .single()
    if (!error && data) {
      setWatchlists(prev => [...prev, data])
      setNewName('')
      setCreating(false)
    }
  }

  async function deleteWatchlist(id: string) {
    await supabase.from('watchlists').delete().eq('id', id)
    setWatchlists(prev => prev.filter(w => w.id !== id))
  }

  async function renameWatchlist(id: string, name: string) {
    await supabase.from('watchlists').update({ name }).eq('id', id)
    setWatchlists(prev => prev.map(w => w.id === id ? { ...w, name } : w))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[var(--obs-purple)]" />
            Watchlists
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track countries, assets, conflicts, and topics you care about
          </p>
        </div>
        <Button
          onClick={() => setCreating(true)}
          className="bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] hover:bg-[var(--obs-purple)]/30 border border-[var(--obs-purple)]/30 h-9"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Watchlist
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Watchlists', value: watchlists.length },
          { label: 'Total Items', value: watchlists.reduce((s, w) => s + w.watchlist_items.length, 0) },
          { label: 'Countries Tracked', value: watchlists.reduce((s, w) => s + w.watchlist_items.filter(i => i.entity_type === 'country').length, 0) },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 border border-white/5 text-center">
            <div className="text-2xl font-bold font-mono text-[var(--obs-purple)]">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl border border-[var(--obs-purple)]/30 p-4"
          >
            <p className="text-sm font-semibold text-foreground mb-3">New Watchlist</p>
            <div className="flex gap-2">
              <input
                autoFocus
                placeholder="Watchlist name…"
                className="flex-1 bg-surface rounded-lg border border-border/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--obs-purple)]/50"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') createWatchlist(); if (e.key === 'Escape') setCreating(false) }}
              />
              <Button onClick={createWatchlist} disabled={!newName.trim()} className="bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] hover:bg-[var(--obs-purple)]/30 border border-[var(--obs-purple)]/30">
                Create
              </Button>
              <Button variant="ghost" onClick={() => setCreating(false)} className="text-muted-foreground">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watchlists */}
      {watchlists.length === 0 ? (
        <div className="glass rounded-xl border border-white/5 p-12 text-center">
          <Bookmark className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-foreground mb-1">No watchlists yet</h3>
          <p className="text-xs text-muted-foreground">
            Create a watchlist to track countries, conflicts, assets, and topics
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {watchlists.map(wl => (
            <WatchlistCard
              key={wl.id}
              watchlist={wl}
              onDelete={deleteWatchlist}
              onRename={renameWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  )
}
