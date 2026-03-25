import { lookupCountry } from './countryCentroids'
import type { AnyEvent, ConflictEvent } from '@/types'

export interface RelationshipArc {
  id: string
  sourcePosition: [number, number]  // [lng, lat] — event location
  targetPosition: [number, number]  // [lng, lat] — related country centroid
  label: string
  role: 'party' | 'mentioned' | 'affected' | 'primary'
  // Two-toned arc: source color is bright, target fades
  sourceColor: [number, number, number, number]
  targetColor: [number, number, number, number]
}

// Role → arc color (RGBA)
const ROLE_COLORS: Record<RelationshipArc['role'], [number, number, number, number]> = {
  party:     [239, 68,  68,  220],  // red       — active belligerents
  mentioned: [249, 115, 22,  180],  // orange    — referenced entities
  affected:  [99,  102, 241, 160],  // indigo    — affected/neighboring
  primary:   [20,  184, 166, 180],  // teal      — primary country
}

const ROLE_TARGET_COLORS: Record<RelationshipArc['role'], [number, number, number, number]> = {
  party:     [239, 68,  68,  50 ],
  mentioned: [249, 115, 22,  40 ],
  affected:  [99,  102, 241, 30 ],
  primary:   [20,  184, 166, 30 ],
}

/**
 * Extract all relationship arcs for a selected event.
 * Returns arcs from the event's location to each related country centroid.
 */
export function extractRelationships(event: AnyEvent): RelationshipArc[] {
  if (!event.lat || !event.lng) return []

  const source: [number, number] = [event.lng, event.lat]
  const arcs: RelationshipArc[] = []
  const seen = new Set<string>() // dedup by target coordinates

  function addArc(
    nameOrCode: string,
    role: RelationshipArc['role'],
  ) {
    const centroid = lookupCountry(nameOrCode)
    if (!centroid) return

    // Skip if centroid is essentially at the same location as the event
    const distSq = (centroid.lng - event.lng!) ** 2 + (centroid.lat - event.lat!) ** 2
    if (distSq < 4) return  // < ~2° radius — too close, would render as a dot

    const key = `${centroid.lat.toFixed(1)},${centroid.lng.toFixed(1)}`
    if (seen.has(key)) return
    seen.add(key)

    arcs.push({
      id: `${event.id}-${key}`,
      sourcePosition: source,
      targetPosition: [centroid.lng, centroid.lat],
      label: centroid.name,
      role,
      sourceColor: ROLE_COLORS[role],
      targetColor: ROLE_TARGET_COLORS[role],
    })
  }

  // 1. Conflict parties — highest priority, shown as hostile arcs
  if (event.type === 'conflict') {
    const conflict = event as ConflictEvent
    const parties = conflict.conflict_zone?.parties ?? []
    for (const party of parties) {
      addArc(party, 'party')
    }
  }

  // 2. Tags — scan for ISO codes (2-letter uppercase) or known names
  for (const tag of (event.tags ?? [])) {
    const trimmed = tag.trim()
    // 2-letter tag: likely ISO country code
    if (/^[A-Z]{2}$/.test(trimmed)) {
      addArc(trimmed, 'mentioned')
    } else if (trimmed.length > 2) {
      // Longer tag: try as country name/alias
      addArc(trimmed, 'mentioned')
    }
  }

  // 3. Primary country — teal arc as the "home" connection
  if (event.country_id) {
    addArc(event.country_id, 'primary')
  }

  // 4. Fallback: if no arcs built yet and we have a region, try matching region name
  if (arcs.length === 0 && event.region) {
    addArc(event.region, 'affected')
  }

  return arcs
}

/** Build endpoint marker data from arc targets (for pulsing dots at destinations) */
export interface EndpointMarker {
  id: string
  position: [number, number]
  label: string
  role: RelationshipArc['role']
  color: [number, number, number, number]
}

export function extractEndpoints(arcs: RelationshipArc[]): EndpointMarker[] {
  return arcs.map((arc) => ({
    id: arc.id,
    position: arc.targetPosition,
    label: arc.label,
    role: arc.role,
    color: arc.sourceColor,
  }))
}
