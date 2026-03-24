import { NextResponse } from 'next/server'
import { USGSAdapter } from '@/lib/ingestion/adapters/usgs'
import { OpenMeteoAdapter } from '@/lib/ingestion/adapters/openmeteo'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: Request) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [usgsResult, reliefResult] = await Promise.allSettled([
    runIngestionPipeline(new USGSAdapter(), 'usgs'),
    runIngestionPipeline(new OpenMeteoAdapter(), 'reliefweb'),
  ])

  return NextResponse.json({
    ok: true,
    usgs: usgsResult.status === 'fulfilled' ? usgsResult.value : { error: String(usgsResult.reason) },
    reliefweb: reliefResult.status === 'fulfilled' ? reliefResult.value : { error: String(reliefResult.reason) },
  })
}
