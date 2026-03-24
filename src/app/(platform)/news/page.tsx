import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { NewsClient } from '@/components/intelligence/NewsClient'

export const metadata: Metadata = { title: 'News Intelligence' }

export default async function NewsPage() {
  const supabase = await createClient()

  const { data: newsEvents } = await supabase
    .from('global_events')
    .select(`
      *,
      news_articles ( headline, source_name, source_url, author, image_url, sentiment, topics, published_at )
    `)
    .eq('type', 'news')
    .eq('is_active', true)
    .order('occurred_at', { ascending: false })
    .limit(40)

  return <NewsClient events={newsEvents ?? []} />
}
