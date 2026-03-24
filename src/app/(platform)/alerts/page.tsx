import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AlertsClient } from '@/components/alerts/AlertsClient'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Alert Rules' }

export default async function AlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: rules }, { data: recentAlerts }] = await Promise.all([
    supabase
      .from('alert_rules')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('alert_events')
      .select('*, alert_rules(name), global_events(title, severity, type)')
      .order('fired_at', { ascending: false })
      .limit(20),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <AlertsClient rules={(rules ?? []) as any} recentAlerts={(recentAlerts ?? []) as any} userId={user.id} />
}
