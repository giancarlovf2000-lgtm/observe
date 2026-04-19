import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'
import { USGSAdapter } from '@/lib/ingestion/adapters/usgs'
import { NOAAWeatherAdapter } from '@/lib/ingestion/adapters/noaaweather'
import { GDELTAdapter } from '@/lib/ingestion/adapters/gdelt'
import { CoinCapAdapter } from '@/lib/ingestion/adapters/coincap'
import { ExchangeRateAdapter } from '@/lib/ingestion/adapters/exchangerate'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Platform sources: open/public data only, no user keys required.
  // Excluded: NewsAPI (BYOK — ToS prohibits platform use of free key)
  //           ReliefWeb (non-commercial only per their T&C)
  //           OpenSky (non-commercial/research only — BYOK via Settings)
  const [usgs, noaa, crypto, fx] = await Promise.all([
    runIngestionPipeline(new USGSAdapter(),         'usgs'),
    runIngestionPipeline(new NOAAWeatherAdapter(),  'noaaweather'),
    runIngestionPipeline(new CoinCapAdapter(),      'coincap'),
    runIngestionPipeline(new ExchangeRateAdapter(), 'exchangerate'),
  ].map(p => p.catch(e => ({ error: String(e) }))))

  // GDELT runs after to avoid rate limit conflicts (1 req/5s)
  const gdelt = await runIngestionPipeline(new GDELTAdapter(), 'gdelt').catch(e => ({ error: String(e) }))

  return NextResponse.json({ ok: true, usgs, noaa, gdelt, crypto, fx })
}
