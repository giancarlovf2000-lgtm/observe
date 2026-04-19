import { NextResponse } from 'next/server'
import { CoinCapAdapter } from '@/lib/ingestion/adapters/coincap'
import { ExchangeRateAdapter } from '@/lib/ingestion/adapters/exchangerate'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: Request) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [crypto, fx] = await Promise.allSettled([
      runIngestionPipeline(new CoinCapAdapter(), 'coincap'),
      runIngestionPipeline(new ExchangeRateAdapter(), 'exchangerate'),
    ])

    return NextResponse.json({
      ok: true,
      crypto: crypto.status === 'fulfilled' ? crypto.value : { error: String((crypto as PromiseRejectedResult).reason) },
      fx:     fx.status === 'fulfilled'     ? fx.value     : { error: String((fx as PromiseRejectedResult).reason) },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
