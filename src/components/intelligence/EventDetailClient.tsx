'use client'

import { motion } from 'framer-motion'
import {
  Globe2, MapPin, Clock, Tag, ExternalLink, Bookmark, Share2,
  AlertTriangle, Sword, Newspaper, Cloud, TrendingUp, ChevronLeft,
  Brain, Zap, Activity, FileText
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { format, formatDistanceToNow } from 'date-fns'
import type { SeverityLevel } from '@/types'
import Link from 'next/link'
import { useT } from '@/hooks/useT'
import { usePageTranslation } from '@/hooks/usePageTranslation'
import { TranslateBanner } from '@/components/shared/TranslateBanner'

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

const EVENT_TYPE_LABELS: Record<string, string> = {
  conflict:     'CONFLICT',
  news:         'NEWS',
  weather:      'WEATHER',
  market:       'MARKET SIGNAL',
  political:    'POLITICAL',
  humanitarian: 'HUMANITARIAN',
}

export function EventDetailClient({
  event,
  relatedEvents,
}: {
  event: GlobalEvent
  relatedEvents: RelatedEvent[]
}) {
  const { t } = useT()
  const ev = t('event')

  // Translate DB content on demand
  const translatableItems = [{ title: event.title, summary: event.summary ?? undefined, ai_summary: event.ai_summary ?? undefined, body: event.body ?? undefined }]
  const { items: translated, isTranslating, isTranslated, translate, reset } = usePageTranslation(translatableItems)
  const displayEvent = {
    ...event,
    title:      translated[0]?.title      ?? event.title,
    summary:    translated[0]?.summary    ?? event.summary,
    ai_summary: translated[0]?.ai_summary ?? event.ai_summary,
    body:       translated[0]?.body       ?? event.body,
  }

  const Icon  = EVENT_TYPE_ICONS[event.type] || Globe2
  const color = EVENT_TYPE_COLORS[event.type] || 'var(--obs-teal)'
  const label = EVENT_TYPE_LABELS[event.type] || event.type.toUpperCase()

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <div className="flex items-center justify-between">
        <a
          href="javascript:history.back()"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {ev.back}
        </a>
        <TranslateBanner
          isTranslated={isTranslated}
          isTranslating={isTranslating}
          onTranslate={translate}
          onReset={reset}
          className="border-0 bg-transparent p-0"
        />
      </div>

      {/* Event header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-white/5 overflow-hidden"
      >
        {/* Colored top strip */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${color}, ${color}40)` }} />

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4 mb-5">
            {/* Type icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Type + severity */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono font-bold tracking-wider"
                  style={{ color, borderColor: `${color}50`, background: `${color}10` }}
                >
                  {label}
                </Badge>
                <SeverityBadge severity={event.severity} />
                {event.data_sources?.name && (
                  <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">
                    via {event.data_sources.name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-3">
                {displayEvent.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {event.country_id && (
                  <Link
                    href={`/countries/${event.country_id}`}
                    className="flex items-center gap-1 hover:text-[var(--obs-teal)] transition-colors font-mono"
                  >
                    <Globe2 className="w-3 h-3" />
                    {event.country_id.toUpperCase()}
                  </Link>
                )}
                {event.region && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.region}
                  </span>
                )}
                {event.lat != null && event.lng != null && (
                  <span className="font-mono text-muted-foreground/50">
                    {event.lat.toFixed(2)}°, {event.lng.toFixed(2)}°
                  </span>
                )}
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {format(new Date(event.occurred_at), 'MMM d, yyyy HH:mm')} UTC
                </span>
                <span className="text-muted-foreground/40">
                  ({formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })})
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/20">
            <Button variant="outline" size="sm" className="border-border/30 text-muted-foreground h-8 text-xs hover:bg-white/5">
              <Bookmark className="w-3.5 h-3.5 mr-1.5" />
              {ev.save}
            </Button>
            <Button variant="outline" size="sm" className="border-border/30 text-muted-foreground h-8 text-xs hover:bg-white/5">
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              {ev.share}
            </Button>
            {event.data_sources?.base_url && (
              <a
                href={event.data_sources.base_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-border/30 text-muted-foreground h-8 text-xs hover:bg-white/5')}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                {ev.source}
              </a>
            )}
            <Link
              href="/map"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'ml-auto border-[var(--obs-teal)]/30 text-[var(--obs-teal)] h-8 text-xs hover:bg-[var(--obs-teal)]/10')}
            >
              <Activity className="w-3.5 h-3.5 mr-1.5" />
              {ev.viewOnMap}
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Summary */}
          {displayEvent.summary && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl border border-white/5 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{ev.summary}</h2>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">{displayEvent.summary}</p>
            </motion.div>
          )}

          {/* AI Analysis — featured prominently */}
          {displayEvent.ai_summary && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-xl border border-[var(--obs-purple)]/25 p-5 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-15"
                style={{ background: 'radial-gradient(ellipse at top right, oklch(0.60 0.20 280 / 0.4), transparent 70%)' }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[var(--obs-purple)]/20 border border-[var(--obs-purple)]/30 flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 text-[var(--obs-purple)]" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">{ev.aiAnalysis}</h2>
                  <Badge className="text-[10px] bg-[var(--obs-purple)]/20 text-[var(--obs-purple)] border-[var(--obs-purple)]/30">
                    Perplexity Sonar
                  </Badge>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--obs-purple)] animate-pulse ml-auto" />
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">{displayEvent.ai_summary}</p>
              </div>
            </motion.div>
          )}

          {/* Full body */}
          {displayEvent.body && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl border border-white/5 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{ev.fullReport}</h2>
              </div>
              <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{displayEvent.body}</div>
            </motion.div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag className="w-3.5 h-3.5 text-muted-foreground/40" />
              {event.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] border-border/20 text-muted-foreground/60 px-2 py-0.5 hover:border-border/40 transition-colors cursor-default"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Event metadata */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="glass rounded-xl border border-white/5 p-4"
          >
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {ev.eventDetails}
            </h3>
            <div className="space-y-2.5">
              {[
                { label: ev.type,        value: label,              color },
                { label: ev.severity,    value: event.severity },
                { label: ev.country,     value: event.country_id?.toUpperCase() },
                { label: ev.region,      value: event.region },
                {
                  label: ev.coordinates,
                  value: event.lat != null && event.lng != null
                    ? `${event.lat.toFixed(3)}°, ${event.lng.toFixed(3)}°`
                    : null,
                },
                {
                  label: ev.occurred,
                  value: format(new Date(event.occurred_at), 'PPpp'),
                },
                {
                  label: ev.ingested,
                  value: event.ingested_at
                    ? formatDistanceToNow(new Date(event.ingested_at), { addSuffix: true })
                    : null,
                },
                {
                  label: ev.source,
                  value: event.data_sources?.name,
                },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex items-start justify-between gap-3">
                  <span className="text-[10px] text-muted-foreground/60 flex-shrink-0 uppercase tracking-wide">{row.label}</span>
                  <span
                    className="text-xs text-foreground font-mono text-right leading-relaxed"
                    style={row.color ? { color: row.color } : undefined}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="glass rounded-xl border border-white/5 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {ev.relatedIntel}
                </h3>
              </div>
              <div className="divide-y divide-border/10">
                {relatedEvents.map(re => {
                  const RIcon = EVENT_TYPE_ICONS[re.type] || Globe2
                  const rc    = EVENT_TYPE_COLORS[re.type] || 'var(--obs-teal)'
                  return (
                    <Link
                      key={re.id}
                      href={`/events/${re.id}`}
                      className="flex items-start gap-2.5 px-4 py-3 hover:bg-white/3 transition-colors group"
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${rc}15` }}
                      >
                        <RIcon className="w-3 h-3" style={{ color: rc }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-foreground/85 leading-tight line-clamp-2 group-hover:text-[var(--obs-teal)] transition-colors">
                          {re.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <SeverityBadge severity={re.severity} />
                          <span className="text-[10px] text-muted-foreground/50 font-mono">
                            {formatDistanceToNow(new Date(re.occurred_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
