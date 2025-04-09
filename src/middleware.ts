import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Allow access to auth callback routes
    if (req.nextUrl.pathname.startsWith('/auth/callback') || 
        req.nextUrl.pathname.startsWith('/api/auth/callback')) {
      return res
    }

    // If no session and trying to access protected routes, redirect to login
    if (!session && (
      req.nextUrl.pathname.startsWith('/profile') || 
      req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/api/payments')
    )) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If has session and trying to access auth pages, redirect to home
    if (session && (
      req.nextUrl.pathname.startsWith('/auth/login') || 
      req.nextUrl.pathname.startsWith('/auth/signup')
    )) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: [
    '/app/:path*',
    '/auth/callback',
    '/api/auth/callback',
    '/api/draw/generate',
    '/api/learn/generate',
    '/api/user/drawings',
    '/api/user/learnings',
    '/api/user/usage'
  ]
} 