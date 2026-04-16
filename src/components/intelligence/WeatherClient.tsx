'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Json } from '@/types/database'
import {
  Cloud, Wind, Waves, Flame, Mountain, Zap, Droplets,
  Thermometer, AlertTriangle, Globe2, Clock, Activity
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { PulseIndicator } from '@/components/shared/PulseIndicator'
import { TranslateBanner } from '@/components/shared/TranslateBanner'
import { usePageTranslation } from '@/hooks/usePageTranslation'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'

interface WeatherEvent {
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
  metadata: Json | null
  weather_events?: Array<{
    weather_type: string
    magnitude: number | null
    valid_from: string | null
    valid_until: string | null
  }> | null
}

interface DisasterEvent {
  id: string
  title: string
  summary: string | null
  severity: SeverityLevel
  country_id: string | null
  region: string | null
  occurred_at: string
  tags: string[]
}

const WEATHER_TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  hurricane:  { icon: Wind,        color: 'var(--obs-red)',    label: 'Hurricane / Typhoon' },
  typhoon:    { icon: Wind,        color: 'var(--obs-red)',    label: 'Typhoon' },
  cyclone:    { icon: Wind,        color: 'var(--obs-red)',    label: 'Cyclone' },
  earthquake: { icon: Mountain,    color: 'var(--obs-amber)',  label: 'Earthquake' },
  tsunami:    { icon: Waves,       color: 'var(--obs-blue)',   label: 'Tsunami' },
  flood:      { icon: Droplets,    color: 'var(--obs-blue)',   label: 'Flooding' },
  wildfire:   { icon: Flame,       color: 'var(--obs-amber)',  label: 'Wildfire' },
  drought:    { icon: Thermometer, color: 'var(--obs-amber)',  label: 'Drought' },
  tornado:    { icon: Wind,        color: 'var(--obs-green)',  label: 'Tornado' },
  storm:      { icon: Zap,         color: 'var(--obs-purple)', label: 'Severe Storm' },
  blizzard:   { icon: Cloud,       color: 'var(--obs-teal)',   label: 'Blizzard / Winter Storm' },
  heatwave:   { icon: Thermometer, color: 'var(--obs-red)',    label: 'Heat Wave' },
  volcano:    { icon: Mountain,    color: 'var(--obs-red)',    label: 'Volcanic Activity' },
}

const WEATHER_FILTERS = ['all', 'hurricane', 'earthquake', 'flood', 'wildfire', 'tsunami', 'storm'] as const
type WeatherFilter = (typeof WEATHER_FILTERS)[number]

const SEVERITY_PULSE: Record<SeverityLevel, string> = {
  critical: 'bg-red-500 animate-pulse',
  high:     'bg-orange-500 animate-pulse',
  moderate: 'bg-yellow-500',
  low:      'bg-green-500',
  minimal:  'bg-slate-500',
}

function getWeatherType(event: WeatherEvent): string {
  if (event.weather_events?.[0]?.weather_type) return event.weather_events[0].weather_type
  const lower = event.title.toLowerCase()
  for (const key of Object.keys(WEATHER_TYPE_CONFIG)) {
    if (lower.includes(key)) return key
  }
  const tags = event.tags.map(t => t.toLowerCase())
  for (const key of Object.keys(WEATHER_TYPE_CONFIG)) {
    if (tags.some(t => t.includes(key))) return key
  }
  return 'storm'
}

