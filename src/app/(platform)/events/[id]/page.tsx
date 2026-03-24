import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { EventDetailClient } from '@/components/intelligence/EventDetailClient'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('global_events').select('title').eq('id', id).single()
  return { title: (data as { title?: string } | null)?.title ?? 'Event Detail' }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('global_events')
    .select('*, data_sources(name, base_url)')
    .eq('id', id)
    .single()

  if (!event) notFound()

  const countryId = (event as { country_id?: string | null }).country_id ?? ''
  const { data: related } = await supabase
    .from('global_events')
    .select('id, title, severity, type, occurred_at')
    .eq('country_id', countryId)
    .eq('is_active', true)
    .neq('id', id)
    .order('occurred_at', { ascending: false })
    .limit(5)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <EventDetailClient event={event as any} relatedEvents={related ?? []} />
}
