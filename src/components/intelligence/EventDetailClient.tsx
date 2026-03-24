'use client'

import { motion } from 'framer-motion'
import {
  Globe2, MapPin, Clock, Tag, ExternalLink, Bookmark, Share2,
  AlertTriangle, Sword, Newspaper, Cloud, TrendingUp, ChevronLeft
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { format, formatDistanceToNow } from 'date-fns'
import type { SeverityLevel } from '@/types'

interface GlobalEvent {
  id: string
  type: string
  title: string
  summary: string | null
  body: string | null
  severity: SeverityLevel
  country_id: string | null
  region: string | null
  lat: number | null
  lng: number | null
  occurred_at: string
  ingested_at: string | null
  tags: string[]
  ai_summary: string | null
  metadata: Record<string, unknown> | null
  data_sources: { name: string; base_url: string | null } | null
}

interface RelatedEvent {
  id: string
  title: string
  severity: SeverityLevel
  type: string
  occurred_at: string
}

const EVENT_TYPE_ICONS: Record<string, React.ElementType> = {
  conflict:     Sword,
  news:         Newspaper,
  weather:      Cloud,
  market:       TrendingUp,
  political:    AlertTriangle,
  humanitarian: Globe2,
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  conflict:     'var(--obs-red)',
  news:         'var(--obs-teal)',
  weather:      'var(--obs-blue)',
  market:       'var(--obs-amber)',
  political:    'var(--obs-purple)',
  humanitarian: 'var(--obs-green)',
}

export function EventDetailClient({
  event,
  relatedEvents,
}: {
  event: GlobalEvent
  relatedEvents: RelatedEvent[]
}) {
  const Icon = EVENT_TYPE_ICONS[event.type] || Globe2
  const color = EVENT_TYPE_COLORS[event.type] || 'var(--obs-teal)'

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <a
        href="javascript:history.back()"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Back
      </a>

      {/* Event header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-white/5 p-6"
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-lg font-bold text-foreground leading-tight flex-1">{event.title}</h1>
              <SeverityBadge severity={event.severity} className="flex-shrink-0 mt-0.5" />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Badge
                variant="outline"
                className="text-xs border-border/30 capitalize"
                style={{ color, borderColor: `${color}40` }}
              >
                {event.type}
              </Badge>
              {event.country_id && (
                <a
                  href={`/countries/${event.country_id}`}
                  className="flex items-center gap-1 hover:text-[var(--obs-teal)] transition-colors"
                >
                  <Globe2 className="w-3 h-3" />
                  {event.country_id.toUpperCase()}
                </a>
              )}
              {event.region && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.region}
                </span>
              )}
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {format(new Date(event.occurred_at), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-border/30 text-muted-foreground h-8 text-xs">
            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="border-border/30 text-muted-foreground h-8 text-xs">
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            Share
          </Button>
          {event.data_sources?.base_url && (
            <a
              href={event.data_sources.base_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border/30 text-muted-foreground h-8 text-xs')}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Source
            </a>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Summary */}
          {event.summary && (
            <div className="glass rounded-xl border border-white/5 p-5">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Summary</h2>
              <p className="text-sm text-foreground/85 leading-relaxed">{event.summary}</p>
            </div>
          )}

          {/* AI Summary */}
          {event.ai_summary && (
            <div className="glass rounded-xl border border-[var(--obs-purple)]/20 p-5">
              <h2 className="text-xs font-semibold text-[var(--obs-purple)] uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--obs-purple)] animate-pulse" />
                AI Analysis
              </h2>
              <p className="text-sm text-foreground/85 leading-relaxed">{event.ai_summary}</p>
            </div>
          )}

          {/* Full body */}
          {event.body && (
            <div className="glass rounded-xl border border-white/5 p-5">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Full Report</h2>
              <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{event.body}</div>
            </div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <Tag className="w-3.5 h-3.5 text-muted-foreground/60" />
              {event.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-[10px] border-border/20 text-muted-foreground/60 px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Event Details
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Type', value: event.type },
                { label: 'Severity', value: event.severity },
                { label: 'Country', value: event.country_id?.toUpperCase() },
                { label: 'Region', value: event.region },
                {
                  label: 'Coordinates',
                  value: event.lat != null && event.lng != null
                    ? `${event.lat.toFixed(3)}, ${event.lng.toFixed(3)}`
                    : null,
                },
                {
                  label: 'Occurred',
                  value: format(new Date(event.occurred_at), 'PPpp'),
                },
                {
                  label: 'Ingested',
                  value: event.ingested_at
                    ? formatDistanceToNow(new Date(event.ingested_at), { addSuffix: true })
                    : null,
                },
                {
                  label: 'Source',
                  value: event.data_sources?.name,
                },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-muted-foreground flex-shrink-0">{row.label}</span>
                  <span className="text-xs text-foreground font-mono text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Related Events
                </h3>
              </div>
              <div className="divide-y divide-border/10">
                {relatedEvents.map(re => {
                  const RIcon = EVENT_TYPE_ICONS[re.type] || Globe2
                  const rc = EVENT_TYPE_COLORS[re.type] || 'var(--obs-teal)'
                  return (
                    <a
                      key={re.id}
                      href={`/events/${re.id}`}
                      className="flex items-start gap-2 px-4 py-3 hover:bg-white/3 transition-colors"
                    >
                      <RIcon className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: rc }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-foreground/85 leading-tight line-clamp-2">{re.title}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <SeverityBadge severity={re.severity} />
                          <span className="text-[10px] text-muted-foreground/50 font-mono">
                            {formatDistanceToNow(new Date(re.occurred_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
