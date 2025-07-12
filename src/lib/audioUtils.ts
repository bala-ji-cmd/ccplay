import { createHash } from 'crypto';
import { SupabaseClient } from '@supabase/supabase-js';
import logger from './server-logger';

/**
 * Generate a unique cache key for audio files based on content and voice
 */
export function generateAudioCacheKey(storyText: string, voiceName: string): string {
  const content = `${storyText.trim()}-${voiceName}`;
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Animal character voice configurations for kid-friendly storytelling
 */
export const animalCharacterVoices = {
  'friendly-bear': {
    baseVoice: 'Kore',
    personality: 'Warm, gentle papa bear voice',
    description: 'A cuddly teddy bear who loves bedtime stories',
    ssmlEnhancements: {
      rate: 'slow',
      pitch: 'low',
      volume: 'medium'
    }
  },
  'cheerful-bunny': {
    baseVoice: 'Aoede',
    personality: 'Bouncy, excited little bunny',
    description: 'An energetic bunny who hops through adventures',
    ssmlEnhancements: {
      rate: 'fast',
      pitch: 'high',
      volume: 'medium'
    }
  },
  'wise-owl': {
    baseVoice: 'Charon',
    personality: 'Thoughtful, storytelling grandpa owl',
    description: 'A wise old owl who knows all the best stories',
    ssmlEnhancements: {
      rate: 'slow',
      pitch: 'low',
      volume: 'soft'
    }
  },
  'playful-puppy': {
    baseVoice: 'Zephyr',
    personality: 'Happy, tail-wagging puppy',
    description: 'A friendly puppy who loves to play and tell stories',
    ssmlEnhancements: {
      rate: 'medium',
      pitch: 'medium',
      volume: 'medium'
    }
  },
  'gentle-elephant': {
    baseVoice: 'Orus',
    personality: 'Kind, slow-speaking gentle giant',
    description: 'A wise elephant with a big heart and soothing voice',
    ssmlEnhancements: {
      rate: 'x-slow',
      pitch: 'x-low',
      volume: 'medium'
    }
  },
  'curious-cat': {
    baseVoice: 'Leda',
    personality: 'Mysterious, purring storyteller',
    description: 'A clever cat who whispers magical bedtime tales',
    ssmlEnhancements: {
      rate: 'medium',
      pitch: 'medium',
      volume: 'soft'
    }
  }
};

/**
 * Preprocess story text for better speech synthesis
 */
export function preprocessStoryText(storyText: string): string {
  let processedText = storyText.trim();
  
  // Add pauses after sentences for natural pacing
  processedText = processedText.replace(/([.!?])\s+/g, '$1 ');
  
  // Add emphasis to exclamations and excitement
  processedText = processedText.replace(/([!])/g, '$1');
  
  // Add breathing room around dialogue
  processedText = processedText.replace(/(".*?")/g, ' $1 ');
  
  // Normalize multiple spaces
  processedText = processedText.replace(/\s+/g, ' ');
  
  // Add gentle ending pause
  if (!processedText.endsWith('.') && !processedText.endsWith('!') && !processedText.endsWith('?')) {
    processedText += '.';
  }
  
  return processedText;
}

/**
 * Apply SSML formatting for natural storytelling
 */
export function applySSMLFormatting(storyText: string, characterId?: string): string {
  const processedText = preprocessStoryText(storyText);
  
  // If no character specified, return basic SSML
  if (!characterId || !animalCharacterVoices[characterId as keyof typeof animalCharacterVoices]) {
    return `<speak>
      <prosody rate="medium" pitch="medium" volume="medium">
        ${processedText}
      </prosody>
    </speak>`;
  }
  
  const character = animalCharacterVoices[characterId as keyof typeof animalCharacterVoices];
  const { rate, pitch, volume } = character.ssmlEnhancements;
  
  // Create character-specific SSML
  let ssmlText = `<speak>
    <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">`;
  
  // Add character introduction for first story
  if (processedText.toLowerCase().includes('once upon a time')) {
    ssmlText += `
      <emphasis level="moderate">Hello there, little ones!</emphasis>
      <break time="500ms"/>
      I'm your ${character.personality.toLowerCase()}, and I have a wonderful story to tell you.
      <break time="800ms"/>`;
  }
  
  // Process the story text with natural pauses
  let formattedText = processedText;
  
  // Add dramatic pauses for story beats
  formattedText = formattedText.replace(/\.\.\./g, '<break time="1s"/>');
  formattedText = formattedText.replace(/([.!?])\s+/g, '$1<break time="300ms"/>');
  
  // Add emphasis to exciting parts
  formattedText = formattedText.replace(/(!)/g, '<emphasis level="strong">$1</emphasis>');
  
  // Add gentle emphasis to "Once upon a time"
  formattedText = formattedText.replace(
    /(once upon a time)/gi, 
    '<emphasis level="moderate">$1</emphasis><break time="500ms"/>'
  );
  
  // Add emphasis to "The End"
  formattedText = formattedText.replace(
    /(the end)/gi,
    '<break time="500ms"/><emphasis level="moderate">$1</emphasis>'
  );
  
  ssmlText += formattedText;
  
  // Add gentle closing
  ssmlText += `
      <break time="500ms"/>
      <prosody rate="slow" volume="soft">
        Sweet dreams, little ones.
      </prosody>
    </prosody>
  </speak>`;
  
  return ssmlText;
}

/**
 * Get voice name for character or default
 */
export function getVoiceForCharacter(characterId?: string, defaultVoice: string = 'Kore'): string {
  if (!characterId || !animalCharacterVoices[characterId as keyof typeof animalCharacterVoices]) {
    return defaultVoice;
  }
  
  return animalCharacterVoices[characterId as keyof typeof animalCharacterVoices].baseVoice;
}

/**
 * Clean up old audio files (optional optimization)
 */
export async function cleanupOldAudioFiles(supabase: SupabaseClient, olderThanDays: number = 30): Promise<void> {
  try {
    const { data: files, error } = await supabase.storage
      .from('audio-stories')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'asc' }
      });
    
    if (error) {
      logger.error({ error }, '[audio cache] error listing files for cleanup');
      return;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const filesToDelete = files?.filter((file: any) => {
      const fileDate = new Date(file.created_at);
      return fileDate < cutoffDate;
    });
    
    if (filesToDelete && filesToDelete.length > 0) {
      const fileNames = filesToDelete.map((file: any) => file.name);
      const { error: deleteError } = await supabase.storage
        .from('audio-stories')
        .remove(fileNames);
      
      if (deleteError) {
        logger.error({ deleteError }, '[audio cache] error deleting old files');
      } else {
        logger.info({ deletedCount: fileNames.length }, '[audio cache] cleaned up old audio files');
      }
    }
  } catch (error) {
    logger.error({ error }, '[audio cache] error during cleanup');
  }
}

