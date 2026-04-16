'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plane, Ship, Navigation, Anchor, MapPin, Clock, Activity, Globe2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/useT'

interface Flight {
  id: string
  callsign: string
  icao24: string | null
  origin_iata: string | null
  dest_iata: string | null
  lat: number | null
  lng: number | null
  altitude_ft: number | null
  speed_kts: number | null
  heading: number | null
  on_ground: boolean | null
  track_at: string
}

interface Vessel {
  id: string
  mmsi: string
  name: string | null
  vessel_type: string | null
  flag: string | null
  lat: number | null
  lng: number | null
  speed_kts: number | null
  heading: number | null
  destination: string | null
  cargo_type: string | null
  is_tanker: boolean | null
  track_at: string
}

type Tab = 'flights' | 'vessels'

const VESSEL_TYPE_COLORS: Record<string, string> = {
  cargo:      'var(--obs-blue)',
  tanker:     'var(--obs-amber)',
  passenger:  'var(--obs-teal)',
  military:   'var(--obs-red)',
  fishing:    'var(--obs-green)',
  tug:        'var(--obs-purple)',
}

function FlightRow({ flight, index }: { flight: Flight; index: number }) {
  const isAirborne = !flight.on_ground
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="flex items-center gap-3 px-4 py-3 border-b border-border/10 hover:bg-white/3 transition-colors last:border-0"
    >
      <div className={cn(
        'w-2 h-2 rounded-full flex-shrink-0',
        isAirborne ? 'bg-[var(--obs-teal)]' : 'bg-muted-foreground/40'
      )} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-semibold text-foreground">{flight.callsign}</span>
          {flight.origin_iata && flight.dest_iata && (
            <span className="text-xs text-muted-foreground">
              {flight.origin_iata} → {flight.dest_iata}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {flight.altitude_ft != null && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {Math.round(flight.altitude_ft / 1000)}k ft
            </span>
          )}
          {flight.speed_kts != null && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {flight.speed_kts} kts
            </span>
          )}
          {flight.heading != null && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {flight.heading}°
            </span>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        {flight.lat != null && flight.lng != null && (
          <div className="text-[10px] font-mono text-muted-foreground/60">
            {flight.lat.toFixed(2)}, {flight.lng.toFixed(2)}
          </div>
        )}
        <div className="text-[10px] text-muted-foreground/50 font-mono">
          {formatDistanceToNow(new Date(flight.track_at), { addSuffix: true })}
        </div>
      </div>
    </motion.div>
  )
}

