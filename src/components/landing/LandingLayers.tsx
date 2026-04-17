'use client'

import { motion } from 'framer-motion'
import {
  Sword, Newspaper, CloudLightning, Plane, Ship, TrendingUp,
  Globe2, Activity, Brain
} from 'lucide-react'

const LAYERS = [
  { icon: Sword,         label: 'Conflicts & Wars',    color: '#ef4444', desc: 'Powered by ACLED — requires your free ACLED account', included: false },
  { icon: Newspaper,    label: 'Breaking News',        color: '#f97316', desc: 'Powered by NewsAPI — requires your free NewsAPI key', included: false },
  { icon: CloudLightning,label: 'Weather & Disasters', color: '#3b82f6', desc: 'Earthquakes (USGS), storms & floods (NOAA, OpenMeteo) — included', included: true },
  { icon: Plane,        label: 'Flight Tracking',      color: '#22d3ee', desc: 'Flight positions via OpenSky Network — included', included: true },
  { icon: Ship,         label: 'Vessel Tracking',      color: '#06b6d4', desc: 'Vessel positions via OpenSky Network — included', included: true },
  { icon: TrendingUp,   label: 'Markets & Crypto',     color: '#eab308', desc: 'Crypto prices (CoinGecko) and FX rates (ExchangeRate) — included', included: true },
  { icon: Activity,     label: 'Political Events',     color: '#a78bfa', desc: 'Political events from ACLED data — requires your free ACLED account', included: false },
  { icon: Globe2,       label: 'Country Profiles',     color: '#8b5cf6', desc: 'Country-level pages with aggregated event data — included', included: true },
  { icon: Brain,        label: 'AI Briefings',         color: '#d946ef', desc: 'On-demand briefings via Perplexity Sonar — requires your Perplexity API key', included: false },
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
            9 data layers. All from public sources.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Each layer is backed by a real public API. Some are included in your
            subscription; others unlock when you connect your own free credentials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="text-sm font-medium text-foreground group-hover:text-[var(--obs-teal)] transition-colors leading-tight">
                      {layer.label}
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      layer.included
                        ? 'bg-[var(--obs-teal)]/15 text-[var(--obs-teal)] border border-[var(--obs-teal)]/25'
                        : 'bg-[var(--obs-amber)]/15 text-[var(--obs-amber)] border border-[var(--obs-amber)]/25'
                    }`}>
                      {layer.included ? 'INCLUDED' : 'YOUR KEY'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground leading-tight">
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
