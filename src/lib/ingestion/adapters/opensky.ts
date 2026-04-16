import { BaseAdapter, type RawPayload } from './base'

interface OpenSkyState {
  // [icao24, callsign, origin_country, time_position, last_contact,
  //  longitude, latitude, baro_altitude, on_ground, velocity,
  //  true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source]
  0: string   // icao24
  1: string   // callsign
  2: string   // origin_country
  3: number   // time_position
  4: number   // last_contact
  5: number   // longitude
  6: number   // latitude
  7: number   // baro_altitude (meters)
  8: boolean  // on_ground
  9: number   // velocity (m/s)
  10: number  // true_track
}

export class OpenSkyAdapter extends BaseAdapter {
  readonly key = 'opensky'

  async fetchRaw(): Promise<RawPayload[]> {
    const headers: Record<string, string> = {}
    // BYOK: prefer passed credentials, fall back to env vars for shared cron
    const user = this.credentials.username ?? process.env.OPENSKY_USERNAME
    const pass = this.credentials.password ?? process.env.OPENSKY_PASSWORD
    if (user && pass) {
      headers['Authorization'] = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`
    }

    // Get a bounding box covering Europe and Middle East — high interest area
    const url = 'https://opensky-network.org/api/states/all?lamin=20&lomin=-10&lamax=60&lomax=60'

    try {
      const res = await fetch(url, { headers, next: { revalidate: 0 }, signal: AbortSignal.timeout(10000) })
      if (!res.ok) return []

      const data = await res.json() as { states: OpenSkyState[] }

      return (data.states ?? []).slice(0, 100).map(state => ({
        external_id: state[0], // icao24 as unique key
        title: `${(state[1] || state[0]).trim()} in flight`,
        lat: state[6],
        lng: state[5],
        occurred_at: new Date(state[4] * 1000).toISOString(),
        tags: ['flight', 'transport', state[2] ?? ''],
        metadata: {
          asset_type: 'flight',
          icao24: state[0],
          callsign: (state[1] || '').trim(),
          origin_country: state[2],
          altitude_ft: state[7] != null ? Math.round(state[7] * 3.28084) : null,
          speed_kts: state[9] != null ? Math.round(state[9] * 1.94384) : null,
          heading: state[10],
          on_ground: state[8],
        },
      }))
    } catch {
      return []
    }
  }
}
