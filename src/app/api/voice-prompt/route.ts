import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { getApiKey, handleApiError } from '@/lib/ai';
import logger from '@/lib/server-logger';

const MAX_RETRIES = 3;

// Kid-friendly speech-to-text processing with Gemini
async function transcribeAudioWithGemini(filePath: string, customApiKey?: string) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      logger.info({ attempt: attempt + 1, filePath }, '[voice-prompt] sending to gemini api');
      
      // Get API key using existing infrastructure
      const apiKey = getApiKey(customApiKey);
      
      // Initialize Gemini with same patterns as other routes
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash", // Optimal for text processing
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          }
        ],
      });

      // Determine mime type from file extension
      const fileExtension = path.extname(filePath).toLowerCase();
      let mimeType = 'audio/webm';
      if (fileExtension === '.mp3') mimeType = 'audio/mp3';
      else if (fileExtension === '.wav') mimeType = 'audio/wav';
      else if (fileExtension === '.webm') mimeType = 'audio/webm';

      // Optimized inline data approach with streaming for better performance
      logger.info({ filePath, mimeType }, '[voice-prompt] processing audio file with optimized approach');
      
      const audioBuffer = fs.readFileSync(filePath);
      const audioBase64 = audioBuffer.toString('base64');
      
      logger.info({ 
        originalSize: audioBuffer.length, 
        base64Size: audioBase64.length,
        compressionRatio: (audioBase64.length / audioBuffer.length * 100).toFixed(1) + '%'
      }, '[voice-prompt] audio file processed for Gemini');

      // Kid-friendly transcription prompt with performance optimizations
      const prompt = `Transcribe this audio from a child (age 4-8) describing what they want to draw. 
      
The child may speak unclearly, use simple words, or have creative ideas. Please:
- Transcribe exactly what they say
- Correct obvious mispronunciations to standard words
- Keep their creative and imaginative language
- If the speech is unclear, provide your best interpretation
- Return only the transcribed text, nothing else

Example: If a child says "I want to draw a purpel unicorn with sparkels", transcribe as "I want to draw a purple unicorn with sparkles"`;

      const response = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType
          }
        }
      ]);

      const transcription = response.response.text();
      logger.info('[voice-prompt] transcription successful');
      return transcription;
      
    } catch (error) {
      logger.error(error, `[voice-prompt] transcription attempt ${attempt + 1} failed`);
      if (attempt === MAX_RETRIES - 1) {
        throw error; // Rethrow the error after max attempts
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
    }
  }
}

export async function POST(request: NextRequest) {
  logger.info('[voice-prompt] received request');
  
  // Use internal project folder for temp files
  const tempDir = path.join(process.cwd(), 'temp', 'voice-prompt');
  const fileName = `voice-prompt-${uuidv4()}`;
  let filePath: string | null = null;
  
  try {
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      logger.info({ tempDir }, '[voice-prompt] created temp directory');
    }

    // Parse form data for audio file
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const customApiKey = formData.get('customApiKey') as string | undefined;
    
    // Basic request validation
    if (!audioFile) {
      logger.warn('[voice-prompt] no audio file provided');
      return NextResponse.json(
        { success: false, error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Validate file type and get extension
    const allowedTypes = {
      'audio/webm': '.webm',
      'audio/mp3': '.mp3', 
      'audio/wav': '.wav',
      'audio/mpeg': '.mp3'
    };
    
    if (!allowedTypes[audioFile.type as keyof typeof allowedTypes]) {
      logger.warn({ fileType: audioFile.type }, '[voice-prompt] invalid audio file type');
      return NextResponse.json(
        { success: false, error: 'Unsupported audio format. Please use WebM, MP3, or WAV.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB for voice prompts)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (audioFile.size > maxSize) {
      logger.warn({ fileSize: audioFile.size }, '[voice-prompt] file too large');
      return NextResponse.json(
        { success: false, error: 'Audio file is too large. Maximum size is 10MB.' },
        { status: 413 }
      );
    }

    logger.info({ 
      fileSize: audioFile.size, 
      fileType: audioFile.type,
      fileName: audioFile.name 
    }, '[voice-prompt] audio file validated');

    // Create temp file with proper extension
    const fileExtension = allowedTypes[audioFile.type as keyof typeof allowedTypes];
    filePath = path.join(tempDir, fileName + fileExtension);

    try {
      // Convert audio file to buffer and save to temp file
      const bytes = await audioFile.arrayBuffer();
      const uint8Array = new Uint8Array(bytes);
      await writeFile(filePath, uint8Array);
      logger.info({ filePath }, '[voice-prompt] saved temp audio file');

      // Process with Gemini speech-to-text
      const transcription = await transcribeAudioWithGemini(filePath, customApiKey);
      
      logger.info('[voice-prompt] audio transcription completed successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Voice prompt transcribed successfully',
        data: {
          text: transcription,
          fileSize: audioFile.size,
          fileType: audioFile.type,
          processed: true
        }
      });

    } finally {
      // Clean up temp file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info({ filePath }, '[voice-prompt] cleaned up temp audio file');
      }
    }

  } catch (error) {
    logger.error(error, '[voice-prompt] unexpected error processing request');
    
    // Clean up temp file in case of error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info({ filePath }, '[voice-prompt] cleaned up temp audio file after error');
    }
    
    // Handle specific error cases with kid-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('safety_settings')) {
        return NextResponse.json(
          { success: false, error: "Let's keep our drawing ideas fun and kid-friendly! Try describing something creative and positive." },
          { status: 400 }
        );
      }
      if (error.message.includes('No valid API key provided')) {
        return NextResponse.json(
          { success: false, error: 'No API key available. Please provide a valid API key.' },
          { status: 400 }
        );
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { success: false, error: 'API usage limit reached. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: "Oops! I couldn't hear you clearly. Try speaking again or type your idea!" },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 