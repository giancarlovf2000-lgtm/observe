import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MarketsClient } from '@/components/intelligence/MarketsClient'

export const metadata: Metadata = { title: 'Markets & Currency Intelligence' }

export default async function MarketsPage() {
  const supabase = await createClient()

  const { data: assets } = await supabase
    .from('market_assets')
    .select('*')
    .eq('is_active', true)
    .order('asset_class', { ascending: true })

  const { data: marketEvents } = await supabase
    .from('global_events')
    .select('*')
    .in('type', ['market', 'political'])
    .eq('is_active', true)
    .order('occurred_at', { ascending: false })
    .limit(20)

  return <MarketsClient assets={assets ?? []} marketEvents={marketEvents ?? []} />
}
