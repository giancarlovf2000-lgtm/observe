import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch recent high-severity events (more items for the ticker + feed)
  const { data: recentEvents } = await supabase
    .from('global_events')
    .select('id, type, title, summary, severity, country_id, region, lat, lng, occurred_at, tags')
    .eq('is_active', true)
    .in('severity', ['high', 'critical'])
    .order('occurred_at', { ascending: false })
    .limit(20)

  // Active conflicts count
  const { count: conflictCount } = await supabase
    .from('conflict_zones')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)

  // Recent AI briefing
  const { data: latestBriefing } = await supabase
    .from('ai_briefings')
    .select('id, type, title, executive_summary, briefing_date, created_at')
    .eq('is_published', true)
    .eq('type', 'daily')
    .order('briefing_date', { ascending: false })
    .limit(1)
    .single()

  // Weather/disaster events
  const { data: weatherEvents } = await supabase
    .from('global_events')
    .select('id, type, title, summary, severity, country_id, region, lat, lng, occurred_at, tags')
    .eq('type', 'weather')
    .eq('is_active', true)
    .in('severity', ['high', 'critical'])
    .order('occurred_at', { ascending: false })
    .limit(4)

  return (
    <DashboardClient
      recentEvents={recentEvents ?? []}
      conflictCount={conflictCount ?? 0}
      latestBriefing={latestBriefing ?? null}
      weatherEvents={weatherEvents ?? []}
    />
  )
}
