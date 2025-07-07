import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import logger from '@/lib/server-logger'

export async function POST(request: Request) {
  logger.info('[signup] received request');
  try {
    const { email, password, metadata } = await request.json()
    if (!email || !password) {
      logger.warn('[signup] email and password are required');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) {
      logger.error(error, '[signup] supabase error');
      throw error;
    }

    logger.info({ user: data.user }, '[signup] user signed up successfully');
    return NextResponse.json({ data })
  } catch (error: any) {
    logger.error(error, '[signup] failed to sign up');
    return NextResponse.json(
      { error: error.message || 'Authentication failed. Please try again.' },
      { status: 400 }
    )
  }
} 