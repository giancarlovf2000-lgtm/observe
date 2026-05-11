import { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Lock, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'OBSERVE internal API endpoints — for advanced integrations and automation.',
}

function NavHeader() {
  return (
    <header className="border-b border-border/30 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--obs-teal)] flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="font-bold text-sm tracking-wider uppercase">OBSERVE</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link>
          <Link href="/data-sources" className="hover:text-foreground transition-colors">Data Sources</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
        </div>
      </div>
    </header>
  )
}

type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH'

const METHOD_COLORS: Record<Method, string> = {
  GET:    'text-[var(--obs-green)] bg-[var(--obs-green)]/10 border-[var(--obs-green)]/20',
  POST:   'text-[var(--obs-teal)] bg-[var(--obs-teal)]/10 border-[var(--obs-teal)]/20',
  DELETE: 'text-[var(--obs-red)] bg-[var(--obs-red)]/10 border-[var(--obs-red)]/20',
  PATCH:  'text-[var(--obs-amber)] bg-[var(--obs-amber)]/10 border-[var(--obs-amber)]/20',
}

function MethodBadge({ method }: { method: Method }) {
  return (
    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${METHOD_COLORS[method]}`}>
      {method}
    </span>
  )
}

const ENDPOINTS = [
  {
    group: 'Data Refresh',
    description: 'Trigger on-demand data ingestion for platform sources.',
    routes: [
      {
        method: 'POST' as Method,
        path: '/api/refresh',
        auth: 'Session cookie (subscriber)',
        summary: 'Run all platform ingestion pipelines in sequence',
        body: null,
        response: '{ ok: true, usgs, noaa, gdelt, crypto, fx }',
        notes: 'Runs USGS → NOAA → CoinCap → ExchangeRate → GDELT (sequential due to GDELT rate limit). Takes 15–30s. Called by the Refresh button on intelligence pages.',
      },
    ],
  },
  {
    group: 'Credentials (BYOK)',
    description: 'Manage encrypted third-party API keys stored in your account.',
    routes: [
      {
        method: 'GET' as Method,
        path: '/api/credentials',
        auth: 'Session cookie',
        summary: 'List all saved credential slugs for the authenticated user',
        body: null,
        response: '{ credentials: [{ source_slug, has_key }] }',
        notes: 'Never returns the actual key values — only confirms which slugs have a key set.',
      },
      {
        method: 'POST' as Method,
        path: '/api/credentials',
        auth: 'Session cookie',
        summary: 'Save or update an API key for a given source slug',
        body: '{ source_slug: "newsapi", api_key: "your-key" }',
        response: '{ ok: true }',
        notes: 'Keys are encrypted before storage. Supported slugs: newsapi, acled, opensky, openweathermap, perplexity.',
      },
      {
        method: 'DELETE' as Method,
        path: '/api/credentials',
        auth: 'Session cookie',
        summary: 'Delete a saved API key',
        body: '{ source_slug: "newsapi" }',
        response: '{ ok: true }',
        notes: null,
      },
    ],
  },
  {
    group: 'Stripe Billing',
    description: 'Manage subscriptions via Stripe.',
    routes: [
      {
        method: 'POST' as Method,
        path: '/api/stripe/checkout',
        auth: 'Session cookie',
        summary: 'Create a Stripe Checkout session for the Pro plan',
        body: '{ plan: "pro" }',
        response: '{ url: "https://checkout.stripe.com/..." }',
        notes: 'Redirect the user to the returned URL to complete payment.',
      },
      {
        method: 'POST' as Method,
        path: '/api/stripe/portal',
        auth: 'Session cookie (subscriber)',
        summary: 'Create a Stripe Customer Portal session to manage billing',
        body: null,
        response: '{ url: "https://billing.stripe.com/..." }',
        notes: 'Redirect to the returned URL to manage payment method, view invoices, or cancel.',
      },
      {
        method: 'POST' as Method,
        path: '/api/stripe/sync-subscription',
        auth: 'Session cookie',
        summary: 'Sync subscription status from Stripe into the user profile',
        body: null,
        response: '{ ok: true, status: "active" | "canceled" | "none" }',
        notes: 'Call this after returning from Stripe checkout to ensure the platform reflects the latest subscription state.',
      },
    ],
  },
  {
    group: 'Briefings',
    description: 'Generate and retrieve AI intelligence briefings.',
    routes: [
      {
        method: 'POST' as Method,
        path: '/api/briefings',
        auth: 'Session cookie (subscriber + Perplexity key)',
        summary: 'Generate a new AI briefing using Perplexity AI',
        body: '{ topic?: string, region?: string }',
        response: '{ id, content, created_at }',
        notes: 'Requires Perplexity API key saved in Settings → Integrations. Takes 10–30 seconds.',
      },
    ],
  },
  {
    group: 'Auth',
    description: 'Authentication callback — handled automatically by Supabase.',
    routes: [
      {
        method: 'GET' as Method,
        path: '/api/auth/callback',
        auth: 'None (public)',
        summary: 'OAuth and magic link callback — exchanges code for session',
        body: null,
        response: 'Redirect to /dashboard or /reset-password',
        notes: 'Used internally by Supabase for email confirmation and password reset flows. Do not call directly.',
      },
    ],
  },
]

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">API Reference</h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Internal API endpoints used by the OBSERVE platform. These are the same endpoints
            the frontend calls — useful if you want to automate refreshes, manage credentials,
            or integrate OBSERVE data into your own workflows.
          </p>
        </div>

        {/* Auth note */}
        <div className="flex items-start gap-3 rounded-xl border border-[var(--obs-amber)]/20 bg-[var(--obs-amber)]/5 p-4">
          <Lock className="w-4 h-4 text-[var(--obs-amber)] mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Authentication:</strong> All endpoints require an active Supabase session cookie
            (obtained by signing in at <Link href="/login" className="text-[var(--obs-teal)] hover:underline">/login</Link>).
            Unauthenticated requests return <code className="text-xs bg-white/5 px-1 py-0.5 rounded">401 Unauthorized</code>.
            Subscriber-only endpoints additionally require an active Stripe subscription.
          </div>
        </div>

        {/* Base URL */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Base URL</h2>
          <div className="rounded-lg bg-white/3 border border-border/20 px-4 py-3 font-mono text-sm text-foreground">
            https://www.observe.center
          </div>
        </div>

        {/* Endpoint groups */}
        {ENDPOINTS.map(group => (
          <section key={group.group} className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--obs-teal)]" />
              <h2 className="text-lg font-semibold text-foreground">{group.group}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{group.description}</p>

            <div className="space-y-3">
              {group.routes.map(route => (
                <div key={route.path} className="rounded-xl border border-border/20 overflow-hidden">
                  {/* Route header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/2 border-b border-border/10">
                    <MethodBadge method={route.method} />
                    <code className="text-sm font-mono text-foreground">{route.path}</code>
                    <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{route.summary}</span>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground sm:hidden">{route.summary}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-muted-foreground/60 uppercase tracking-wider font-mono mb-1">Auth</div>
                        <div className="text-muted-foreground">{route.auth}</div>
                      </div>
                      {route.body && (
                        <div>
                          <div className="text-muted-foreground/60 uppercase tracking-wider font-mono mb-1">Request body</div>
                          <code className="text-muted-foreground bg-white/3 px-2 py-1 rounded block">{route.body}</code>
                        </div>
                      )}
                      <div>
                        <div className="text-muted-foreground/60 uppercase tracking-wider font-mono mb-1">Response</div>
                        <code className="text-muted-foreground bg-white/3 px-2 py-1 rounded block">{route.response}</code>
                      </div>
                    </div>

                    {route.notes && (
                      <div className="text-xs text-muted-foreground/60 border-t border-border/10 pt-2">
                        {route.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="border-t border-border/30 pt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link>
          <Link href="/data-sources" className="hover:text-foreground transition-colors">Data Sources</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </div>
      </main>
    </div>
  )
}
