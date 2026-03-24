'use client'

import { motion } from 'framer-motion'
import { Globe2, Layers, MousePointer2, Brain, BellRing } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Globe2,
    title: 'Open the world map',
    description: 'Start with a beautiful full-screen world map showing current global activity. Every marker represents a real event happening right now.',
    color: 'var(--obs-teal)',
  },
  {
    number: '02',
    icon: Layers,
    title: 'Activate intelligence layers',
    description: 'Toggle conflict zones, weather alerts, flight density, shipping routes, news hotspots, or market signals. Mix layers for cross-domain analysis.',
    color: 'var(--obs-blue)',
  },
  {
    number: '03',
    icon: MousePointer2,
    title: 'Click to explore events',
    description: 'Click any marker to open a detailed intelligence panel: timeline, parties involved, implications, related assets, and live source links.',
    color: 'var(--obs-purple)',
  },
  {
    number: '04',
    icon: Brain,
    title: 'Read AI briefings',
    description: 'Request an AI-generated briefing on any country, conflict, region, or market. Get executive summaries, risk analysis, and implication frameworks.',
    color: 'var(--obs-amber)',
  },
  {
    number: '05',
    icon: BellRing,
    title: 'Save watchlists and alerts',
    description: 'Save your preferred intelligence configuration. Create alerts for the countries and topics you monitor. Come back tomorrow fully updated.',
    color: 'var(--obs-green)',
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--obs-teal)] tracking-widest uppercase mb-4">
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
            HOW IT WORKS
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From raw events to strategic intelligence
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            OBSERVE turns global noise into clarity in five steps.
          </p>
        </motion.div>

        <div className="space-y-0">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 md:gap-10 items-start py-8 border-b border-border/40 last:border-0"
            >
              {/* Number */}
              <div className="flex-shrink-0">
                <span
                  className="text-4xl font-black font-mono opacity-20"
                  style={{ color: step.color }}
                >
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center mt-1"
                style={{
                  background: `${step.color}15`,
                  border: `1px solid ${step.color}30`,
                }}
              >
                <step.icon className="w-5 h-5" style={{ color: step.color }} />
              </div>

              {/* Content */}
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
