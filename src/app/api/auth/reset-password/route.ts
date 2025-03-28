import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { error } = await supabase.auth.updateUser({ password })

    if (error) throw error

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 400 }
    )
  }
} 