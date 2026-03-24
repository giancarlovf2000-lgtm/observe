import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BriefingDetailClient } from '@/components/briefings/BriefingDetailClient'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('ai_briefings').select('title').eq('id', id).single()
  return { title: (data as { title?: string } | null)?.title ?? 'Intelligence Briefing' }
}

export default async function BriefingDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: briefing } = await supabase
    .from('ai_briefings')
    .select('*')
    .eq('id', id)
    .single()

  if (!briefing) notFound()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BriefingDetailClient briefing={briefing as any} />
}
