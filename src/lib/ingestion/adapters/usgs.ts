import { BaseAdapter, type RawPayload } from './base'

interface USGSFeature {
  id: string
  properties: {
    mag: number
    place: string
    time: number
    updated: number
    title: string
    type: string
    url: string
    sig: number
    alert: string | null
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number, number] // lon, lat, depth
  }
}

export class USGSAdapter extends BaseAdapter {
  readonly key = 'usgs'

  async fetchRaw(): Promise<RawPayload[]> {
    const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson'
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) throw new Error(`USGS fetch failed: ${res.status}`)

    const data = await res.json() as { features: USGSFeature[] }

    return data.features.map(f => {
      const mag = f.properties.mag
      const severity = mag >= 7.0 ? 'critical'
        : mag >= 6.0 ? 'high'
        : mag >= 5.0 ? 'moderate'
        : mag >= 4.0 ? 'low'
        : 'minimal'

      return {
        external_id: f.id,
        title: f.properties.title,
        summary: `${mag >= 6.5 ? 'Major earthquake' : 'Earthquake'} of magnitude ${mag} — ${f.properties.place}`,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
        occurred_at: new Date(f.properties.time).toISOString(),
        tags: ['earthquake', 'seismic', 'usgs', severity],
        metadata: {
          magnitude: mag,
          depth_km: f.geometry.coordinates[2],
          significance: f.properties.sig,
          alert: f.properties.alert,
          usgs_url: f.properties.url,
          event_type: 'weather', // mapped to weather in our schema
          weather_type: 'earthquake',
        },
      }
    })
  }
}
