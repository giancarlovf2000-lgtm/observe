import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingShell } from '@/components/onboarding/OnboardingShell'

export const metadata: Metadata = { title: 'Getting Started — OBSERVE' }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier, subscription_status')
    .eq('id', user.id)
    .single()

  const isSubscribed =
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing' ||
    profile?.tier === 'pro' ||
    profile?.tier === 'enterprise'

  // Already subscribed — skip onboarding, go straight to dashboard
  if (isSubscribed) redirect('/dashboard')

  return <OnboardingShell />
}
