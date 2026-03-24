import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('vessels')
    .select('id, lat, lng, name, vessel_type, flag, speed_kts')
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .limit(200)

  if (error) {
    console.error('[api/map/vessels] error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
