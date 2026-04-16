import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

export const metadata: Metadata = { title: 'Getting Started — OBSERVE' }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <OnboardingShell />
}
