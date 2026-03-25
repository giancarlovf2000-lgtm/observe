import { NextResponse } from 'next/server'
import { ACLEDAdapter } from '@/lib/ingestion/adapters/acled'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'

export const runtime    = 'nodejs'
export const maxDuration = 60

export async function GET(req: Request) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runIngestionPipeline(new ACLEDAdapter(), 'acled')
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
