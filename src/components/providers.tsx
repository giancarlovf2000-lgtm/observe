'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { TooltipProvider } from '@/components/ui/tooltip'

function AuthInitializer() {
  const { setUser, setRole, setLoaded } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)

      if (user) {
        // Fetch role from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile) setRole(profile.role)
      }

      setLoaded(true)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          if (profile) setRole(profile.role)
        } else {
          setRole('visitor')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setRole, setLoaded])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,         // 1 min
            gcTime: 5 * 60 * 1000,        // 5 min
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delay={200}>
        <AuthInitializer />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  )
}
