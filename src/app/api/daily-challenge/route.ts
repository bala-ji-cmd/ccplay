import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

// Helper function to generate filename
const generateFileName = (date: string, deadline: string): string => {
  return `${date}_${deadline}.png`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const today = date || new Date().toISOString().split('T')[0]

    // Check if challenge already exists for today
    const publicDir = path.join(process.cwd(), 'public', 'contest')
    const files = fs.readdirSync(publicDir)
    
    // Find existing challenge for today
    const existingFile = files.find(file => {
      const parsed = parseFileName(file)
      return parsed && parsed.date === today
    })

    if (existingFile) {
      const parsed = parseFileName(existingFile)
      if (parsed) {
        return NextResponse.json({
          sketch_url: `/contest/${existingFile}`,
          submission_deadline: parsed.deadline,
        })
      }
    }

    // Generate new challenge if it doesn't exist
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
      model:  "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      },
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

Generate the image with the  ( 788 * 296 ) 16:9 aspect ratio to maintain quality.`

    console.log('Calling Gemini API...')
    const response = await model.generateContent(prompt)
    console.log('Gemini API response received')
    let imageData = null

    if (response.response.candidates && response.response.candidates[0].content.parts && response.response.candidates[0].content.parts[0].inlineData) {
      imageData = response.response.candidates[0].content.parts[0].inlineData.data
      console.log('Daily contest image generated (size) :  ', imageData.length)
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
    }

    return NextResponse.json({
      sketch_url: `/contest/${fileName}`,
      submission_deadline: deadlineStr,
    })
  } catch (error) {
    console.error('Error generating daily challenge:', error)
    return NextResponse.json({ error: 'Failed to generate daily challenge' }, { status: 500 })
  }
}

// Cleanup old images (older than 2 days)
export async function DELETE() {
  try {
    const publicDir = path.join(process.cwd(), 'public', 'contest')
    const files = fs.readdirSync(publicDir)

    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    for (const file of files) {
      const filePath = path.join(publicDir, file)
      const stats = fs.statSync(filePath)

      if (stats.mtime < twoDaysAgo) {
        fs.unlinkSync(filePath)
      }
    }

    return NextResponse.json({ message: 'Cleanup completed' })
  } catch (error) {
    console.error('Error cleaning up old images:', error)
    return NextResponse.json({ error: 'Failed to cleanup old images' }, { status: 500 })
  }
} 