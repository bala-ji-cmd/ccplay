import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import logger from '@/lib/server-logger';

const openai = new OpenAI();

const MAX_RETRIES = 3;

async function transcribeAudio(filePath: string) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      logger.info({ attempt: attempt + 1, filePath }, '[transcribe] sending to whisper api');
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
      });
      logger.info('[transcribe] transcription successful');
      return transcription;
    } catch (error) {
      logger.error(error, `[transcribe] transcription attempt ${attempt + 1} failed`);
      if (attempt === MAX_RETRIES - 1) {
        throw error; // Rethrow the error after max attempts
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
    }
  }
}

export async function POST(request: NextRequest) {
  logger.info('[transcribe] received request');
  
  // Use internal project folder for temp files (consistent with voice-prompt)
  const tempDir = path.join(process.cwd(), 'temp', 'transcribe');
  const fileName = `voice-${uuidv4()}.webm`;
  let filePath: string | null = null;

  try {
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      logger.info({ tempDir }, '[transcribe] created temp directory');
    }

    filePath = path.join(tempDir, fileName);

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      logger.warn('[transcribe] no audio file provided');
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert audio file to buffer and save to temp file
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    logger.info({ filePath }, '[transcribe] saved temp audio file');

    try {
      // Send to Whisper API
      const transcription = await transcribeAudio(filePath);
      return NextResponse.json({ text: transcription });
    } finally {
      // Clean up temp file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info({ filePath }, '[transcribe] cleaned up temp audio file');
      }
    }
  } catch (error) {
    logger.error(error, '[transcribe] transcription error');
    // Clean up temp file in case of error
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info({ filePath }, '[transcribe] cleaned up temp audio file after error');
    }
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 