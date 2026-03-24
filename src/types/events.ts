import type { EventType, SeverityLevel } from './database'

export interface GlobalEvent {
  id: string
  type: EventType
  title: string
  summary: string | null
  severity: SeverityLevel
  country_id: string | null
  region: string | null
  lat: number | null
  lng: number | null
  tags: string[]
  ai_summary: string | null
  occurred_at: string
  ingested_at: string
  source_url: string | null
  metadata: Record<string, unknown>
}

export interface ConflictEvent extends GlobalEvent {
  type: 'conflict'
  conflict_zone?: {
    id: string
    name: string
    conflict_type: string
    parties: string[]
    active: boolean
    intensity: number
    casualties_estimate: number | null
    displacement_estimate: number | null
    start_date: string
  }
  recent_updates?: Array<{
    id: string
    title: string
    body: string | null
    severity: SeverityLevel | null
    occurred_at: string
  }>
}

export interface NewsEvent extends GlobalEvent {
  type: 'news'
  article?: {
    headline: string
    body: string | null
    source_name: string
    source_url: string
    author: string | null
    image_url: string | null
    sentiment: number | null
    topics: string[]
    published_at: string
  }
}

export interface WeatherEvent extends GlobalEvent {
  type: 'weather'
  weather?: {
    weather_type: string
    magnitude: number | null
    valid_from: string
    valid_until: string | null
  }
}

export interface MarketEvent extends GlobalEvent {
  type: 'market'
  asset?: {
    symbol: string
    name: string
    asset_class: string
    price: number
    change_pct: number | null
  }
}

export type AnyEvent = ConflictEvent | NewsEvent | WeatherEvent | MarketEvent | GlobalEvent

// Map marker data (minimal, for rendering performance)
export interface MapMarker {
  id: string
  lat: number
  lng: number
  type: EventType
  severity: SeverityLevel
  title: string
  country_id: string | null
}
