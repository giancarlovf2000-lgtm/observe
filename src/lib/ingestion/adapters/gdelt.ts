import { BaseAdapter, type RawPayload } from './base'

interface GDELTArticle {
  url: string
  url_mobile?: string
  title: string
  seendate: string
  socialimage?: string
  domain: string
  language: string
  sourcecountry?: string
}

interface GDELTResponse {
  articles?: GDELTArticle[]
}

// Query terms for geopolitical intelligence events
const GDELT_QUERIES = [
  'conflict military attack',
  'political crisis election protest',
  'humanitarian disaster emergency',
  'sanctions diplomatic',
]

export class GDELTAdapter extends BaseAdapter {
  readonly key = 'gdelt'

  async fetchRaw(): Promise<RawPayload[]> {
    const results: RawPayload[] = []
    const seen = new Set<string>()

    for (const query of GDELT_QUERIES) {
      try {
        const encoded = encodeURIComponent(query)
        const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encoded}&mode=artlist&maxrecords=25&format=json&timespan=24h&sort=HybridRel`
        const res = await fetch(url, { next: { revalidate: 0 } })
        if (!res.ok) continue

        const data = await res.json() as GDELTResponse
        for (const article of data.articles ?? []) {
          if (seen.has(article.url)) continue
          seen.add(article.url)

          results.push({
            external_id: `gdelt_${Buffer.from(article.url).toString('base64').slice(0, 40)}`,
            title: article.title,
            occurred_at: parseGDELTDate(article.seendate),
            country_code: article.sourcecountry?.toLowerCase().slice(0, 2) ?? null,
            tags: ['news', 'gdelt', article.language, article.domain],
            metadata: {
              event_type: 'news',
              source_url: article.url,
              source_domain: article.domain,
              source_name: article.domain,
              language: article.language,
              social_image: article.socialimage,
            },
          })
        }
      } catch {
        // Continue with other queries if one fails
        continue
      }
    }

    return results
  }
}

function parseGDELTDate(dateStr: string): string {
  // GDELT format: YYYYMMDDHHMMSS
  if (dateStr.length >= 14) {
    const y = dateStr.slice(0, 4)
    const mo = dateStr.slice(4, 6)
    const d = dateStr.slice(6, 8)
    const h = dateStr.slice(8, 10)
    const m = dateStr.slice(10, 12)
    const s = dateStr.slice(12, 14)
    return `${y}-${mo}-${d}T${h}:${m}:${s}Z`
  }
  return new Date().toISOString()
}
