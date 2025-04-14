import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { readCaptions, updateCaptionScores, isResultsComputed, markResultsComputed } from '@/lib/csv-utils'
import fs from 'fs'
import path from 'path'


async function getImageAsBase64(imagePath: string): Promise<string> {
  const imageBuffer = fs.readFileSync(imagePath)
  return imageBuffer.toString('base64')
}

// Helper function to validate the API key
const validateApiKey = (apiKey: string): boolean => {
  return apiKey.startsWith('AI') && apiKey.length > 20
}

// Helper function to get API key
const getApiKey = (customApiKey?: string): string => {
  const defaultKey = process.env.GEMINI_API_KEY
  if (customApiKey && validateApiKey(customApiKey)) {
    return customApiKey
  }
  if (!defaultKey) {
    throw new Error('No valid API key provided')
  }
  return defaultKey
}

// Helper function to parse filename and get date and deadline
const parseFileName = (fileName: string): { date: string; deadline: string } | null => {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\.png$/)
  if (!match) return null
  return { date: match[1], deadline: match[2] }
}


export async function GET(request: Request) {
  // Verify cron job secret
  const headersList = headers()
  const cronSecret = headersList.get('x-cron-secret')
  
  if (cronSecret !== process.env.CRON_SECRET) {
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

    // Check if results are already computed
    if (isResultsComputed(targetDate)) {
      return NextResponse.json({ message: 'Results already computed for this date' })
    }


    // Get captions for the target date
    const captions = readCaptions(targetDate)
    if (captions.length === 0) {
      return NextResponse.json({ message: 'No captions found for this date' })
    }



    // Get the image path

    const publicDir = path.join(process.cwd(), 'public', 'contest')
    const files = fs.readdirSync(publicDir)
     // Find existing challenge for today
    const imagePath = files.find(file => {
      const parsed = parseFileName(file)
      return parsed && parsed.date === targetDate
    })

    if (!imagePath || !fs.existsSync(imagePath)) {
      // return NextResponse.json({ error: 'Image not found for this date' }, { status: 404 })
      console.error("imagenot found");
    }

    const imageBase64 = await getImageAsBase64(publicDir+'/'+imagePath)

        // Initialize Gemini
    let apiKey: string
    try {
      apiKey = getApiKey()
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'No API key available. Please provide a valid Gemini API key.',
        },
        { status: 400 }
      )
    }

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

    console.log("Calling Gemini API...")
    
    // Get scores from Gemini
    const result = await model.generateContent(generationContent)
    console.log("Response received from Gemini...")

    let response = result.response.text()
    console.log("Raw response:", response)

    // Clean up the response to handle potential markdown or code blocks
    response = response.replace(/```json\s*|\s*```/g, '').trim()
    
    // Parse scores from JSON response
    try {
      const parsedResponse = JSON.parse(response)
      
      // Validate response structure
      if (!parsedResponse.scores || !Array.isArray(parsedResponse.scores)) {
        throw new Error('Invalid response format: missing scores array')
      }

      const scores: { [key: string]: number } = {}
      const providedCaptions = new Set(captions.map(c => c.caption))
      
      // Validate each score entry
      for (const item of parsedResponse.scores) {
        if (!item.caption || typeof item.caption !== 'string') {
          throw new Error('Invalid caption format in response')
        }
        if (typeof item.score !== 'number' || item.score < 0 || item.score > 10 || !Number.isInteger(item.score)) {
          throw new Error(`Invalid score for caption "${item.caption}": score must be an integer between 0 and 10`)
        }
        if (!providedCaptions.has(item.caption)) {
          throw new Error(`Received score for unknown caption: "${item.caption}"`)
        }
        scores[item.caption] = item.score
      }

      // Verify all captions were scored
      const missingCaptions = Array.from(providedCaptions).filter(caption => !(caption in scores))
      if (missingCaptions.length > 0) {
        throw new Error(`Missing scores for captions: ${missingCaptions.join(', ')}`)
      }

      console.log("Validated scores:", scores)

      // Update scores in CSV
      updateCaptionScores(targetDate, scores)

      // Mark results as computed
      markResultsComputed(targetDate)

      return NextResponse.json({ 
        message: 'Scores computed and updated successfully',
        date: targetDate,
        captions_processed: Object.keys(scores).length,
        scores: scores // Include scores in response for verification
      })
    } catch (error) {
      console.error('Error processing Gemini response:', error)
      return NextResponse.json({ 
        error: 'Failed to process scores',
        details: error instanceof Error ? error.message : 'Unknown error',
        raw_response: response // Include raw response for debugging
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error computing scores:', error)
    return NextResponse.json({ error: 'Failed to compute scores' }, { status: 500 })
  }
} 