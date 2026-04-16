'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Loader2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

async function startCheckout() {
  const res = await fetch('/api/stripe/checkout', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ plan: 'pro' }),
  })
  const d = await res.json() as { url?: string; error?: string }
  if (d.url) {
    window.location.href = d.url
  } else if (d.error === 'Unauthorized') {
    // Not logged in — go to signup with plan intent
    window.location.href = '/signup?plan=pro'
  }
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Core map access with essential layers.',
    features: [
      'Interactive world map',
      '5 intelligence layers',
      'Public news & weather',
      'Daily world briefing',
      'Basic watchlist (5 items)',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Full platform access for serious analysts.',
    features: [
      'All 15 intelligence layers',
      'Unlimited AI briefings',
      'Custom alerts (unlimited)',
      'Country intelligence profiles',
      'Workspaces & saved views',
      'Historical timeline tools',
      'Market & crypto intelligence',
      'Export briefings',
    ],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams requiring advanced capabilities.',
    features: [
      'Everything in Pro',
      'Team workspaces',
      'API access',
      'Custom data integrations',
      'Dedicated briefing feeds',
      'SLA & priority support',
      'Custom AI tuning',
      'Compliance features',
    ],
    cta: 'Contact Sales',
    href: 'mailto:sales@observeplatform.com',
    featured: false,
  },
]

type PlanDef = typeof PLANS[number]

function PlanCard({ plan, index }: { plan: PlanDef; index: number }) {
  const [busy, setBusy] = useState(false)

  async function handleClick() {
    if (!plan.featured) return
    setBusy(true)
    await startCheckout()
    setBusy(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative rounded-2xl p-6 border transition-all',
        plan.featured
          ? 'border-[var(--obs-teal)]/40 glass-elevated glow-teal'
          : 'border-border/40 glass'
      )}
    >
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[var(--obs-teal)] text-background text-xs font-semibold px-3">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-1">
          {plan.name}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">{plan.price}</span>
          {plan.period && (
            <span className="text-muted-foreground text-sm">{plan.period}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
      </div>

      <ul className="space-y-2.5 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm">
            <Check
              className="w-4 h-4 flex-shrink-0"
              style={{ color: plan.featured ? 'var(--obs-teal)' : 'var(--obs-green)' }}
            />
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      {plan.featured ? (
        <button
          onClick={handleClick}
          disabled={busy}
          className={cn(
            buttonVariants(),
            'w-full group bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90'
          )}
        >
          {busy
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <>{plan.cta}<ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></>
          }
        </button>
      ) : (
        <Link
          href={plan.href}
          className={cn(
            buttonVariants(),
            'w-full group border border-border/60 bg-transparent hover:bg-white/5'
          )}
        >
          {plan.cta}
          <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </motion.div>
  )
}

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--obs-teal)] tracking-widest uppercase mb-4">
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
            PRICING
            <div className="w-8 h-px bg-[var(--obs-teal)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free, scale as your intelligence needs grow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
