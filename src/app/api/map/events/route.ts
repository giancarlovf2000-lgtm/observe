import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const types = searchParams.get('types')?.split(',').filter(Boolean) ?? []
  const hours = parseInt(searchParams.get('hours') ?? '168', 10)

  if (types.length === 0) {
    return NextResponse.json([])
  }

  const supabase = await createClient()
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('global_events')
    .select('id, type, title, severity, country_id, lat, lng, occurred_at')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .in('type', types as any)
    .eq('is_active', true)
    .gte('occurred_at', cutoff)
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .order('occurred_at', { ascending: false })
    .limit(500)

  if (error) {
    console.error('[api/map/events] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const filtered = (data ?? []).filter(
    (e) => e.lat !== null && e.lng !== null &&
      typeof e.lat === 'number' && typeof e.lng === 'number'
  )

  return NextResponse.json(filtered)
}
