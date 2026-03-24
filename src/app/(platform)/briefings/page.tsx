import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BriefingsClient } from '@/components/briefings/BriefingsClient'

export const metadata: Metadata = { title: 'Intelligence Briefings' }

export default async function BriefingsPage() {
  const supabase = await createClient()

  const { data: briefings } = await supabase
    .from('ai_briefings')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return <BriefingsClient savedBriefings={briefings ?? []} />
}
