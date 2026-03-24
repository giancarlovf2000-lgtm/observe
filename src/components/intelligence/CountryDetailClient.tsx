'use client'

import { motion } from 'framer-motion'
import { Globe2, MapPin, Users, AlertTriangle, TrendingUp, Sword, Newspaper, Cloud, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'

interface Country {
  id: string
  name: string
  region: string | null
  subregion: string | null
  capital: string | null
  lat: number | null
  lng: number | null
  population: number | null
  risk_score: number | null
  flag_url: string | null
}

interface Event {
  id: string
  type: string
  title: string
  summary: string | null
  severity: SeverityLevel
  occurred_at: string
  tags: string[]
}

interface Conflict {
  id: string
  name: string
  conflict_type: string
  active: boolean | null
  intensity: number | null
  global_events: { title: string; severity: SeverityLevel; occurred_at: string; summary: string | null } | null
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

function RiskMeter({ score }: { score: number }) {
  const color = score >= 75 ? 'var(--obs-red)'
    : score >= 50 ? 'var(--obs-amber)'
    : score >= 25 ? 'var(--obs-teal)'
    : 'var(--obs-green)'

  const label = score >= 75 ? 'Critical'
    : score >= 50 ? 'High'
    : score >= 25 ? 'Moderate'
    : 'Low'

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">Risk Score</span>
        <span className="text-xs font-mono font-semibold" style={{ color }}>{score}/100 · {label}</span>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

export function CountryDetailClient({
  country,
  events,
  conflicts,
}: {
  country: Country
  events: Event[]
  conflicts: Conflict[]
}) {
  const riskScore = country.risk_score ?? 0
  const highSeverityEvents = events.filter(e => e.severity === 'critical' || e.severity === 'high')

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-white/5 p-6"
      >
        <div className="flex items-start gap-4">
          {country.flag_url ? (
            <img src={country.flag_url} alt={`${country.name} flag`} className="w-14 h-10 rounded object-cover border border-white/10 flex-shrink-0" />
          ) : (
            <div className="w-14 h-10 rounded bg-surface border border-border/30 flex items-center justify-center flex-shrink-0">
              <Globe2 className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{country.name}</h1>
              <Badge variant="outline" className="text-xs border-border/30 text-muted-foreground font-mono">
                {country.id.toUpperCase()}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {country.capital && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {country.capital}
                </span>
              )}
              {country.region && <span>{country.region}</span>}
              {country.subregion && <span>· {country.subregion}</span>}
              {country.population && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {(country.population / 1e6).toFixed(1)}M
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <RiskMeter score={riskScore} />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: events.length, color: 'var(--obs-teal)' },
          { label: 'High/Critical', value: highSeverityEvents.length, color: 'var(--obs-red)' },
          { label: 'Active Conflicts', value: conflicts.filter(c => c.active).length, color: 'var(--obs-amber)' },
          { label: 'Risk Score', value: riskScore, color: riskScore >= 60 ? 'var(--obs-red)' : 'var(--obs-green)' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 border border-white/5">
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
            Recent Intelligence Events
            <Badge variant="outline" className="text-xs border-border/40 text-muted-foreground ml-auto">
              {events.length}
            </Badge>
          </h2>

          {events.length === 0 ? (
            <div className="glass rounded-xl border border-white/5 p-8 text-center">
              <Globe2 className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No recent events for this country</p>
            </div>
          ) : (
            events.map((event, i) => {
              const Icon = EVENT_TYPE_ICONS[event.type] || Globe2
              const color = EVENT_TYPE_COLORS[event.type] || 'var(--obs-teal)'
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-xl border border-white/5 p-4 hover:glass-elevated transition-all"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <a
                          href={`/events/${event.id}`}
                          className="text-sm font-medium text-foreground hover:text-[var(--obs-teal)] transition-colors leading-tight"
                        >
                          {event.title}
                        </a>
                        <SeverityBadge severity={event.severity} className="flex-shrink-0" />
                      </div>
                      {event.summary && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{event.summary}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] border-border/20 px-1.5 py-0"
                          style={{ color, borderColor: `${color}30` }}
                        >
                          {event.type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground/60 font-mono flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Active conflicts */}
          {conflicts.length > 0 && (
            <div className="glass rounded-xl border border-[var(--obs-red)]/15 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Sword className="w-4 h-4 text-[var(--obs-red)]" />
                <span className="text-sm font-semibold text-foreground">Active Conflicts</span>
              </div>
              <div className="divide-y divide-border/20">
                {conflicts.map(c => (
                  <div key={c.id} className="px-4 py-3">
                    <div className="text-xs font-medium text-foreground mb-1">{c.name}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] border-[var(--obs-red)]/30 text-[var(--obs-red)]">
                        {c.conflict_type?.replace('_', ' ')}
                      </Badge>
                      {c.intensity != null && (
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Intensity {c.intensity}/10
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Country info */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Country Information
            </h3>
            <div className="space-y-2">
              {[
                { label: 'ISO Code', value: country.id.toUpperCase() },
                { label: 'Region', value: country.region },
                { label: 'Subregion', value: country.subregion },
                { label: 'Capital', value: country.capital },
                { label: 'Population', value: country.population ? `${(country.population / 1e6).toFixed(1)}M` : null },
                { label: 'Coordinates', value: country.lat != null && country.lng != null ? `${country.lat.toFixed(2)}, ${country.lng.toFixed(2)}` : null },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-xs text-foreground font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="glass rounded-xl border border-white/5 p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <a
                href={`/map?country=${country.id}`}
                className="flex items-center gap-2 text-xs text-[var(--obs-teal)] hover:text-[var(--obs-teal)]/80 transition-colors"
              >
                <MapPin className="w-3 h-3" />
                View on map
              </a>
              <a
                href={`/briefings?country=${country.id}`}
                className="flex items-center gap-2 text-xs text-[var(--obs-purple)] hover:text-[var(--obs-purple)]/80 transition-colors"
              >
                <TrendingUp className="w-3 h-3" />
                Generate country briefing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
