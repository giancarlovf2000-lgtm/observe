'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sword, Clock, MapPin, Users, AlertTriangle, Brain, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
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

const INTENSITY_LABELS = ['', 'Minimal', 'Very Low', 'Low', 'Below Average', 'Moderate', 'Above Average', 'High', 'Very High', 'Severe', 'Critical']

const CONFLICT_TYPE_LABELS: Record<string, string> = {
  armed_conflict: 'Armed Conflict',
  civil_unrest: 'Civil Unrest',
  terrorism: 'Terrorism',
  political_crisis: 'Political Crisis',
  border_dispute: 'Border Dispute',
}

export function ConflictsClient({ conflicts }: { conflicts: ConflictZone[] }) {
  const [selected, setSelected] = useState<ConflictZone | null>(conflicts[0] ?? null)

  return (
    <div className="flex h-full">
      {/* Left: conflict list */}
      <div className="w-80 flex-shrink-0 border-r border-border/40 flex flex-col h-full">
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center gap-2 mb-1">
            <Sword className="w-4 h-4 text-[var(--obs-red)]" />
            <h1 className="text-sm font-bold text-foreground">Active Conflicts</h1>
          </div>
          <p className="text-xs text-muted-foreground">{conflicts.length} conflicts being tracked</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conflicts.map((conflict, i) => (
            <motion.div
              key={conflict.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(conflict)}
              className={cn(
                'p-4 border-b border-border/30 cursor-pointer transition-colors',
                selected?.id === conflict.id
                  ? 'bg-[var(--obs-red)]/8 border-l-2 border-l-[var(--obs-red)]'
                  : 'hover:bg-white/3'
              )}
            >
              <div className="flex items-start gap-2 mb-1.5">
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground leading-tight">{conflict.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {conflict.global_events?.country_id ?? conflict.global_events?.region ?? 'Global'}
                  </div>
                </div>
                <div className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded',
                  conflict.intensity >= 8 ? 'bg-red-500/20 text-red-400' :
                  conflict.intensity >= 5 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                )}>
                  {conflict.intensity}/10
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-border/40 text-muted-foreground px-1.5 py-0">
                  {CONFLICT_TYPE_LABELS[conflict.conflict_type] ?? conflict.conflict_type}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatDistanceToNow(new Date(conflict.last_update), { addSuffix: true })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right: conflict detail */}
      <div className="flex-1 overflow-y-auto p-6">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <Badge variant="outline" className="border-[var(--obs-red)]/40 text-[var(--obs-red)] bg-[var(--obs-red)]/5">
                  {CONFLICT_TYPE_LABELS[selected.conflict_type]}
                </Badge>
                {selected.global_events && (
                  <SeverityBadge severity={selected.global_events.severity} />
                )}
                <span className="text-xs text-muted-foreground font-mono">
                  Intensity: {INTENSITY_LABELS[selected.intensity]}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{selected.name}</h1>
              {selected.global_events?.summary && (
                <p className="text-muted-foreground leading-relaxed">{selected.global_events.summary}</p>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Parties', value: selected.parties.length, icon: Users },
                { label: 'Intensity', value: `${selected.intensity}/10`, icon: AlertTriangle },
                { label: 'Casualties Est.', value: selected.casualties_estimate ? selected.casualties_estimate.toLocaleString() : 'Unknown', icon: Sword },
                { label: 'Displaced Est.', value: selected.displacement_estimate ? (selected.displacement_estimate / 1000000).toFixed(1) + 'M' : 'Unknown', icon: MapPin },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 border border-white/5 text-center">
                  <stat.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Parties */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Involved Parties
              </h2>
              <div className="flex flex-wrap gap-2">
                {selected.parties.map((party) => (
                  <Badge key={party} variant="outline" className="border-border/50 text-foreground/80">
                    {party}
                  </Badge>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            {selected.global_events?.ai_summary && (
              <div className="glass rounded-xl p-4 border border-[var(--obs-purple)]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-[var(--obs-purple)]" />
                  <span className="text-sm font-semibold text-foreground">AI Analysis</span>
                  <Badge className="text-xs bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] border-[var(--obs-purple)]/30">GPT-4o</Badge>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{selected.global_events.ai_summary}</p>
              </div>
            )}

            {/* Timeline */}
            {selected.conflict_updates.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Recent Developments
                </h2>
                <div className="space-y-3">
                  {selected.conflict_updates
                    .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
                    .slice(0, 6)
                    .map((update) => (
                      <div key={update.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                            update.severity === 'critical' ? 'bg-red-500' :
                            update.severity === 'high' ? 'bg-orange-500' : 'bg-[var(--obs-teal)]'
                          )} />
                          <div className="w-px flex-1 bg-border/30 my-1" />
                        </div>
                        <div className="pb-3 flex-1">
                          <div className="text-xs font-mono text-muted-foreground/60 mb-0.5">
                            {formatDistanceToNow(new Date(update.occurred_at), { addSuffix: true })}
                          </div>
                          <div className="text-sm font-medium text-foreground">{update.title}</div>
                          {update.body && (
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{update.body}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {(selected.global_events?.tags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.global_events!.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-border/40 text-muted-foreground">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a conflict to view details
          </div>
        )}
      </div>
    </div>
  )
}
