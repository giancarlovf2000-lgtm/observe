import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('flight_tracks')
    .select('id, lat, lng, callsign, altitude_ft, speed_kts, on_ground')
    .eq('on_ground', false)
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .limit(300)

  if (error) {
    console.error('[api/map/flights] error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
