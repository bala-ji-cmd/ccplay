import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import logger from '@/lib/server-logger'

export async function POST(request: Request) {
    logger.info('[user learnings] received request');
    try {
        const { userId } = await request.json()
        
        if (!userId) {
            logger.warn('[user learnings] user ID is required');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const supabase = createRouteHandlerClient({ cookies: () => cookies() })

        // Fetch user learnings
        logger.info({ userId }, '[user learnings] fetching learnings');
        const { data: learnings, error: learningsError } = await supabase
            .from('user_learnings')
            .select('id, drawing_name, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5)

        if (learningsError) {
            logger.error(learningsError, '[user learnings] supabase error');
            return NextResponse.json({ error: learningsError.message }, { status: 500 })
        }

        logger.info({ count: learnings.length }, '[user learnings] successfully fetched learnings');
        return NextResponse.json({ learnings })
    } catch (error) {
        logger.error(error, '[user learnings] error fetching user learnings');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 