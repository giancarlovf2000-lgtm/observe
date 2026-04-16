import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { IntegrationsClient } from '@/components/settings/IntegrationsClient'

export const metadata: Metadata = { title: 'Integrations — Settings' }

export default async function IntegrationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: credentials } = await supabase
    .from('api_credentials')
    .select('service, is_active, last_tested_at, test_status')
    .eq('user_id', user.id)

  return <IntegrationsClient initialStatuses={credentials ?? []} />
}
