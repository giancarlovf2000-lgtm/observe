'use client'

import { motion } from 'framer-motion'
import { Users, Database, Activity, Globe2, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'

interface IngestionRun {
  id: string
  status: string
  records_fetched: number | null
  records_inserted: number | null
  records_skipped: number | null
  error_message: string | null
  started_at: string
  completed_at: string | null
  data_sources: { name: string } | null
}

interface RecentEvent {
  id: string
  title: string
  type: string
  severity: SeverityLevel
  occurred_at: string
}

const STATUS_CONFIG = {
  success: { icon: CheckCircle, color: 'var(--obs-green)', label: 'Success' },
  failed:  { icon: XCircle,     color: 'var(--obs-red)',   label: 'Failed' },
  running: { icon: Activity,    color: 'var(--obs-teal)',  label: 'Running' },
  pending: { icon: Clock,       color: 'var(--obs-amber)', label: 'Pending' },
  partial: { icon: AlertTriangle, color: 'var(--obs-amber)', label: 'Partial' },
}

export function AdminOverviewClient({
  stats,
  recentRuns,
  recentEvents,
}: {
  stats: { users: number; events: number; sources: number }
  recentRuns: IngestionRun[]
  recentEvents: RecentEvent[]
}) {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Platform health, ingestion status, and system metrics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.users, icon: Users, color: 'var(--obs-teal)' },
          { label: 'Active Events', value: stats.events, icon: Globe2, color: 'var(--obs-blue)' },
          { label: 'Data Sources', value: stats.sources, icon: Database, color: 'var(--obs-purple)' },
          {
            label: 'Last Ingestion',
            value: recentRuns[0]?.status || '—',
            icon: Activity,
            color: recentRuns[0]?.status === 'success' ? 'var(--obs-green)' : 'var(--obs-amber)',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl border border-white/5 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-2xl font-bold font-mono capitalize" style={{ color: s.color }}>
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent ingestion runs */}
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--obs-teal)]" />
            <span className="text-sm font-semibold text-foreground">Recent Ingestion Runs</span>
          </div>
          {recentRuns.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              No ingestion runs yet
            </div>
          ) : (
            <div className="divide-y divide-border/10">
              {recentRuns.map(run => {
                const statusCfg = STATUS_CONFIG[run.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
                const StatusIcon = statusCfg.icon
                return (
                  <div key={run.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-3.5 h-3.5" style={{ color: statusCfg.color }} />
                        <span className="text-sm text-foreground">{run.data_sources?.name || 'Unknown'}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-border/20 px-1.5 py-0"
                        style={{ color: statusCfg.color, borderColor: `${statusCfg.color}30` }}
                      >
                        {statusCfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                      {run.records_fetched != null && <span>{run.records_fetched} fetched</span>}
                      {run.records_inserted != null && <span className="text-green-400/70">+{run.records_inserted} new</span>}
                      {run.records_skipped != null && run.records_skipped > 0 && <span>{run.records_skipped} skipped</span>}
                      <span className="ml-auto">
                        {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                      </span>
                    </div>
                    {run.error_message && (
                      <p className="text-[10px] text-red-400/70 mt-1 font-mono line-clamp-1">
                        {run.error_message}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent events */}
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[var(--obs-blue)]" />
            <span className="text-sm font-semibold text-foreground">Recently Ingested Events</span>
          </div>
          <div className="divide-y divide-border/10">
            {recentEvents.map(event => (
              <div key={event.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
                <div className="flex items-start gap-2">
                  <SeverityBadge severity={event.severity} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground/85 leading-tight line-clamp-1">{event.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] border-border/20 text-muted-foreground/60 px-1 py-0">
                        {event.type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/50 font-mono">
                        {format(new Date(event.occurred_at), 'MMM d HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
