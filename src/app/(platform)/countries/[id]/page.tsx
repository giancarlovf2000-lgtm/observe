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

  const [{ data: country }, { data: events }, { data: conflicts }] = await Promise.all([
    supabase.from('countries').select('*').eq('id', id.toLowerCase()).single(),
    supabase
      .from('global_events')
      .select('*')
      .eq('country_id', id.toLowerCase())
      .eq('is_active', true)
      .order('occurred_at', { ascending: false })
      .limit(20),
    supabase
      .from('conflict_zones')
      .select('*, global_events!event_id(title, severity, occurred_at, summary)')
      .or(`global_events.country_id.eq.${id.toLowerCase()}`)
      .eq('active', true)
      .limit(5),
  ])

  if (!country) notFound()

  return (
    <CountryDetailClient
      country={country}
      events={events ?? []}
      conflicts={conflicts ?? []}
    />
  )
}
