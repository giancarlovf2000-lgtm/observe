import { NextResponse } from 'next/server'
import { OpenSkyAdapter } from '@/lib/ingestion/adapters/opensky'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: Request) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runIngestionPipeline(new OpenSkyAdapter(), 'opensky')
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
