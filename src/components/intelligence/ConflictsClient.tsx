'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sword, Clock, MapPin, Users, AlertTriangle, Brain, ChevronRight,
  ArrowLeft, Activity, Flame, TrendingUp, Radio
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { PulseIndicator } from '@/components/shared/PulseIndicator'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'

interface ConflictZone {
  id: string
  name: string
  conflict_type: string
  parties: string[]
  active: boolean
  intensity: number
  casualties_estimate: number | null
  displacement_estimate: number | null
  start_date: string
  last_update: string
  global_events: {
    id: string
    title: string
    summary: string | null
    severity: SeverityLevel
    country_id: string | null
    region: string | null
    lat: number | null
    lng: number | null
    occurred_at: string
    tags: string[]
    ai_summary: string | null
    source_url: string | null
  } | null
  conflict_updates: Array<{
    id: string
    title: string
    body: string | null
    severity: SeverityLevel | null
    occurred_at: string
  }>
}

const INTENSITY_LABELS = ['', 'Minimal', 'Very Low', 'Low', 'Below Average', 'Moderate',
  'Above Average', 'High', 'Very High', 'Severe', 'Critical']

const CONFLICT_TYPE_LABELS: Record<string, string> = {
  armed_conflict:   'Armed Conflict',
  civil_unrest:     'Civil Unrest',
  terrorism:        'Terrorism',
  political_crisis: 'Political Crisis',
  border_dispute:   'Border Dispute',
}

const CONFLICT_TYPE_COLORS: Record<string, string> = {
  armed_conflict:   'var(--obs-red)',
  civil_unrest:     'var(--obs-amber)',
  terrorism:        '#dc2626',
  political_crisis: 'var(--obs-purple)',
  border_dispute:   'var(--obs-blue)',
}

function IntensityBar({ value }: { value: number }) {
  const pct   = (value / 10) * 100
  const color = value >= 8 ? 'from-red-600 to-red-400' :
                value >= 5 ? 'from-orange-600 to-orange-400' :
                             'from-yellow-600 to-yellow-400'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">Intensity</span>
        <span className={cn(
          'text-xs font-bold font-mono',
          value >= 8 ? 'text-red-400' : value >= 5 ? 'text-orange-400' : 'text-yellow-400'
        )}>
          {INTENSITY_LABELS[value]} ({value}/10)
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={cn('h-full rounded-full bg-gradient-to-r', color)}
        />
      </div>
    </div>
  )
}

