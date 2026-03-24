import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MarketsClient } from '@/components/intelligence/MarketsClient'

export const metadata: Metadata = { title: 'Markets & Currency Intelligence' }

export default async function MarketsPage() {
  const supabase = await createClient()

  const { data: assets } = await supabase
    .from('market_assets')
    .select(`
      *,
      price_ticks (
        price, change_24h, change_pct, volume_24h, market_cap, tick_at
      )
    `)
    .eq('is_active', true)
    .order('asset_class', { ascending: true })

  // Each asset has price_ticks array — get latest tick per asset
  const assetsWithPrice = (assets ?? []).map((a) => {
    const ticks = (a.price_ticks ?? []) as Array<{price:number;change_24h:number;change_pct:number;volume_24h:number;market_cap:number;tick_at:string}>
    const latest = ticks.sort((x, y) => new Date(y.tick_at).getTime() - new Date(x.tick_at).getTime())[0] ?? null
    return { ...a, latest_price: latest }
  })

  const { data: marketEvents } = await supabase
    .from('global_events')
    .select('id, title, summary, severity, country_id, occurred_at, tags')
    .in('type', ['market', 'political'])
    .eq('is_active', true)
    .order('occurred_at', { ascending: false })
    .limit(20)

  return <MarketsClient assets={assetsWithPrice} marketEvents={marketEvents ?? []} />
}
