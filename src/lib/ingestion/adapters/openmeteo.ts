import { BaseAdapter, type RawPayload } from './base'

// Open-Meteo doesn't provide alerts, but we use their weather API
// for contextual weather data attached to conflict/news events
// This adapter instead uses the ReliefWeb API (free) for disasters

interface ReliefWebItem {
  id: number
  fields: {
    title: string
    body?: string
    date?: { created: string }
    country?: Array<{ iso3?: string; name: string }>
    type?: Array<{ name: string }>
    status: string
    primary_type?: { name: string }
  }
}

export class OpenMeteoAdapter extends BaseAdapter {
  readonly key = 'openmeteo'

  async fetchRaw(): Promise<RawPayload[]> {
    try {
      const url = 'https://api.reliefweb.int/v1/disasters?appname=observe&limit=20&sort[]=date.created:desc&filter[field]=status&filter[value]=alert'
      const res = await fetch(url, { next: { revalidate: 0 } })
      if (!res.ok) throw new Error(`ReliefWeb fetch failed: ${res.status}`)

      const data = await res.json() as { data: ReliefWebItem[] }

      return (data.data ?? []).map(item => {
        const primaryType = item.fields.primary_type?.name?.toLowerCase() ?? 'disaster'
        const country = item.fields.country?.[0]

        return {
          external_id: `reliefweb_${item.id}`,
          title: item.fields.title,
          body: item.fields.body ?? null,
          country_code: country?.iso3?.toLowerCase() ?? null,
          region: country?.name ?? null,
          occurred_at: item.fields.date?.created ?? new Date().toISOString(),
          tags: ['disaster', 'humanitarian', primaryType, 'reliefweb'],
          metadata: {
            event_type: 'humanitarian',
            weather_type: primaryType,
            reliefweb_id: item.id,
            status: item.fields.status,
            disaster_types: item.fields.type?.map(t => t.name),
          },
        }
      })
    } catch {
      // Fallback: return empty array if API is unavailable
      return []
    }
  }
}
