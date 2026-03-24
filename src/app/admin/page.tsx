import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminOverviewClient } from '@/components/admin/AdminOverviewClient'

export const metadata: Metadata = { title: 'Admin — Overview' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: eventCount },
    { count: sourceCount },
    { data: recentRuns },
    { data: recentEvents },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('global_events').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('data_sources').select('*', { count: 'exact', head: true }),
    supabase
      .from('ingestion_runs')
      .select('*, data_sources(name)')
      .order('started_at', { ascending: false })
      .limit(5),
    supabase
      .from('global_events')
      .select('id, title, type, severity, occurred_at')
      .order('ingested_at', { ascending: false })
      .limit(10),
  ])

  return (
    <AdminOverviewClient
      stats={{
        users: userCount ?? 0,
        events: eventCount ?? 0,
        sources: sourceCount ?? 0,
      }}
      recentRuns={recentRuns ?? []}
      recentEvents={recentEvents ?? []}
    />
  )
}
