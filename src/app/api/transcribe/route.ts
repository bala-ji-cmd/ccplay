import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

const openai = new OpenAI();

const MAX_RETRIES = 3;

async function transcribeAudio(filePath: string) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
      });
      return transcription;
    } catch (error) {
      console.error(`Transcription attempt ${attempt + 1} failed:`, error);
      if (attempt === MAX_RETRIES - 1) {
        throw error; // Rethrow the error after max attempts
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Create temp file path
    const tempDir = os.tmpdir();
    const fileName = `voice-${uuidv4()}.webm`;
    const filePath = path.join(tempDir, fileName);

    // Convert audio file to buffer and save to temp file
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    try {
      // Send to Whisper API
      const transcription = await transcribeAudio(filePath);

      // Clean up temp file
      fs.unlinkSync(filePath);

      return NextResponse.json({ text: transcription });
    } catch (error) {
      // Clean up temp file in case of error
      fs.unlinkSync(filePath);
      throw error;
    }
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 