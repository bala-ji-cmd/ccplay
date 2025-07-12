import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';
import { generateAudioCacheKey, getCachedAudioFile, storeMp3AudioFile, getCachedMp3AudioFile } from '@/lib/audioUtils';
import logger from '@/lib/client-logger';
import { Mp3Encoder } from '@breezystack/lamejs';

// Convert PCM data to WAV format for MP3 encoding
function pcmToWav(pcmData: Uint8Array, sampleRate: number, channels: number, bitDepth: number): ArrayBuffer {
  const dataLength = pcmData.length;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  // RIFF chunk descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true); // File size - 8
  writeString(8, 'WAVE');
  
  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Sub-chunk size
  view.setUint16(20, 1, true); // Audio format (1 = PCM)
  view.setUint16(22, channels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * channels * bitDepth / 8, true); // Byte rate
  view.setUint16(32, channels * bitDepth / 8, true); // Block align
  view.setUint16(34, bitDepth, true); // Bits per sample
  
  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataLength, true); // Data size
  
  // Copy PCM data
  const uint8View = new Uint8Array(buffer, 44);
  uint8View.set(pcmData);
  
  return buffer;
}

// Convert WAV data to MP3 format for smaller file size
function wavToMp3(wavBuffer: ArrayBuffer, sampleRate: number = 24000): ArrayBuffer {
  const wavData = new DataView(wavBuffer);
  
  // Skip WAV header (44 bytes) and get PCM data
  const pcmData = new Int16Array(wavBuffer.slice(44));
  
  // Initialize MP3 encoder with high quality settings
  const mp3encoder = new Mp3Encoder(1, sampleRate, 192); // 192kbps for high quality
  
  // Convert PCM data to the format expected by the encoder
  const samples = new Int16Array(pcmData.length);
  for (let i = 0; i < pcmData.length; i++) {
    samples[i] = pcmData[i];
  }
  
  // Encode to MP3
  const mp3Data = [];
  const blockSize = 1152; // Standard MP3 frame size
  
  for (let i = 0; i < samples.length; i += blockSize) {
    const sampleChunk = samples.subarray(i, i + blockSize);
    const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }
  
  // Flush remaining data
  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }
  
  // Combine all MP3 data
  const totalLength = mp3Data.reduce((acc, buf) => acc + buf.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const buf of mp3Data) {
    result.set(buf, offset);
    offset += buf.length;
  }
  
  return result.buffer;
}

interface NarrationState {
  audioUrl: string | null;
  audioData: string | null;
  isLoading: boolean;
  error: string | null;
  voiceName: string | null;
  characterId: string | null;
  cached: boolean;
}

interface NarrationOptions {
  voiceName?: string;
  characterId?: string;
  customApiKey?: string;
}

