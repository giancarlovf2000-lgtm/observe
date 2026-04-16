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

// Routes that require admin role
const ADMIN_ROUTES = ['/admin']

// Routes that are for unauthenticated users only
const AUTH_ROUTES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Redirect authenticated users away from auth pages
  if (user && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (!user && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Admin routes — check role via profile (done at page level for simplicity)
  // Middleware just ensures authenticated, page checks role

  // Inject current pathname so server layouts can read it
  supabaseResponse.headers.set('x-pathname', pathname)

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
