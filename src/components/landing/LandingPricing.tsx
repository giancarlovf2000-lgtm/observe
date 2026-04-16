'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const FEATURES = [
  'All 15 intelligence layers',
  'Live conflict, news & weather feeds',
  'Unlimited AI-powered briefings',
  'Custom alerts — any country or keyword',
  'Country intelligence profiles',
  'Flight & vessel tracking',
  'Market & crypto intelligence',
  'Watchlists & saved views',
  'Connect your own data sources (BYOK)',
  'Export briefings',
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-lg mx-auto">
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

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 flex-shrink-0 text-[var(--obs-teal)]" />
                <span className="text-foreground/85">{feature}</span>
              </li>
            ))}
          </ul>

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
