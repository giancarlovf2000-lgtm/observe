import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CountryDetailClient } from '@/components/intelligence/CountryDetailClient'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `${id.toUpperCase()} — Country Intelligence` }
}

export default async function CountryDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: country }, { data: events }] = await Promise.all([
    supabase.from('countries').select('*').eq('id', id.toLowerCase()).single(),
    supabase
      .from('global_events')
      .select('id, type, title, summary, severity, occurred_at, tags, lat, lng')
      .eq('country_id', id.toLowerCase())
      .eq('is_active', true)
      .order('occurred_at', { ascending: false })
      .limit(20),
  ])

  // Fetch conflict zones linked to this country's events
  const conflictEventIds = (events ?? [])
    .filter(e => e.type === 'conflict')
    .map(e => e.id)

  const { data: conflicts } = conflictEventIds.length > 0
    ? await supabase
        .from('conflict_zones')
        .select('id, name, conflict_type, parties, active, intensity, start_date, global_events!event_id(title, severity, occurred_at, summary)')
        .in('event_id', conflictEventIds)
        .eq('active', true)
        .limit(5)
    : { data: [] }

  if (!country) notFound()

  return (
    <CountryDetailClient
      country={country}
      events={events ?? []}
      conflicts={conflicts ?? []}
    />
  )
}