function ConflictListItem({
  conflict, isSelected, onClick,
}: {
  conflict: ConflictZone; isSelected: boolean; onClick: () => void
}) {
  const color  = CONFLICT_TYPE_COLORS[conflict.conflict_type] || 'var(--obs-red)'
  const typeLabel = CONFLICT_TYPE_LABELS[conflict.conflict_type] ?? conflict.conflict_type

  return (
    <motion.div
      layout
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all border-b border-border/20',
        isSelected
          ? 'bg-[var(--obs-red)]/8'
          : 'hover:bg-white/3'
      )}
    >
      <div className={cn(
        'flex items-stretch gap-0',
        isSelected && 'border-l-2 border-l-[var(--obs-red)]'
      )}>
        {/* Intensity indicator strip */}
        <div
          className="w-0.5 flex-shrink-0 my-3"
          style={{
            background: `linear-gradient(to bottom, ${color}, transparent)`,
            marginLeft: isSelected ? 0 : 2,
          }}
        />
        <div className="flex-1 p-3 pl-4">
          <div className="flex items-start gap-2 mb-1.5">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground leading-tight">{conflict.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {conflict.global_events?.country_id ?? conflict.global_events?.region ?? 'Global'}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className={cn(
                'text-xs font-bold px-1.5 py-0.5 rounded',
                conflict.intensity >= 8 ? 'bg-red-500/20 text-red-400' :
                conflict.intensity >= 5 ? 'bg-orange-500/20 text-orange-400' :
                'bg-yellow-500/20 text-yellow-400'
              )}>
                {conflict.intensity}/10
              </div>
            </div>
          </div>

          {/* Intensity mini-bar */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
            <div
              className={cn(
                'h-full rounded-full',
                conflict.intensity >= 8 ? 'bg-red-500' :
                conflict.intensity >= 5 ? 'bg-orange-500' : 'bg-yellow-500'
              )}
              style={{ width: `${conflict.intensity * 10}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] border-border/30 text-muted-foreground px-1.5 py-0"
              style={{ borderColor: `${color}40`, color }}
            >
              {typeLabel}
            </Badge>
            <span className="text-[10px] text-muted-foreground/60 font-mono">
              {formatDistanceToNow(new Date(conflict.last_update), { addSuffix: true })}
            </span>
            {isSelected && <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto" />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ConflictDetail({ conflict }: { conflict: ConflictZone }) {
  return (
    <motion.div
      key={conflict.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="max-w-3xl mx-auto space-y-5"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <Badge
            variant="outline"
            className="border-[var(--obs-red)]/40 text-[var(--obs-red)] bg-[var(--obs-red)]/5"
          >
            {CONFLICT_TYPE_LABELS[conflict.conflict_type] ?? conflict.conflict_type}
          </Badge>
          {conflict.global_events && (
            <SeverityBadge severity={conflict.global_events.severity} />
          )}
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[var(--obs-red)] animate-pulse" />
            <span className="text-xs text-muted-foreground font-mono">
              Updated {formatDistanceToNow(new Date(conflict.last_update), { addSuffix: true })}
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">{conflict.name}</h1>
        {conflict.global_events?.summary && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {conflict.global_events.summary}
          </p>
        )}
      </div>

      {/* Intensity bar */}
      <div className="glass rounded-xl p-4 border border-white/5">
        <IntensityBar value={conflict.intensity} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Parties',        value: conflict.parties.length,                                            icon: Users,         color: 'var(--obs-teal)' },
          { label: 'Intensity',      value: `${conflict.intensity}/10`,                                        icon: Flame,         color: 'var(--obs-red)' },
          { label: 'Casualties Est.', value: conflict.casualties_estimate?.toLocaleString() ?? 'Unknown',      icon: AlertTriangle, color: 'var(--obs-amber)' },
          { label: 'Displaced Est.', value: conflict.displacement_estimate ? (conflict.displacement_estimate / 1e6).toFixed(1) + 'M' : 'Unknown', icon: MapPin, color: 'var(--obs-purple)' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 border border-white/5 text-center">
            <stat.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: stat.color }} />
            <div className="text-lg font-bold text-foreground tabular-nums">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Parties */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          Involved Parties
        </h2>
        <div className="flex flex-wrap gap-2">
          {conflict.parties.map((party) => (
            <Badge key={party} variant="outline" className="border-border/50 text-foreground/80 text-xs">
              {party}
            </Badge>
          ))}
          {conflict.parties.length === 0 && (
            <span className="text-xs text-muted-foreground italic">No parties listed</span>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {conflict.global_events?.ai_summary && (
        <div className="glass rounded-xl p-4 border border-[var(--obs-purple)]/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse at top right, oklch(0.60 0.20 280 / 0.15), transparent 70%)' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-[var(--obs-purple)]" />
              <span className="text-sm font-semibold text-foreground">AI Analysis</span>
              <Badge className="text-[10px] bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] border-[var(--obs-purple)]/30">
                Perplexity Sonar
              </Badge>
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">
              {conflict.global_events.ai_summary}
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      {conflict.conflict_updates.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[var(--obs-teal)]" />
            Recent Developments
          </h2>
          <div className="space-y-0">
            {conflict.conflict_updates
              .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
              .slice(0, 6)
              .map((update, i) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ring-2 ring-background',
                      update.severity === 'critical' ? 'bg-red-500' :
                      update.severity === 'high'     ? 'bg-orange-500' : 'bg-[var(--obs-teal)]'
                    )} />
                    <div className="w-px flex-1 bg-border/30 my-1" />
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="text-[10px] font-mono text-muted-foreground/50 mb-0.5">
                      {formatDistanceToNow(new Date(update.occurred_at), { addSuffix: true })}
                    </div>
                    <div className="text-sm font-medium text-foreground">{update.title}</div>
                    {update.body && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{update.body}</p>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* View on map */}
      {conflict.global_events && (
        <Link
          href={`/map`}
          className="flex items-center gap-2 text-xs text-[var(--obs-teal)] hover:underline mt-2"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          View on world map
        </Link>
      )}

      {/* Tags */}
      {(conflict.global_events?.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {conflict.global_events!.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] border-border/30 text-muted-foreground/60">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export function ConflictsClient({ conflicts }: { conflicts: ConflictZone[] }) {
  const [selected, setSelected] = useState<ConflictZone | null>(conflicts[0] ?? null)
  // Mobile: which panel is active ('list' | 'detail')
  const [mobilePanel, setMobilePanel] = useState<'list' | 'detail'>('list')

  function selectConflict(c: ConflictZone) {
    setSelected(c)
    setMobilePanel('detail')
  }

  const sorted = [...conflicts].sort((a, b) => b.intensity - a.intensity)
  const criticalCount = sorted.filter(c => c.intensity >= 8).length

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-[var(--obs-surface)] flex-shrink-0">
        <Sword className="w-4 h-4 text-[var(--obs-red)]" />
        <div className="flex-1">
          <h1 className="text-sm font-bold text-foreground">Active Conflicts</h1>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <PulseIndicator color="var(--obs-red)" />
            <span>{conflicts.length} tracked · {criticalCount} critical</span>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobilePanel === 'detail' && selected && (
        <div className="md:hidden px-4 py-2 border-b border-border/40 bg-[var(--obs-surface)]">
          <button
            onClick={() => setMobilePanel('list')}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to conflicts
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: conflict list */}
        <div className={cn(
          'flex-shrink-0 border-r border-border/40 flex flex-col overflow-y-auto',
          // Mobile: show only when on 'list' view
          mobilePanel === 'list' ? 'w-full md:w-80' : 'hidden md:flex md:w-80'
        )}>
          {sorted.map((conflict) => (
            <ConflictListItem
              key={conflict.id}
              conflict={conflict}
              isSelected={selected?.id === conflict.id}
              onClick={() => selectConflict(conflict)}
            />
          ))}
        </div>

        {/* Right panel: conflict detail */}
        <div className={cn(
          'flex-1 overflow-y-auto p-4 md:p-6',
          mobilePanel === 'detail' ? 'block' : 'hidden md:block'
        )}>
          <AnimatePresence mode="wait">
            {selected ? (
              <ConflictDetail key={selected.id} conflict={selected} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                <div className="text-center">
                  <Sword className="w-10 h-10 mx-auto mb-3 text-muted-foreground/20" />
                  Select a conflict to view details
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
