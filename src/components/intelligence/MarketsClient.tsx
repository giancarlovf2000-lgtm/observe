'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, BarChart3, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'

interface MarketAsset {
  id: string
  symbol: string
  name: string
  asset_class: string
  country_id: string | null
  is_active: boolean
}

interface MarketEvent {
  id: string
  title: string
  summary: string | null
  severity: SeverityLevel
  country_id: string | null
  occurred_at: string
  tags: string[]
}

const ASSET_CLASS_ICONS = {
  crypto: Bitcoin,
  currency: DollarSign,
  commodity: BarChart3,
  index: TrendingUp,
  equity: TrendingUp,
}

const ASSET_CLASS_COLORS = {
  crypto: 'var(--obs-amber)',
  currency: 'var(--obs-teal)',
  commodity: 'var(--obs-green)',
  index: 'var(--obs-blue)',
  equity: 'var(--obs-purple)',
}

// Demo price data — in production these come from the price_ticks table
const DEMO_PRICES: Record<string, { price: string; change: number }> = {
  'BTC': { price: '$67,420', change: 2.4 },
  'ETH': { price: '$3,812', change: 1.8 },
  'XRP': { price: '$0.58', change: -0.9 },
  'SOL': { price: '$175', change: 4.2 },
  'USD/EUR': { price: '0.9182', change: -0.3 },
  'USD/GBP': { price: '0.7841', change: 0.1 },
  'USD/JPY': { price: '149.82', change: -0.5 },
  'USD/RUB': { price: '89.45', change: 0.8 },
  'GOLD': { price: '$2,341', change: 0.6 },
  'OIL_WTI': { price: '$81.20', change: 3.2 },
  'OIL_BRENT': { price: '$85.40', change: 2.9 },
  'WHEAT': { price: '$548', change: -1.2 },
}

export function MarketsClient({ assets, marketEvents }: { assets: MarketAsset[]; marketEvents: MarketEvent[] }) {
  const grouped = assets.reduce((acc, asset) => {
    if (!acc[asset.asset_class]) acc[asset.asset_class] = []
    acc[asset.asset_class].push(asset)
    return acc
  }, {} as Record<string, MarketAsset[]>)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--obs-amber)]" />
          Market & Currency Intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Geopolitical context for global markets · Educational purposes only
        </p>
      </div>

      {/* Disclaimer */}
      <div className="glass rounded-xl p-3 border border-[var(--obs-amber)]/20 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[var(--obs-amber)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Market data and signals are for <strong className="text-foreground">educational and informational purposes only</strong>.
          This platform does not provide financial advice. Always consult a qualified financial professional.
        </p>
      </div>

      {/* Asset classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([assetClass, classAssets]) => {
          const Icon = ASSET_CLASS_ICONS[assetClass as keyof typeof ASSET_CLASS_ICONS] || BarChart3
          const color = ASSET_CLASS_COLORS[assetClass as keyof typeof ASSET_CLASS_COLORS] || 'var(--obs-teal)'

          return (
            <motion.div
              key={assetClass}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl border border-white/5 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-sm font-semibold text-foreground capitalize">
                  {assetClass === 'crypto' ? 'Cryptocurrencies' :
                   assetClass === 'currency' ? 'FX / Currencies' :
                   assetClass === 'commodity' ? 'Commodities' : assetClass}
                </span>
                <Badge variant="outline" className="ml-auto text-xs border-border/40 text-muted-foreground">
                  {classAssets.length} assets
                </Badge>
              </div>
              <div className="divide-y divide-border/20">
                {classAssets.map((asset) => {
                  const demo = DEMO_PRICES[asset.symbol]
                  const isPositive = (demo?.change ?? 0) >= 0
                  return (
                    <div key={asset.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/3 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-foreground">{asset.symbol}</div>
                        <div className="text-xs text-muted-foreground">{asset.name}</div>
                      </div>
                      {demo ? (
                        <div className="text-right">
                          <div className="text-sm font-mono text-foreground">{demo.price}</div>
                          <div className={cn(
                            'text-xs font-mono flex items-center gap-0.5',
                            isPositive ? 'text-green-400' : 'text-red-400'
                          )}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {isPositive ? '+' : ''}{demo.change}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground font-mono">—</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Market-relevant events */}
      {marketEvents.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
            Market-Moving Events
          </h2>
          <div className="space-y-2">
            {marketEvents.slice(0, 8).map((event) => (
              <div key={event.id} className="glass rounded-xl p-3 border border-white/5 flex items-start gap-3">
                <SeverityBadge severity={event.severity} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground/90 leading-tight">{event.title}</div>
                  {event.summary && (
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{event.summary}</div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground/60 font-mono flex-shrink-0">
                  {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
