import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { WeatherClient } from '@/components/intelligence/WeatherClient'

export const metadata: Metadata = { title: 'Weather & Disasters' }

export default async function WeatherPage() {
  const supabase = await createClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: events }, { data: disasters }] = await Promise.all([
    supabase
      .from('global_events')
      .select('*, weather_events(*)')
      .eq('type', 'weather')
      .eq('is_active', true)
      .gte('occurred_at', sevenDaysAgo)
      .order('occurred_at', { ascending: false })
      .limit(40),
    supabase
      .from('global_events')
      .select('*')
      .eq('type', 'humanitarian')
      .eq('is_active', true)
      .gte('occurred_at', sevenDaysAgo)
      .order('occurred_at', { ascending: false })
      .limit(20),
  ])

  return <WeatherClient events={events ?? []} disasters={disasters ?? []} />
}
