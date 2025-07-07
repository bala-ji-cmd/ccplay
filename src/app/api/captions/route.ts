import { NextResponse } from 'next/server'
import { addCaption, getTopCaptions, isResultsComputed } from '@/lib/csv-utils'
import logger from '@/lib/server-logger';

async function computeScores(date: string) {
  logger.info({ date }, '[captions] computing scores');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/compute-scores?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': process.env.CRON_SECRET || '',
      },
    })

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, statusText: response.statusText, body: errorText }, '[captions] failed to compute scores');
      throw new Error(`Failed to compute scores: ${response.statusText}`);
    }

    const data = await response.json()
    logger.info({ data }, '[captions] score computation result');
    return data
  } catch (error) {
    logger.error(error, '[captions] error computing scores');
    throw error
  }
}

export async function POST(request: Request) {
  logger.info('[captions] received POST request');
  try {
    const body = await request.json()
    logger.info({ body }, '[captions] request body');
    
    const { user_id, challenge_date, caption } = body

    if (!user_id || !challenge_date || !caption) {
      logger.warn("[captions] missing required fields:", { user_id, challenge_date, caption })
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
      logger.info('[captions] caption added successfully');
      return NextResponse.json({ success: true })
    } catch (error) {
      logger.error(error, "[captions] error in addCaption");
      return NextResponse.json(
        { error: 'Failed to save caption' },
        { status: 500 }
      )
    }
  } catch (error) {
    logger.error(error, '[captions] error processing POST request');
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  logger.info('[captions] received GET request');
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20

    if (!date) {
      logger.warn('[captions] date parameter is required');
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // // Check if results are computed for the given date
    // if (!isResultsComputed(date)) {
    //   logger.info(`Results not computed for date ${date}, computing now...`)
    //   try {
    //     await computeScores(date)
    //   } catch (error) {
    //     logger.error(error, 'Failed to compute scores')
    //     // Continue with existing scores even if computation fails
    //   }
    // }

    try {
      const captions = getTopCaptions(date, limit)
      logger.info({ count: captions.length, date }, `[captions] fetched captions`);
      return NextResponse.json(captions)
    } catch (error) {
      logger.error(error, "[captions] error in getTopCaptions");
      return NextResponse.json(
        { error: 'Failed to fetch captions' },
        { status: 500 }
      )
    }
  } catch (error) {
    logger.error(error, '[captions] error processing GET request');
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 