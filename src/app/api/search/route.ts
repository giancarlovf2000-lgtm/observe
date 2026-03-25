import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  const { searchParams } = new URL(req.url)
  const q     = searchParams.get('q')?.trim() ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '8', 10), 20)

  if (q.length < 2) return NextResponse.json([])

  const { data, error } = await supabase
    .from('global_events')
    .select('id, type, title, severity, country_id, region, occurred_at, tags')
    .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
    .eq('is_active', true)
    .order('occurred_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data ?? [])
}
