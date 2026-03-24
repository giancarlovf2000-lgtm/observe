import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminSourcesClient } from '@/components/admin/AdminSourcesClient'

export const metadata: Metadata = { title: 'Admin — Data Sources' }

export default async function AdminSourcesPage() {
  const supabase = await createClient()

  const { data: sources } = await supabase
    .from('data_sources')
    .select('*, ingestion_runs(id, status, started_at, records_inserted)')
    .order('name', { ascending: true })

  return <AdminSourcesClient sources={sources ?? []} />
}
