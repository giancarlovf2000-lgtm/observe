'use client'

import { motion } from 'framer-motion'
import {
  Sword, Newspaper, CloudLightning, Plane, Ship, TrendingUp,
  AlertTriangle, Zap, Globe2, Activity, Wifi, Navigation
} from 'lucide-react'

const LAYERS = [
  { icon: Sword, label: 'Conflicts & Wars', color: '#ef4444', desc: 'Active conflicts, frozen disputes, border tensions' },
  { icon: Newspaper, label: 'Breaking News', color: '#f97316', desc: 'Geolocated global news with AI summaries' },
  { icon: CloudLightning, label: 'Weather & Disasters', color: '#3b82f6', desc: 'Storms, earthquakes, floods, wildfires' },
  { icon: Plane, label: 'Flight Intelligence', color: '#22d3ee', desc: 'Live air traffic density and route analysis' },
  { icon: Ship, label: 'Maritime Activity', color: '#06b6d4', desc: 'Shipping lanes, vessels, chokepoints' },
  { icon: TrendingUp, label: 'Markets & Crypto', color: '#eab308', desc: 'FX, crypto, commodities, macro signals' },
  { icon: Globe2, label: 'Country Risk', color: '#8b5cf6', desc: 'Risk score overlays for all 180+ nations' },
  { icon: AlertTriangle, label: 'Sanctions & Regulation', color: '#f59e0b', desc: 'New sanctions, legal changes, compliance events' },
  { icon: Zap, label: 'Energy & Infrastructure', color: '#10b981', desc: 'Pipeline disruptions, power grid events' },
  { icon: Activity, label: 'Political Instability', color: '#a78bfa', desc: 'Elections, protests, regime change signals' },
  { icon: Navigation, label: 'Trade Corridors', color: '#14b8a6', desc: 'Strategic chokepoints, route disruptions' },
  { icon: Wifi, label: 'AI Insights', color: '#d946ef', desc: 'AI-surfaced anomalies and pattern alerts' },
]

export function LandingLayers() {
  return (
    <section id="layers" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--obs-teal)]/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--obs-teal)] tracking-widest uppercase mb-4">
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
            INTELLIGENCE LAYERS
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            15 layers. One unified view.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Each layer represents a different dimension of global reality.
            Activate them individually or combine them for cross-domain intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {LAYERS.map((layer, i) => (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="glass rounded-xl p-4 hover:glass-elevated transition-all duration-200 group cursor-default border border-white/5"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${layer.color}20`, border: `1px solid ${layer.color}35` }}
                >
                  <layer.icon className="w-4 h-4" style={{ color: layer.color }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground group-hover:text-[var(--obs-teal)] transition-colors leading-tight">
                    {layer.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    {layer.desc}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
