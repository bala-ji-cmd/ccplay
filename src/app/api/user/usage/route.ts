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
            .gte('usage_date', oneWeekAgo.toISOString())
            .order('usage_date', { ascending: true })

        if (creditUsageError) {
            return NextResponse.json({ error: creditUsageError.message }, { status: 500 })
        }

        // Process usage data by day
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const usageByDay: { [key: string]: number } = {}
        
        // Initialize all days with 0 minutes
        dayNames.forEach(day => {
            usageByDay[day] = 0
        })
        
        // Aggregate usage data by day
        if (creditUsage) {
            creditUsage.forEach(usage => {
                const date = new Date(usage.usage_date)
                const dayIndex = date.getUTCDay()
                const day = dayNames[dayIndex]
                usageByDay[day] += usage.credits_used || 0
            })
        }
        
        // Format data for chart
        const weeklyData = dayNames.map(day => ({
            day,
            minutes: usageByDay[day]
        }))
        
        // Get recent activity (latest 5)
        const recentActivity = creditUsage ? creditUsage.slice(creditUsage.length - 5, creditUsage.length) : []

        return NextResponse.json({ 
            weeklyData,
            recentActivity
        })
    } catch (error) {
        console.error('Error fetching user usage data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 