function VesselRow({ vessel, index }: { vessel: Vessel; index: number }) {
  const typeColor = vessel.vessel_type
    ? VESSEL_TYPE_COLORS[vessel.vessel_type.toLowerCase()] || 'var(--obs-teal)'
    : 'var(--obs-teal)'

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="flex items-center gap-3 px-4 py-3 border-b border-border/10 hover:bg-white/3 transition-colors last:border-0"
    >
      <Ship className="w-3.5 h-3.5 flex-shrink-0" style={{ color: typeColor }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{vessel.name}</span>
          {vessel.vessel_type && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-border/30 flex-shrink-0"
              style={{ color: typeColor, borderColor: `${typeColor}40` }}
            >
              {vessel.vessel_type}
            </Badge>
          )}
          {vessel.flag && (
            <span className="text-[10px] text-muted-foreground font-mono">{vessel.flag}</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {vessel.destination && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Anchor className="w-2.5 h-2.5" />
              {vessel.destination}
            </span>
          )}
          {vessel.speed_kts != null && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {vessel.speed_kts} kts
            </span>
          )}
          {vessel.cargo_type && (
            <span className="text-[10px] text-muted-foreground">{vessel.cargo_type}</span>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        {vessel.lat != null && vessel.lng != null && (
          <div className="text-[10px] font-mono text-muted-foreground/60">
            {vessel.lat.toFixed(2)}, {vessel.lng.toFixed(2)}
          </div>
        )}
        <div className="text-[10px] text-muted-foreground/50 font-mono">
          {formatDistanceToNow(new Date(vessel.track_at), { addSuffix: true })}
        </div>
      </div>
    </motion.div>
  )
}

export function TransportClient({ flights, vessels }: { flights: Flight[]; vessels: Vessel[] }) {
  const [tab, setTab] = useState<Tab>('flights')
  const { t } = useT()
  const tr = t('transport')

  const airborne = flights.filter(f => !f.on_ground)
  const grounded = flights.filter(f => f.on_ground)

  const tankers = vessels.filter(v => v.is_tanker || v.vessel_type?.toLowerCase() === 'tanker')
  const cargo = vessels.filter(v => v.vessel_type?.toLowerCase() === 'cargo')

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[var(--obs-teal)]" />
          {tr.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{tr.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: tr.airborne,  value: airborne.length, icon: Plane,   color: 'var(--obs-teal)' },
          { label: tr.vessels,   value: vessels.length,  icon: Ship,    color: 'var(--obs-blue)' },
          { label: 'Tankers',    value: tankers.length,  icon: Anchor,  color: 'var(--obs-amber)' },
          { label: 'Cargo',      value: cargo.length,    icon: Globe2,  color: 'var(--obs-green)' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 glass rounded-xl p-1 border border-white/5 w-fit">
        {(['flights', 'vessels'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t
                ? 'bg-[var(--obs-teal)]/15 text-[var(--obs-teal)] border border-[var(--obs-teal)]/30'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'flights' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
            {t === 'flights' ? tr.flights : tr.vessels}
            <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground">
              {t === 'flights' ? flights.length : vessels.length}
            </Badge>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'flights' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Airborne */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--obs-teal)]" />
              <span className="text-sm font-semibold text-foreground">{tr.airborne}</span>
              <Badge variant="outline" className="ml-auto text-xs border-border/40 text-muted-foreground">
                {airborne.length}
              </Badge>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {airborne.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No airborne flights tracked
                </div>
              ) : (
                airborne.map((f, i) => <FlightRow key={f.id} flight={f} index={i} />)
              )}
            </div>
          </div>

          {/* On ground */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">{tr.onGround}</span>
              <Badge variant="outline" className="ml-auto text-xs border-border/40 text-muted-foreground">
                {grounded.length}
              </Badge>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {grounded.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No grounded flights tracked
                </div>
              ) : (
                grounded.map((f, i) => <FlightRow key={f.id} flight={f} index={i} />)
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tankers */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-[var(--obs-amber)]" />
              <span className="text-sm font-semibold text-foreground">Tankers & Cargo</span>
              <Badge variant="outline" className="ml-auto text-xs border-border/40 text-muted-foreground">
                {tankers.length + cargo.length}
              </Badge>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {[...tankers, ...cargo].length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-muted-foreground">No vessels tracked</div>
              ) : (
                [...tankers, ...cargo].map((v, i) => <VesselRow key={v.id} vessel={v} index={i} />)
              )}
            </div>
          </div>

          {/* Other vessels */}
          <div className="glass rounded-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Ship className="w-4 h-4 text-[var(--obs-blue)]" />
              <span className="text-sm font-semibold text-foreground">Other Vessels</span>
              <Badge variant="outline" className="ml-auto text-xs border-border/40 text-muted-foreground">
                {vessels.filter(v => !v.is_tanker && v.vessel_type?.toLowerCase() !== 'cargo' && v.vessel_type?.toLowerCase() !== 'tanker').length}
              </Badge>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {vessels
                .filter(v => !v.is_tanker && v.vessel_type?.toLowerCase() !== 'cargo' && v.vessel_type?.toLowerCase() !== 'tanker')
                .map((v, i) => <VesselRow key={v.id} vessel={v} index={i} />)
              }
            </div>
          </div>
        </div>
      )}

      {/* Note about live data */}
      <div className="flex items-start gap-2 glass rounded-xl p-3 border border-white/5">
        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Flight and vessel positions are updated via OpenSky Network and public AIS feeds.
          Data may be delayed 15–60 seconds. Military and classified movements are not tracked.
        </p>
      </div>
    </div>
  )
}
