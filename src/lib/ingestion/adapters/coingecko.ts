import { BaseAdapter, type RawPayload } from './base'

interface CoinGeckoMarket {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number | null
  total_volume: number | null
  market_cap: number | null
  last_updated: string
}

export class CoinGeckoAdapter extends BaseAdapter {
  readonly key = 'coingecko'

  async fetchRaw(): Promise<RawPayload[]> {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano,polkadot&order=market_cap_desc&per_page=10&page=1&sparkline=false'
    const headers: Record<string, string> = {}
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY
    }

    const res = await fetch(url, { headers, next: { revalidate: 0 } })
    if (!res.ok) throw new Error(`CoinGecko fetch failed: ${res.status}`)

    const coins = await res.json() as CoinGeckoMarket[]

    // Return as price tick metadata — the normalizer will insert into price_ticks
    return coins.map(coin => ({
      external_id: `coingecko_${coin.id}_${Date.now()}`,
      title: `${coin.name} price update`,
      occurred_at: coin.last_updated,
      tags: ['crypto', 'market', coin.symbol.toUpperCase()],
      metadata: {
        event_type: 'market',
        asset_type: 'price_tick',
        asset_class: 'crypto',
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change_pct: coin.price_change_percentage_24h,
        volume: coin.total_volume,
        market_cap: coin.market_cap,
        coin_id: coin.id,
      },
    }))
  }
}
