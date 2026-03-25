'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Bitcoin, BarChart3,
  AlertTriangle, Activity, RefreshCw
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { PulseIndicator } from '@/components/shared/PulseIndicator'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/types'
import Link from 'next/link'
import { useT } from '@/hooks/useT'

interface PriceTick {
  price: number
  change_24h: number
  change_pct: number
  volume_24h: number
  market_cap: number
  tick_at: string
}

interface MarketAsset {
  id: string
  symbol: string
  name: string
  asset_class: string
  country_id: string | null
  is_active: boolean
  latest_price?: PriceTick | null
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
  crypto:    Bitcoin,
  currency:  DollarSign,
  commodity: BarChart3,
  index:     TrendingUp,
  equity:    TrendingUp,
}

const ASSET_CLASS_COLORS = {
  crypto:    'var(--obs-amber)',
  currency:  'var(--obs-teal)',
  commodity: 'var(--obs-green)',
  index:     'var(--obs-blue)',
  equity:    'var(--obs-purple)',
}

const ASSET_CLASS_LABELS: Record<string, string> = {
  crypto:    'Cryptocurrencies',
  currency:  'FX / Currencies',
  commodity: 'Commodities',
  index:     'Indices',
  equity:    'Equities',
}

function formatPrice(symbol: string, price: number): string {
  const cryptoSymbols = ['BTC','ETH','XRP','SOL','BNB','USDT']
  const isCrypto    = cryptoSymbols.includes(symbol)
  const isCurrency  = symbol.includes('/')
  const isCommodity = ['GOLD','OIL_WTI','OIL_BRENT'].includes(symbol)
  if (isCurrency)                           return price.toFixed(4)
  if (isCrypto && price < 10)               return `$${price.toFixed(4)}`
  if (isCrypto)                             return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  if (isCommodity)                          return `$${price.toFixed(2)}`
  return `$${price.toFixed(2)}`
}

// Flashing price row with animation when value changes
function PriceRow({ asset }: { asset: MarketAsset }) {
  const tick      = asset.latest_price
  const isPos     = (tick?.change_pct ?? 0) >= 0
  const flashRef  = useRef<string | null>(null)
  const [flash, setFlash] = useState<'green' | 'red' | null>(null)
  const prevPrice = useRef<number | null>(null)

  useEffect(() => {
    if (tick?.price == null) return
    if (prevPrice.current !== null && prevPrice.current !== tick.price) {
      const dir = tick.price > prevPrice.current ? 'green' : 'red'
      setFlash(dir)
      flashRef.current = dir
      const t = setTimeout(() => setFlash(null), 1200)
      return () => clearTimeout(t)
    }
    prevPrice.current = tick.price
  }, [tick?.price])

  return (
    <div className={cn(
      'flex items-center justify-between px-4 py-2.5 transition-colors',
      flash === 'green' ? 'flash-green' :
      flash === 'red'   ? 'flash-red'   : 'hover:bg-white/3'
    )}>
      <div>
        <div className="text-sm font-medium text-foreground">{asset.symbol}</div>
        <div className="text-xs text-muted-foreground">{asset.name}</div>
      </div>
      {tick ? (
        <div className="text-right">
          <div className="text-sm font-mono text-foreground tabular-nums">
            {formatPrice(asset.symbol, tick.price)}
          </div>
          <div className={cn(
            'text-xs font-mono flex items-center gap-0.5 justify-end',
            isPos ? 'text-green-400' : 'text-red-400'
          )}>
            {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPos ? '+' : ''}{(tick.change_pct ?? 0).toFixed(2)}%
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground/40 font-mono">No data</div>
      )}
    </div>
  )
}

