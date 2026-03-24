import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { TransportClient } from '@/components/intelligence/TransportClient'

export const metadata: Metadata = { title: 'Transport & Logistics' }

export default async function TransportPage() {
  const supabase = await createClient()

  const [{ data: flights }, { data: vessels }] = await Promise.all([
    supabase
      .from('flight_tracks')
      .select('*')
      .order('track_at', { ascending: false })
      .limit(100),
    supabase
      .from('vessels')
      .select('*')
      .order('track_at', { ascending: false })
      .limit(100),
  ])

  return <TransportClient flights={flights ?? []} vessels={vessels ?? []} />
}
