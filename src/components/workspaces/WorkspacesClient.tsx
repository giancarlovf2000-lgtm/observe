'use client'

import { useState } from 'react'
import type { Json } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout, Plus, Trash2, ExternalLink, Map, Clock, Star, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface Workspace {
  id: string
  name: string
  description: string | null
  map_state: Json | null
  active_layers: Json | null
  filter_state: Json | null
  is_default: boolean | null
  created_at: string
  updated_at: string
}

function WorkspaceCard({
  workspace,
  onDelete,
  onSetDefault,
}: {
  workspace: Workspace
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}) {
  const layersRaw = workspace.active_layers
  const layers = Array.isArray(layersRaw)
    ? layersRaw as string[]
    : (layersRaw && typeof layersRaw === 'object' && !Array.isArray(layersRaw))
      ? Object.keys(layersRaw as Record<string, unknown>)
      : []

  type MapState = { zoom?: number; latitude?: number; longitude?: number }
  const mapState = (workspace.map_state && typeof workspace.map_state === 'object' && !Array.isArray(workspace.map_state))
    ? workspace.map_state as unknown as MapState
    : null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl border border-white/5 hover:glass-elevated transition-all group"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-[var(--obs-blue)] flex-shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">{workspace.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            {workspace.is_default && (
              <Badge className="text-[10px] bg-[var(--obs-teal)]/15 text-[var(--obs-teal)] border-[var(--obs-teal)]/25">
                Default
              </Badge>
            )}
          </div>
        </div>

        {workspace.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{workspace.description}</p>
        )}

        {/* Map state preview */}
        {mapState && (
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Map className="w-3 h-3" />
              {mapState.zoom != null && `Zoom ${(mapState.zoom as number).toFixed(1)}`}
            </div>
            {mapState.latitude != null && mapState.longitude != null && (
              <div className="text-[10px] text-muted-foreground/60 font-mono">
                {(mapState.latitude as number | undefined ?? 0).toFixed(2)}, {(mapState.longitude as number | undefined ?? 0).toFixed(2)}
              </div>
            )}
          </div>
        )}

        {/* Active layers */}
        {layers.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <Layers className="w-3 h-3 text-muted-foreground/60 mt-0.5" />
            {layers.slice(0, 5).map((layer) => (
              <Badge
                key={String(layer)}
                variant="outline"
                className="text-[10px] border-border/20 text-muted-foreground/60 px-1 py-0"
              >
                {String(layer)}
              </Badge>
            ))}
            {layers.length > 5 && (
              <span className="text-[10px] text-muted-foreground/40">+{layers.length - 5}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/60 font-mono flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {formatDistanceToNow(new Date(workspace.updated_at), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!workspace.is_default && (
              <button
                onClick={() => onSetDefault(workspace.id)}
                className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-[var(--obs-teal)]"
                title="Set as default"
              >
                <Star className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={`/map?workspace=${workspace.id}`}
              className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              title="Open workspace"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onDelete(workspace.id)}
              className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-red-400"
              title="Delete workspace"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function WorkspacesClient({
  workspaces: initial,
  userId,
}: {
  workspaces: Workspace[]
  userId: string
}) {
  const [workspaces, setWorkspaces] = useState(initial)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const supabase = createClient()

  async function createWorkspace() {
    if (!newName.trim()) return
    const { data } = await supabase
      .from('workspaces')
      .insert({
        name: newName.trim(),
        description: newDesc.trim() || null,
        user_id: userId,
        map_state: {},
        active_layers: {},
        filter_state: {},
      })
      .select()
      .single()
    if (data) {
      setWorkspaces(prev => [data, ...prev])
      setNewName('')
      setNewDesc('')
      setCreating(false)
    }
  }

  async function deleteWorkspace(id: string) {
    await supabase.from('workspaces').delete().eq('id', id)
    setWorkspaces(prev => prev.filter(w => w.id !== id))
  }

  async function setDefault(id: string) {
    await supabase.from('workspaces').update({ is_default: false }).eq('user_id', userId)
    await supabase.from('workspaces').update({ is_default: true }).eq('id', id)
    setWorkspaces(prev => prev.map(w => ({ ...w, is_default: w.id === id })))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Layout className="w-5 h-5 text-[var(--obs-blue)]" />
            Workspaces
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Save and restore map configurations, active layers, and filter states
          </p>
        </div>
        <Button
          onClick={() => setCreating(true)}
          className="bg-[var(--obs-blue)]/20 text-[var(--obs-blue)] hover:bg-[var(--obs-blue)]/30 border border-[var(--obs-blue)]/30 h-9"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl border border-[var(--obs-blue)]/30 p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">New Workspace</p>
              <input
                autoFocus
                placeholder="Workspace name…"
                className="w-full bg-surface rounded-lg border border-border/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--obs-blue)]/50"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <input
                placeholder="Description (optional)…"
                className="w-full bg-surface rounded-lg border border-border/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--obs-blue)]/50"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createWorkspace()}
              />
              <div className="flex gap-2">
                <Button onClick={createWorkspace} disabled={!newName.trim()} className="bg-[var(--obs-blue)]/20 text-[var(--obs-blue)] hover:bg-[var(--obs-blue)]/30 border border-[var(--obs-blue)]/30">
                  Create
                </Button>
                <Button variant="ghost" onClick={() => setCreating(false)} className="text-muted-foreground">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspaces grid */}
      {workspaces.length === 0 ? (
        <div className="glass rounded-xl border border-white/5 p-12 text-center">
          <Layout className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-sm font-semibold text-foreground mb-1">No workspaces yet</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Workspaces save your map configuration so you can switch between different intelligence views instantly.
          </p>
          <Button
            onClick={() => setCreating(true)}
            className={cn(
              'bg-[var(--obs-blue)]/20 text-[var(--obs-blue)] hover:bg-[var(--obs-blue)]/30',
              'border border-[var(--obs-blue)]/30'
            )}
          >
            Create First Workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map(ws => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              onDelete={deleteWorkspace}
              onSetDefault={setDefault}
            />
          ))}
        </div>
      )}
    </div>
  )
}
