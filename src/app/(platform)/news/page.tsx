import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { NewsClient } from '@/components/intelligence/NewsClient'

export const metadata: Metadata = { title: 'News Intelligence' }

export default async function NewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cred } = await supabase
    .from('api_credentials')
    .select('is_active')
    .eq('user_id', user!.id)
    .eq('service', 'newsapi')
    .single()

  const hasCredential = cred?.is_active === true

  const { data: newsEvents } = hasCredential
    ? await supabase
        .from('global_events')
        .select(`
          *,
          news_articles ( headline, source_name, source_url, author, image_url, sentiment, topics, published_at )
        `)
        .eq('type', 'news')
        .eq('is_active', true)
        .eq('user_id', user!.id)
        .order('occurred_at', { ascending: false })
        .limit(40)
    : { data: [] }

  return <NewsClient events={newsEvents ?? []} hasCredential={hasCredential} />
}
