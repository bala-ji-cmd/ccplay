import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import logger from '@/lib/server-logger'

export async function POST(request: Request) {
    logger.info('[user drawings] received request');
    try {
        const { userId } = await request.json()
        
        if (!userId) {
            logger.warn('[user drawings] user ID is required');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const supabase = createRouteHandlerClient({ cookies: () => cookies() })

        // Fetch user drawings
        logger.info({ userId }, '[user drawings] fetching drawings');
        const { data: drawings, error: drawingsError } = await supabase
            .from('user_images')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(8)

        if (drawingsError) {
            logger.error(drawingsError, '[user drawings] supabase error');
            return NextResponse.json({ error: drawingsError.message }, { status: 500 })
        }

        logger.info({ count: drawings.length }, '[user drawings] successfully fetched drawings');
        return NextResponse.json({ drawings })
    } catch (error) {
        logger.error(error, '[user drawings] error fetching user drawings');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 