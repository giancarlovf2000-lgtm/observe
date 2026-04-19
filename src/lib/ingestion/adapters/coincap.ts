import { BaseAdapter, type RawPayload } from './base'

// CoinCap API v2 — free for commercial use, no API key required
// https://docs.coincap.io/

interface CoinCapAsset {
  id: string
  symbol: string
  name: string
  priceUsd: string | null
  changePercent24Hr: string | null
  volumeUsd24Hr: string | null
  marketCapUsd: string | null
}

const COIN_IDS = 'bitcoin,ethereum,solana,ripple,cardano,polkadot'

export class CoinCapAdapter extends BaseAdapter {
  readonly key = 'coincap'

  async fetchRaw(): Promise<RawPayload[]> {
    const url = `https://api.coincap.io/v2/assets?ids=${COIN_IDS}`
    const res = await fetch(url, {
      headers: { 'Accept-Encoding': 'gzip, deflate' },
      next: { revalidate: 0 },
    })
    if (!res.ok) throw new Error(`CoinCap fetch failed: ${res.status}`)

    const json = await res.json() as { data: CoinCapAsset[] }

    return (json.data ?? []).map(coin => ({
      external_id: `coincap_${coin.id}_${Date.now()}`,
      title: `${coin.name} price update`,
      occurred_at: new Date().toISOString(),
      tags: ['crypto', 'market', coin.symbol.toUpperCase()],
      metadata: {
        event_type: 'market',
        asset_type: 'price_tick',
        asset_class: 'crypto',
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.priceUsd != null ? parseFloat(coin.priceUsd) : null,
        change_pct: coin.changePercent24Hr != null ? parseFloat(coin.changePercent24Hr) : null,
        volume: coin.volumeUsd24Hr != null ? parseFloat(coin.volumeUsd24Hr) : null,
        market_cap: coin.marketCapUsd != null ? parseFloat(coin.marketCapUsd) : null,
        coin_id: coin.id,
      },
    }))
  }
}
