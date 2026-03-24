import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { WorkspacesClient } from '@/components/workspaces/WorkspacesClient'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Workspaces' }

export default async function WorkspacesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return <WorkspacesClient workspaces={workspaces ?? []} userId={user.id} />
}
