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

        // Calculate date range for weekly data
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        // Fetch credit usage data
        const { data: creditUsage, error: creditUsageError } = await supabase
            .from('credit_usage')
            .select('*')
            .eq('user_id', userId)
            // .gte('usage_date', oneWeekAgo.toISOString())
            .order('usage_date', { ascending: false })

        if (creditUsageError) {
            return NextResponse.json({ error: creditUsageError.message }, { status: 500 })
        }


        // Group usage by date
        const usageByDate = creditUsage.reduce((acc: { [key: string]: number }, log) => {
            const date = new Date(log.usage_date).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + log.credits_used;
            return acc;
        }, {});

        // Get last 7 days of data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();
        
        // Format data for chart
        const weeklyData = last7Days.map(date => ({
            date: date.split('-').slice(2,3).concat('2025-04-07'.split('-')[1]).join('/'),
            minutes: usageByDate[date] || 0
        }));
        
        
        // Get recent activity (latest 5)
        const recentActivity = creditUsage ? creditUsage.slice(0, 5) : []

        return NextResponse.json({ 
            weeklyData,
            recentActivity
        })
    } catch (error) {
        console.error('Error fetching user usage data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 