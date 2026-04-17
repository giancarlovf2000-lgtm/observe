'use client'

import { motion } from 'framer-motion'
import {
  Map, Brain, Bell, BookOpen, Shield, BarChart3, Globe2, Layers, Crosshair
} from 'lucide-react'

const FEATURES = [
  {
    icon: Map,
    title: 'Interactive World Map',
    description: 'Full-screen world map with toggleable data layers. Pan, zoom, and click any event to see source details, location context, and related events.',
    color: 'var(--obs-teal)',
  },
  {
    icon: Brain,
    title: 'AI Briefings (your Perplexity key)',
    description: 'Connect your own Perplexity API key to generate on-demand briefings on any country, conflict, or region. Streamed directly to your dashboard.',
    color: 'var(--obs-purple)',
  },
  {
    icon: Layers,
    title: 'Multiple Data Layers',
    description: 'Toggle weather events, flight tracking, market prices, conflict data, and news. Each layer is backed by a real public data source.',
    color: 'var(--obs-blue)',
  },
  {
    icon: Bell,
    title: 'Custom Alerts',
    description: 'Create rule-based alerts for specific countries or keywords. Get notified when matching events are ingested into your dashboard.',
    color: 'var(--obs-amber)',
  },
  {
    icon: BookOpen,
    title: 'Country Profiles',
    description: 'Browse country-level pages showing recent events, weather activity, market data, and any briefings you have generated for that country.',
    color: 'var(--obs-teal)',
  },
  {
    icon: BarChart3,
    title: 'Market & Currency Prices',
    description: 'Daily-updated crypto prices from CoinGecko and FX rates from ExchangeRate API. No credential needed — included in your subscription.',
    color: 'var(--obs-green)',
  },
  {
    icon: Globe2,
    title: 'Conflict Tracking (ACLED key)',
    description: 'Connect your free ACLED account to pull armed conflict event data. Events are stored in your account and visible only to you.',
    color: 'var(--obs-red)',
  },
  {
    icon: Crosshair,
    title: 'Watchlists & Workspaces',
    description: 'Save countries, events, and topics to personal watchlists. Organize your monitoring into workspaces for different regions or topics.',
    color: 'var(--obs-purple)',
  },
  {
    icon: Shield,
    title: 'Public sources only',
    description: 'OBSERVE uses exclusively public, open, and legally accessible data sources. No private surveillance, no scraping of restricted content.',
    color: 'var(--obs-amber)',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--obs-teal)] tracking-widest uppercase mb-4">
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
            CAPABILITIES
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to understand the world
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            OBSERVE aggregates data from public APIs into one dashboard. Some
            features work out of the box; others unlock when you connect your own
            free API credentials.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass rounded-xl p-6 hover:glass-elevated transition-all duration-200 group cursor-default border border-white/5"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}30` }}
              >
                <feature.icon
                  className="w-5 h-5"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-[var(--obs-teal)] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
