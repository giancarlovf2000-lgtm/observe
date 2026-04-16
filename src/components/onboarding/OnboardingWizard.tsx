'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, ArrowRight, Loader2, CreditCard, Link2, Rocket, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IntegrationsClient } from '@/components/settings/IntegrationsClient'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 'subscribe',     label: 'Subscribe',     icon: CreditCard },
  { id: 'integrations',  label: 'Connect data',  icon: Link2 },
  { id: 'launch',        label: 'Launch',         icon: Rocket },
]

const PRO_FEATURES = [
  'All 15 intelligence layers',
  'Unlimited AI briefings',
  'Live conflict, news & weather',
  'Flight & vessel tracking',
  'Custom alerts',
  'Connect your own data sources',
]

export function OnboardingWizard() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const checkoutSuccess = searchParams.get('checkout') === 'success'

  const [step, setStep]         = useState(checkoutSuccess ? 1 : 0)
  const [upgrading, setUpgrading] = useState(false)
  const [paid, setPaid]         = useState(checkoutSuccess)
  const [checking, setChecking] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  // Poll subscription status after returning from Stripe
  useEffect(() => {
    if (!checkoutSuccess) return
    setChecking(true)
    const interval = setInterval(async () => {
      const res = await fetch('/api/me')
      const d   = await res.json() as { subscription_status?: string; tier?: string }
      if (d.subscription_status === 'active' || d.tier === 'pro') {
        setPaid(true)
        setChecking(false)
        clearInterval(interval)
      }
    }, 2000)
    // Stop polling after 30s regardless
    setTimeout(() => { clearInterval(interval); setChecking(false) }, 30000)
    return () => clearInterval(interval)
  }, [checkoutSuccess])

  async function handleUpgrade() {
    setUpgrading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan: 'pro' }),
      })
      const d = await res.json() as { url?: string; error?: string }
      if (d.url) {
        window.location.href = d.url
        return // page will navigate away
      }
      setCheckoutError(d.error ?? 'Could not start checkout. Please try again.')
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Network error. Please try again.')
    }
    setUpgrading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo / brand */}
      <div className="mb-10 text-center">
        <div className="text-xs font-mono text-[var(--obs-teal)] tracking-widest uppercase mb-1">
          Welcome to
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">OBSERVE</h1>
        <p className="text-sm text-muted-foreground mt-1">Global Intelligence Platform</p>
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
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >

            {/* ── Step 0: Subscribe ── */}
            {step === 0 && (
              <div className="glass-elevated rounded-2xl border border-white/8 p-8 space-y-6">
                {paid ? (
                  <div className="text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[var(--obs-teal)]/15 border border-[var(--obs-teal)]/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7 text-[var(--obs-teal)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Payment confirmed</h2>
                      <p className="text-sm text-muted-foreground mt-1">Pro access is active.</p>
                    </div>
                    <Button
                      className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-11"
                      onClick={() => setStep(1)}
                    >
                      Continue <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                ) : checkoutSuccess && checking ? (
                  <div className="text-center space-y-4 py-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--obs-teal)] mx-auto" />
                    <p className="text-sm text-muted-foreground">Confirming your payment…</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">Activate your account</h2>
                      <p className="text-sm text-muted-foreground">
                        Full platform access for $29/month. Cancel anytime.
                      </p>
                    </div>

                    {/* Plan card */}
                    <div className="rounded-xl border border-[var(--obs-teal)]/30 bg-[var(--obs-teal)]/5 p-5">
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <div className="text-sm font-mono text-[var(--obs-teal)] uppercase tracking-wider">OBSERVE PRO</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Billed monthly · Cancel anytime</div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-foreground">$29</span>
                          <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {PRO_FEATURES.map(f => (
                          <li key={f} className="flex items-center gap-2 text-xs text-foreground/80">
                            <Check className="w-3.5 h-3.5 text-[var(--obs-teal)] shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-12 text-base font-semibold"
                      onClick={handleUpgrade}
                      disabled={upgrading}
                    >
                      {upgrading
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <><CreditCard className="w-4 h-4 mr-2" />Subscribe — $29/month</>
                      }
                    </Button>

                    {checkoutError && (
                      <p className="text-center text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {checkoutError}
                      </p>
                    )}

                    <p className="text-center text-xs text-muted-foreground">
                      Secure checkout via Stripe. Your data is never sold.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* ── Step 1: Connect data sources ── */}
            {step === 1 && (
              <div className="glass-elevated rounded-2xl border border-white/8 p-6 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Connect your data sources</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    OBSERVE uses <span className="text-foreground/80 font-medium">your own free API accounts</span> to
                    fetch intelligence. Create accounts on each service below — it takes about 5 minutes
                    and they&apos;re all free.
                  </p>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-300 leading-relaxed">
                  <span className="font-medium">Why do I need my own accounts?</span>{' '}
                  This keeps your data private, gives you your own rate limits, and means
                  you agree directly to each provider&apos;s terms — not us acting as a middleman.
                </div>

                <IntegrationsClient initialStatuses={[]} />

                <div className="flex gap-3 pt-1">
                  <Button
                    className="flex-1 bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-10"
                    onClick={() => setStep(2)}
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground h-10 text-sm"
                    onClick={() => setStep(2)}
                  >
                    Skip for now
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 2: Launch ── */}
            {step === 2 && (
              <div className="glass-elevated rounded-2xl border border-white/8 p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--obs-teal)]/10 border border-[var(--obs-teal)]/20 flex items-center justify-center mx-auto">
                  <Rocket className="w-8 h-8 text-[var(--obs-teal)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">You&apos;re ready</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your command center is live. Connected sources will populate automatically.
                    Add more integrations anytime in{' '}
                    <span className="text-foreground/70">Settings → Integrations</span>.
                  </p>
                </div>
                <Button
                  className="w-full bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 h-12 text-base"
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
