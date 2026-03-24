'use client'

import { Activity, CheckCircle, XCircle, Clock, AlertTriangle, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format, formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface IngestionRun {
  id: string
  status: string
  records_fetched: number | null
  records_inserted: number | null
  records_skipped: number | null
  error_message: string | null
  started_at: string
  completed_at: string | null
  data_sources: { name: string; slug: string } | null
}

const STATUS_CONFIG = {
  success: { icon: CheckCircle,   color: 'var(--obs-green)',  label: 'Success' },
  failed:  { icon: XCircle,       color: 'var(--obs-red)',    label: 'Failed' },
  running: { icon: Activity,      color: 'var(--obs-teal)',   label: 'Running' },
  pending: { icon: Clock,         color: 'var(--obs-amber)',  label: 'Pending' },
  partial: { icon: AlertTriangle, color: 'var(--obs-amber)',  label: 'Partial' },
}

function duration(start: string, end: string | null): string {
  if (!end) return 'ongoing'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

export function AdminIngestionClient({ runs }: { runs: IngestionRun[] }) {
  const [filter, setFilter] = useState<string>('all')

  const statuses = ['all', 'success', 'failed', 'running', 'partial']
  const filtered = filter === 'all' ? runs : runs.filter(r => r.status === filter)

  const successRate = runs.length > 0
    ? Math.round((runs.filter(r => r.status === 'success').length / runs.length) * 100)
    : 0

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--obs-teal)]" />
          Ingestion Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {runs.length} runs tracked · {successRate}% success rate
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const count = runs.filter(r => r.status === status).length
          const Icon = cfg.icon
          return (
            <div key={status} className="glass rounded-xl border border-white/5 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
              </div>
              <div className="text-xl font-bold font-mono" style={{ color: cfg.color }}>{count}</div>
            </div>
          )
        })}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <div className="flex gap-1.5">
          {statuses.map(s => {
            const cfg = s !== 'all' ? STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] : null
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                  filter === s
                    ? 'border-[var(--obs-teal)]/40 bg-[var(--obs-teal)]/10 text-[var(--obs-teal)]'
                    : 'border-border/30 text-muted-foreground hover:border-border/60'
                )}
                style={filter === s && cfg ? { color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}15` } : undefined}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Runs table */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] text-[10px] text-muted-foreground uppercase tracking-wide px-5 py-2 border-b border-border/10 bg-surface/40">
          <span>Source</span>
          <span className="text-right pr-4">Fetched</span>
          <span className="text-right pr-4">Inserted</span>
          <span className="text-right pr-4">Duration</span>
          <span className="text-right">Time</span>
        </div>
        <div className="divide-y divide-border/10">
          {filtered.map(run => {
            const cfg = STATUS_CONFIG[run.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
            const Icon = cfg.icon
            return (
              <div key={run.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center px-5 py-3 hover:bg-white/3 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon
                      className={cn('w-3.5 h-3.5 flex-shrink-0', run.status === 'running' && 'animate-spin')}
                      style={{ color: cfg.color }}
                    />
                    <span className="text-sm text-foreground">{run.data_sources?.name || 'Unknown'}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-border/20 px-1.5 py-0"
                      style={{ color: cfg.color, borderColor: `${cfg.color}30` }}
                    >
                      {cfg.label}
                    </Badge>
                  </div>
                  {run.error_message && (
                    <p className="text-[10px] text-red-400/70 mt-0.5 font-mono ml-5 line-clamp-1">
                      {run.error_message}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono text-muted-foreground text-right pr-4">
                  {run.records_fetched ?? '—'}
                </span>
                <span className={cn(
                  'text-xs font-mono text-right pr-4',
                  (run.records_inserted ?? 0) > 0 ? 'text-green-400' : 'text-muted-foreground'
                )}>
                  {run.records_inserted != null ? `+${run.records_inserted}` : '—'}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground text-right pr-4">
                  {duration(run.started_at, run.completed_at)}
                </span>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {format(new Date(run.started_at), 'MMM d HH:mm')}
                  </div>
                  <div className="text-[10px] text-muted-foreground/50">
                    {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No {filter !== 'all' ? filter : ''} runs found
        </div>
      )}
    </div>
  )
}
