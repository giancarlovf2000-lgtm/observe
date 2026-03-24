import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { WatchlistsClient } from '@/components/watchlists/WatchlistsClient'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Watchlists' }

export default async function WatchlistsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: watchlists } = await supabase
    .from('watchlists')
    .select('*, watchlist_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return <WatchlistsClient watchlists={watchlists ?? []} userId={user.id} />
}
