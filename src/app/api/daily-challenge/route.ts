import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getApiKey, handleApiError } from '@/lib/ai'
import logger from '@/lib/server-logger'

// Helper function to parse filename and get date and deadline
const parseFileName = (fileName: string): { date: string; deadline: string } | null => {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\.png$/)
  if (!match) return null
  return { date: match[1], deadline: match[2] }
}

// Helper function to generate filename
const generateFileName = (date: string, deadline: string): string => {
  return `${date}_${deadline}.png`
}

export async function GET(request: Request) {
  logger.info('[daily-challenge] received GET request');
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const today = date || new Date().toISOString().split('T')[0]
    logger.info({ today }, '[daily-challenge] target date determined');

    // Check if challenge already exists for today
    const publicDir = path.join(process.cwd(), 'public', 'contest')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      logger.info(`[daily-challenge] created contest directory at ${publicDir}`);
    }
    const files = fs.readdirSync(publicDir)
    
    // Find existing challenge for today
    const existingFile = files.find(file => {
      const parsed = parseFileName(file)
      return parsed && parsed.date === today
    })

    if (existingFile) {
      const parsed = parseFileName(existingFile)
      if (parsed) {
        logger.info({ file: existingFile }, '[daily-challenge] found existing challenge');
        return NextResponse.json({
          sketch_url: `/contest/${existingFile}`,
          submission_deadline: parsed.deadline,
        })
      }
    }
    logger.info('[daily-challenge] no existing challenge found, generating a new one');

    // Generate new challenge if it doesn't exist
    const apiKey = getApiKey()

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model:  "gemini-2.0-flash-exp-image-generation",
      // @ts-ignore - responseModalities is required for image generation but not in type definition
      generationConfig: {
        responseModalities: ['Text', 'Image']
      } as any,
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

    const prompt = `Create a hand-drawn, amateur-style illustration that is playful, vibrant, and engaging for kids under 8 years old. The image should be colorful, with bold and simple shapes, designed to evoke creativity and fun captions. The scene should be imaginative and relatable to everyday life or fantasy, leaving room for kids to come up with their own unique and creative ideas.

Example themes (but not a compulsion):

A giant rainbow-colored pencil turning into a bridge for a group of curious ants.

A colorful spaceship made out of fruits, flying through a starry sky.

A magical tree growing upside down with upside-down birds flying around.

A dancing robot made out of kitchen utensils having a party with fruit friends.

A bunny wearing sneakers, hopping through a field of giant, floating bubbles.

The style should be whimsical and simple, allowing children to connect with the image and create their own playful captions. 

Generate the only the image with the  ( 788 * 296 ) 16:9 aspect ratio to maintain quality. Don't respond with anything else but the image.`

    logger.info('[daily-challenge] calling LLM API...');
    const response = await model.generateContent(prompt)
    logger.info('[daily-challenge] LLM API response received');
    let imageData = null

    if (response.response.candidates && response.response.candidates[0].content.parts && response.response.candidates[0].content.parts[0].inlineData) {
      imageData = response.response.candidates[0].content.parts[0].inlineData.data
      logger.info({ size: imageData.length }, '[daily-challenge] daily contest image generated');
    } else {
        logger.error('[daily-challenge] no image data received from AI');
        throw new Error('No image data received from AI');
    }

    // Ensure directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // Calculate submission deadline (24 hours from now)
    const submissionDeadline = new Date()
    submissionDeadline.setHours(submissionDeadline.getHours() + 24)
    const deadlineStr = submissionDeadline.toISOString()

    // Generate filename with date and deadline
    const fileName = generateFileName(today, deadlineStr)
    const filePath = path.join(publicDir, fileName)

    // Save image to public directory
    if (imageData) {
      const uint8Array = new Uint8Array(Buffer.from(imageData, 'base64'))
      fs.writeFileSync(filePath, uint8Array)
      logger.info({ filePath }, '[daily-challenge] saved new challenge image');
    }

    return NextResponse.json({
      sketch_url: `/contest/${fileName}`,
      submission_deadline: deadlineStr,
    })
  } catch (error) {
    logger.error(error, '[daily-challenge] error in GET request');
    if (error instanceof Error && error.message.includes('safety_settings')) {
      return NextResponse.json(
          {
              success: false,
              error: `This drawing idea isn't suitable for our creative space. Let's keep it fun, kid-friendly, and appropriate for all ages! 🎨✨`
          },
          { status: 400 }
      );
    }
    return handleApiError(error);
  }
}

// Cleanup old images (older than 2 days)
export async function DELETE() {
  logger.info('[daily-challenge] received DELETE request for cleanup');
  try {
    const publicDir = path.join(process.cwd(), 'public', 'contest')
    if (!fs.existsSync(publicDir)) {
        logger.info('[daily-challenge] contest directory does not exist, nothing to clean up');
        return NextResponse.json({ message: 'Cleanup completed, directory not found.' });
    }
    const files = fs.readdirSync(publicDir)

    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    let deletedCount = 0;
    for (const file of files) {
      const filePath = path.join(publicDir, file)
      const stats = fs.statSync(filePath)

      if (stats.mtime < twoDaysAgo) {
        fs.unlinkSync(filePath)
        logger.info({ file: filePath }, '[daily-challenge] deleted old challenge image');
        deletedCount++;
      }
    }

    logger.info({ deletedCount }, '[daily-challenge] cleanup completed');
    return NextResponse.json({ message: 'Cleanup completed', deleted_count: deletedCount })
  } catch (error) {
    logger.error(error, '[daily-challenge] error cleaning up old images');
    return NextResponse.json({ error: 'Failed to cleanup old images' }, { status: 500 })
  }
} 