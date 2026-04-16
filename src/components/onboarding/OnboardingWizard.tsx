'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowRight, Loader2, Sparkles, Link2, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IntegrationsClient } from '@/components/settings/IntegrationsClient'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 'welcome',      label: 'Welcome',      icon: Sparkles },
  { id: 'plan',         label: 'Your plan',    icon: CheckCircle2 },
  { id: 'integrations', label: 'Connect data', icon: Link2 },
  { id: 'launch',       label: 'Launch',       icon: Rocket },
]

export function OnboardingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const checkoutSuccess = searchParams.get('checkout') === 'success'

  const [step, setStep]         = useState(checkoutSuccess ? 2 : 0)
  const [upgrading, setUpgrading] = useState(false)
  const [tier, setTier]         = useState<'free' | 'pro'>('free')

  // Fetch current tier
  useEffect(() => {
    fetch('/api/me')
      .then(r => r.ok ? r.json() : null)
      .then((d: { tier?: string } | null) => {
        if (d?.tier === 'pro') setTier('pro')
      })
      .catch(() => null)
  }, [])

  async function handleUpgrade() {
    setUpgrading(true)
    const res = await fetch('/api/stripe/checkout', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ plan: 'pro' }),
    })
    const d = await res.json() as { url?: string }
    if (d.url) window.location.href = d.url
    setUpgrading(false)
  }

  function next() { setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  function skip() { setStep(s => Math.min(s + 1, STEPS.length - 1)) }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="text-xs font-mono text-[var(--obs-teal)] tracking-widest uppercase mb-2">
          Getting started
        </div>
        <h1 className="text-2xl font-bold text-foreground">Welcome to OBSERVE</h1>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              i === step
                ? 'bg-[var(--obs-teal)]/15 text-[var(--obs-teal)] border border-[var(--obs-teal)]/30'
                : i < step
                ? 'text-[var(--obs-teal)]/60'
                : 'text-muted-foreground/40'
            )}>
              {i < step
                ? <CheckCircle2 className="w-3.5 h-3.5" />
                : <s.icon className="w-3.5 h-3.5" />
              }
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'w-6 h-px',
                i < step ? 'bg-[var(--obs-teal)]/40' : 'bg-border/30'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── Step 0: Welcome ── */}
            {step === 0 && (
              <div className="glass-elevated rounded-2xl border border-white/8 p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--obs-teal)]/10 border border-[var(--obs-teal)]/20 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-[var(--obs-teal)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Your account is ready</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    OBSERVE is a global intelligence platform. We&apos;ll guide you through connecting
                    your data sources so your map starts populating with live intelligence.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {['World Map', 'AI Briefings', 'Live Alerts'].map(f => (
                    <div key={f} className="rounded-lg border border-border/20 p-3 bg-background/30">
                      <div className="text-xs text-muted-foreground">{f}</div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-11"
                  onClick={next}
                >
                  Get started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {/* ── Step 1: Plan ── */}
            {step === 1 && (
              <div className="glass-elevated rounded-2xl border border-white/8 p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Choose your plan</h2>
                  <p className="text-sm text-muted-foreground">Start free and upgrade whenever you&apos;re ready.</p>
                </div>

                {checkoutSuccess || tier === 'pro' ? (
                  <div className="rounded-xl border border-[var(--obs-teal)]/30 bg-[var(--obs-teal)]/5 p-5 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[var(--obs-teal)] shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">Pro plan active</div>
                      <div className="text-xs text-muted-foreground">All 15 intelligence layers and unlimited AI briefings unlocked.</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Free */}
                    <div className="rounded-xl border border-border/40 p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-foreground">Free forever</div>
                        <div className="text-xs text-muted-foreground mt-0.5">5 layers · basic watchlist · daily briefing</div>
                      </div>
                      <div className="text-lg font-bold text-foreground">$0</div>
                    </div>

                    {/* Pro */}
                    <div className="rounded-xl border border-[var(--obs-teal)]/30 bg-[var(--obs-teal)]/5 p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-foreground flex items-center gap-2">
                          Pro
                          <span className="text-[10px] bg-[var(--obs-teal)]/20 text-[var(--obs-teal)] px-1.5 py-0.5 rounded font-mono">
                            RECOMMENDED
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">All 15 layers · unlimited briefings · custom alerts</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">$29</div>
                        <div className="text-xs text-muted-foreground">/month</div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-10"
                      onClick={handleUpgrade}
                      disabled={upgrading}
                    >
                      {upgrading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Upgrade to Pro
                    </Button>
                  </div>
                )}

                <button
                  onClick={skip}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  Continue with free plan →
                </button>
              </div>
            )}

            {/* ── Step 2: Integrations ── */}
            {step === 2 && (
              <div className="glass-elevated rounded-2xl border border-white/8 p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Connect your data sources</h2>
                  <p className="text-sm text-muted-foreground">
                    Create free accounts on these services. Takes about 5 minutes.
                  </p>
                </div>
                <IntegrationsClient initialStatuses={[]} />
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-10"
                    onClick={next}
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="border-border/40 h-10 text-sm" onClick={skip}>
                    Skip for now
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 3: Launch ── */}
            {step === 3 && (
              <div className="glass-elevated rounded-2xl border border-white/8 p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--obs-teal)]/10 border border-[var(--obs-teal)]/20 flex items-center justify-center mx-auto">
                  <Rocket className="w-8 h-8 text-[var(--obs-teal)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">You&apos;re all set</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your command center is ready. Connected sources will populate automatically.
                    You can always add more integrations in Settings.
                  </p>
                </div>
                <Button
                  className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-11 text-base"
                  onClick={() => router.push('/dashboard')}
                >
                  Open command center <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
