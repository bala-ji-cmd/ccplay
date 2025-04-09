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

        // Fetch user learnings
        const { data: learnings, error: learningsError } = await supabase
            .from('user_learnings')
            .select('id, drawing_name, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5)

        if (learningsError) {
            return NextResponse.json({ error: learningsError.message }, { status: 500 })
        }

        return NextResponse.json({ learnings })
    } catch (error) {
        console.error('Error fetching user learnings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 