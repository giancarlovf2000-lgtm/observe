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

  const results = await Promise.allSettled([
    runIngestionPipeline(new USGSAdapter(),         'usgs'),
    runIngestionPipeline(new OpenMeteoAdapter(),    'openmeteo'),
    runIngestionPipeline(new NOAAWeatherAdapter(),  'noaaweather'),
    runIngestionPipeline(new GDELTAdapter(),        'gdelt'),
    runIngestionPipeline(new CoinGeckoAdapter(),    'coingecko'),
    runIngestionPipeline(new ExchangeRateAdapter(), 'exchangerate'),
  ])

  const [usgs, openmeteo, noaa, gdelt, crypto, fx] = results.map(r =>
    r.status === 'fulfilled' ? r.value : { error: String(r.reason) }
  )

  return NextResponse.json({ ok: true, usgs, openmeteo, noaa, gdelt, crypto, fx })
}
