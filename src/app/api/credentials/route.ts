/**
 * BYOK credentials CRUD
 * GET  /api/credentials          — list connection statuses (no plaintext keys returned)
 * POST /api/credentials          — save/update credentials for a service
 * DELETE /api/credentials?service=newsapi — remove credentials for a service
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encryptCredentials, decryptCredentials } from '@/lib/credentials'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('api_credentials')
    .select('service, is_active, last_tested_at, test_status, created_at')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ credentials: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { service: string; fields: Record<string, string> }
  const { service, fields } = body

  if (!service || !fields || typeof fields !== 'object') {
    return NextResponse.json({ error: 'service and fields are required' }, { status: 400 })
  }

  // Validate all field values are non-empty strings
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v !== 'string' || !v.trim()) {
      return NextResponse.json({ error: `Field "${k}" must be a non-empty string` }, { status: 400 })
    }
  }

  const encrypted = encryptCredentials(fields)

  const { error } = await supabase
    .from('api_credentials')
    .upsert(
      {
        user_id:        user.id,
        service,
        encrypted_data: encrypted,
        is_active:      true,
        test_status:    null,
        last_tested_at: null,
        updated_at:     new Date().toISOString(),
      },
      { onConflict: 'user_id,service' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = req.nextUrl.searchParams.get('service')
  if (!service) return NextResponse.json({ error: 'service param required' }, { status: 400 })

  const { error } = await supabase
    .from('api_credentials')
    .delete()
    .eq('user_id', user.id)
    .eq('service', service)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

// Export for internal use by the test route
export { decryptCredentials }
