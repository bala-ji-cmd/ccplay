import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { getApiKey, handleApiError } from '@/lib/ai';
import logger from '@/lib/server-logger';
import { 
  applySSMLFormatting, 
  getVoiceForCharacter,
  animalCharacterVoices,
  getFallbackVoiceForCharacter,
  getTTSErrorMessage,
  retryConfig,
  sleep,
  getRetryDelay,
  isRetryableError,
  logTTSError
} from '@/lib/audioUtils';

// Voice options from the Gemini TTS demo
const VOICES = [
  'Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Leda', 'Orus', 'Aoede',
  'Callirrhoe', 'Autonoe', 'Enceladus', 'Iapetus', 'Umbriel', 'Algieba', 
  'Despina', 'Erinome', 'Sulafat', 'Algenib', 'Rasalgethi', 'Laomedeia', 
  'Achernar', 'Alnilam', 'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 
  'Zubenelgenubi', 'Vindemiatrix', 'Sadachbia', 'Sadaltager'
];



/**
 * Generate audio with retry logic and fallback voices
 */
async function generateAudioWithRetry(
  processedStoryText: string,
  voiceName: string,
  characterId: string | undefined,
  customApiKey: string | undefined
): Promise<{ audioData: string; voiceUsed: string }> {
  const fallbackVoices = getFallbackVoiceForCharacter(characterId);
  const apiKey = getApiKey(customApiKey);
  
  // Initialize Gemini with TTS model
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-tts",
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

  // Try each voice with retry logic
  for (const fallbackVoice of fallbackVoices) {
    logger.info({ voiceName: fallbackVoice, characterId }, '[story narrate] attempting voice');
    
    for (let attempt = 1; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        logger.info({ attempt, voiceName: fallbackVoice }, '[story narrate] generation attempt');
        
        const response = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: processedStoryText }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: fallbackVoice },
              },
            },
          },
        } as any);

        const audioData = response.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (!audioData) {
          throw new Error('No audio data received from TTS service');
        }

        logger.info({ voiceName: fallbackVoice, attempt }, '[story narrate] audio generated successfully');
        return { audioData, voiceUsed: fallbackVoice };
        
      } catch (error: any) {
        const isLastAttempt = attempt === retryConfig.maxRetries;
        const isLastVoice = fallbackVoice === fallbackVoices[fallbackVoices.length - 1];
        
        // Log the error with context
        logTTSError(error, {
          characterId,
          voiceName: fallbackVoice,
          attempt
        });

        // If this is not retryable, try next voice
        if (!isRetryableError(error)) {
          logger.warn({ error: error.message, voiceName: fallbackVoice }, '[story narrate] non-retryable error, trying next voice');
          break;
        }

        // If this is the last attempt with the last voice, throw the error
        if (isLastAttempt && isLastVoice) {
          throw error;
        }

        // If not the last attempt, wait before retry
        if (!isLastAttempt) {
          const delay = getRetryDelay(attempt);
          logger.info({ delay, attempt, voiceName: fallbackVoice }, '[story narrate] waiting before retry');
          await sleep(delay);
        }
      }
    }
    break;
  }

  // This should not be reached, but add fallback
  throw new Error('All voice generation attempts failed');
}

export async function POST(request: NextRequest) {
  logger.info('[story narrate] received request');
  
  try {
    const body = await request.json();
    const { storyText, voiceName, characterId, customApiKey } = body;

    if (!storyText || typeof storyText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Story text is required' },
        { status: 400 }
      );
    }

    // Determine the voice to use (character-based or direct voice selection)
    const finalVoiceName = voiceName || getVoiceForCharacter(characterId, 'Kore');
    
    if (!VOICES.includes(finalVoiceName)) {
      return NextResponse.json(
        { success: false, error: `Invalid voice. Available voices: ${VOICES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate character ID if provided
    if (characterId && !animalCharacterVoices[characterId as keyof typeof animalCharacterVoices]) {
      return NextResponse.json(
        { success: false, error: `Invalid character ID. Available characters: ${Object.keys(animalCharacterVoices).join(', ')}` },
        { status: 400 }
      );
    }

    // Apply SSML formatting for natural storytelling
    const processedStoryText = applySSMLFormatting(storyText, characterId);
    logger.info({ 
      hasCharacter: !!characterId, 
      characterId,
      finalVoiceName,
      textLength: processedStoryText.length 
    }, '[story narrate] applied SSML formatting');

    // Generate audio with retry logic and fallbacks
    logger.info({ finalVoiceName, characterId }, '[story narrate] generating audio');
    
    try {
      const { audioData, voiceUsed } = await generateAudioWithRetry(
        processedStoryText,
        finalVoiceName,
        characterId,
        customApiKey
      );
      
      logger.info({ voiceUsed, originalVoice: finalVoiceName }, '[story narrate] audio generated successfully');

      // Return response with raw audio data for client-side caching
      return NextResponse.json({
        success: true,
        audioData: audioData, // Raw audio data for client-side playback and caching
        voiceName: voiceUsed,
        characterId,
        message: 'Story narration generated successfully',
        cached: false
      });
      
    } catch (error: any) {
      const userMessage = getTTSErrorMessage(error);
      
      // Log the final error
      logTTSError(error, {
        characterId,
        voiceName: finalVoiceName
      });
      
      logger.error({ error: error.message, finalVoiceName }, '[story narrate] all generation attempts failed');
      
      return NextResponse.json(
        { 
          success: false, 
          error: userMessage,
          retryable: isRetryableError(error),
          characterId,
          voiceName: finalVoiceName
        },
        { status: 503 } // Service Unavailable
      );
    }
  } catch (error: any) {
    logger.error({ error: error.message }, '[story narrate] unexpected error in POST handler');
    return handleApiError(error);
  }
}

export async function GET() {
  logger.info('[story narrate] received GET request for voices');
  try {
    const characterInfo = Object.entries(animalCharacterVoices).map(([id, data]) => ({
      id,
      name: id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      personality: data.personality,
      baseVoice: data.baseVoice,
    }));
    
    return NextResponse.json({
      success: true,
      voices: VOICES,
      characters: characterInfo
    });
  } catch (error: any) {
    logger.error({ error: error.message }, '[story narrate] unexpected error in GET handler');
    return handleApiError(error);
  }
} 