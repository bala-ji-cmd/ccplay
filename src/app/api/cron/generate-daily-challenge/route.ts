import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import logger from '@/lib/server-logger'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  logger.info('[cron generate-daily-challenge] received request');
  // Verify cron job secret
  const headersList = headers()
  const cronSecret = headersList.get('x-cron-secret')
  
  if (cronSecret !== process.env.CRON_SECRET) {
    logger.warn('[cron generate-daily-challenge] unauthorized access');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Call the daily challenge API to generate a new challenge
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/daily-challenge`;
    logger.info(`[cron generate-daily-challenge] calling daily challenge API at ${apiUrl}`);
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, statusText: response.statusText, body: errorText }, '[cron generate-daily-challenge] failed to generate daily challenge');
      throw new Error('Failed to generate daily challenge');
    }

    const data = await response.json()
    logger.info('[cron generate-daily-challenge] successfully generated daily challenge');
    return NextResponse.json(data)
  } catch (error) {
    logger.error(error, '[cron generate-daily-challenge] an unexpected error occurred');
    return NextResponse.json({ error: 'Failed to generate daily challenge' }, { status: 500 })
  }
} 