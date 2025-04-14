import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  // Verify cron job secret
  const headersList = headers()
  const cronSecret = headersList.get('x-cron-secret')
  
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Call the daily challenge API to generate a new challenge
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/daily-challenge`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to generate daily challenge')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json({ error: 'Failed to generate daily challenge' }, { status: 500 })
  }
} 