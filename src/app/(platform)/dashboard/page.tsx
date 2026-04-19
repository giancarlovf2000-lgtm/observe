import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Fetch recent events — moderate+ severity, last 7 days only
  const { data: rawRecentEvents } = await supabase
    .from('global_events')
    .select('id, type, title, summary, severity, country_id, region, lat, lng, occurred_at, tags')
    .eq('is_active', true)
    .in('severity', ['moderate', 'high', 'critical'])
    .gte('occurred_at', sevenDaysAgo)
    .order('occurred_at', { ascending: false })
    .limit(30)

  // Deduplicate by title (same story from multiple outlets)
  const seenTitles = new Set<string>()
  const recentEvents = (rawRecentEvents ?? []).filter(e => {
    if (seenTitles.has(e.title)) return false
    seenTitles.add(e.title)
    return true
  }).slice(0, 20)

  // Check which gated credentials the user has
  const { data: userCreds } = await supabase
    .from('api_credentials')
    .select('service')
    .eq('user_id', user!.id)
    .eq('is_active', true)

  const hasAcled   = userCreds?.some(c => c.service === 'acled')   ?? false
  const hasNewsApi = userCreds?.some(c => c.service === 'newsapi') ?? false

  // Active conflicts count
  const { count: conflictCount } = await supabase
    .from('conflict_zones')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)

  // Recent AI briefing — only the current user's own briefings
  const { data: latestBriefing } = await supabase
    .from('ai_briefings')
    .select('id, type, title, executive_summary, briefing_date, created_at')
    .eq('is_published', true)
    .eq('generated_by', user!.id)
    .order('briefing_date', { ascending: false })
    .limit(1)
    .single()

  // Weather/disaster events — last 7 days
  const { data: weatherEvents } = await supabase
    .from('global_events')
    .select('id, type, title, summary, severity, country_id, region, lat, lng, occurred_at, tags')
    .eq('type', 'weather')
    .eq('is_active', true)
    .in('severity', ['high', 'critical'])
    .gte('occurred_at', sevenDaysAgo)
    .order('occurred_at', { ascending: false })
    .limit(4)

  return (
    <DashboardShell
      recentEvents={recentEvents ?? []}
      conflictCount={conflictCount ?? 0}
      latestBriefing={latestBriefing ?? null}
      weatherEvents={weatherEvents ?? []}
      hasAcled={hasAcled}
      hasNewsApi={hasNewsApi}
    />
  )
}