/**
 * Get audio file size and metadata
 */
export async function getAudioFileInfo(cacheKey: string, supabase: SupabaseClient): Promise<{ size: number; lastModified: Date } | null> {
  try {
    const fileName = `${cacheKey}.wav`;
    const { data: files, error } = await supabase.storage
      .from('audio-stories')
      .list('', {
        search: fileName
      });
    
    if (error || !files || files.length === 0) {
      return null;
    }
    
    const file = files[0];
    return {
      size: file.metadata?.size || 0,
      lastModified: new Date(file.created_at)
    };
  } catch (error) {
    logger.error({ error, cacheKey }, '[audio cache] error getting file info');
    return null;
  }
}

/**
 * Fallback voice options for error recovery
 */
export const fallbackVoices = {
  primary: 'Kore',
  secondary: 'Zephyr',
  tertiary: 'Aoede',
  last_resort: 'Charon'
};

/**
 * Get fallback voice for a character if primary voice fails
 */
export function getFallbackVoiceForCharacter(characterId?: string): string[] {
  const character = characterId ? animalCharacterVoices[characterId as keyof typeof animalCharacterVoices] : null;
  const primaryVoice = character?.baseVoice || fallbackVoices.primary;
  
  // Return array of fallback voices in order of preference
  return [
    primaryVoice,
    fallbackVoices.secondary,
    fallbackVoices.tertiary,
    fallbackVoices.last_resort
  ].filter((voice, index, array) => array.indexOf(voice) === index); // Remove duplicates
}

/**
 * Check if a voice is available in the supported voices list
 */
export function isVoiceAvailable(voiceName: string, availableVoices: string[]): boolean {
  return availableVoices.includes(voiceName);
}

