import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { WeatherClient } from '@/components/intelligence/WeatherClient'

export const metadata: Metadata = { title: 'Weather & Disasters' }

export default async function WeatherPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('global_events')
    .select('*, weather_events(*)')
    .eq('type', 'weather')
    .eq('is_active', true)
    .order('occurred_at', { ascending: false })
    .limit(40)

  const { data: disasters } = await supabase
    .from('global_events')
    .select('*')
    .eq('type', 'humanitarian')
    .eq('is_active', true)
    .order('occurred_at', { ascending: false })
    .limit(20)

  return <WeatherClient events={events ?? []} disasters={disasters ?? []} />
}
