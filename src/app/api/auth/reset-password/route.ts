import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import logger from '@/lib/server-logger'

export async function POST(request: Request) {
  logger.info('[reset password] received request');
  try {
    const { password } = await request.json()
    if (!password) {
      logger.warn('[reset password] password is required');
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies })

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      logger.error(error, '[reset password] supabase error');
      throw error;
    }

    logger.info('[reset password] password updated successfully');
    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    logger.error(error, '[reset password] failed to update password');
    return NextResponse.json(
      { error: 'Failed to update password. The link may have expired or been used already.' },
      { status: 400 }
    )
  }
} 