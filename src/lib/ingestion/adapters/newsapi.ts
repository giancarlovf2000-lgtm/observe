import { BaseAdapter, type RawPayload } from './base'

interface NewsAPIArticle {
  source:      { id: string | null; name: string }
  author:      string | null
  title:       string
  description: string | null
  url:         string
  urlToImage:  string | null
  publishedAt: string
  content:     string | null
}

interface NewsAPIResponse {
  status:       string
  totalResults: number
  articles:     NewsAPIArticle[]
}

// Targeted queries for global intelligence events
const QUERIES = [
  'conflict military attack strike war',
  'coup protest riot political crisis',
  'sanctions embargo diplomatic expulsion',
  'terrorism attack explosion bomb',
  'humanitarian disaster refugee famine',
]

export class NewsAPIAdapter extends BaseAdapter {
  readonly key = 'newsapi'

  async fetchRaw(): Promise<RawPayload[]> {
    // BYOK: prefer passed credential, fall back to env var for shared cron
    const apiKey = this.credentials.api_key ?? process.env.NEWSAPI_KEY
    if (!apiKey) {
      console.error('[newsapi] no api_key provided and NEWSAPI_KEY env var not set')
      return []
    }

    const results: RawPayload[] = []
    const seen = new Set<string>()

    await Promise.allSettled(
      QUERIES.map(async (q) => {
        const params = new URLSearchParams({
          q,
          language:  'en',
          sortBy:    'publishedAt',
          pageSize:  '20',
          apiKey,
        })

        const res = await fetch(
          `https://newsapi.org/v2/everything?${params}`,
          { next: { revalidate: 0 } }
        )
        if (!res.ok) return

        const data = await res.json() as NewsAPIResponse
        for (const article of data.articles ?? []) {
          if (!article.title || article.title === '[Removed]') continue
          if (seen.has(article.url)) continue
          seen.add(article.url)

          results.push({
            external_id:  `newsapi_${Buffer.from(article.url).toString('base64').slice(0, 40)}`,
            title:        article.title.slice(0, 500),
            summary:      article.description?.slice(0, 800) ?? null,
            body:         article.content?.slice(0, 5000) ?? null,
            occurred_at:  article.publishedAt,
            country_code: null, // NewsAPI doesn't provide country — normalizer will infer
            tags:         ['news', 'newsapi', article.source.name.toLowerCase().replace(/\s+/g, '-')],
            metadata: {
              event_type:   'news',
              source_name:  article.source.name,
              source_url:   article.url,
              author:       article.author,
              image_url:    article.urlToImage,
            },
          })
        }
      })
    )

    return results
  }
}
