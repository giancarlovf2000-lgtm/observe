import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { SideNav } from '@/components/layout/SideNav'
import { MobileNav } from '@/components/layout/MobileNav'
import { CommandSearch } from '@/components/map/controls/CommandSearch'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  if (!isSubscribed) {
    redirect('/onboarding')
  }

  return (
    <LanguageProvider>
      <div className="h-screen flex overflow-hidden bg-background">
        <SideNav />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            {children}
          </main>
        </div>
        <CommandSearch />
        <MobileNav />
      </div>
    </LanguageProvider>
  )
}