// Summary stats bar
function MarketSummary({ assets }: { assets: MarketAsset[] }) {
  const { t }    = useT()
  const mk       = t('markets')
  const withData = assets.filter(a => a.latest_price)
  const gainers  = withData.filter(a => (a.latest_price?.change_pct ?? 0) > 0).length
  const losers   = withData.filter(a => (a.latest_price?.change_pct ?? 0) < 0).length
  const avgChange = withData.length > 0
    ? withData.reduce((sum, a) => sum + (a.latest_price?.change_pct ?? 0), 0) / withData.length
    : 0

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: mk.gainers,   value: gainers,   color: 'var(--obs-green)', sub: mk.above0 },
        { label: mk.losers,    value: losers,     color: 'var(--obs-red)',   sub: mk.below0 },
        { label: mk.avgChange, value: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`, color: avgChange >= 0 ? 'var(--obs-green)' : 'var(--obs-red)', sub: mk.acrossAssets },
      ].map(s => (
        <div key={s.label} className="glass rounded-xl p-3 border border-white/5">
          <div className="text-lg font-bold font-mono tabular-nums" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs font-medium text-foreground/80">{s.label}</div>
          <div className="text-[10px] text-muted-foreground">{s.sub}</div>
        </div>
      ))}
    </div>
  )
}

export function MarketsClient({ assets, marketEvents }: { assets: MarketAsset[]; marketEvents: MarketEvent[] }) {
  const { t } = useT()
  const mk    = t('markets')
  const grouped = assets.reduce((acc, asset) => {
    if (!acc[asset.asset_class]) acc[asset.asset_class] = []
    acc[asset.asset_class].push(asset)
    return acc
  }, {} as Record<string, MarketAsset[]>)

  // Sort each class: movers first (by abs change_pct)
  for (const cls of Object.keys(grouped)) {
    grouped[cls].sort((a, b) =>
      Math.abs(b.latest_price?.change_pct ?? 0) - Math.abs(a.latest_price?.change_pct ?? 0)
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--obs-amber)]" />
            {mk.title}
          </h1>
          <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <PulseIndicator color="var(--obs-amber)" />
            <span>{mk.subtitle}</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass rounded-xl p-3 border border-[var(--obs-amber)]/20 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-[var(--obs-amber)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          {mk.disclaimer}
        </p>
      </div>

      {/* Summary stats */}
      <MarketSummary assets={assets} />

      {/* Asset classes — 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Object.entries(grouped).map(([assetClass, classAssets], gi) => {
          const Icon  = ASSET_CLASS_ICONS[assetClass as keyof typeof ASSET_CLASS_ICONS] || BarChart3
          const color = ASSET_CLASS_COLORS[assetClass as keyof typeof ASSET_CLASS_COLORS] || 'var(--obs-teal)'
          const label = ASSET_CLASS_LABELS[assetClass] ?? assetClass

          return (
            <motion.div
              key={assetClass}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.06 }}
              className="glass rounded-xl border border-white/5 overflow-hidden"
            >
              {/* Section header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <span className="text-sm font-semibold text-foreground">{label}</span>
                <Badge variant="outline" className="ml-auto text-[10px] border-border/40 text-muted-foreground">
                  {classAssets.length}
                </Badge>
              </div>

              {/* Prices */}
              <div className="divide-y divide-border/15">
                {classAssets.map((asset) => (
                  <PriceRow key={asset.id} asset={asset} />
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Market-relevant events */}
      {marketEvents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
            <h2 className="text-sm font-semibold text-foreground">{mk.movingEvents}</h2>
            <div className="flex-1 h-px bg-border/30" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {marketEvents.slice(0, 8).map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="glass rounded-xl p-3 border border-white/5 hover:glass-elevated transition-all cursor-pointer group flex items-start gap-3">
                  <SeverityBadge severity={event.severity} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground/90 leading-tight group-hover:text-[var(--obs-amber)] transition-colors line-clamp-1">
                      {event.title}
                    </div>
                    {event.summary && (
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{event.summary}</div>
                    )}
                    <div className="text-[10px] text-muted-foreground/50 font-mono mt-1">
                      {formatDistanceToNow(new Date(event.occurred_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
