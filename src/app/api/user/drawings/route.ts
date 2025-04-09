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

        // Fetch user drawings
        const { data: drawings, error: drawingsError } = await supabase
            .from('user_images')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(8)

        if (drawingsError) {
            return NextResponse.json({ error: drawingsError.message }, { status: 500 })
        }

        return NextResponse.json({ drawings })
    } catch (error) {
        console.error('Error fetching user drawings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 