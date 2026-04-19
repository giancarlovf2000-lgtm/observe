import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { TransportClient } from '@/components/intelligence/TransportClient'

export const metadata: Metadata = { title: 'Transport & Logistics' }

export default async function TransportPage() {
  const supabase = await createClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: flights }, { data: vessels }] = await Promise.all([
    supabase
      .from('flight_tracks')
      .select('*')
      .gte('track_at', sevenDaysAgo)
      .order('track_at', { ascending: false })
      .limit(100),
    supabase
      .from('vessels')
      .select('*')
      .gte('track_at', sevenDaysAgo)
      .order('track_at', { ascending: false })
      .limit(100),
  ])

  return <TransportClient flights={flights ?? []} vessels={vessels ?? []} />
}
