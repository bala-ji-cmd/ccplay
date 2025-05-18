import { NextResponse } from 'next/server'
import { addCaption, getTopCaptions, isResultsComputed } from '@/lib/csv-utils'

async function computeScores(date: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/compute-scores?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': process.env.CRON_SECRET || '',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to compute scores: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Score computation result:', data)
    return data
  } catch (error) {
    console.error('Error computing scores:', error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received request body:", body)
    
    const { user_id, challenge_date, caption } = body

    if (!user_id || !challenge_date || !caption) {
      console.error("Missing required fields:", { user_id, challenge_date, caption })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      addCaption({
        user_id,
        challenge_date,
        caption,
        submission_time: new Date().toISOString(),
      })
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error in addCaption:", error)
      return NextResponse.json(
        { error: 'Failed to save caption' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // // Check if results are computed for the given date
    // if (!isResultsComputed(date)) {
    //   console.log(`Results not computed for date ${date}, computing now...`)
    //   try {
    //     await computeScores(date)
    //   } catch (error) {
    //     console.error('Failed to compute scores:', error)
    //     // Continue with existing scores even if computation fails
    //   }
    // }

    try {
      const captions = getTopCaptions(date, limit)
      console.log(`Fetched ${captions.length} captions for date ${date}`)
      return NextResponse.json(captions)
    } catch (error) {
      console.error("Error in getTopCaptions:", error)
      return NextResponse.json(
        { error: 'Failed to fetch captions' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 