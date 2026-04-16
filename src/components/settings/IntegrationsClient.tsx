'use client'

import { useState, useCallback } from 'react'
import {
  CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp,
  ExternalLink, RefreshCw, Trash2, Link2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// ─── Service definitions ─────────────────────────────────────────────────────

interface CredentialField {
  key:         string
  label:       string
  placeholder: string
  type?:       'text' | 'password'
}

interface ServiceDef {
  id:          string
  name:        string
  description: string
  signupUrl:   string
  signupLabel: string
  guide:       string[]
  fields:      CredentialField[]
  free:        boolean
  required:    boolean
}

const SERVICES: ServiceDef[] = [
  {
    id:          'acled',
    name:        'ACLED',
    description: 'Armed conflict event data — powers the Conflicts layer.',
    signupUrl:   'https://acleddata.com/register/',
    signupLabel: 'Register at acleddata.com',
    guide: [
      'Go to acleddata.com/register',
      'Fill in the research registration form (personal/student use is free)',
      'Verify your email — approval may take 1–2 days',
      'Once approved, enter your login email and password below',
    ],
    fields: [
      { key: 'email',    label: 'ACLED email',    placeholder: 'you@example.com' },
      { key: 'password', label: 'ACLED password', placeholder: '••••••••', type: 'password' },
    ],
    free:     true,
    required: true,
  },
  {
    id:          'newsapi',
    name:        'NewsAPI',
    description: 'Breaking news aggregation — powers the News layer.',
    signupUrl:   'https://newsapi.org/register',
    signupLabel: 'Get free API key at newsapi.org',
    guide: [
      'Go to newsapi.org/register',
      'Create a free developer account',
      'Copy your API key from the dashboard',
      'Paste it below',
    ],
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
    ],
    free:     true,
    required: true,
  },
  {
    id:          'opensky',
    name:        'OpenSky Network',
    description: 'Live flight tracking — powers the Transport layer.',
    signupUrl:   'https://opensky-network.org/index.php?option=com_users&view=registration',
    signupLabel: 'Register at opensky-network.org',
    guide: [
      'Go to opensky-network.org and register a free account',
      'Verify your email address',
      'Enter your username and password below',
      'Note: the free tier allows ~400 API credits/day',
    ],
    fields: [
      { key: 'username', label: 'Username', placeholder: 'your-opensky-username' },
      { key: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
    ],
    free:     true,
    required: false,
  },
  {
    id:          'openweather',
    name:        'OpenWeatherMap',
    description: 'Weather data — enhances the Weather layer.',
    signupUrl:   'https://home.openweathermap.org/users/sign_up',
    signupLabel: 'Get free key at openweathermap.org',
    guide: [
      'Sign up at openweathermap.org',
      'Go to API keys in your profile',
      'Copy your default API key (or create a new one)',
      'Paste it below',
    ],
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
    ],
    free:     true,
    required: false,
  },
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface ConnectionStatus {
  service:        string
  is_active:      boolean
  test_status:    string | null
  last_tested_at: string | null
}

interface IntegrationsClientProps {
  initialStatuses: ConnectionStatus[]
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  status,
  onSaved,
}: {
  service:  ServiceDef
  status:   ConnectionStatus | null
  onSaved:  () => void
}) {
  const [expanded, setExpanded]  = useState(false)
  const [fields, setFields]      = useState<Record<string, string>>({})
  const [saving, setSaving]      = useState(false)
  const [testing, setTesting]    = useState(false)
  const [fetching, setFetching]  = useState(false)
  const [removing, setRemoving]  = useState(false)
  const [message, setMessage]    = useState<{ text: string; ok: boolean } | null>(null)

  const isConnected = status?.is_active ?? false
  const testOk      = status?.test_status === 'ok'

  function showMsg(text: string, ok: boolean) {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/credentials', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ service: service.id, fields }),
    })
    setSaving(false)
    if (res.ok) {
      showMsg('Credentials saved', true)
      setExpanded(false)
      onSaved()
    } else {
      const d = await res.json() as { error?: string }
      showMsg(d.error ?? 'Save failed', false)
    }
  }

  async function handleTest() {
    setTesting(true)
    const res = await fetch('/api/credentials/test', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ service: service.id }),
    })
    setTesting(false)
    const d = await res.json() as { ok: boolean; message: string }
    showMsg(d.message, d.ok)
    onSaved()
  }

  async function handleFetch() {
    setFetching(true)
    const res = await fetch(`/api/ingest/${service.id}`, { method: 'POST' })
    setFetching(false)
    const d = await res.json() as { inserted?: number; fetched?: number; error?: string }
    if (d.error) {
      showMsg(d.error, false)
    } else {
      showMsg(`Fetched ${d.fetched} events, inserted ${d.inserted}`, true)
    }
  }

  async function handleRemove() {
    setRemoving(true)
    await fetch(`/api/credentials?service=${service.id}`, { method: 'DELETE' })
    setRemoving(false)
    onSaved()
  }

  const allFilled = service.fields.every(f => (fields[f.key] ?? '').trim() !== '')

  return (
    <div className={cn(
      'rounded-xl border transition-colors',
      isConnected
        ? 'border-[var(--obs-teal)]/30 bg-[var(--obs-teal)]/5'
        : 'border-border/40 bg-background/30'
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-foreground">{service.name}</span>
            {service.required && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 border-amber-500/40 text-amber-400">
                Recommended
              </Badge>
            )}
            {service.free && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 border-green-500/30 text-green-400">
                Free account
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{service.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isConnected ? (
            <div className="flex items-center gap-1.5 text-xs">
              {testOk ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--obs-teal)]" />
              ) : status?.test_status === 'failed' ? (
                <XCircle className="w-4 h-4 text-red-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-muted-foreground/50" />
              )}
              <span className={cn('font-mono', testOk ? 'text-[var(--obs-teal)]' : 'text-muted-foreground')}>
                {testOk ? 'Connected' : status?.test_status === 'failed' ? 'Error' : 'Saved'}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Not connected</span>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Feedback message */}
      {message && (
        <div className={cn(
          'mx-4 mb-3 px-3 py-2 rounded-lg text-xs',
          message.ok
            ? 'bg-[var(--obs-teal)]/10 text-[var(--obs-teal)] border border-[var(--obs-teal)]/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        )}>
          {message.text}
        </div>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
          {/* Setup guide */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Setup guide
              </span>
              <a
                href={service.signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[var(--obs-teal)] hover:underline"
              >
                {service.signupLabel}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="space-y-1">
              {service.guide.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="text-[var(--obs-teal)]/60 font-mono shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Credential fields */}
          <div className="space-y-3">
            {service.fields.map(field => (
              <div key={field.key} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{field.label}</Label>
                <Input
                  type={field.type ?? 'text'}
                  placeholder={field.placeholder}
                  value={fields[field.key] ?? ''}
                  onChange={e => setFields(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="h-8 text-sm bg-background/50 border-border/50 focus:border-[var(--obs-teal)]"
                />
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              className="h-8 bg-[var(--obs-teal)] text-background hover:bg-[var(--obs-teal)]/90 text-xs"
              onClick={handleSave}
              disabled={saving || !allFilled}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5 mr-1.5" />}
              {isConnected ? 'Update credentials' : 'Save & connect'}
            </Button>

            {isConnected && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-border/50 text-xs"
                  onClick={handleTest}
                  disabled={testing}
                >
                  {testing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : null}
                  Test connection
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-[var(--obs-teal)]/30 text-[var(--obs-teal)] hover:bg-[var(--obs-teal)]/10 text-xs"
                  onClick={handleFetch}
                  disabled={fetching}
                >
                  {fetching ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                  Fetch now
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs ml-auto"
                  onClick={handleRemove}
                  disabled={removing}
                >
                  {removing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
                  Disconnect
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function IntegrationsClient({ initialStatuses }: IntegrationsClientProps) {
  const [statuses, setStatuses] = useState<ConnectionStatus[]>(initialStatuses)
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    const res = await fetch('/api/credentials')
    const data = await res.json() as { credentials: ConnectionStatus[] }
    setStatuses(data.credentials ?? [])
    setRefreshing(false)
  }, [])

  const connectedCount = statuses.filter(s => s.is_active).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Data Integrations</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Connect your own API accounts to power your intelligence feeds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {connectedCount} / {SERVICES.length} connected
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground"
            onClick={refresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-[var(--obs-teal)]/20 bg-[var(--obs-teal)]/5 p-3 text-xs text-muted-foreground leading-relaxed">
        <span className="text-[var(--obs-teal)] font-medium">Your keys, your data.</span>{' '}
        OBSERVE uses your API accounts to fetch intelligence on your behalf. Credentials are
        encrypted and never shared. All free accounts are sufficient — no paid tiers required.
      </div>

      {/* Service cards */}
      <div className="space-y-3">
        {SERVICES.map(service => (
          <ServiceCard
            key={service.id}
            service={service}
            status={statuses.find(s => s.service === service.id) ?? null}
            onSaved={refresh}
          />
        ))}
      </div>

      {/* Always-on note */}
      <div className="rounded-lg border border-border/30 bg-background/20 p-3 text-xs text-muted-foreground">
        <span className="text-foreground/70 font-medium">Always available (no account needed):</span>{' '}
        GDELT · USGS Earthquakes · NOAA Weather · OpenMeteo · ExchangeRate · CoinGecko public data.
        These power layers automatically with no setup required.
      </div>
    </div>
  )
}
