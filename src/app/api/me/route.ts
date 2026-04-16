import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier, role, subscription_status, full_name')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    id:    user.id,
    email: user.email,
    tier:               profile?.tier ?? 'free',
    role:               profile?.role ?? 'user',
    subscription_status: profile?.subscription_status ?? 'inactive',
    full_name:          profile?.full_name ?? null,
  })
}
