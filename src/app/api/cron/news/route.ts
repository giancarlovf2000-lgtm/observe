import { NextResponse } from 'next/server'
import { GDELTAdapter } from '@/lib/ingestion/adapters/gdelt'
import { NewsAPIAdapter } from '@/lib/ingestion/adapters/newsapi'
import { runIngestionPipeline } from '@/lib/ingestion/pipeline'

export const runtime    = 'nodejs'
export const maxDuration = 60

export async function GET(req: Request) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [gdeltResult, newsapiResult] = await Promise.allSettled([
    runIngestionPipeline(new GDELTAdapter(),   'gdelt'),
    runIngestionPipeline(new NewsAPIAdapter(), 'newsapi'),
  ])

  return NextResponse.json({
    ok:      true,
    gdelt:   gdeltResult.status   === 'fulfilled' ? gdeltResult.value   : { error: String(gdeltResult.reason)   },
    newsapi: newsapiResult.status === 'fulfilled' ? newsapiResult.value : { error: String(newsapiResult.reason) },
  })
}
