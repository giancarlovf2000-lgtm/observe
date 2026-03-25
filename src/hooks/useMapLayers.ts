'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ScatterplotLayer, ArcLayer, TextLayer } from '@deck.gl/layers'
import { useFilterStore } from '@/store/filterStore'
import { useMapStore } from '@/store/mapStore'
import { useUIStore } from '@/store/uiStore'
import { SEVERITY_COLORS } from '@/lib/map/styleConfig'
import { extractRelationships, extractEndpoints } from '@/lib/map/relationshipExtractor'
import type { SeverityLevel, EventType, AnyEvent } from '@/types'

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

// Map layer IDs → event types
const TYPE_MAP: Record<string, EventType> = {
  conflicts: 'conflict',
  news: 'news',
  weather: 'weather',
  disasters: 'weather',
  markets: 'market',
  political: 'political',
}

async function fetchEventDetail(id: string): Promise<AnyEvent | null> {
  const res = await fetch(`/api/events/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

async function fetchMapEvents(activeLayers: Set<string>, dateHours: number): Promise<EventPoint[]> {
  const activeTypes = [...new Set(
    [...activeLayers].map((lid) => TYPE_MAP[lid]).filter(Boolean) as EventType[]
  )]
  if (activeTypes.length === 0) return []

  const params = new URLSearchParams({
    types: activeTypes.join(','),
    hours: String(dateHours),
  })
  const res = await fetch(`/api/map/events?${params}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`events fetch failed: ${res.status}`)
  return res.json()
}

async function fetchVessels() {
  const res = await fetch('/api/map/vessels', { cache: 'no-store' })
  if (!res.ok) throw new Error(`vessels fetch failed: ${res.status}`)
  return res.json()
}

async function fetchFlights() {
  const res = await fetch('/api/map/flights', { cache: 'no-store' })
  if (!res.ok) throw new Error(`flights fetch failed: ${res.status}`)
  return res.json()
}

