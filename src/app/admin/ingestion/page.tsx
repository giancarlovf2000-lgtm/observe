import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminIngestionClient } from '@/components/admin/AdminIngestionClient'

export const metadata: Metadata = { title: 'Admin — Ingestion Logs' }

export default async function AdminIngestionPage() {
  const supabase = await createClient()

  const { data: runs } = await supabase
    .from('ingestion_runs')
    .select('*, data_sources(name, slug)')
    .order('started_at', { ascending: false })
    .limit(50)

  return <AdminIngestionClient runs={runs ?? []} />
}
