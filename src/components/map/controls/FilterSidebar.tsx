'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Filter, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFilterStore, type LayerId } from '@/store/filterStore'
import { LAYER_CONFIGS, LAYER_CATEGORIES } from '@/lib/map/layerConfig'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sword, Newspaper, CloudLightning, AlertTriangle, Plane, Ship,
  TrendingUp, Globe2, Activity, Shield, Zap, Crosshair, Network, BellRing, Bookmark
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  Sword, Newspaper, CloudLightning, AlertTriangle, Plane, Ship,
  TrendingUp, Globe2, Activity, Shield, Zap, Crosshair, Network, BellRing, Bookmark,
}

const CATEGORY_LABELS: Record<string, string> = {
  security: 'Security',
  news: 'News & Media',
  environment: 'Weather & Environment',
  transport: 'Transport',
  markets: 'Markets & Economy',
  intelligence: 'Intelligence',
}

const DATE_OPTIONS = [
  { value: '24', label: 'Last 24 hours' },
  { value: '48', label: 'Last 48 hours' },
  { value: '168', label: 'Last 7 days' },
  { value: '720', label: 'Last 30 days' },
]

const SEVERITY_OPTIONS = [
  { value: 'minimal', label: 'All levels' },
  { value: 'low', label: 'Low and above' },
  { value: 'moderate', label: 'Moderate and above' },
  { value: 'high', label: 'High and above' },
  { value: 'critical', label: 'Critical only' },
]

export function FilterSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { activeLayers, toggleLayer, isLayerActive, dateHours, setDateHours, severityMin, setSeverityMin } = useFilterStore()

  const activeCount = activeLayers.size

  return (
    <motion.div
      animate={{ width: collapsed ? 40 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-full bg-[var(--obs-surface)] border-r border-border/40 flex flex-col relative z-10 flex-shrink-0"
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
              Layers
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
            className="flex-1 overflow-y-auto p-3 space-y-4"
          >
            {/* Time range */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Time Range</span>
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
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Min. Severity</div>
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
                  {CATEGORY_LABELS[category]}
                </div>
                <div className="space-y-0.5">
                  {layers.map((layer) => {
                    const Icon = ICON_MAP[layer.icon] || Filter
                    const active = isLayerActive(layer.id as LayerId)
                    return (
                      <div
                        key={layer.id}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer',
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
                          {layer.label}
                        </span>
                        <Switch
                          checked={active}
                          className="h-3.5 w-6 data-[state=checked]:bg-[var(--obs-teal)]"
                          onCheckedChange={() => toggleLayer(layer.id as LayerId)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
