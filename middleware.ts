import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/map',
  '/briefings',
  '/watchlists',
  '/alerts',
  '/news',
  '/conflicts',
  '/markets',
  '/weather',
  '/transport',
  '/countries',
  '/events',
  '/workspaces',
  '/settings',
  '/onboarding',
  '/admin',
]

// Routes that are for unauthenticated users only
const AUTH_ROUTES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Authenticated user hitting /login or /signup — route them appropriately
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    // Check subscription so we don't bounce them through /dashboard → /onboarding
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

    const dest = isSubscribed ? '/dashboard' : '/onboarding'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (!user && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
