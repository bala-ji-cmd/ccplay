"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Loader2,
  AlertCircle,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { Mp3Encoder } from '@breezystack/lamejs';

// Convert PCM data to WAV format for browser playback
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

interface StoryAudioPlayerProps {
  audioUrl?: string;
  audioData?: string; // Base64 encoded audio data
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}

export function StoryAudioPlayer({ 
  audioUrl, 
  audioData, 
  isLoading = false, 
  error, 
  onRetry,
  className = ''
}: StoryAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    isLoading: false,
    error: null
  });

  // Format time display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize audio element when audio data is available
  useEffect(() => {
    if (audioRef.current && (audioUrl || audioData)) {
      const audio = audioRef.current;
      
      // Set audio source with better error handling
      try {
        if (audioData) {
          console.log('Setting audio data, length:', audioData.length);
          // The Gemini TTS API returns PCM audio data (24kHz, 16-bit, mono)
          // We need to convert it to WAV format for browser playback
          try {
            // Decode base64 to get PCM data
            const pcmData = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
            console.log('PCM data length:', pcmData.length);
            
            // Convert PCM to WAV
            const wavData = pcmToWav(pcmData, 24000, 1, 16);
            const audioBlob = new Blob([wavData], { type: 'audio/wav' });
            const audioObjectUrl = URL.createObjectURL(audioBlob);
            console.log('Created WAV blob URL:', audioObjectUrl);
            audio.src = audioObjectUrl;
            
            // Clean up URL when component unmounts
            return () => {
              URL.revokeObjectURL(audioObjectUrl);
            };
          } catch (conversionError) {
            console.warn('PCM to WAV conversion failed:', conversionError);
            // Fallback to direct data URL (may not work in all browsers)
            audio.src = `data:audio/wav;base64,${audioData}`;
          }
        } else if (audioUrl) {
          console.log('Setting audio URL:', audioUrl);
          audio.src = audioUrl;
        }
      } catch (error) {
        console.error('Error setting audio source:', error);
        setAudioState(prev => ({
          ...prev,
          error: 'Failed to load audio format'
        }));
        return;
      }

      // Audio event listeners with enhanced debugging
      const handleLoadedMetadata = () => {
        console.log('Audio metadata loaded:', {
          duration: audio.duration,
          readyState: audio.readyState
        });
        setAudioState(prev => ({
          ...prev,
          duration: audio.duration,
          isLoading: false,
          error: null
        }));
      };

      const handleTimeUpdate = () => {
        setAudioState(prev => ({
          ...prev,
          currentTime: audio.currentTime
        }));
      };

      const handleEnded = () => {
        console.log('Audio ended');
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0
        }));
      };

      const handleError = (event: Event) => {
        const audioError = audio.error;
        console.error('Audio error event:', {
          error: audioError,
          code: audioError?.code,
          message: audioError?.message,
          src: audio.src
        });
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          isLoading: false,
          error: `Audio error: ${audioError?.message || 'Unknown error'}`
        }));
      };

      const handleLoadStart = () => {
        console.log('Audio load started');
        setAudioState(prev => ({
          ...prev,
          isLoading: true,
          error: null
        }));
      };

      const handleCanPlay = () => {
        console.log('Audio can play');
        setAudioState(prev => ({
          ...prev,
          isLoading: false
        }));
      };

      const handleLoadedData = () => {
        console.log('Audio data loaded');
      };

      const handleCanPlayThrough = () => {
        console.log('Audio can play through');
      };

      // Add event listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);

      // Set initial volume
      audio.volume = audioState.volume;

      // Cleanup
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, [audioUrl, audioData]);

  // Handle play/pause toggle
  const handlePlayPause = async () => {
    if (!audioRef.current) {
      console.error('Audio ref not available');
      return;
    }

    const audio = audioRef.current;
    console.log('Audio element state:', {
      src: audio.src,
      readyState: audio.readyState,
      duration: audio.duration,
      currentTime: audio.currentTime,
      paused: audio.paused,
      ended: audio.ended,
      error: audio.error
    });

    try {
      if (audioState.isPlaying) {
        console.log('Pausing audio');
        audio.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      } else {
        console.log('Attempting to play audio');
        
        // Check if audio is ready
        if (audio.readyState < 2) {
          console.log('Audio not ready, waiting for load...');
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Audio load timeout'));
            }, 10000);
            
            audio.addEventListener('canplay', () => {
              clearTimeout(timeout);
              resolve(true);
            }, { once: true });
            
            audio.addEventListener('error', () => {
              clearTimeout(timeout);
              reject(new Error('Audio load error'));
            }, { once: true });
          });
        }
        
        console.log('Playing audio...');
        await audio.play();
        console.log('Audio playing successfully');
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Playback error:', error);
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        error: `Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  // Handle stop
  const handleStop = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0
    }));
  };

  // Handle restart
  const handleRestart = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    setAudioState(prev => ({ ...prev, currentTime: 0 }));
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    
    const volume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = volume;
    setAudioState(prev => ({
      ...prev,
      volume,
      isMuted: volume === 0
    }));
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    
    if (audioState.isMuted) {
      audioRef.current.volume = audioState.volume;
      setAudioState(prev => ({ ...prev, isMuted: false }));
    } else {
      audioRef.current.volume = 0;
      setAudioState(prev => ({ ...prev, isMuted: true }));
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || audioState.duration === 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * audioState.duration;
    
    audioRef.current.currentTime = newTime;
    setAudioState(prev => ({ ...prev, currentTime: newTime }));
  };

  // Handle download
  const handleDownload = () => {
    if (!audioData) {
      console.error('No audio data available for download');
      return;
    }

    try {
      console.log('Starting MP3 download, audio data length:', audioData.length);
      
      // Convert PCM to WAV first (for MP3 encoder)
      const pcmData = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
      console.log('PCM data length:', pcmData.length);
      
      const wavData = pcmToWav(pcmData, 24000, 1, 16);
      console.log('WAV data length:', wavData.byteLength);
      
      // Convert WAV to MP3 for smaller file size
      const mp3Data = wavToMp3(wavData, 24000);
      console.log('MP3 data length:', mp3Data.byteLength);
      
      // Calculate compression ratio
      const compressionRatio = ((wavData.byteLength - mp3Data.byteLength) / wavData.byteLength * 100).toFixed(1);
      console.log(`File size reduced by ${compressionRatio}% (WAV: ${(wavData.byteLength / 1024 / 1024).toFixed(2)}MB → MP3: ${(mp3Data.byteLength / 1024 / 1024).toFixed(2)}MB)`);
      
      const audioBlob = new Blob([mp3Data], { type: 'audio/mp3' });
      
      // Create download link
      const downloadUrl = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `story-narration-${new Date().toISOString().split('T')[0]}.mp3`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL
      URL.revokeObjectURL(downloadUrl);
      
      console.log('MP3 download completed successfully');
    } catch (error) {
      console.error('MP3 download failed:', error);
    }
  };

  // Calculate progress percentage
  const progressPercentage = audioState.duration > 0 
    ? (audioState.currentTime / audioState.duration) * 100 
    : 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl border-4 border-[#FFD900] p-6 shadow-lg ${className}`}>
        <div className="flex items-center justify-center space-x-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#58CC02]" />
          <span 
            className="text-lg font-bold text-[#4B4B4B]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Preparing your story narration...
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || audioState.error) {
    return (
      <div className={`bg-white rounded-2xl border-4 border-[#FF4B4B] p-6 shadow-lg ${className}`}>
        <div className="flex items-center justify-center space-x-4">
          <AlertCircle className="w-8 h-8 text-[#FF4B4B]" />
          <div className="flex-1">
            <span 
              className="text-lg font-bold text-[#FF4B4B] block"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              Oops! Audio not available
            </span>
            <span 
              className="text-sm text-[#777777]"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              {error || audioState.error}
            </span>
          </div>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-2 px-4 rounded-xl text-sm border-b-2 border-[#46A302]"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show empty state if no audio
  if (!audioUrl && !audioData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border-4 border-[#FFD900] p-6 shadow-lg ${className}`}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-xl font-bold text-[#58CC02] flex items-center gap-2"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          <Volume2 className="w-6 h-6" />
          Listen to Your Story
        </h3>
        <div className="flex items-center gap-3">
          <div 
            className="text-sm text-[#777777]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
          </div>
          {audioData && (
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-[#FFD900] hover:bg-[#E6C500] text-[#4B4B4B] rounded-full flex items-center justify-center shadow-lg border-b-2 border-[#E6C500] transition-all"
              aria-label="Download audio"
              title="Download story narration"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div
          className="w-full h-3 bg-[#E5E5E5] rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-label={`Story progress: ${Math.round(progressPercentage)}%`}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#58CC02] to-[#46A302] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {/* Restart Button */}
        <motion.button
          onClick={handleRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-[#8549BA] hover:bg-[#7339AA] text-white rounded-full flex items-center justify-center shadow-lg border-b-2 border-[#7339AA] transition-all"
          aria-label="Restart story"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        {/* Play/Pause Button */}
        <motion.button
          onClick={handlePlayPause}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={audioState.isLoading}
          className="w-16 h-16 bg-[#58CC02] hover:bg-[#46A302] text-white rounded-full flex items-center justify-center shadow-lg border-b-4 border-[#46A302] transition-all disabled:opacity-50"
          aria-label={audioState.isPlaying ? "Pause story" : "Play story"}
        >
          <AnimatePresence mode="wait">
            {audioState.isLoading ? (
              <Loader2 key="loading" className="w-8 h-8 animate-spin" />
            ) : audioState.isPlaying ? (
              <Pause key="pause" className="w-8 h-8 ml-1" />
            ) : (
              <Play key="play" className="w-8 h-8 ml-1" />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Stop Button */}
        <motion.button
          onClick={handleStop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-[#FF4B4B] hover:bg-[#E63946] text-white rounded-full flex items-center justify-center shadow-lg border-b-2 border-[#E63946] transition-all"
          aria-label="Stop story"
        >
          <Square className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Volume Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleMuteToggle}
          className="text-[#777777] hover:text-[#4B4B4B] transition-colors"
          aria-label={audioState.isMuted ? "Unmute" : "Mute"}
        >
          {audioState.isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        
        <div className="flex-1 max-w-32">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioState.isMuted ? 0 : audioState.volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#E5E5E5] rounded-lg appearance-none cursor-pointer volume-slider"
            aria-label="Volume control"
          />
        </div>
        
        <span 
          className="text-sm text-[#777777] w-8"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          {Math.round((audioState.isMuted ? 0 : audioState.volume) * 100)}%
        </span>
      </div>

      {/* Custom styles for volume slider */}
      <style jsx>{`
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #58CC02;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #58CC02;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .volume-slider::-webkit-slider-track {
          background: #E5E5E5;
          border-radius: 4px;
        }
        
        .volume-slider::-moz-range-track {
          background: #E5E5E5;
          border-radius: 4px;
        }
      `}</style>
    </motion.div>
  );
} 