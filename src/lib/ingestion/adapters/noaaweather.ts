import { BaseAdapter, type RawPayload } from './base'

// ─── NOAA NWS (US, free, no key) ───────────────────────────────────────────

interface NOAAFeature {
  id: string
  geometry: { type: string; coordinates: unknown } | null
  properties: {
    id:          string
    event:       string
    headline:    string | null
    description: string | null
    areaDesc:    string
    severity:    string
    urgency:     string
    certainty:   string
    onset:       string | null
    effective:   string
    expires:     string | null
    senderName:  string
    instruction: string | null
  }
}

interface NOAAResponse {
  type:     string
  features: NOAAFeature[]
}

// ─── OpenWeatherMap (global, optional key) ─────────────────────────────────

// Major world cities to poll for severe weather when OPENWEATHERMAP_API_KEY is set
const WEATHER_CITIES = [
  // Asia-Pacific
  { name: 'Tokyo',     lat: 35.69,  lon: 139.69, cc: 'JP' },
  { name: 'Manila',    lat: 14.60,  lon: 120.98, cc: 'PH' },
  { name: 'Jakarta',   lat: -6.21,  lon: 106.85, cc: 'ID' },
  { name: 'Mumbai',    lat: 18.96,  lon: 72.82,  cc: 'IN' },
  { name: 'Dhaka',     lat: 23.72,  lon: 90.41,  cc: 'BD' },
  // Middle East / Africa
  { name: 'Karachi',   lat: 24.86,  lon: 67.01,  cc: 'PK' },
  { name: 'Lagos',     lat: 6.52,   lon: 3.38,   cc: 'NG' },
  { name: 'Cairo',     lat: 30.06,  lon: 31.25,  cc: 'EG' },
  { name: 'Khartoum',  lat: 15.56,  lon: 32.53,  cc: 'SD' },
  { name: 'Mogadishu', lat: 2.05,   lon: 45.34,  cc: 'SO' },
  // Americas
  { name: 'Miami',     lat: 25.77,  lon: -80.19, cc: 'US' },
  { name: 'Houston',   lat: 29.76,  lon: -95.37, cc: 'US' },
  { name: 'Mexico City', lat: 19.43, lon: -99.13, cc: 'MX' },
  { name: 'Havana',    lat: 23.13,  lon: -82.38, cc: 'CU' },
  { name: 'São Paulo', lat: -23.55, lon: -46.63, cc: 'BR' },
  // Europe
  { name: 'London',    lat: 51.51,  lon: -0.13,  cc: 'GB' },
  { name: 'Madrid',    lat: 40.42,  lon: -3.70,  cc: 'ES' },
  { name: 'Kyiv',      lat: 50.45,  lon: 30.52,  cc: 'UA' },
]

// OWM weather condition codes ≥ severe threshold
const SEVERE_OWM_CODES = new Set([
  200,201,202,210,211,212,221,230,231,232, // thunderstorm
  502,503,504,511,                           // heavy/extreme rain
  602,611,612,613,615,616,620,621,622,       // heavy snow/sleet
  711,721,731,751,761,762,                   // smoke/dust/volcanic ash
  771,                                        // squalls
  781,                                        // tornado
  900,901,902,903,904,905,906,               // extreme (legacy)
])

interface OWMCurrentResponse {
  name:    string
  sys:     { country: string }
  coord:   { lat: number; lon: number }
  weather: Array<{ id: number; main: string; description: string }>
  main:    { temp: number; feels_like: number; humidity: number }
  wind:    { speed: number }
  dt:      number
}

function owmSeverity(code: number): string {
  if (code === 781) return 'critical'  // tornado
  if ([202, 212, 221, 232, 503, 504].includes(code)) return 'critical'
  if (code >= 200 && code < 300) return 'high'
  if (code >= 500 && code < 600) return 'high'
  return 'moderate'
}

export class NOAAWeatherAdapter extends BaseAdapter {
  readonly key = 'noaaweather'

  async fetchRaw(): Promise<RawPayload[]> {
    const results: RawPayload[] = []

    await Promise.allSettled([
      this.fetchNOAA(results),
      this.fetchOWM(results),
    ])

    return results
  }

