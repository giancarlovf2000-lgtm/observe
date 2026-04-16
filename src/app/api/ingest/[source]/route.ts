/**
 * POST /api/ingest/[source]
 *
 * Two modes:
 *  1. BYOK mode — user has credentials stored for this source.
 *     Uses their keys; results tagged with user_id (private to them).
 *  2. Admin mode — no stored user credentials; requires admin role.
 *     Uses server env vars; results stored as public (user_id = null).
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decryptCredentials } from '@/lib/credentials'
import { GDELTAdapter }        from '@/lib/ingestion/adapters/gdelt'
import { USGSAdapter }         from '@/lib/ingestion/adapters/usgs'
import { OpenMeteoAdapter }    from '@/lib/ingestion/adapters/openmeteo'
import { CoinGeckoAdapter }    from '@/lib/ingestion/adapters/coingecko'
import { OpenSkyAdapter }      from '@/lib/ingestion/adapters/opensky'
import { ExchangeRateAdapter } from '@/lib/ingestion/adapters/exchangerate'
import { ACLEDAdapter }        from '@/lib/ingestion/adapters/acled'
import { NewsAPIAdapter }      from '@/lib/ingestion/adapters/newsapi'
import { NOAAWeatherAdapter }  from '@/lib/ingestion/adapters/noaaweather'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'
import type { BaseAdapter, AdapterCredentials } from '@/lib/ingestion/adapters/base'

// Sources that support BYOK (user provides own credentials)
const BYOK_SOURCES = new Set(['newsapi', 'acled', 'opensky'])

function buildAdapter(source: string, credentials?: AdapterCredentials): BaseAdapter | null {
  switch (source) {
    case 'gdelt':        return new GDELTAdapter(credentials)
    case 'usgs':         return new USGSAdapter(credentials)
    case 'reliefweb':    return new OpenMeteoAdapter(credentials)
    case 'coingecko':    return new CoinGeckoAdapter(credentials)
    case 'opensky':      return new OpenSkyAdapter(credentials)
    case 'exchangerate': return new ExchangeRateAdapter(credentials)
    case 'acled':        return new ACLEDAdapter(credentials)
    case 'newsapi':      return new NewsAPIAdapter(credentials)
    case 'noaaweather':  return new NOAAWeatherAdapter(credentials)
    default:             return null
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ source: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { source } = await params

  const adapter = buildAdapter(source)
  if (!adapter) return NextResponse.json({ error: `Unknown source: ${source}` }, { status: 400 })

  // Check if the user has their own credentials stored (BYOK mode)
  let byokCredentials: AdapterCredentials | null = null
  if (BYOK_SOURCES.has(source)) {
    const { data: row } = await supabase
      .from('api_credentials')
      .select('encrypted_data, is_active')
      .eq('user_id', user.id)
      .eq('service', source)
      .single()

    if (row?.is_active) {
      try {
        byokCredentials = decryptCredentials(row.encrypted_data)
      } catch {
        return NextResponse.json({ error: 'Failed to decrypt credentials' }, { status: 500 })
      }
    }
  }

  if (byokCredentials) {
    // BYOK mode: use user's own keys, tag results with their user_id
    const userAdapter = buildAdapter(source, byokCredentials)!
    const result = await runIngestionPipeline(userAdapter, source, user.id)
    return NextResponse.json({ ok: true, mode: 'byok', ...result })
  }

  // Admin mode: require admin role for server-level keys
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as { role?: string } | null)?.role !== 'admin') {
    return NextResponse.json(
      { error: `Connect your ${source} account in Settings → Integrations to fetch data` },
      { status: 403 }
    )
  }

  const result = await runIngestionPipeline(adapter, source)
  return NextResponse.json({ ok: true, mode: 'admin', ...result })
}