function WeatherEventCard({ event, index }: { event: WeatherEvent; index: number }) {
  const weatherType = getWeatherType(event)
  const config      = WEATHER_TYPE_CONFIG[weatherType] || WEATHER_TYPE_CONFIG.storm
  const Icon        = config.icon
  const magnitude   = event.weather_events?.[0]?.magnitude
  const isCritical  = event.severity === 'critical' || event.severity === 'high'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035 }}
    >
      <Link href={`/events/${event.id}`}>
        <div className={cn(
          'glass rounded-xl border transition-all cursor-pointer group hover:glass-elevated',
          isCritical ? 'border-red-500/20 hover:border-red-500/30' : 'border-white/5 hover:border-white/10'
        )}>
          {/* Top severity accent */}
          {isCritical && (
            <div className="h-0.5 bg-gradient-to-r from-red-500/80 to-orange-500/40 rounded-t-xl" />
          )}
          <div className="p-4 flex items-start gap-3">
            {/* Icon with pulse for critical */}
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${config.color}18`, border: `1px solid ${config.color}30` }}
            >
              <Icon className="w-5 h-5" style={{ color: config.color }} />
              {isCritical && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-background" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-[var(--obs-blue)] transition-colors">
                  {event.title}
                </h3>
                <SeverityBadge severity={event.severity} className="flex-shrink-0" />
              </div>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-[10px] border-border/30 px-1.5 py-0"
                  style={{ color: config.color, borderColor: `${config.color}40` }}
                >
                  {config.label}
                </Badge>
                {magnitude != null && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-1.5 py-0 rounded">
                    {weatherType === 'earthquake' ? `M${magnitude.toFixed(1)}` : `Cat ${magnitude}`}
                  </span>
                )}
                {(event.country_id || event.region) && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Globe2 className="w-2.5 h-2.5" />
                    {event.region || event.country_id}
                  </span>
                )}
              </div>

              {event.summary && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                  {event.summary}
                </p>
              )}

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50 font-mono">
                <Clock className="w-2.5 h-2.5" />
                {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function StatsBar({ events, disasters }: { events: WeatherEvent[]; disasters: DisasterEvent[] }) {
  const critical   = events.filter(e => e.severity === 'critical' || e.severity === 'high').length
  const hurricanes = events.filter(e => ['hurricane', 'typhoon', 'cyclone'].includes(getWeatherType(e))).length
  const quakes     = events.filter(e => getWeatherType(e) === 'earthquake').length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        { label: 'Active Events',   value: events.length + disasters.length, color: 'var(--obs-teal)',   sub: 'tracked now' },
        { label: 'High / Critical', value: critical,                         color: 'var(--obs-red)',    sub: 'alert level' },
        { label: 'Tropical Storms', value: hurricanes,                       color: 'var(--obs-amber)',  sub: 'category 1+' },
        { label: 'Seismic Events',  value: quakes,                           color: 'var(--obs-purple)', sub: 'recorded' },
      ].map(s => (
        <div key={s.label} className="glass rounded-xl p-4 border border-white/5">
          <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs font-medium text-foreground/80 mt-0.5">{s.label}</div>
          <div className="text-[10px] text-muted-foreground">{s.sub}</div>
        </div>
      ))}
    </div>
  )
}

export function WeatherClient({ events, disasters }: { events: WeatherEvent[]; disasters: DisasterEvent[] }) {
  const [filter, setFilter] = useState<WeatherFilter>('all')

  // Translation
  const translatableItems = events.map(e => ({ title: e.title, summary: e.summary ?? undefined }))
  const { items: translated, isTranslating, isTranslated, translate, reset } = usePageTranslation(translatableItems)
  const displayEvents = events.map((e, i) => ({
    ...e,
    title:   translated[i]?.title   ?? e.title,
    summary: translated[i]?.summary ?? e.summary,
  }))

  const filtered = filter === 'all'
    ? displayEvents
    : displayEvents.filter(e => {
        const wt = getWeatherType(e)
        if (filter === 'hurricane') return ['hurricane', 'typhoon', 'cyclone'].includes(wt)
        return wt === filter
      })

  // Sort: critical first, then by date
  const sorted = [...filtered].sort((a, b) => {
    const sevScore = { critical: 5, high: 4, moderate: 3, low: 2, minimal: 1 }
    const sd = (sevScore[b.severity] ?? 0) - (sevScore[a.severity] ?? 0)
    if (sd !== 0) return sd
    return new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  })

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Cloud className="w-5 h-5 text-[var(--obs-blue)]" />
          Weather & Disaster Monitoring
        </h1>
        <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
          <PulseIndicator color="var(--obs-blue)" />
          <span>Real-time extreme weather, natural disasters &amp; humanitarian emergencies</span>
        </div>
      </div>

      {/* Translate banner */}
      <TranslateBanner
        isTranslated={isTranslated}
        isTranslating={isTranslating}
        onTranslate={translate}
        onReset={reset}
      />

      {/* Stats */}
      <StatsBar events={events} disasters={disasters} />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {WEATHER_FILTERS.map(f => {
          const config = f !== 'all' ? WEATHER_TYPE_CONFIG[f] : null
          const Icon   = config?.icon ?? Globe2
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                filter === f
                  ? 'border-[var(--obs-blue)]/50 bg-[var(--obs-blue)]/12 text-[var(--obs-blue)]'
                  : 'border-border/30 text-muted-foreground hover:border-border/60 hover:text-foreground'
              )}
            >
              <Icon className="w-3 h-3" />
              {f === 'all' ? 'All Events' : config?.label ?? f}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main events */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
            <h2 className="text-sm font-semibold text-foreground">Active Weather Events</h2>
            <Badge variant="outline" className="text-xs border-border/40 text-muted-foreground ml-auto">
              {sorted.length}
            </Badge>
          </div>

          <AnimatePresence mode="wait">
            {sorted.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass rounded-xl border border-white/5 p-8 text-center"
              >
                <Cloud className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No events match this filter</p>
              </motion.div>
            ) : (
              <motion.div
                key={filter}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {sorted.map((event, i) => (
                  <WeatherEventCard key={event.id} event={event} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Critical alerts */}
          <div className="glass rounded-xl border border-[var(--obs-red)]/20 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--obs-red)]" />
              <span className="text-sm font-semibold text-foreground">Critical Alerts</span>
              {events.filter(e => e.severity === 'critical').length > 0 && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <div className="divide-y divide-border/15">
              {events
                .filter(e => e.severity === 'critical' || e.severity === 'high')
                .slice(0, 6)
                .map(event => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="px-4 py-3 hover:bg-white/3 transition-colors cursor-pointer">
                      <div className="flex items-start gap-2">
                        <span className={cn(
                          'w-2 h-2 rounded-full flex-shrink-0 mt-1',
                          SEVERITY_PULSE[event.severity]
                        )} />
                        <div>
                          <div className="text-xs font-medium text-foreground leading-tight mb-1">
                            {event.title}
                          </div>
                          <div className="flex items-center gap-2">
                            <SeverityBadge severity={event.severity} />
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              {events.filter(e => e.severity === 'critical' || e.severity === 'high').length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  <Cloud className="w-6 h-6 mx-auto mb-1 text-muted-foreground/20" />
                  No critical alerts
                </div>
              )}
            </div>
          </div>

          {/* Humanitarian */}
          {disasters.length > 0 && (
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[var(--obs-amber)]" />
                <span className="text-sm font-semibold text-foreground">Humanitarian</span>
                <Badge variant="outline" className="ml-auto text-[10px] border-border/40 text-muted-foreground">
                  {disasters.length}
                </Badge>
              </div>
              <div className="divide-y divide-border/15">
                {disasters.slice(0, 6).map(d => (
                  <Link key={d.id} href={`/events/${d.id}`}>
                    <div className="px-4 py-3 hover:bg-white/3 transition-colors cursor-pointer">
                      <div className="text-xs font-medium text-foreground leading-tight mb-1">{d.title}</div>
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={d.severity} />
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatDistanceToNow(new Date(d.occurred_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick stat: most active regions */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3.5 h-3.5 text-[var(--obs-teal)]" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Most Active Regions</span>
            </div>
            {(() => {
              const regionCounts: Record<string, number> = {}
              for (const e of events) {
                const r = e.region || e.country_id
                if (r) regionCounts[r] = (regionCounts[r] || 0) + 1
              }
              return Object.entries(regionCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([region, count]) => (
                  <div key={region} className="flex items-center justify-between py-1">
                    <span className="text-xs text-foreground/80 truncate">{region}</span>
                    <span className="text-xs font-mono text-muted-foreground ml-2">{count}</span>
                  </div>
                ))
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