  private async fetchNOAA(results: RawPayload[]) {
    try {
      const res = await fetch(
        'https://api.weather.gov/alerts/active?status=actual&severity=Severe,Extreme&limit=50',
        {
          headers: { 'User-Agent': 'OBSERVE-Platform/1.0 (contact@observe.app)', Accept: 'application/geo+json' },
          next: { revalidate: 0 },
        }
      )
      if (!res.ok) return

      const data = await res.json() as NOAAResponse

      for (const feature of data.features ?? []) {
        const p = feature.properties
        const [lat, lng] = extractCentroid(feature.geometry)

        const sev = p.severity === 'Extreme' ? 'critical'
          : p.severity === 'Severe'   ? 'high'
          : p.urgency  === 'Immediate'? 'moderate'
          : 'low'

        results.push({
          external_id:  `noaa_${p.id.replace(/[^a-z0-9]/gi, '_').slice(-60)}`,
          title:        `${p.event} — ${p.areaDesc.slice(0, 120)}`,
          summary:      p.headline?.slice(0, 500) ?? null,
          body:         [p.description, p.instruction].filter(Boolean).join('\n\n').slice(0, 5000) || null,
          occurred_at:  p.onset ?? p.effective,
          country_code: 'us',
          region:       'North America',
          lat,
          lng,
          tags:         ['weather', 'noaa', sev, p.event.toLowerCase().replace(/\s+/g, '-')],
          metadata: {
            event_type:  'weather',
            source_name: p.senderName,
            noaa_event:  p.event,
            severity:    p.severity,
            urgency:     p.urgency,
            certainty:   p.certainty,
            expires:     p.expires,
          },
        })
      }
    } catch (err) {
      console.error('[noaaweather] NOAA fetch failed:', err)
    }
  }

  private async fetchOWM(results: RawPayload[]) {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY
    if (!apiKey) return

    await Promise.allSettled(
      WEATHER_CITIES.map(async (city) => {
        try {
          const params = new URLSearchParams({
            lat:   String(city.lat),
            lon:   String(city.lon),
            appid: apiKey,
            units: 'metric',
          })
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?${params}`,
            { next: { revalidate: 0 } }
          )
          if (!res.ok) return

          const d = await res.json() as OWMCurrentResponse
          const weather = d.weather?.[0]
          if (!weather || !SEVERE_OWM_CODES.has(weather.id)) return

          const sev = owmSeverity(weather.id)
          results.push({
            external_id:  `owm_${city.cc}_${weather.id}_${Math.floor(d.dt / 3600)}`,
            title:        `${weather.main} in ${d.name}, ${d.sys.country} — ${weather.description}`,
            summary:      `Severe weather alert: ${weather.description}. Wind: ${d.wind.speed}m/s.`,
            body:         null,
            occurred_at:  new Date(d.dt * 1000).toISOString(),
            country_code: city.cc.toLowerCase(),
            region:       null,
            lat:          city.lat,
            lng:          city.lon,
            tags:         ['weather', 'openweathermap', sev, weather.main.toLowerCase()],
            metadata: {
              event_type:        'weather',
              source_name:       'OpenWeatherMap',
              owm_id:            weather.id,
              owm_main:          weather.main,
              owm_description:   weather.description,
              temp_c:            d.main.temp,
              wind_speed_ms:     d.wind.speed,
            },
          })
        } catch {
          // silently skip individual city failures
        }
      })
    )
  }
}

function extractCentroid(
  geometry: { type: string; coordinates: unknown } | null
): [number | null, number | null] {
  if (!geometry) return [null, null]
  try {
    if (geometry.type === 'Point') {
      const [lon, lat] = geometry.coordinates as [number, number]
      return [lat, lon]
    }
    if (geometry.type === 'Polygon') {
      const ring = (geometry.coordinates as number[][][])[0]
      const lat = ring.reduce((s, c) => s + c[1], 0) / ring.length
      const lon = ring.reduce((s, c) => s + c[0], 0) / ring.length
      return [lat, lon]
    }
    if (geometry.type === 'MultiPolygon') {
      const ring = ((geometry.coordinates as number[][][][])[0])[0]
      const lat = ring.reduce((s, c) => s + c[1], 0) / ring.length
      const lon = ring.reduce((s, c) => s + c[0], 0) / ring.length
      return [lat, lon]
    }
  } catch { /* ignore */ }
  return [null, null]
}
