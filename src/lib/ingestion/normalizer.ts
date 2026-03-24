import type { RawPayload } from './adapters/base'

export type SeverityLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'critical'
export type EventType = 'conflict' | 'news' | 'weather' | 'flight' | 'vessel' | 'market' | 'political' | 'humanitarian'

export interface NormalizedEvent {
  external_id: string
  type: EventType
  title: string
  summary: string | null
  body: string | null
  severity: SeverityLevel
  country_id: string | null
  region: string | null
  lat: number | null
  lng: number | null
  occurred_at: string
  tags: string[]
  metadata: Record<string, unknown>
  is_price_tick: boolean
  price_tick_data?: {
    symbol: string
    price: number
    change_pct: number | null
    volume: number | null
    market_cap: number | null
  }
  is_flight: boolean
  flight_data?: {
    icao24: string
    callsign: string
    origin_country: string
    altitude_ft: number | null
    speed_kts: number | null
    heading: number | null
    on_ground: boolean
  }
}

const SEVERITY_FROM_TAGS: Record<string, SeverityLevel> = {
  critical: 'critical',
  high: 'high',
  moderate: 'moderate',
  low: 'low',
  minimal: 'minimal',
}

function inferSeverity(payload: RawPayload): SeverityLevel {
  // Check explicit tags
  for (const tag of (payload.tags ?? [])) {
    if (tag in SEVERITY_FROM_TAGS) return SEVERITY_FROM_TAGS[tag]
  }
  // Check title keywords
  const lower = payload.title.toLowerCase()
  if (/catastroph|mass.casualt|major.earthquake|7\.\d|8\.\d|tsunami|nuclear/.test(lower)) return 'critical'
  if (/killed|attack|explosion|strike|invasion|war|coup|crisis/.test(lower)) return 'high'
  if (/clash|tension|protest|flood|fire|storm/.test(lower)) return 'moderate'
  if (/arrest|sanction|election|summit|ceasefire/.test(lower)) return 'low'
  return 'minimal'
}

function inferEventType(payload: RawPayload): EventType {
  const meta = payload.metadata ?? {}
  if (meta.event_type && typeof meta.event_type === 'string') {
    return meta.event_type as EventType
  }
  const lower = payload.title.toLowerCase()
  if (/earthquake|hurricane|typhoon|flood|wildfire|tsunami|storm|volcano/.test(lower)) return 'weather'
  if (/conflict|attack|war|military|strike|bombing|missile/.test(lower)) return 'conflict'
  if (/election|politics|government|parliament|minister|president/.test(lower)) return 'political'
  if (/humanitarian|refugee|displaced|famine|aid/.test(lower)) return 'humanitarian'
  return 'news'
}

export function normalize(payload: RawPayload, _sourceId: string): NormalizedEvent {
  const meta = payload.metadata ?? {}
  const isPriceTick = meta.asset_type === 'price_tick'
  const isFlight = meta.asset_type === 'flight'

  return {
    external_id: payload.external_id,
    type: inferEventType(payload),
    title: payload.title.slice(0, 500),
    summary: payload.summary?.slice(0, 1000) ?? null,
    body: payload.body?.slice(0, 10000) ?? null,
    severity: inferSeverity(payload),
    country_id: normalizeCountryCode(payload.country_code),
    region: payload.region ?? null,
    lat: payload.lat ?? null,
    lng: payload.lng ?? null,
    occurred_at: payload.occurred_at ?? new Date().toISOString(),
    tags: (payload.tags ?? []).filter(Boolean).slice(0, 20),
    metadata: meta,
    is_price_tick: isPriceTick,
    price_tick_data: isPriceTick ? {
      symbol: String(meta.symbol),
      price: Number(meta.price),
      change_pct: meta.change_pct != null ? Number(meta.change_pct) : null,
      volume: meta.volume != null ? Number(meta.volume) : null,
      market_cap: meta.market_cap != null ? Number(meta.market_cap) : null,
    } : undefined,
    is_flight: isFlight,
    flight_data: isFlight ? {
      icao24: String(meta.icao24),
      callsign: String(meta.callsign ?? ''),
      origin_country: String(meta.origin_country ?? ''),
      altitude_ft: meta.altitude_ft != null ? Number(meta.altitude_ft) : null,
      speed_kts: meta.speed_kts != null ? Number(meta.speed_kts) : null,
      heading: meta.heading != null ? Number(meta.heading) : null,
      on_ground: Boolean(meta.on_ground),
    } : undefined,
  }
}

function normalizeCountryCode(code: string | null | undefined): string | null {
  if (!code) return null
  // ISO3 → ISO2 would need a lookup table; for now just return 2-char codes
  const clean = code.toLowerCase().replace(/[^a-z]/g, '')
  return clean.length >= 2 ? clean.slice(0, 2) : null
}
