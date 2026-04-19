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

// Query terms — sourcelang:english ensures only English-language sources are returned
const GDELT_QUERIES = [
  'conflict attack war military sourcelang:english',
  'political crisis protest election sanctions sourcelang:english',
  'humanitarian disaster emergency flood sourcelang:english',
]

export class GDELTAdapter extends BaseAdapter {
  readonly key = 'gdelt'

  async fetchRaw(): Promise<RawPayload[]> {
    const results: RawPayload[] = []
    const seen = new Set<string>()

    for (let i = 0; i < GDELT_QUERIES.length; i++) {
      if (i > 0) await new Promise(r => setTimeout(r, 6000)) // respect 1 req/5s limit
      const query = GDELT_QUERIES[i]
      try {
        const encoded = encodeURIComponent(query)
        const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encoded}&mode=artlist&maxrecords=25&format=json&timespan=24h&sort=HybridRel`
        const res = await fetch(url, { next: { revalidate: 0 } })
        if (!res.ok) continue

        const text = await res.text()
        if (!text.trim().startsWith('{')) continue // rate limit response is plain text
        const data = JSON.parse(text) as GDELTResponse
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
  try {
    // GDELT format: YYYYMMDDHHMMSS (14 pure digits)
    if (/^\d{14}/.test(dateStr)) {
      const y  = dateStr.slice(0, 4)
      const mo = dateStr.slice(4, 6)
      const d  = dateStr.slice(6, 8)
      const h  = dateStr.slice(8, 10)
      const m  = dateStr.slice(10, 12)
      const s  = dateStr.slice(12, 14)
      const dt = new Date(`${y}-${mo}-${d}T${h}:${m}:${s}Z`)
      if (!isNaN(dt.getTime())) return dt.toISOString()
    }
    // Fallback: try parsing as-is
    const dt = new Date(dateStr)
    if (!isNaN(dt.getTime())) return dt.toISOString()
  } catch { /* fall through */ }
  return new Date().toISOString()
}
