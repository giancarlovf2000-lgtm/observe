import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const REFRESH_COOLDOWN_MS = 5 * 60 * 1000 // 5 minutes between ingestion runs
const lastRun: Record<string, number> = {}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = Date.now()
  const sinceLastRun = now - (lastRun['included'] ?? 0)

  if (sinceLastRun < REFRESH_COOLDOWN_MS) {
    const waitSec = Math.ceil((REFRESH_COOLDOWN_MS - sinceLastRun) / 1000)
    return NextResponse.json({ ok: true, skipped: true, retryAfter: waitSec })
  }

  lastRun['included'] = now

  // Trigger the three included cron jobs in parallel via internal fetch
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.observe.center').trim()
  const secret = process.env.CRON_SECRET ?? ''
  const headers = { Authorization: `Bearer ${secret}` }

  const results = await Promise.allSettled([
    fetch(`${base}/api/cron/weather`,  { headers }).then(r => r.json()),
    fetch(`${base}/api/cron/markets`,  { headers }).then(r => r.json()),
    fetch(`${base}/api/cron/flights`,  { headers }).then(r => r.json()),
  ])

  return NextResponse.json({
    ok: true,
    results: results.map(r => r.status === 'fulfilled' ? r.value : { error: r.reason }),
  })
}
