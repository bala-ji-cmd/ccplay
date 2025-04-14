import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { userId } = await request.json()
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const supabase = createRouteHandlerClient({ cookies: () => cookies() })

        // Fetch user stories
        const { data: stories, error: storiesError } = await supabase
            .from('bedtime_stories')
            .select('id, user_id, title, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(8)

        
        if (storiesError) {
            return NextResponse.json({ error: storiesError.message }, { status: 500 })
        }

        return NextResponse.json({ stories })
    } catch (error) {
        console.error('Error fetching user stories:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 