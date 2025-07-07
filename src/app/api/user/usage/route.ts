import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import logger from '@/lib/server-logger'

export async function POST(request: Request) {
    logger.info('[user usage] received request');
    try {
        const { userId } = await request.json()
        
        if (!userId) {
            logger.warn('[user usage] user ID is required');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const supabase = createRouteHandlerClient({ cookies: () => cookies() })

        // Calculate date range for weekly data
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        // Fetch credit usage data
        logger.info({ userId }, '[user usage] fetching credit usage');
        const { data: creditUsage, error: creditUsageError } = await supabase
            .from('credit_usage')
            .select('*')
            .eq('user_id', userId)
            // .gte('usage_date', oneWeekAgo.toISOString())
            .order('usage_date', { ascending: false })

        if (creditUsageError) {
            logger.error(creditUsageError, '[user usage] supabase error');
            return NextResponse.json({ error: creditUsageError.message }, { status: 500 })
        }
        logger.info({ count: creditUsage.length }, '[user usage] successfully fetched credit usage');


        // Group usage by date
        const usageByDate = creditUsage.reduce((acc: { [key: string]: number }, log) => {
            const date = new Date(log.usage_date).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + log.credits_used;
            return acc;
        }, {});
        logger.info('[user usage] grouped usage by date');

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
        logger.info('[user usage] formatted weekly data');
        
        
        // Get recent activity (latest 5)
        const recentActivity = creditUsage ? creditUsage.slice(0, 5) : []
        logger.info({ count: recentActivity.length }, '[user usage] extracted recent activity');

        return NextResponse.json({ 
            weeklyData,
            recentActivity
        })
    } catch (error) {
        logger.error(error, '[user usage] error fetching user usage data');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 