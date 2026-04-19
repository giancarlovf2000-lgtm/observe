import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'
import { USGSAdapter } from '@/lib/ingestion/adapters/usgs'
import { OpenMeteoAdapter } from '@/lib/ingestion/adapters/openmeteo'
import { NOAAWeatherAdapter } from '@/lib/ingestion/adapters/noaaweather'
import { GDELTAdapter } from '@/lib/ingestion/adapters/gdelt'
import { NewsAPIAdapter } from '@/lib/ingestion/adapters/newsapi'
import { CoinGeckoAdapter } from '@/lib/ingestion/adapters/coingecko'
import { ExchangeRateAdapter } from '@/lib/ingestion/adapters/exchangerate'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Run non-GDELT sources in parallel; GDELT runs sequentially internally due to rate limits
  const [usgs, openmeteo, noaa, newsapi, crypto, fx] = await Promise.all([
    runIngestionPipeline(new USGSAdapter(),         'usgs'),
    runIngestionPipeline(new OpenMeteoAdapter(),    'openmeteo'),
    runIngestionPipeline(new NOAAWeatherAdapter(),  'noaaweather'),
    runIngestionPipeline(new NewsAPIAdapter(),      'newsapi'),
    runIngestionPipeline(new CoinGeckoAdapter(),    'coingecko'),
    runIngestionPipeline(new ExchangeRateAdapter(), 'exchangerate'),
  ].map(p => p.catch(e => ({ error: String(e) }))))

  // GDELT runs after to avoid rate limit conflicts with other fetches
  const gdelt = await runIngestionPipeline(new GDELTAdapter(), 'gdelt').catch(e => ({ error: String(e) }))

  return NextResponse.json({ ok: true, usgs, openmeteo, noaa, newsapi, gdelt, crypto, fx })
}
