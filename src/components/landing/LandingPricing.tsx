'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Plug } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const INCLUDED = [
  'Live weather & disaster alerts (USGS, NOAA)',
  'Market & crypto prices (CoinCap, ExchangeRate)',
  'Live flight & vessel tracking (OpenSky)',
  'Global events map',
  'Country intelligence profiles',
  'Custom alerts — any country or keyword',
  'Watchlists & saved views',
  'Workspaces',
]

const BRING_YOUR_OWN = [
  { label: 'News Intelligence', service: 'NewsAPI — free key at newsapi.org' },
  { label: 'Conflict Tracking', service: 'ACLED — free at acleddata.com' },
  { label: 'AI Briefings', service: 'Perplexity AI — pay-as-you-go API key' },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--obs-teal)] tracking-widest uppercase mb-4">
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
            PRICING
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            One plan. Full access.
          </h2>
          <p className="text-muted-foreground">
            Everything you need to monitor the world in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl p-8 border border-[var(--obs-teal)]/40 glass-elevated glow-teal"
        >
          {/* Price */}
          <div className="text-center mb-8">
            <div className="text-sm font-mono text-[var(--obs-teal)] uppercase tracking-widest mb-3">
              OBSERVE PRO
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl font-bold text-foreground">$29</span>
              <span className="text-muted-foreground text-lg">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cancel anytime. No contracts.
            </p>
          </div>

          {/* Included out of the box */}
          <p className="text-xs font-mono text-[var(--obs-teal)] uppercase tracking-widest mb-3">Included — no setup required</p>
          <ul className="space-y-2.5 mb-8">
            {INCLUDED.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <Check className="w-4 h-4 flex-shrink-0 text-[var(--obs-teal)] mt-0.5" />
                <span className="text-foreground/85">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Bring your own keys */}
          <div className="border-t border-white/8 pt-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Plug className="w-3.5 h-3.5 text-[var(--obs-amber)]" />
              <p className="text-xs font-mono text-[var(--obs-amber)] uppercase tracking-widest">Connect your own free API keys to unlock</p>
            </div>
            <ul className="space-y-2.5">
              {BRING_YOUR_OWN.map((item) => (
                <li key={item.label} className="flex items-start gap-3 text-sm">
                  <Plug className="w-3.5 h-3.5 flex-shrink-0 text-[var(--obs-amber)] mt-0.5" />
                  <span>
                    <span className="text-foreground/85 font-medium">{item.label}</span>
                    <span className="text-muted-foreground"> — {item.service}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Your keys stay private — encrypted and stored only in your account. We never share or use them outside your sessions.
            </p>
          </div>

          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-12 text-base font-semibold group'
            )}
          >
            Get Started
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Secure checkout via Stripe · Your data is never sold
          </p>
        </motion.div>
      </div>
    </section>
  )
}
