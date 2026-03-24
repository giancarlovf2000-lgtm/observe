import { BaseAdapter, type RawPayload } from './base'

// FX pairs to track
const FX_PAIRS = [
  { symbol: 'USD/EUR', to: 'EUR' },
  { symbol: 'USD/GBP', to: 'GBP' },
  { symbol: 'USD/JPY', to: 'JPY' },
  { symbol: 'USD/CNY', to: 'CNY' },
  { symbol: 'USD/RUB', to: 'RUB' },
  { symbol: 'USD/UAH', to: 'UAH' },
  { symbol: 'USD/TRY', to: 'TRY' },
  { symbol: 'USD/BRL', to: 'BRL' },
  { symbol: 'USD/INR', to: 'INR' },
  { symbol: 'USD/SAR', to: 'SAR' },
]

interface OpenERResponse {
  result: string
  rates: Record<string, number>
}

export class ExchangeRateAdapter extends BaseAdapter {
  readonly key = 'exchangerate'

  async fetchRaw(): Promise<RawPayload[]> {
    try {
      const symbols = FX_PAIRS.map(p => p.to).join(',')
      const url = `https://open.er-api.com/v6/latest/USD?symbols=${symbols}`

      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 10_000)

      let data: OpenERResponse
      try {
        const res = await fetch(url, { signal: ctrl.signal, next: { revalidate: 0 } })
        if (!res.ok) return []
        data = await res.json() as OpenERResponse
      } finally {
        clearTimeout(timer)
      }

      if (data.result !== 'success' || !data.rates) return []

      const now = new Date().toISOString()
      const ts = Date.now()

      return FX_PAIRS
        .filter(pair => data.rates[pair.to] != null)
        .map(pair => ({
          external_id: `fx_${pair.symbol.replace('/', '_')}_${ts}`,
          title: `${pair.symbol} exchange rate update`,
          occurred_at: now,
          tags: ['currency', 'fx', pair.to.toLowerCase()],
          metadata: {
            event_type: 'market',
            asset_type: 'price_tick',
            asset_class: 'currency',
            symbol: pair.symbol,
            price: data.rates[pair.to],
            change_pct: null,
            volume: null,
            market_cap: null,
          },
        }))
    } catch {
      return []
    }
  }
}
