'use client'

import { motion } from 'framer-motion'
import {
  Map, Brain, Bell, BookOpen, Shield, BarChart3, Globe2, Layers, Crosshair
} from 'lucide-react'

const FEATURES = [
  {
    icon: Map,
    title: 'Interactive World Map',
    description: 'Full-screen, GPU-accelerated world map with 15 intelligence layers. Pan, zoom, and click any event to reveal deep contextual analysis.',
    color: 'var(--obs-teal)',
  },
  {
    icon: Brain,
    title: 'AI-Powered Briefings',
    description: 'AI generates daily world summaries, country briefings, conflict analyses, and market intelligence — streamed in real time.',
    color: 'var(--obs-purple)',
  },
  {
    icon: Layers,
    title: '15 Intelligence Layers',
    description: 'Toggle conflicts, news, weather, flights, shipping, markets, energy, and more. Mix layers for powerful cross-domain situational views.',
    color: 'var(--obs-blue)',
  },
  {
    icon: Bell,
    title: 'Custom Alerts',
    description: 'Create intelligent alerts for any country, conflict, asset, or keyword. Get notified when the world changes in ways that matter to you.',
    color: 'var(--obs-amber)',
  },
  {
    icon: BookOpen,
    title: 'Country Intelligence Profiles',
    description: 'Deep profiles for every nation: active conflicts, economic signals, weather events, shipping activity, and AI-generated briefings.',
    color: 'var(--obs-teal)',
  },
  {
    icon: BarChart3,
    title: 'Market & Currency Intelligence',
    description: 'Monitor FX, cryptocurrency, commodities, and macro signals. Understand the geopolitical forces moving markets.',
    color: 'var(--obs-green)',
  },
  {
    icon: Globe2,
    title: 'Conflict Monitoring',
    description: 'Track active wars, frozen conflicts, border tensions, and escalation signals. Timeline views, party analysis, and implication briefings.',
    color: 'var(--obs-red)',
  },
  {
    icon: Crosshair,
    title: 'Saved Watchlists',
    description: 'Build personal intelligence workspaces around the countries, assets, and issues you care about. Your world, filtered for you.',
    color: 'var(--obs-purple)',
  },
  {
    icon: Shield,
    title: 'Lawful & Ethical',
    description: 'Built exclusively on public, open, and legally accessible data sources. No private surveillance. No hacking. Intelligence through transparency.',
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
            OBSERVE fuses data from dozens of public sources into one coherent,
            AI-enhanced view of global reality.
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
