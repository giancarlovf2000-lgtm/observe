import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { SideNav } from '@/components/layout/SideNav'
import { MobileNav } from '@/components/layout/MobileNav'
import { CommandSearch } from '@/components/map/controls/CommandSearch'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Routes that don't require an active subscription
const PAYWALL_EXEMPT = ['/onboarding', '/settings']

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

  // Read pathname injected by middleware
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isExempt = PAYWALL_EXEMPT.some(p => pathname.startsWith(p))

  if (!isSubscribed && !isExempt) {
    redirect('/onboarding')
  }

  // Onboarding renders full-screen — no shell
  if (pathname.startsWith('/onboarding')) {
    return <LanguageProvider>{children}</LanguageProvider>
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
