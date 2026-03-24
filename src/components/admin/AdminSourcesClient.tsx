'use client'

import { useState } from 'react'
import { Database, CheckCircle, XCircle, Clock, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface IngestionRun {
  id: string
  status: string
  started_at: string
  records_inserted: number | null
}

interface DataSource {
  id: string
  name: string
  slug: string
  adapter_key: string
  base_url: string | null
  is_active: boolean | null
  fetch_interval_seconds: number | null
  last_fetched_at: string | null
  ingestion_runs: IngestionRun[]
}

const STATUS_ICONS = {
  success: { icon: CheckCircle, color: 'var(--obs-green)' },
  failed:  { icon: XCircle,     color: 'var(--obs-red)' },
  running: { icon: RefreshCw,   color: 'var(--obs-teal)' },
  pending: { icon: Clock,       color: 'var(--obs-amber)' },
}

export function AdminSourcesClient({ sources: initial }: { sources: DataSource[] }) {
  const [sources, setSources] = useState(initial)
  const supabase = createClient()

  async function toggleSource(id: string, active: boolean) {
    await supabase.from('data_sources').update({ is_active: active }).eq('id', id)
    setSources(prev => prev.map(s => s.id === id ? { ...s, is_active: active } : s))
  }

  async function triggerIngestion(slug: string) {
    await fetch(`/api/ingest/${slug}`, { method: 'POST' })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--obs-purple)]" />
          Data Sources
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {sources.filter(s => s.is_active).length} active of {sources.length} configured sources
        </p>
      </div>

      <div className="space-y-3">
        {sources.map(source => {
          const lastRun = source.ingestion_runs.sort(
            (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
          )[0]
          const statusCfg = lastRun ? STATUS_ICONS[lastRun.status as keyof typeof STATUS_ICONS] : null
          const StatusIcon = statusCfg?.icon

          return (
            <div
              key={source.id}
              className={cn(
                'glass rounded-xl border p-4 transition-all',
                source.is_active ? 'border-white/10' : 'border-white/5 opacity-60'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{source.name}</h3>
                    <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground font-mono">
                      {source.adapter_key}
                    </Badge>
                    {source.is_active ? (
                      <Badge className="text-[10px] bg-green-500/15 text-green-400 border-green-500/25">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground">Disabled</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground font-mono">
                    {source.base_url && (
                      <a
                        href={source.base_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--obs-teal)]/70 hover:text-[var(--obs-teal)] transition-colors"
                      >
                        {source.base_url}
                      </a>
                    )}
                    {source.fetch_interval_seconds && (
                      <span>Every {Math.round(source.fetch_interval_seconds / 60)}m</span>
                    )}
                    {source.last_fetched_at && (
                      <span>Last: {formatDistanceToNow(new Date(source.last_fetched_at), { addSuffix: true })}</span>
                    )}
                  </div>

                  {lastRun && (
                    <div className="flex items-center gap-2 mt-2">
                      {StatusIcon && (
                        <StatusIcon
                          className={cn('w-3 h-3', lastRun.status === 'running' && 'animate-spin')}
                          style={{ color: statusCfg?.color }}
                        />
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        Last run: {lastRun.status}
                        {lastRun.records_inserted != null && ` · ${lastRun.records_inserted} inserted`}
                        {' · '}{formatDistanceToNow(new Date(lastRun.started_at), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerIngestion(source.slug)}
                    disabled={!source.is_active}
                    className="border-border/30 text-muted-foreground h-8 text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1.5" />
                    Run Now
                  </Button>
                  <button
                    onClick={() => toggleSource(source.id, !source.is_active)}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                    title={source.is_active ? 'Disable' : 'Enable'}
                  >
                    {source.is_active
                      ? <ToggleRight className="w-5 h-5 text-[var(--obs-teal)]" />
                      : <ToggleLeft className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
