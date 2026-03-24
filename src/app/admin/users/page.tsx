import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminUsersClient } from '@/components/admin/AdminUsersClient'

export const metadata: Metadata = { title: 'Admin — Users' }

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return <AdminUsersClient users={users ?? []} />
}
