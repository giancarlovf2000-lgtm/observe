'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Globe2, Shield, Zap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Animated world grid background
function WorldGridBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />

      {/* Grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--obs-teal)]/5 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-[var(--obs-blue)]/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-[var(--obs-purple)]/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Scan line effect */}
      <div className="absolute inset-0 z-5 overflow-hidden opacity-[0.015]">
        <div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--obs-teal)] to-transparent animate-scan"
        />
      </div>

      {/* Dot markers simulating events on a map */}
      {DEMO_MARKERS.map((m, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: m.delay, duration: 0.4 }}
        >
          <div className="relative">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: m.color }}
            />
            {m.pulse && (
              <div
                className="absolute inset-0 rounded-full animate-pulse-ring"
                style={{ background: m.color, opacity: 0.4 }}
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const DEMO_MARKERS = [
  { x: 52, y: 28, color: '#ef4444', pulse: true, delay: 0.5 },   // Ukraine
  { x: 57, y: 35, color: '#f97316', pulse: false, delay: 0.8 },  // Middle East
  { x: 48, y: 38, color: '#ef4444', pulse: true, delay: 1.1 },   // Sudan
  { x: 72, y: 30, color: '#f97316', pulse: false, delay: 1.4 },  // Asia
  { x: 38, y: 22, color: '#3b82f6', pulse: false, delay: 1.7 },  // Atlantic
  { x: 55, y: 42, color: '#f59e0b', pulse: true, delay: 2.0 },   // Africa
  { x: 30, y: 36, color: '#3b82f6', pulse: false, delay: 2.3 },  // Atlantic shipping
  { x: 20, y: 45, color: '#f97316', pulse: false, delay: 2.6 },  // Americas
  { x: 75, y: 45, color: '#22d3ee', pulse: true, delay: 2.9 },   // SE Asia
  { x: 65, y: 20, color: '#f59e0b', pulse: false, delay: 3.2 },  // Central Asia
]

const STATS = [
  { value: '180+', label: 'Countries monitored' },
  { value: '15', label: 'Intelligence layers' },
  { value: 'Real-time', label: 'Data updates' },
  { value: 'AI-powered', label: 'Briefings' },
]

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      <WorldGridBg />

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <Badge
            variant="outline"
            className="border-[var(--obs-teal)]/40 text-[var(--obs-teal)] bg-[var(--obs-teal)]/5 px-4 py-1.5 text-xs font-mono tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--obs-teal)] mr-2 inline-block animate-pulse" />
            LIVE INTELLIGENCE FEED ACTIVE
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-gradient-hero">
            See the world.
          </span>
          <br />
          <span className="text-foreground/90">
            Understand what matters.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
        >
          OBSERVE is an advanced global situational awareness platform. Monitor
          conflicts, weather, shipping, flights, markets, and breaking intelligence
          from a single, beautiful command center.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: 'lg' }), 'bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 glow-teal font-semibold px-8 h-12 text-base group')}
          >
            Open Intelligence Platform
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'border-border/60 hover:border-border h-12 text-base px-8')}
          >
            <Globe2 className="mr-2 w-4 h-4" />
            View Live Map
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/30 rounded-xl overflow-hidden border border-border/30"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-obs-surface px-6 py-4 text-center">
              <div className="text-xl font-bold text-gradient-teal">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <div className="text-xs text-muted-foreground/50 font-mono tracking-widest uppercase">Scroll</div>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
      </motion.div>
    </section>
  )
}
