import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GDELTAdapter } from '@/lib/ingestion/adapters/gdelt'
import { USGSAdapter } from '@/lib/ingestion/adapters/usgs'
import { OpenMeteoAdapter } from '@/lib/ingestion/adapters/openmeteo'
import { CoinGeckoAdapter } from '@/lib/ingestion/adapters/coingecko'
import { OpenSkyAdapter } from '@/lib/ingestion/adapters/opensky'
import { ExchangeRateAdapter } from '@/lib/ingestion/adapters/exchangerate'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'
import type { BaseAdapter } from '@/lib/ingestion/adapters/base'

const ADAPTERS: Record<string, BaseAdapter> = {
  gdelt:        new GDELTAdapter(),
  usgs:         new USGSAdapter(),
  reliefweb:    new OpenMeteoAdapter(),
  coingecko:    new CoinGeckoAdapter(),
  opensky:      new OpenSkyAdapter(),
  exchangerate: new ExchangeRateAdapter(),
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ source: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as { role?: string } | null)?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { source } = await params
  const adapter = ADAPTERS[source]
  if (!adapter) return NextResponse.json({ error: `Unknown source: ${source}` }, { status: 400 })

  const result = await runIngestionPipeline(adapter, source)
  return NextResponse.json({ ok: true, ...result })
}