export const useStoryNarration = () => {
  const { user } = useAuth();
  const { setErrorMessage } = useError();
  const [narrationState, setNarrationState] = useState<NarrationState>({
    audioUrl: null,
    audioData: null,
    isLoading: false,
    error: null,
    voiceName: null,
    characterId: null,
    cached: false
  });

  const generateNarration = useCallback(async (
    storyText: string,
    options: NarrationOptions = {}
  ) => {
    if (!user) {
      setErrorMessage('Please log in to generate story narration');
      return;
    }

    if (!storyText || storyText.trim().length === 0) {
      setErrorMessage('Story text is required for narration');
      return;
    }

    setNarrationState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Generate cache key based on story text and voice/character
      const finalVoiceName = options.voiceName || 'Kore';
      const cacheKey = generateAudioCacheKey(storyText + (options.characterId || ''), finalVoiceName);
      
      logger.info('Generating story narration', {
        storyLength: storyText.length,
        characterId: options.characterId,
        voiceName: options.voiceName,
        userId: user.id,
        cacheKey
      });

      // Check cache first - prioritize MP3 cache for better performance
      logger.info('Checking cache for audio...', { cacheKey, userId: user.id });
      
      // 1. Check MP3 cache first (smaller, faster)
      const cachedMp3Url = await getCachedMp3AudioFile(cacheKey, user.id);
      
      if (cachedMp3Url) {
        logger.info('Using cached MP3 audio', {
          cacheKey,
          cachedUrl: cachedMp3Url,
          characterId: options.characterId,
          voiceName: finalVoiceName,
          cacheType: 'mp3'
        });
        
        setNarrationState({
          audioUrl: cachedMp3Url,
          audioData: null,
          isLoading: false,
          error: null,
          voiceName: finalVoiceName,
          characterId: options.characterId || null,
          cached: true
        });
        
        return;
      }
      
      // 2. Fallback to WAV cache (legacy)
      const cachedWavUrl = await getCachedAudioFile(cacheKey, user.id);
      
      if (cachedWavUrl) {
        logger.info('Using cached WAV audio (legacy)', {
          cacheKey,
          cachedUrl: cachedWavUrl,
          characterId: options.characterId,
          voiceName: finalVoiceName,
          cacheType: 'wav'
        });
        
        setNarrationState({
          audioUrl: cachedWavUrl,
          audioData: null,
          isLoading: false,
          error: null,
          voiceName: finalVoiceName,
          characterId: options.characterId || null,
          cached: true
        });
        
        return;
      }
      
      // 3. No cache found - proceed with generation
      logger.info('No cached audio found, generating new audio', { cacheKey });

      // Generate new audio
      logger.info('Generating new audio', { cacheKey });
      
      const response = await fetch('/api/story/narrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyText: storyText.trim(),
          voiceName: options.voiceName,
          characterId: options.characterId,
          customApiKey: options.customApiKey
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate narration');
      }

      if (!data.success) {
        throw new Error(data.error || 'Narration generation failed');
      }

      logger.info('Story narration generated successfully', {
        voiceName: data.voiceName,
        characterId: data.characterId,
        hasAudioData: !!data.audioData
      });

      logger.info('Story narration generated successfully', {
        voiceName: data.voiceName,
        characterId: data.characterId,
        hasAudioUrl: !!data.audioUrl,
        hasAudioData: !!data.audioData,
        tempFile: data.tempFile
      });

      // Use local temp file URL for immediate playback (guaranteed to work)
      setNarrationState({
        audioUrl: data.audioUrl, // Local temp file URL
        audioData: data.audioData, // Fallback to raw data if needed
        isLoading: false,
        error: null,
        voiceName: data.voiceName,
        characterId: data.characterId,
        cached: false
      });

      // Cache MP3 file in Supabase storage (background operation)
      if (data.audioData && user?.id) {
        logger.info('Starting background MP3 caching...', { cacheKey, userId: user.id });
        
        // Convert PCM to WAV then to MP3 for caching
        try {
          const pcmData = Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0));
          const wavData = pcmToWav(pcmData, 24000, 1, 16);
          const mp3Data = wavToMp3(wavData, 24000);
          
          // Calculate compression ratio
          const compressionRatio = ((wavData.byteLength - mp3Data.byteLength) / wavData.byteLength * 100).toFixed(1);
          logger.info('MP3 conversion completed for caching', {
            cacheKey,
            compressionRatio: `${compressionRatio}%`,
            wavSize: `${(wavData.byteLength / 1024 / 1024).toFixed(2)}MB`,
            mp3Size: `${(mp3Data.byteLength / 1024 / 1024).toFixed(2)}MB`
          });
          
          // Store in background (don't await to avoid blocking UI)
          storeMp3AudioFile(cacheKey, user.id, mp3Data)
            .then((result) => {
              if (result) {
                logger.info('MP3 file cached successfully in background', { cacheKey, filePath: result });
              } else {
                logger.warn('Failed to cache MP3 file in background', { cacheKey });
              }
            })
            .catch((error) => {
              logger.error('Error caching MP3 file in background', { cacheKey, error });
            });
            
        } catch (error) {
          logger.error('MP3 conversion failed during caching', { cacheKey, error });
        }
      }

      logger.info('Audio ready for playback from local temp file', { 
        cacheKey, 
        audioUrl: data.audioUrl,
        tempFile: data.tempFile 
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate story narration';
      
      logger.error('Story narration generation failed', {
        error: errorMessage,
        storyLength: storyText.length,
        characterId: options.characterId,
        voiceName: options.voiceName,
        userId: user.id
      });

      setNarrationState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      setErrorMessage(errorMessage);
    }
  }, [user, setErrorMessage]);

  const retryNarration = useCallback(() => {
    setNarrationState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  const clearNarration = useCallback(() => {
    setNarrationState({
      audioUrl: null,
      audioData: null,
      isLoading: false,
      error: null,
      voiceName: null,
      characterId: null,
      cached: false
    });
  }, []);

  const hasAudio = narrationState.audioUrl || narrationState.audioData;

  return {
    ...narrationState,
    generateNarration,
    retryNarration,
    clearNarration,
    hasAudio
  };
}; 