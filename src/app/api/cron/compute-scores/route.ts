import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { readCaptions, updateCaptionScores, isResultsComputed, markResultsComputed } from '@/lib/csv-utils'
import fs from 'fs'
import path from 'path'
import { getApiKey, handleApiError } from '@/lib/ai'
import logger from '@/lib/server-logger'
import { supabase } from '@/lib/supabase'


async function getImageAsBase64(imagePath: string): Promise<string> {
  const imageBuffer = fs.readFileSync(imagePath)
  return imageBuffer.toString('base64')
}

// Helper function to parse filename and get date and deadline
const parseFileName = (fileName: string): { date: string; deadline: string } | null => {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\.png$/)
  if (!match) return null
  return { date: match[1], deadline: match[2] }
}


export async function GET(request: Request) {
  logger.info('[cron compute-scores] received request');
  // Verify cron job secret
  const headersList = headers()
  const cronSecret = headersList.get('x-cron-secret')
  
  if (cronSecret !== process.env.CRON_SECRET) {
    logger.warn('[cron compute-scores] unauthorized access');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get date from query params or use yesterday's date
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    let targetDate: string
    if (dateParam) {
      targetDate = dateParam
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      targetDate = yesterday.toISOString().split('T')[0]
    }
    logger.info({ targetDate }, '[cron compute-scores] target date determined');

    // Check if results are already computed
    if (isResultsComputed(targetDate)) {
      logger.info({ targetDate }, '[cron compute-scores] results already computed');
      return NextResponse.json({ message: 'Results already computed for this date' })
    }

    // Get captions for the target date
    const captions = readCaptions(targetDate)
    if (captions.length === 0) {
      logger.info({ targetDate }, '[cron compute-scores] no captions found');
      return NextResponse.json({ message: 'No captions found for this date' })
    }
    logger.info({ count: captions.length, targetDate }, '[cron compute-scores] captions read');

    // Get the image path
    const publicDir = path.join(process.cwd(), 'public', 'contest')
    const files = fs.readdirSync(publicDir)
    const imageFileName = files.find(file => {
      const parsed = parseFileName(file)
      return parsed && parsed.date === targetDate
    })

    if (!imageFileName) {
        logger.error({ targetDate }, '[cron compute-scores] image not found for this date');
        return NextResponse.json({ error: 'Image not found for this date' }, { status: 404 });
    }
    
    const imagePath = path.join(publicDir, imageFileName);
    if (!fs.existsSync(imagePath)) {
      logger.error({ imagePath }, '[cron compute-scores] image file does not exist');
      return NextResponse.json({ error: 'Image file does not exist' }, { status: 404 });
    }
    logger.info({ imagePath }, '[cron compute-scores] image found');

    const imageBase64 = await getImageAsBase64(imagePath)

    // Initialize AI
    const apiKey = getApiKey()

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    })




    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png"
      }
    }
    const captionsText = captions.map(c => c.caption).join('\n')
    
    const prompt = `You are a judge for a caption contest. The image is a fun, creative sketch, and users have submitted captions for it. Please rate each caption on a scale of 0-10 based on:
- Creativity and originality (4 points)
- Humor and entertainment value (3 points)
- Relevance to the image (3 points)

Image's attached in the request already.

Here are the captions to rate:

${captionsText}

IMPORTANT: You MUST respond with ONLY a valid JSON object in this exact format, with no additional text or explanation:
{
  "scores": [
    {
      "caption": "exact caption text",
      "score": number from 0-10
    }
  ]
}

Requirements:
1. Response must be pure JSON - no markdown, no code blocks, no extra text
2. Each caption must be included exactly as provided
3. Scores must be integers between 0 and 10
4. The response must include ALL captions provided`

    let generationContent = [
      imagePart,
      { text: prompt }
    ]

    logger.info("[cron compute-scores] calling AI API...");
    
    // Get scores from AI
    const result = await model.generateContent(generationContent)
    logger.info("[cron compute-scores] response received from AI");

    let response = result.response.text()
    logger.debug({ response }, "[cron compute-scores] raw response");

    // Clean up the response to handle potential markdown or code blocks
    response = response.replace(/```json\s*|\s*```/g, '').trim()
    
    // Parse scores from JSON response
    try {
      const parsedResponse = JSON.parse(response)
      logger.info("[cron compute-scores] successfully parsed response");
      
      // Validate response structure
      if (!parsedResponse.scores || !Array.isArray(parsedResponse.scores)) {
        logger.error({ parsedResponse }, '[cron compute-scores] invalid response format: missing scores array');
        throw new Error('Invalid response format: missing scores array')
      }

      const scores: { [key: string]: number } = {}
      const providedCaptions = new Set(captions.map(c => c.caption))
      
      // Validate each score entry
      for (const item of parsedResponse.scores) {
        if (!item.caption || typeof item.caption !== 'string') {
          logger.error({ item }, '[cron compute-scores] invalid caption format in response');
          throw new Error('Invalid caption format in response')
        }
        if (typeof item.score !== 'number' || item.score < 0 || item.score > 10 || !Number.isInteger(item.score)) {
          logger.error({ item }, `[cron compute-scores] invalid score for caption "${item.caption}"`);
          throw new Error(`Invalid score for caption "${item.caption}": score must be an integer between 0 and 10`)
        }
        if (!providedCaptions.has(item.caption)) {
          logger.warn({ caption: item.caption }, '[cron compute-scores] received score for unknown caption');
          // This might not be a critical error, so we can choose to log and continue
          continue;
        }
        scores[item.caption] = item.score
      }

      // Verify all captions were scored
      const missingCaptions = Array.from(providedCaptions).filter(caption => !(caption in scores))
      if (missingCaptions.length > 0) {
        logger.warn({ missingCaptions }, '[cron compute-scores] missing scores for some captions');
        // Depending on requirements, this could be a soft error or a hard one.
        // For now, we proceed with the scores we have.
      }

      logger.info({ scoresCount: Object.keys(scores).length }, "[cron compute-scores] validated scores");

      // Update scores in CSV
      updateCaptionScores(targetDate, scores)
      logger.info({ targetDate }, '[cron compute-scores] updated scores in CSV');

      // Mark results as computed
      markResultsComputed(targetDate)
      logger.info({ targetDate }, '[cron compute-scores] marked results as computed');

      return NextResponse.json({ 
        message: 'Scores computed and updated successfully',
        date: targetDate,
        captions_processed: Object.keys(scores).length,
        scores: scores // Include scores in response for verification
      })
    } catch (error) {
      logger.error(error, '[cron compute-scores] error processing AI response');
      return handleApiError(error)
    }
  } catch (error) {
    logger.error(error, '[cron compute-scores] an unexpected error occurred');
    return handleApiError(error)
  }
} 