'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ScatterplotLayer, IconLayer } from '@deck.gl/layers'
import { createClient } from '@/lib/supabase/client'
import { useFilterStore } from '@/store/filterStore'
import { useMapStore } from '@/store/mapStore'
import { useUIStore } from '@/store/uiStore'
import { SEVERITY_COLORS, EVENT_TYPE_COLORS } from '@/lib/map/styleConfig'
import type { SeverityLevel, EventType } from '@/types'

interface EventPoint {
  id: string
  lat: number
  lng: number
  type: EventType
  severity: SeverityLevel
  title: string
  country_id: string | null
  occurred_at: string
}

// Fetch events for map rendering (minimal fields for performance)
async function fetchMapEvents(activeLayers: Set<string>, dateHours: number) {
  const supabase = createClient()
  const cutoff = new Date(Date.now() - dateHours * 60 * 60 * 1000).toISOString()

  // Map layer IDs to event types
  const typeMap: Record<string, EventType> = {
    conflicts: 'conflict',
    news: 'news',
    weather: 'weather',
    disasters: 'weather',
    markets: 'market',
    political: 'political',
  }

  const activeTypes = [...activeLayers]
    .map((lid) => typeMap[lid])
    .filter(Boolean) as EventType[]

  if (activeTypes.length === 0) return []

  const { data } = await supabase
    .from('global_events')
    .select('id, type, title, severity, country_id, lat, lng, occurred_at')
    .in('type', activeTypes)
    .eq('is_active', true)
    .gte('occurred_at', cutoff)
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .order('occurred_at', { ascending: false })
    .limit(500)

  return (data ?? []).filter(
    (e): e is EventPoint =>
      e.lat !== null &&
      e.lng !== null &&
      typeof e.lat === 'number' &&
      typeof e.lng === 'number'
  )
}

async function fetchVessels() {
  const supabase = createClient()
  const { data } = await supabase
    .from('vessels')
    .select('id, lat, lng, name, vessel_type, flag, speed_kts')
    .limit(200)
  return data ?? []
}

async function fetchFlights() {
  const supabase = createClient()
  const { data } = await supabase
    .from('flight_tracks')
    .select('id, lat, lng, callsign, altitude_ft, speed_kts, on_ground')
    .eq('on_ground', false)
    .limit(300)
  return data ?? []
}

