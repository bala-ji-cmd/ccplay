import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import logger from '@/lib/server-logger'

export async function POST(request: Request) {
    logger.info('[user stories] received request');
    try {
        const { userId } = await request.json()
        
        if (!userId) {
            logger.warn('[user stories] user ID is required');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const supabase = createRouteHandlerClient({ cookies: () => cookies() })

        // Fetch user stories
        logger.info({ userId }, '[user stories] fetching stories');
        const { data: stories, error: storiesError } = await supabase
            .from('bedtime_stories')
            .select('id, user_id, title, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(8)

        
        if (storiesError) {
            logger.error(storiesError, '[user stories] supabase error');
            return NextResponse.json({ error: storiesError.message }, { status: 500 })
        }

        logger.info({ count: stories.length }, '[user stories] successfully fetched stories');
        return NextResponse.json({ stories })
    } catch (error) {
        logger.error(error, '[user stories] error fetching user stories');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 