export function useMapLayers() {
  const rawActiveLayers = useFilterStore((s) => s.activeLayers)
  const dateHours = useFilterStore((s) => s.dateHours)

  // Defensive: always ensure a proper Set regardless of persist hydration edge cases
  const activeLayers: Set<string> = rawActiveLayers instanceof Set
    ? rawActiveLayers
    : new Set<string>(Array.isArray(rawActiveLayers) ? rawActiveLayers as string[] : [])

  const { selectedEvent, setSelectedEvent, hoveredEventId, setHoveredEventId } = useMapStore()
  const { openIntelDrawer } = useUIStore()

  // Fetch full event detail when an event is selected (shares cache with IntelDrawer)
  const { data: selectedEventDetail } = useQuery({
    queryKey: ['event-detail', selectedEvent?.id],
    queryFn: () => fetchEventDetail(selectedEvent!.id),
    enabled: !!selectedEvent?.id,
    staleTime: 5 * 60 * 1000,
  })

  // Build relationship arcs for the selected event
  const relationshipArcs = useMemo(() => {
    const detail = selectedEventDetail ?? (selectedEvent as AnyEvent | null)
    if (!detail) return []
    return extractRelationships(detail)
  }, [selectedEvent, selectedEventDetail])

  const hasEventLayers = activeLayers.has('conflicts') || activeLayers.has('news') ||
    activeLayers.has('weather') || activeLayers.has('disasters') ||
    activeLayers.has('markets') || activeLayers.has('political')

  const { data: events = [], isLoading: eventsLoading, isError: eventsError } = useQuery({
    queryKey: ['map-events', [...activeLayers].sort().join(','), dateHours],
    queryFn: () => fetchMapEvents(activeLayers, dateHours),
    enabled: hasEventLayers,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  })

  const { data: vessels = [], isLoading: vesselsLoading, isError: vesselsError } = useQuery({
    queryKey: ['map-vessels'],
    queryFn: fetchVessels,
    enabled: activeLayers.has('shipping'),
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 1,
  })

  const { data: flights = [], isLoading: flightsLoading, isError: flightsError } = useQuery({
    queryKey: ['map-flights'],
    queryFn: fetchFlights,
    enabled: activeLayers.has('flights'),
    refetchInterval: 30_000,
    staleTime: 15_000,
    retry: 1,
  })

  const layers = useMemo(() => {
    const result = []

    // --- Conflicts + Political ---
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
            const sizes: Record<string, number> = { minimal: 40000, low: 55000, moderate: 75000, high: 100000, critical: 140000 }
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
            const sizes: Record<string, number> = { minimal: 15000, low: 20000, moderate: 28000, high: 36000, critical: 45000 }
            return sizes[d.severity] ?? 20000
          },
          getFillColor: (d: EventPoint) => {
            const c = SEVERITY_COLORS[d.severity] ?? [239, 68, 68, 255]
            const isHovered = d.id === hoveredEventId
            return [c[0], c[1], c[2], isHovered ? 255 : c[3]] as [number, number, number, number]
          },
          getLineColor: [255, 255, 255, 60] as [number, number, number, number],
          stroked: true,
          lineWidthMinPixels: 1,
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 60] as [number, number, number, number],
          onHover: (info: { object?: EventPoint }) => setHoveredEventId(info.object?.id ?? null),
          onClick: (info: { object?: EventPoint }) => {
            if (info.object) {
              setSelectedEvent(info.object as never)
              openIntelDrawer()
            }
          },
          updateTriggers: { getFillColor: [hoveredEventId] },
        })
      )
    }

    // --- News ---
    const newsEvents = events.filter((e) => e.type === 'news')
    if (newsEvents.length > 0 && activeLayers.has('news')) {
      result.push(
        new ScatterplotLayer({
          id: 'news-glow',
          data: newsEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: (d: EventPoint) => {
            const sizes: Record<string, number> = { minimal: 30000, low: 45000, moderate: 65000, high: 90000, critical: 120000 }
            return sizes[d.severity] ?? 45000
          },
          getFillColor: [249, 115, 22, 25] as [number, number, number, number],
          stroked: false,
          radiusUnits: 'meters',
          pickable: false,
        }),
        new ScatterplotLayer({
          id: 'news-dots',
          data: newsEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: (d: EventPoint) => {
            const sizes: Record<string, number> = { minimal: 10000, low: 14000, moderate: 20000, high: 28000, critical: 36000 }
            return sizes[d.severity] ?? 14000
          },
          getFillColor: [249, 115, 22, 200] as [number, number, number, number],
          getLineColor: [253, 186, 116, 120] as [number, number, number, number],
          stroked: true,
          lineWidthMinPixels: 1,
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 60] as [number, number, number, number],
          onClick: (info: { object?: EventPoint }) => {
            if (info.object) {
              setSelectedEvent(info.object as never)
              openIntelDrawer()
            }
          },
        })
      )
    }

    // --- Weather / Disasters ---
    const weatherEvents = events.filter((e) => e.type === 'weather')
    if (weatherEvents.length > 0 && (activeLayers.has('weather') || activeLayers.has('disasters'))) {
      result.push(
        new ScatterplotLayer({
          id: 'weather-dots',
          data: weatherEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: (d: EventPoint) => {
            const sizes: Record<string, number> = { minimal: 20000, low: 35000, moderate: 60000, high: 90000, critical: 120000 }
            return sizes[d.severity] ?? 40000
          },
          getFillColor: [59, 130, 246, 180] as [number, number, number, number],
          getLineColor: [147, 197, 253, 150] as [number, number, number, number],
          stroked: true,
          lineWidthMinPixels: 1.5,
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 60] as [number, number, number, number],
          onClick: (info: { object?: EventPoint }) => {
            if (info.object) {
              setSelectedEvent(info.object as never)
              openIntelDrawer()
            }
          },
        })
      )
    }

    // --- Markets ---
    const marketEvents = events.filter((e) => e.type === 'market')
    if (marketEvents.length > 0 && activeLayers.has('markets')) {
      result.push(
        new ScatterplotLayer({
          id: 'market-dots',
          data: marketEvents,
          getPosition: (d: EventPoint) => [d.lng, d.lat],
          getRadius: 30000,
          getFillColor: [234, 179, 8, 200] as [number, number, number, number],
          getLineColor: [253, 224, 71, 180] as [number, number, number, number],
          stroked: true,
          lineWidthMinPixels: 1,
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          onClick: (info: { object?: EventPoint }) => {
            if (info.object) {
              setSelectedEvent(info.object as never)
              openIntelDrawer()
            }
          },
        })
      )
    }

    // --- Vessels ---
    if (vessels.length > 0 && activeLayers.has('shipping')) {
      result.push(
        new ScatterplotLayer({
          id: 'vessels',
          data: vessels,
          getPosition: (d: { lng: number; lat: number }) => [d.lng, d.lat],
          getRadius: 8000,
          getFillColor: [6, 182, 212, 200] as [number, number, number, number],
          radiusUnits: 'meters',
          pickable: true,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 80] as [number, number, number, number],
        })
      )
    }

    // --- Flights ---
    if (flights.length > 0 && activeLayers.has('flights')) {
      result.push(
        new ScatterplotLayer({
          id: 'flights',
          data: flights,
          getPosition: (d: { lng: number; lat: number }) => [d.lng, d.lat],
          getRadius: 4000,
          getFillColor: [34, 211, 238, 180] as [number, number, number, number],
          radiusUnits: 'meters',
          pickable: true,
        })
      )
    }

    // --- Relationship arcs (rendered on top of all event layers) ---
    if (relationshipArcs.length > 0) {
      const endpoints = extractEndpoints(relationshipArcs)

      // Glow arcs — thick, low opacity
      result.push(
        new ArcLayer({
          id: 'rel-arc-glow',
          data: relationshipArcs,
          getSourcePosition: (d) => d.sourcePosition,
          getTargetPosition: (d) => d.targetPosition,
          getSourceColor: (d) => [d.sourceColor[0], d.sourceColor[1], d.sourceColor[2], 35] as [number, number, number, number],
          getTargetColor: (d) => [d.sourceColor[0], d.sourceColor[1], d.sourceColor[2], 0] as [number, number, number, number],
          getWidth: 10,
          getHeight: 0.4,
          greatCircle: true,
          pickable: false,
          updateTriggers: { getSourceColor: [relationshipArcs], getTargetColor: [relationshipArcs] },
        })
      )

      // Solid arcs — thin, vivid
      result.push(
        new ArcLayer({
          id: 'rel-arc-solid',
          data: relationshipArcs,
          getSourcePosition: (d) => d.sourcePosition,
          getTargetPosition: (d) => d.targetPosition,
          getSourceColor: (d) => d.sourceColor,
          getTargetColor: (d) => d.targetColor,
          getWidth: 1.5,
          getHeight: 0.4,
          greatCircle: true,
          pickable: false,
          updateTriggers: { getSourceColor: [relationshipArcs], getTargetColor: [relationshipArcs] },
        })
      )

      // Endpoint glow rings at target countries
      result.push(
        new ScatterplotLayer({
          id: 'rel-endpoint-glow',
          data: endpoints,
          getPosition: (d) => d.position,
          getRadius: 180000,
          getFillColor: (d) => [d.color[0], d.color[1], d.color[2], 20] as [number, number, number, number],
          stroked: true,
          getLineColor: (d) => [d.color[0], d.color[1], d.color[2], 80] as [number, number, number, number],
          lineWidthMinPixels: 1,
          radiusUnits: 'meters',
          pickable: false,
          updateTriggers: { getFillColor: [endpoints], getLineColor: [endpoints] },
        })
      )

      // Endpoint dots at target countries
      result.push(
        new ScatterplotLayer({
          id: 'rel-endpoint-dot',
          data: endpoints,
          getPosition: (d) => d.position,
          getRadius: 60000,
          getFillColor: (d) => d.color,
          stroked: true,
          getLineColor: [255, 255, 255, 80] as [number, number, number, number],
          lineWidthMinPixels: 1,
          radiusUnits: 'meters',
          pickable: false,
          updateTriggers: { getFillColor: [endpoints] },
        })
      )

      // Country name labels at endpoints
      result.push(
        new TextLayer({
          id: 'rel-labels',
          data: endpoints,
          getPosition: (d) => d.position,
          getText: (d) => d.label,
          getSize: 11,
          getColor: (d) => [d.color[0], d.color[1], d.color[2], 200] as [number, number, number, number],
          getPixelOffset: [0, -22],
          fontFamily: '"IBM Plex Mono", "JetBrains Mono", monospace',
          fontWeight: 600,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          background: true,
          getBackgroundColor: [10, 14, 20, 180] as [number, number, number, number],
          backgroundPadding: [4, 2, 4, 2],
          pickable: false,
          updateTriggers: { getColor: [endpoints], getText: [endpoints] },
        })
      )
    }

    return result
  }, [events, vessels, flights, activeLayers, hoveredEventId, relationshipArcs, setSelectedEvent, setHoveredEventId, openIntelDrawer])

  const isError = Boolean(
    (hasEventLayers && eventsError) ||
    (activeLayers.has('shipping') && vesselsError) ||
    (activeLayers.has('flights') && flightsError)
  )

  return {
    layers,
    isLoading: !isError && (
      (hasEventLayers && eventsLoading) ||
      (activeLayers.has('shipping') && vesselsLoading) ||
      (activeLayers.has('flights') && flightsLoading)
    ),
    isError,
  }
}
