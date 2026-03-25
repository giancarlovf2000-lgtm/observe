import { BaseAdapter, type RawPayload } from './base'

interface ACLEDEvent {
  data_id: string
  event_date: string
  event_type: string
  sub_event_type: string
  actor1: string
  actor2: string
  country: string
  region: string
  admin1: string
  location: string
  latitude: string
  longitude: string
  fatalities: string
  notes: string
  source: string
  timestamp: string
  iso: string
}

interface ACLEDResponse {
  data?: ACLEDEvent[]
  count?: number
  status?: number
}

// Map ACLED event_type → our severity
function acleSeverity(eventType: string, fatalities: number): string {
  if (fatalities >= 100) return 'critical'
  if (fatalities >= 20)  return 'high'
  const t = eventType.toLowerCase()
  if (t.includes('battle') || t.includes('explosion') || t.includes('remote violence')) {
    return fatalities > 0 ? 'high' : 'moderate'
  }
  if (t.includes('violence against civilians')) return 'high'
  if (t.includes('riot'))    return 'moderate'
  if (t.includes('protest')) return 'low'
  return 'moderate'
}

export class ACLEDAdapter extends BaseAdapter {
  readonly key = 'acled'

  async fetchRaw(): Promise<RawPayload[]> {
    const apiKey = process.env.ACLED_API_KEY
    const email  = process.env.ACLED_EMAIL

    if (!apiKey || !email) {
      console.error('[acled] ACLED_API_KEY or ACLED_EMAIL not set')
      return []
    }

    const params = new URLSearchParams({
      key:    apiKey,
      email:  email,
      limit:  '100',
      order:  '1', // newest first
      fields: 'data_id:event_date:event_type:sub_event_type:actor1:actor2:country:region:admin1:location:latitude:longitude:fatalities:notes:source:timestamp:iso',
    })

    const url = `https://api.acleddata.com/acled/read.php?${params}`
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) {
      console.error(`[acled] API error: ${res.status}`)
      return []
    }

    const data = await res.json() as ACLEDResponse
    const events = data.data ?? []

    return events.map((e): RawPayload => {
      const fatalities = parseInt(e.fatalities ?? '0', 10) || 0
      const parties = [e.actor1, e.actor2].filter(Boolean)

      return {
        external_id:  `acled_${e.data_id}`,
        title:        buildTitle(e),
        summary:      e.notes?.slice(0, 800) || null,
        body:         e.notes || null,
        occurred_at:  e.event_date
          ? new Date(e.event_date).toISOString()
          : new Date(parseInt(e.timestamp) * 1000).toISOString(),
        country_code: isoNumericToAlpha2(e.iso) ?? e.country?.slice(0, 2).toLowerCase() ?? null,
        region:       e.region || null,
        lat:          e.latitude  ? parseFloat(e.latitude)  : null,
        lng:          e.longitude ? parseFloat(e.longitude) : null,
        tags:         [
          'acled',
          e.event_type?.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-'),
          e.sub_event_type?.toLowerCase().replace(/\s+/g, '-'),
          acleSeverity(e.event_type, fatalities),
          ...parties.map(p => p.slice(0, 60)),
        ].filter(Boolean) as string[],
        metadata: {
          event_type:  'conflict',
          source_name: e.source || 'ACLED',
          acled_type:  e.event_type,
          acled_sub:   e.sub_event_type,
          actor1:      e.actor1 || null,
          actor2:      e.actor2 || null,
          parties,
          fatalities,
          location:    e.location || null,
          admin1:      e.admin1  || null,
        },
      }
    })
  }
}

function buildTitle(e: ACLEDEvent): string {
  const parts: string[] = []
  if (e.event_type) parts.push(e.event_type)
  if (e.actor1 && e.actor2) parts.push(`— ${e.actor1} vs ${e.actor2}`)
  else if (e.actor1)         parts.push(`by ${e.actor1}`)
  if (e.location && e.country) parts.push(`in ${e.location}, ${e.country}`)
  else if (e.country)           parts.push(`in ${e.country}`)
  return parts.join(' ').slice(0, 500) || `Conflict event in ${e.country ?? 'unknown'}`
}

// Partial ISO numeric → alpha-2 mapping for the most common conflict countries
const ISO_NUMERIC: Record<string, string> = {
  '004': 'AF', '008': 'AL', '012': 'DZ', '024': 'AO', '051': 'AM',
  '050': 'BD', '112': 'BY', '068': 'BO', '072': 'BW', '854': 'BF',
  '108': 'BI', '116': 'KH', '120': 'CM', '140': 'CF', '148': 'TD',
  '156': 'CN', '170': 'CO', '180': 'CD', '188': 'CR', '384': 'CI',
  '214': 'DO', '218': 'EC', '818': 'EG', '222': 'SV', '231': 'ET',
  '266': 'GA', '288': 'GH', '320': 'GT', '324': 'GN', '332': 'HT',
  '356': 'IN', '360': 'ID', '364': 'IR', '368': 'IQ', '400': 'JO',
  '404': 'KE', '408': 'KP', '410': 'KR', '418': 'LA', '422': 'LB',
  '430': 'LR', '434': 'LY', '466': 'ML', '478': 'MR', '484': 'MX',
  '104': 'MM', '508': 'MZ', '516': 'NA', '524': 'NP', '566': 'NG',
  '586': 'PK', '275': 'PS', '591': 'PA', '604': 'PE', '608': 'PH',
  '630': 'PR', '643': 'RU', '646': 'RW', '682': 'SA',
  '686': 'SN', '694': 'SL', '706': 'SO', '710': 'ZA', '728': 'SS',
  '736': 'SD', '760': 'SY', '762': 'TJ', '764': 'TH', '792': 'TR',
  '800': 'UG', '804': 'UA', '784': 'AE', '826': 'GB', '840': 'US',
  '858': 'UY', '860': 'UZ', '862': 'VE', '704': 'VN', '887': 'YE',
  '894': 'ZM', '716': 'ZW',
}

function isoNumericToAlpha2(numeric?: string): string | null {
  if (!numeric) return null
  const padded = numeric.toString().padStart(3, '0')
  return ISO_NUMERIC[padded] ?? null
}
