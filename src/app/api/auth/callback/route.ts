import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import logger from '@/lib/server-logger'

export async function GET(request: Request) {
  logger.info('[auth callback] received request');
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/app'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      await supabase.auth.exchangeCodeForSession(code)
      logger.info('[auth callback] successfully exchanged code for session, redirecting');
      return NextResponse.redirect(new URL(redirectTo, request.url))
    } catch (error) {
      logger.error(error, '[auth callback] error exchanging code for session');
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('error', 'Authentication failed. Please try again.')
      return NextResponse.redirect(loginUrl)
    }
  }

  // If no code, redirect to login
  logger.warn('[auth callback] no code provided, redirecting to login');
  return NextResponse.redirect(new URL('/auth/login', request.url))
} 