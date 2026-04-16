import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ConflictsClient } from '@/components/intelligence/ConflictsClient'

export const metadata: Metadata = { title: 'Conflicts' }

export default async function ConflictsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cred } = await supabase
    .from('api_credentials')
    .select('is_active')
    .eq('user_id', user!.id)
    .eq('service', 'acled')
    .single()

  const hasCredential = cred?.is_active === true

  const { data: conflicts } = hasCredential
    ? await supabase
        .from('conflict_zones')
        .select(`
          *,
          global_events ( id, title, summary, severity, country_id, region, lat, lng, occurred_at, tags, ai_summary, source_url ),
          conflict_updates ( id, title, body, severity, occurred_at )
        `)
        .eq('active', true)
        .order('last_update', { ascending: false })
    : { data: [] }

  return <ConflictsClient conflicts={conflicts ?? []} hasCredential={hasCredential} />
}
