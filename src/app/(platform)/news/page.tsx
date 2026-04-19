import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { NewsClient } from '@/components/intelligence/NewsClient'

export const metadata: Metadata = { title: 'News Intelligence' }

export default async function NewsPage() {
  const supabase = await createClient()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: newsEvents } = await supabase
    .from('global_events')
    .select('id, type, title, summary, severity, country_id, region, occurred_at, tags, metadata')
    .eq('type', 'news')
    .eq('is_active', true)
    .gte('occurred_at', sevenDaysAgo)
    .order('occurred_at', { ascending: false })
    .limit(60)

  // Deduplicate by title (same story from multiple outlets)
  const seenTitles = new Set<string>()
  const deduped = (newsEvents ?? []).filter(e => {
    if (seenTitles.has(e.title)) return false
    seenTitles.add(e.title)
    return true
  })

  return <NewsClient events={deduped} />
}
