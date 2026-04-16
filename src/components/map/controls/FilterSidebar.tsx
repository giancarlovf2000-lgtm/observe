'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Filter, Clock, Layers, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFilterStore, type LayerId, DEFAULT_ACTIVE } from '@/store/filterStore'
import { LAYER_CONFIGS, LAYER_CATEGORIES } from '@/lib/map/layerConfig'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sword, Newspaper, CloudLightning, AlertTriangle, Plane, Ship,
  TrendingUp, Globe2, Activity, Shield, Zap, Crosshair, Network, BellRing, Bookmark
} from 'lucide-react'
import { useT } from '@/hooks/useT'

const ICON_MAP: Record<string, React.ElementType> = {
  Sword, Newspaper, CloudLightning, AlertTriangle, Plane, Ship,
  TrendingUp, Globe2, Activity, Shield, Zap, Crosshair, Network, BellRing, Bookmark,
}

// Maps layer IDs to translation key suffixes
const LAYER_LABEL_KEYS: Record<string, string> = {
  conflicts:     'layerConflicts',
  news:          'layerNews',
  weather:       'layerWeather',
  disasters:     'layerDisasters',
  flights:       'layerFlights',
  shipping:      'layerShipping',
  markets:       'layerMarkets',
  country_risk:  'layerCountryRisk',
  political:     'layerPolitical',
  sanctions:     'layerSanctions',
  energy:        'layerEnergy',
  tensions:      'layerTensions',
  infrastructure:'layerInfrastructure',
  alerts:        'layerAlerts',
  watchlist:     'layerWatchlist',
}

// Maps category keys to translation key suffixes
const CATEGORY_LABEL_KEYS: Record<string, string> = {
  security:    'catSecurity',
  news:        'catNews',
  environment: 'catEnvironment',
  transport:   'catTransport',
  markets:     'catMarkets',
  intelligence:'catIntelligence',
}

