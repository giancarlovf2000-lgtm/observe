/**
 * POST /api/credentials/test
 * Tests a saved credential by making a real API call.
 * Updates test_status + last_tested_at in the database.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { decryptCredentials } from '@/lib/credentials'

type TestResult = { ok: boolean; message: string }

async function testNewsAPI(fields: Record<string, string>): Promise<TestResult> {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${fields.api_key}`,
    { signal: AbortSignal.timeout(8000) }
  )
  const data = await res.json() as { status: string; message?: string }
  if (data.status === 'ok') return { ok: true, message: 'Connected successfully' }
  return { ok: false, message: data.message ?? 'Invalid API key' }
}

async function testACLED(fields: Record<string, string>): Promise<TestResult> {
  const res = await fetch('https://acleddata.com/user/login?_format=json', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body:    JSON.stringify({ name: fields.email, pass: fields.password }),
    signal:  AbortSignal.timeout(8000),
  })
  if (res.ok) return { ok: true, message: 'Credentials verified' }
  return { ok: false, message: `Login failed (${res.status})` }
}

async function testOpenSky(fields: Record<string, string>): Promise<TestResult> {
  const auth = Buffer.from(`${fields.username}:${fields.password}`).toString('base64')
  const res = await fetch(
    'https://opensky-network.org/api/states/all?lamin=50&lomin=0&lamax=51&lomax=1',
    {
      headers: { Authorization: `Basic ${auth}` },
      signal:  AbortSignal.timeout(8000),
    }
  )
  if (res.ok) return { ok: true, message: 'Connected successfully' }
  if (res.status === 401) return { ok: false, message: 'Invalid username or password' }
  return { ok: false, message: `HTTP ${res.status}` }
}

const TESTERS: Record<string, (f: Record<string, string>) => Promise<TestResult>> = {
  newsapi: testNewsAPI,
  acled:   testACLED,
  opensky: testOpenSky,
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { service } = await req.json() as { service: string }
  if (!service) return NextResponse.json({ error: 'service required' }, { status: 400 })

  // Fetch encrypted credentials
  const { data: row } = await supabase
    .from('api_credentials')
    .select('encrypted_data')
    .eq('user_id', user.id)
    .eq('service', service)
    .single()

  if (!row) return NextResponse.json({ error: 'No credentials saved for this service' }, { status: 404 })

  let fields: Record<string, string>
  try {
    fields = decryptCredentials(row.encrypted_data)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt credentials' }, { status: 500 })
  }

  const tester = TESTERS[service]
  let result: TestResult

  if (!tester) {
    // Services without a test (CoinGecko, OpenWeather) — just mark as ok
    result = { ok: true, message: 'Credentials saved (no live test available)' }
  } else {
    try {
      result = await tester(fields)
    } catch (err) {
      result = { ok: false, message: err instanceof Error ? err.message : 'Connection failed' }
    }
  }

  // Persist test result using admin client (bypasses RLS for update)
  const admin = createAdminClient()
  await admin
    .from('api_credentials')
    .update({
      test_status:    result.ok ? 'ok' : 'failed',
      last_tested_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('service', service)

  return NextResponse.json(result)
}