export function useMapLayers() {
  const { activeLayers, dateHours } = useFilterStore()
  const { setSelectedEvent, hoveredEventId, setHoveredEventId } = useMapStore()
  const { openIntelDrawer } = useUIStore()

  const hasEventLayers = activeLayers.has('conflicts') || activeLayers.has('news') ||
    activeLayers.has('weather') || activeLayers.has('disasters') ||
    activeLayers.has('markets') || activeLayers.has('political')

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['map-events', [...activeLayers].sort().join(','), dateHours],
    queryFn: () => fetchMapEvents(activeLayers, dateHours),
    enabled: hasEventLayers,
    refetchInterval: 60_000,
  })

  const { data: vessels = [], isLoading: vesselsLoading } = useQuery({
    queryKey: ['map-vessels'],
    queryFn: fetchVessels,
    enabled: activeLayers.has('shipping'),
    refetchInterval: 30_000,
  })

  const { data: flights = [], isLoading: flightsLoading } = useQuery({
    queryKey: ['map-flights'],
    queryFn: fetchFlights,
    enabled: activeLayers.has('flights'),
    refetchInterval: 30_000,
  })

  const layers = useMemo(() => {
    const result = []

    // --- Conflicts + Political: ScatterplotLayer with pulsing effect ---
    const conflictEvents = events.filter(
      (e) => e.type === 'conflict' || e.type === 'political'
    )
    if (conflictEvents.length > 0 && (activeLayers.has('conflicts') || activeLayers.has('political'))) {
      result.push(
        new ScatterplotLayer({
          id: 'conflict-glow',
          data: conflictEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: (d: EventPoint) => {
            const sizes = { minimal: 40000, low: 55000, moderate: 75000, high: 100000, critical: 140000 }
            return sizes[d.severity] ?? 60000
          },
          getFillColor: (d: EventPoint) => {
            const c = SEVERITY_COLORS[d.severity] ?? [239, 68, 68, 200]
            return [c[0], c[1], c[2], 30] as [number, number, number, number]
          },
          stroked: false,
          radiusUnits: 'meters',
          pickable: false,
          updateTriggers: { getFillColor: [conflictEvents] },
        }),
        new ScatterplotLayer({
          id: 'conflict-dots',
          data: conflictEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: (d: EventPoint) => {
            const sizes = { minimal: 15000, low: 20000, moderate: 28000, high: 36000, critical: 45000 }
            return sizes[d.severity] ?? 20000
          },
          getFillColor: (d: EventPoint) => {
            const c = SEVERITY_COLORS[d.severity] ?? [239, 68, 68, 255]
            const isHovered = d.id === hoveredEventId
            return [c[0], c[1], c[2], isHovered ? 255 : c[3]] as [number, number, number, number]
          },
          getLineColor: [255, 255, 255, 60],
          stroked: true,
          lineWidthMinPixels: 1,
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 60],
          onHover: (info) => setHoveredEventId(info.object?.id ?? null),
          onClick: (info) => {
            if (info.object) {
              setSelectedEvent(info.object as never)
              openIntelDrawer()
            }
          },
          updateTriggers: { getFillColor: [hoveredEventId] },
        })
      )
    }

    // --- News: ScatterplotLayer orange (replaced HeatmapLayer — avoids WebGPU probe) ---
    const newsEvents = events.filter((e) => e.type === 'news')
    if (newsEvents.length > 0 && activeLayers.has('news')) {
      result.push(
        new ScatterplotLayer({
          id: 'news-glow',
          data: newsEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: (d: EventPoint) => {
            const sizes = { minimal: 30000, low: 45000, moderate: 65000, high: 90000, critical: 120000 }
            return sizes[d.severity] ?? 45000
          },
          getFillColor: [249, 115, 22, 25],
          stroked: false,
          radiusUnits: 'meters',
          pickable: false,
        }),
        new ScatterplotLayer({
          id: 'news-dots',
          data: newsEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: (d: EventPoint) => {
            const sizes = { minimal: 10000, low: 14000, moderate: 20000, high: 28000, critical: 36000 }
            return sizes[d.severity] ?? 14000
          },
          getFillColor: [249, 115, 22, 200],
          getLineColor: [253, 186, 116, 120],
          stroked: true,
          lineWidthMinPixels: 1,
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 60],
          onClick: (info) => {
            if (info.object) {
              setSelectedEvent(info.object as never)
              openIntelDrawer()
            }
          },
        })
      )
    }

    // --- Weather: ScatterplotLayer blue ---
    const weatherEvents = events.filter((e) => e.type === 'weather')
    if (weatherEvents.length > 0 && (activeLayers.has('weather') || activeLayers.has('disasters'))) {
      result.push(
        new ScatterplotLayer({
          id: 'weather-dots',
          data: weatherEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: (d: EventPoint) => {
            const sizes = { minimal: 20000, low: 35000, moderate: 60000, high: 90000, critical: 120000 }
            return sizes[d.severity] ?? 40000
          },
          getFillColor: [59, 130, 246, 180],
          getLineColor: [147, 197, 253, 150],
          stroked: true,
          lineWidthMinPixels: 1.5,
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 60],
          onClick: (info) => {
            if (info.object) {
              setSelectedEvent(info.object as never)
              openIntelDrawer()
            }
          },
        })
      )
    }

    // --- Markets: ScatterplotLayer gold ---
    const marketEvents = events.filter((e) => e.type === 'market')
    if (marketEvents.length > 0 && activeLayers.has('markets')) {
      result.push(
        new ScatterplotLayer({
          id: 'market-dots',
          data: marketEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: 30000,
          getFillColor: [234, 179, 8, 200],
          getLineColor: [253, 224, 71, 180],
          stroked: true,
          lineWidthMinPixels: 1,
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          onClick: (info) => {
            if (info.object) {
              setSelectedEvent(info.object as never)
              openIntelDrawer()
            }
          },
        })
      )
    }

    // --- Shipping vessels: ScatterplotLayer cyan ---
    if (vessels.length > 0 && activeLayers.has('shipping')) {
      result.push(
        new ScatterplotLayer({
          id: 'vessels',
          data: vessels,
          getPosition: (d: typeof vessels[0]) => [d.lng, d.lat],
          getRadius: 8000,
          getFillColor: [6, 182, 212, 200],
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 80],
        })
      )
    }

    // --- Flights: tiny cyan dots ---
    if (flights.length > 0 && activeLayers.has('flights')) {
      result.push(
        new ScatterplotLayer({
          id: 'flights',
          data: flights,
          getPosition: (d: typeof flights[0]) => [d.lng, d.lat],
          getRadius: 4000,
          getFillColor: [34, 211, 238, 180],
          radiusUnits: 'meters',
          pickable: true,
        })
      )
    }

    return result
  }, [events, vessels, flights, activeLayers, hoveredEventId, setSelectedEvent, setHoveredEventId, openIntelDrawer])

  return {
    layers,
    isLoading:
      (hasEventLayers && eventsLoading) ||
      (activeLayers.has('shipping') && vesselsLoading) ||
      (activeLayers.has('flights') && flightsLoading),
  }
}
