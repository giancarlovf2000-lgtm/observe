import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BriefingsClient } from '@/components/briefings/BriefingsClient'

export const metadata: Metadata = { title: 'Intelligence Briefings' }

export default async function BriefingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: briefings }, { data: cred }, { data: profile }] = await Promise.all([
    supabase
      .from('ai_briefings')
      .select('*')
      .eq('is_published', true)
      .eq('generated_by', user!.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('api_credentials')
      .select('is_active')
      .eq('user_id', user!.id)
      .eq('service', 'perplexity')
      .single(),
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single(),
  ])

  const hasCredential = cred?.is_active === true || profile?.role === 'admin'

  return <BriefingsClient savedBriefings={briefings ?? []} hasCredential={hasCredential} />
}