/**
 * Get user-friendly error message for TTS failures
 */
export function getTTSErrorMessage(error: any): string {
  // API quota exceeded
  if (error.message?.includes('quota') || error.message?.includes('limit')) {
    return 'Story narration is temporarily unavailable due to high demand. Please try again in a few minutes.';
  }
  
  // Network/connectivity issues
  if (error.message?.includes('network') || error.message?.includes('connect')) {
    return 'Unable to connect to narration service. Please check your internet connection and try again.';
  }
  
  // Voice not available
  if (error.message?.includes('voice') || error.message?.includes('model')) {
    return 'The selected voice is temporarily unavailable. We\'ll try with a different voice.';
  }
  
  // Content safety issues
  if (error.message?.includes('safety') || error.message?.includes('blocked')) {
    return 'This story content cannot be narrated due to content guidelines. Please try a different story.';
  }
  
  // Authentication issues
  if (error.message?.includes('auth') || error.message?.includes('permission')) {
    return 'Authentication error. Please refresh the page and try again.';
  }
  
  // Generic fallback
  return 'Story narration is temporarily unavailable. Please try again later.';
}

/**
 * Retry configuration for TTS operations
 */
export const retryConfig = {
  maxRetries: 1,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2
};

/**
 * Sleep utility for retry delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate retry delay with exponential backoff
 */
export function getRetryDelay(attempt: number): number {
  const delay = retryConfig.baseDelay * Math.pow(retryConfig.backoffFactor, attempt - 1);
  return Math.min(delay, retryConfig.maxDelay);
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors are retryable
  if (error.message?.includes('network') || error.message?.includes('timeout')) {
    return true;
  }
  
  // Rate limiting is retryable
  if (error.message?.includes('rate') || error.message?.includes('limit')) {
    return true;
  }
  
  // Temporary server errors are retryable
  if (error.status >= 500 && error.status < 600) {
    return true;
  }
  
  // 429 Too Many Requests is retryable
  if (error.status === 429) {
    return true;
  }
  
  // Authentication errors are not retryable
  if (error.status === 401 || error.status === 403) {
    return false;
  }
  
  // Content safety errors are not retryable
  if (error.message?.includes('safety') || error.message?.includes('blocked')) {
    return false;
  }
  
  // Default to retryable for unknown errors
  return true;
}

/**
 * Enhanced error logging with context
 */
export function logTTSError(error: any, context: {
  userId?: string;
  characterId?: string;
  voiceName?: string;
  attempt?: number;
  cacheKey?: string;
}): void {
  const errorDetails = {
    error: error.message || error,
    errorType: error.constructor?.name,
    status: error.status,
    ...context,
    timestamp: new Date().toISOString(),
    isRetryable: isRetryableError(error)
  };
  
  logger.error(errorDetails, '[tts error] detailed error logging');
}

/**
 * Get cached audio file from Supabase storage (client-side)
 */
export async function getCachedAudioFile(cacheKey: string, userId: string): Promise<string | null> {
  try {
    // Import supabase client for client-side usage
    const { supabase } = await import('@/lib/supabase');
    
    const filePath = `${userId}/${cacheKey}.wav`;
    
    // Check if file exists first
    const { data: fileData, error: listError } = await supabase.storage
      .from('audio-stories-v2')
      .list(userId, {
        search: `${cacheKey}.wav`
      });
    
    if (listError || !fileData || fileData.length === 0) {
      console.warn('[audio cache] file not found in storage:', { cacheKey, userId });
      return null;
    }
    
    // Get signed URL for authenticated access (valid for 1 hour)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('audio-stories-v2')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    if (signedError || !signedData?.signedUrl) {
      console.warn('[audio cache] failed to create signed URL:', signedError);
      return null;
    }
    
    console.log('[audio cache] found cached file:', { cacheKey, userId, signedUrl: signedData.signedUrl });
    return signedData.signedUrl;
    
  } catch (error) {
    console.warn('[audio cache] error checking cache:', error);
    return null;
  }
}

/**
 * Convert base64 audio data to blob (store exactly as received from Gemini)
 */
