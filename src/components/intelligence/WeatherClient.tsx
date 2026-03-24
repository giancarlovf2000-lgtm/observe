'use client'

import { useState } from 'react'
import type { Json } from '@/types/database'
import { motion } from 'framer-motion'
import {
  Cloud, Wind, Waves, Flame, Mountain, Zap, Droplets,
  Thermometer, AlertTriangle, Globe2, Clock
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
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
  hurricane:  { icon: Wind,        color: 'var(--obs-red)',   label: 'Hurricane / Typhoon' },
  typhoon:    { icon: Wind,        color: 'var(--obs-red)',   label: 'Typhoon' },
  cyclone:    { icon: Wind,        color: 'var(--obs-red)',   label: 'Cyclone' },
  earthquake: { icon: Mountain,    color: 'var(--obs-amber)', label: 'Earthquake' },
  tsunami:    { icon: Waves,       color: 'var(--obs-blue)',  label: 'Tsunami' },
  flood:      { icon: Droplets,    color: 'var(--obs-blue)',  label: 'Flooding' },
  wildfire:   { icon: Flame,       color: 'var(--obs-amber)', label: 'Wildfire' },
  drought:    { icon: Thermometer, color: 'var(--obs-amber)', label: 'Drought' },
  tornado:    { icon: Wind,        color: 'var(--obs-green)', label: 'Tornado' },
  storm:      { icon: Zap,         color: 'var(--obs-purple)',label: 'Severe Storm' },
  blizzard:   { icon: Cloud,       color: 'var(--obs-teal)',  label: 'Blizzard / Winter Storm' },
  heatwave:   { icon: Thermometer, color: 'var(--obs-red)',   label: 'Heat Wave' },
  volcano:    { icon: Mountain,    color: 'var(--obs-red)',   label: 'Volcanic Activity' },
}

const WEATHER_FILTERS = ['all', 'hurricane', 'earthquake', 'flood', 'wildfire', 'tsunami', 'storm'] as const
type WeatherFilter = (typeof WEATHER_FILTERS)[number]

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
  const config = WEATHER_TYPE_CONFIG[weatherType] || WEATHER_TYPE_CONFIG.storm
  const Icon = config.icon
  const magnitude = event.weather_events?.[0]?.magnitude

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass rounded-xl border border-white/5 p-4 hover:glass-elevated transition-all"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${config.color}18`, border: `1px solid ${config.color}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground leading-tight">{event.title}</h3>
            <SeverityBadge severity={event.severity} className="flex-shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-[10px] border-border/30 px-1.5 py-0"
              style={{ color: config.color, borderColor: `${config.color}40` }}
            >
              {config.label}
            </Badge>
            {magnitude != null && (
              <span className="text-[10px] font-mono text-muted-foreground">
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
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-muted-foreground/60 font-mono flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
            </span>
            {event.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] border-border/20 text-muted-foreground/60 px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function StatsBar({ events, disasters }: { events: WeatherEvent[]; disasters: DisasterEvent[] }) {
  const critical = events.filter(e => e.severity === 'critical' || e.severity === 'high').length
  const hurricanes = events.filter(e => ['hurricane', 'typhoon', 'cyclone'].includes(getWeatherType(e))).length
  const earthquakes = events.filter(e => getWeatherType(e) === 'earthquake').length

  const stats = [
    { label: 'Active Events', value: events.length + disasters.length, color: 'var(--obs-teal)' },
    { label: 'High / Critical', value: critical, color: 'var(--obs-red)' },
    { label: 'Tropical Storms', value: hurricanes, color: 'var(--obs-amber)' },
    { label: 'Seismic Events', value: earthquakes, color: 'var(--obs-purple)' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="glass rounded-xl p-3 border border-white/5">
          <div className="text-xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

export function WeatherClient({ events, disasters }: { events: WeatherEvent[]; disasters: DisasterEvent[] }) {
  const [filter, setFilter] = useState<WeatherFilter>('all')

  const filtered = filter === 'all'
    ? events
    : events.filter(e => {
        const wt = getWeatherType(e)
        if (filter === 'hurricane') return ['hurricane', 'typhoon', 'cyclone'].includes(wt)
        return wt === filter
      })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Cloud className="w-5 h-5 text-[var(--obs-blue)]" />
          Weather & Disaster Monitoring
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Real-time tracking of extreme weather events, natural disasters, and humanitarian emergencies
        </p>
      </div>

      {/* Stats */}
      <StatsBar events={events} disasters={disasters} />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {WEATHER_FILTERS.map(f => {
          const config = f !== 'all' ? WEATHER_TYPE_CONFIG[f] : null
          const Icon = config?.icon ?? Globe2
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                filter === f
                  ? 'border-[var(--obs-blue)]/40 bg-[var(--obs-blue)]/10 text-[var(--obs-blue)]'
                  : 'border-border/30 text-muted-foreground hover:border-border/60 hover:text-foreground'
              )}
            >
              <Icon className="w-3 h-3" />
              {f === 'all' ? 'All Events' : WEATHER_TYPE_CONFIG[f]?.label ?? f}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main events column */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
            Active Weather Events
            <Badge variant="outline" className="text-xs border-border/40 text-muted-foreground ml-auto">
              {filtered.length}
            </Badge>
          </h2>

          {filtered.length === 0 ? (
            <div className="glass rounded-xl border border-white/5 p-8 text-center">
              <Cloud className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No events match current filter</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((event, i) => (
                <WeatherEventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* High-severity alerts */}
          <div className="glass rounded-xl border border-[var(--obs-red)]/20 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--obs-red)]" />
              <span className="text-sm font-semibold text-foreground">Critical Alerts</span>
            </div>
            <div className="divide-y divide-border/20">
              {events
                .filter(e => e.severity === 'critical' || e.severity === 'high')
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
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
                ))}
              {events.filter(e => e.severity === 'critical' || e.severity === 'high').length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No critical alerts
                </div>
              )}
            </div>
          </div>

          {/* Humanitarian emergencies */}
          {disasters.length > 0 && (
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[var(--obs-amber)]" />
                <span className="text-sm font-semibold text-foreground">Humanitarian</span>
              </div>
              <div className="divide-y divide-border/20">
                {disasters.slice(0, 6).map(d => (
                  <div key={d.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
                    <div className="text-xs font-medium text-foreground leading-tight mb-1">
                      {d.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={d.severity} />
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {formatDistanceToNow(new Date(d.occurred_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