// Shared filter content used in both desktop sidebar and mobile sheet
function FilterContent({
  isActive,
  activeCount,
  toggleLayer,
  dateHours,
  setDateHours,
  severityMin,
  setSeverityMin,
}: {
  isActive: (id: LayerId) => boolean
  activeCount: number
  toggleLayer: (id: LayerId) => void
  dateHours: number
  setDateHours: (h: 24 | 48 | 168 | 720) => void
  severityMin: string
  setSeverityMin: (v: 'minimal' | 'low' | 'moderate' | 'high' | 'critical') => void
}) {
  const { t } = useT()
  const mp = t('map')

  const DATE_OPTIONS = [
    { value: '24',  label: mp.last24h },
    { value: '48',  label: mp.last48h },
    { value: '168', label: mp.last7d },
    { value: '720', label: mp.last30d },
  ]

  const SEVERITY_OPTIONS = [
    { value: 'minimal',  label: mp.allLevels },
    { value: 'low',      label: mp.lowAndAbove },
    { value: 'moderate', label: mp.moderateAndAbove },
    { value: 'high',     label: mp.highAndAbove },
    { value: 'critical', label: mp.criticalOnly },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-4">
      {/* Time range */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{mp.timeRange}</span>
        </div>
        <Select
          value={String(dateHours)}
          onValueChange={(v) => setDateHours(Number(v) as 24 | 48 | 168 | 720)}
        >
          <SelectTrigger className="h-7 text-xs bg-background/30 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--obs-surface-elevated)] border-border/50">
            {DATE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Severity filter */}
      <div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{mp.minSeverity}</div>
        <Select value={severityMin} onValueChange={(v) => setSeverityMin(v as never)}>
          <SelectTrigger className="h-7 text-xs bg-background/30 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--obs-surface-elevated)] border-border/50">
            {SEVERITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layer groups */}
      {Object.entries(LAYER_CATEGORIES).map(([category, layers]) => (
        <div key={category}>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-0.5">
            {(mp as Record<string, string>)[CATEGORY_LABEL_KEYS[category]]}
          </div>
          <div className="space-y-0.5">
            {layers.map((layer) => {
              const Icon = ICON_MAP[layer.icon] || Filter
              const active = isActive(layer.id as LayerId)
              const labelKey = LAYER_LABEL_KEYS[layer.id]
              const label = labelKey ? (mp as Record<string, string>)[labelKey] : layer.label
              return (
                <div
                  key={layer.id}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer select-none',
                    active ? 'bg-white/5' : 'hover:bg-white/3'
                  )}
                  onClick={() => toggleLayer(layer.id as LayerId)}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: active ? `${layer.color}20` : 'transparent',
                      border: `1px solid ${active ? layer.color + '40' : 'transparent'}`,
                    }}
                  >
                    <Icon
                      className="w-3 h-3"
                      style={{ color: active ? layer.color : '#6b7280' }}
                    />
                  </div>
                  <span className={cn(
                    'text-xs flex-1 leading-tight',
                    active ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {label}
                  </span>
                  <Switch
                    checked={active}
                    onCheckedChange={() => {}}
                    className="h-3.5 w-6 data-[state=checked]:bg-[var(--obs-teal)] pointer-events-none"
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export function FilterSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { activeLayers, toggleLayer, isLayerActive, dateHours, setDateHours, severityMin, setSeverityMin } = useFilterStore()
  const { t } = useT()
  const mp = t('map')

  useEffect(() => { setMounted(true) }, [])

  // Use persisted state after mount; default state during SSR to avoid hydration mismatch
  const isActive = (id: LayerId) => mounted ? isLayerActive(id) : DEFAULT_ACTIVE.includes(id)
  const activeCount = mounted ? activeLayers.size : DEFAULT_ACTIVE.length

  const sharedProps = { isActive, activeCount, toggleLayer, dateHours, setDateHours, severityMin, setSeverityMin }

  return (
    <>
      {/* ─── Mobile: floating FAB + bottom sheet ─── */}
      <div className="md:hidden">
        {/* Floating Layers button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[var(--obs-surface)]/90 backdrop-blur-md border border-border/50 rounded-xl px-3 py-2 text-xs font-medium text-foreground shadow-lg active:scale-95 transition-transform"
        >
          <Layers className="w-3.5 h-3.5 text-[var(--obs-teal)]" />
          {mp.layers}
          {activeCount > 0 && (
            <span className="bg-[var(--obs-teal)]/20 text-[var(--obs-teal)] rounded-full px-1.5 py-0.5 text-[10px] font-mono">
              {activeCount}
            </span>
          )}
        </button>

        {/* Mobile bottom sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed bottom-0 left-0 right-0 bg-[var(--obs-surface)] border-t border-border/40 rounded-t-2xl z-50 flex flex-col"
                style={{ maxHeight: '80vh', paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}
              >
                <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full bg-white/15" />
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{mp.mapLayers}</span>
                    {activeCount > 0 && (
                      <span className="text-xs bg-[var(--obs-teal)]/20 text-[var(--obs-teal)] px-1.5 py-0.5 rounded-full font-mono">
                        {activeCount} {mp.active}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <FilterContent {...sharedProps} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Desktop: collapsible side panel ─── */}
    <motion.div
      animate={{ width: collapsed ? 40 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden md:flex h-full bg-[var(--obs-surface)] border-r border-border/40 flex-col relative z-10 flex-shrink-0"
    >
      {/* Header */}
      <div className={cn(
        'flex items-center h-12 border-b border-border/40 flex-shrink-0',
        collapsed ? 'justify-center px-2' : 'px-3 gap-2'
      )}>
        {!collapsed && (
          <>
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex-1">
              {mp.layers}
            </span>
            {activeCount > 0 && (
              <span className="text-xs bg-[var(--obs-teal)]/20 text-[var(--obs-teal)] px-1.5 py-0.5 rounded-full font-mono">
                {activeCount}
              </span>
            )}
          </>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <FilterContent {...sharedProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  )
}