function base64ToAudioBlob(base64Data: string): Blob {
  try {
    // Decode base64 to binary data
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('[audio cache] converted base64 to blob:', {
      originalLength: base64Data.length,
      binaryLength: binaryString.length,
      bytesLength: bytes.length
    });
    
    // Store as-is - exactly as received from Gemini API
    return new Blob([bytes], { type: 'audio/wav' });
  } catch (error) {
    console.error('[audio cache] base64 conversion error:', error);
    throw new Error('Failed to convert base64 audio data');
  }
}

/**
 * Store audio file in Supabase storage (client-side)
 */
export async function storeAudioFile(cacheKey: string, userId: string, audioData: string): Promise<string | null> {
  try {
    // Import supabase client for client-side usage
    const { supabase } = await import('@/lib/supabase');
    
    // Convert base64 audio data to blob (no conversion)
    const audioBlob = base64ToAudioBlob(audioData);
    
    const filePath = `${userId}/${cacheKey}.wav`;
    
    // Upload to storage (with upsert to overwrite if exists)
    const { error: uploadError } = await supabase.storage
      .from('audio-stories-v2')
      .upload(filePath, audioBlob, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting existing files
        contentType: 'audio/wav'
      });
    
    if (uploadError) {
      console.error('[audio cache] upload failed:', uploadError);
      return null;
    }
    
    // Get signed URL for authenticated access (valid for 1 hour)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('audio-stories-v2')
      .createSignedUrl(filePath, 3600);
    
    if (signedError || !signedData?.signedUrl) {
      console.error('[audio cache] failed to create signed URL after upload:', signedError);
      return null;
    }
    
    console.log('[audio cache] file stored successfully:', { cacheKey, userId, signedUrl: signedData.signedUrl });
    return signedData.signedUrl;
    
  } catch (error) {
    console.error('[audio cache] error storing file:', error);
    return null;
  }
}

/**
 * Get cached MP3 audio file from Supabase storage (client-side)
 */
export async function getCachedMp3AudioFile(cacheKey: string, userId: string): Promise<string | null> {
  try {
    // Import supabase client for client-side usage
    const { supabase } = await import('@/lib/supabase');
    
    const filePath = `${userId}/${cacheKey}.mp3`;
    
    // Check if MP3 file exists first
    const { data: fileData, error: listError } = await supabase.storage
      .from('audio-stories-v2')
      .list(userId, {
        search: `${cacheKey}.mp3`
      });
    
    if (listError || !fileData || fileData.length === 0) {
      console.log('[mp3 cache] MP3 file not found in storage:', { cacheKey, userId });
      return null;
    }
    
    // Get signed URL for authenticated access (valid for 1 hour)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('audio-stories-v2')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
    if (signedError || !signedData?.signedUrl) {
      console.warn('[mp3 cache] failed to create signed URL for MP3:', signedError);
      return null;
    }
    
    console.log('[mp3 cache] found cached MP3 file:', { cacheKey, userId, signedUrl: signedData.signedUrl });
    return signedData.signedUrl;
    
  } catch (error) {
    console.warn('[mp3 cache] error checking MP3 cache:', error);
    return null;
  }
}

/**
 * Store MP3 audio file in Supabase storage (client-side)
 */
export async function storeMp3AudioFile(cacheKey: string, userId: string, mp3Data: ArrayBuffer): Promise<string | null> {
  try {
    // Import supabase client for client-side usage
    const { supabase } = await import('@/lib/supabase');
    
    // Create MP3 blob from ArrayBuffer
    const mp3Blob = new Blob([mp3Data], { type: 'audio/mp3' });
    
    const filePath = `${userId}/${cacheKey}.mp3`;
    
    // Upload to storage (with upsert to overwrite if exists)
    const { error: uploadError } = await supabase.storage
      .from('audio-stories-v2')
      .upload(filePath, mp3Blob, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting existing files
        contentType: 'audio/mp3'
      });
    
    if (uploadError) {
      console.error('[mp3 cache] upload failed:', uploadError);
      return null;
    }
    
    // Don't return signed URL since we're just caching, not serving
    console.log('[mp3 cache] MP3 file stored successfully:', { 
      cacheKey, 
      userId, 
      filePath,
      fileSize: mp3Data.byteLength 
    });
    
    return filePath;
    
  } catch (error) {
    console.error('[mp3 cache] error storing MP3 file:', error);
    return null;
  }
} 