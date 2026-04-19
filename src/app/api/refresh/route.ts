import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'
import { USGSAdapter } from '@/lib/ingestion/adapters/usgs'
import { OpenMeteoAdapter } from '@/lib/ingestion/adapters/openmeteo'
import { NOAAWeatherAdapter } from '@/lib/ingestion/adapters/noaaweather'
import { GDELTAdapter } from '@/lib/ingestion/adapters/gdelt'
import { CoinGeckoAdapter } from '@/lib/ingestion/adapters/coingecko'
import { ExchangeRateAdapter } from '@/lib/ingestion/adapters/exchangerate'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Platform-included sources only (open/public data, no user keys required)
  // NewsAPI is BYOK — not run here to avoid ToS violations
  const [usgs, openmeteo, noaa, crypto, fx] = await Promise.all([
    runIngestionPipeline(new USGSAdapter(),         'usgs'),
    runIngestionPipeline(new OpenMeteoAdapter(),    'openmeteo'),
    runIngestionPipeline(new NOAAWeatherAdapter(),  'noaaweather'),
    runIngestionPipeline(new CoinGeckoAdapter(),    'coingecko'),
    runIngestionPipeline(new ExchangeRateAdapter(), 'exchangerate'),
  ].map(p => p.catch(e => ({ error: String(e) }))))

  // GDELT runs after to avoid rate limit conflicts (1 req/5s)
  const gdelt = await runIngestionPipeline(new GDELTAdapter(), 'gdelt').catch(e => ({ error: String(e) }))

  return NextResponse.json({ ok: true, usgs, openmeteo, noaa, gdelt, crypto, fx })
}
