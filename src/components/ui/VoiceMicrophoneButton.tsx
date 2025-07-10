"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, Volume2, Clock } from "lucide-react";

interface VoiceMicrophoneButtonProps {
  recording: boolean;
  processing: boolean;
  error: string | null;
  audioLevel: number;
  duration: number; // Recording duration in seconds
  maxDuration?: number; // Maximum recording duration in seconds
  processingStage?: 'uploading' | 'analyzing' | 'transcribing' | 'finalizing' | null; // Progressive processing stages
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceMicrophoneButton({
  recording,
  processing,
  error,
  audioLevel,
  duration,
  maxDuration = 30,
  processingStage = null,
  onStartRecording,
  onStopRecording,
  disabled = false,
  className = "",
}: VoiceMicrophoneButtonProps) {
  const handleClick = () => {
    if (recording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  // Format duration for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if approaching time limit
  const isApproachingLimit = maxDuration && duration >= maxDuration * 0.8;
  const isNearLimit = maxDuration && duration >= maxDuration * 0.9;

  // Determine button state and styling
  const getButtonState = () => {
    if (processing) return "processing";
    if (recording) return "recording";
    if (error) return "error";
    return "idle";
  };

  const buttonState = getButtonState();

  // Enhanced button styling based on state
  const stateStyles = {
    idle: {
      background: "bg-gradient-to-br from-[#4A66E0] to-[#3A56D0]",
      hover: "hover:from-[#3A56D0] hover:to-[#2A46C0]",
      border: "border-[#3A56D0]",
      text: "text-white",
      icon: Mic,
      shadow: "shadow-lg shadow-blue-500/30",
    },
    recording: {
      background: isNearLimit 
        ? "bg-gradient-to-br from-[#FF8A00] to-[#FF6B00]"
        : isApproachingLimit 
        ? "bg-gradient-to-br from-[#FFB347] to-[#FF8A00]"
        : "bg-gradient-to-br from-[#FF4B4B] to-[#E63946]",
      hover: isNearLimit 
        ? "hover:from-[#FF9A00] hover:to-[#FF8A00]"
        : isApproachingLimit 
        ? "hover:from-[#FFC447] hover:to-[#FFB347]"
        : "hover:from-[#FF6B6B] hover:to-[#FF4B4B]",
      border: isNearLimit 
        ? "border-[#E55A00]"
        : isApproachingLimit 
        ? "border-[#E5A347]"
        : "border-[#E63946]",
      text: "text-white",
      icon: Volume2,
      shadow: isNearLimit 
        ? "shadow-lg shadow-orange-500/40"
        : isApproachingLimit 
        ? "shadow-lg shadow-yellow-500/40"
        : "shadow-lg shadow-red-500/40",
    },
    processing: {
      background: "bg-gradient-to-br from-[#FFD900] to-[#FFC800]",
      hover: "hover:from-[#FFC800] hover:to-[#FFB700]",
      border: "border-[#E5B800]",
      text: "text-[#4B4B4B]",
      icon: Loader2,
      shadow: "shadow-lg shadow-yellow-500/30",
    },
    error: {
      background: "bg-gradient-to-br from-[#FF4B4B] to-[#DC2626]",
      hover: "hover:from-[#FF6B6B] hover:to-[#FF4B4B]",
      border: "border-[#DC2626]",
      text: "text-white",
      icon: MicOff,
      shadow: "shadow-lg shadow-red-600/40",
    },
  };

  const currentStyle = stateStyles[buttonState];
  const IconComponent = currentStyle.icon;

  // Sound wave visualization component
  const SoundWaveVisualization = () => {
    const bars = Array.from({ length: 12 }, (_, i) => {
      const baseHeight = 8 + (i % 3) * 4; // Varied base heights
      const audioHeight = recording ? baseHeight + (audioLevel / 100) * 20 : baseHeight;
      const delay = i * 0.1;
      
      return (
        <motion.div
          key={i}
          className="w-1 bg-white/80 rounded-full"
          animate={{
            height: recording ? [baseHeight, audioHeight, baseHeight] : baseHeight,
            opacity: recording ? [0.6, 1, 0.6] : 0.4,
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: recording ? Infinity : 0,
            delay: delay,
            ease: "easeInOut",
          }}
          style={{ height: `${baseHeight}px` }}
        />
      );
    });

    return (
      <div className="flex items-center justify-center gap-1 h-8">
        {bars}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} data-testid={`${buttonState}-state`}>
      {/* Sound wave visualization - positioned above button when recording */}
      {recording && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <div className="bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-xl">
            <SoundWaveVisualization />
          </div>
        </motion.div>
      )}

      {/* Recording timer - positioned top-right when recording */}
      {recording && (
        <motion.div
          initial={{ opacity: 0, x: 10, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 10, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute -top-2 -right-2 z-20"
        >
          <div className={`
            flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg
            ${isNearLimit 
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white animate-pulse" 
              : isApproachingLimit 
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800" 
              : "bg-gradient-to-r from-red-500 to-red-600 text-white"}
          `}>
            <Clock className="w-3 h-3" />
            <span>{formatTime(duration)}</span>
          </div>
        </motion.div>
      )}

      {/* Time limit warning indicator */}
      {recording && maxDuration && duration >= maxDuration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
            ⏰ Time's up!
          </div>
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || processing}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center
          transition-all duration-300 ease-in-out border-b-4
          ${currentStyle.background} ${currentStyle.hover} ${currentStyle.border} 
          ${currentStyle.text} ${currentStyle.shadow}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          focus:outline-none focus:ring-4 focus:ring-blue-300/50
          ${isNearLimit ? "animate-pulse" : ""}
        `}
        aria-label={
          recording
            ? `Stop voice recording (${formatTime(duration)})`
            : processing
            ? "Processing voice..."
            : error
            ? "Try voice recording again"
            : "Start voice recording"
        }
        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
      >
        {/* Idle state - gentle breathing animation */}
        {buttonState === "idle" && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}

        {/* Recording state - enhanced pulsing rings with time-based intensity */}
        {buttonState === "recording" && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-full ${
                isNearLimit 
                  ? "bg-orange-500/40" 
                  : isApproachingLimit 
                  ? "bg-yellow-500/30" 
                  : "bg-red-500/30"
              }`}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ 
                duration: isNearLimit ? 0.8 : 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className={`absolute inset-0 rounded-full ${
                isNearLimit 
                  ? "bg-orange-500/30" 
                  : isApproachingLimit 
                  ? "bg-yellow-500/20" 
                  : "bg-red-500/20"
              }`}
              animate={{ scale: [1, 1.8, 1] }}
              transition={{ 
                duration: isNearLimit ? 0.8 : 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.3 
              }}
            />
            {/* Enhanced audio level visualization */}
            {audioLevel > 0 && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white/60"
                animate={{ scale: 1 + (audioLevel / 150) }}
                transition={{ duration: 0.1 }}
              />
            )}
          </>
        )}

        {/* Processing state - rotating gradient ring */}
        {buttonState === "processing" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #FFD900, #FFC800, #FFB700, #FFA500, #FFD900)",
              mask: "radial-gradient(circle at center, transparent 65%, black 70%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        )}

        {/* Error state - warning pulse */}
        {buttonState === "error" && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-600/40"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}

        {/* Icon with state-specific animations */}
        <IconComponent
          className={`
            w-7 h-7 relative z-10 transition-all duration-300
            ${processing ? "animate-spin" : ""}
            ${recording ? "animate-bounce" : ""}
            ${error ? "animate-pulse" : ""}
            ${buttonState === "idle" ? "drop-shadow-md" : ""}
          `}
        />
      </motion.button>

      {/* Enhanced status indicators with better animations */}
      <AnimatePresence mode="wait">
        {/* Recording indicator with timer */}
        {recording && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className={`
              px-3 py-1.5 rounded-full text-xs font-bold shadow-lg
              ${isNearLimit 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" 
                : isApproachingLimit 
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800" 
                : "bg-gradient-to-r from-red-500 to-red-600 text-white"}
            `}>
              <span className="inline-block animate-pulse">🎤</span> Recording... {formatTime(duration)}
            </div>
          </motion.div>
        )}

        {/* Progressive processing indicators */}
        {processing && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              {processingStage === 'uploading' && (
                <>
                  <span className="inline-block animate-bounce">📤</span> Uploading...
                </>
              )}
              {processingStage === 'analyzing' && (
                <>
                  <span className="inline-block animate-pulse">🔍</span> Analyzing...
                </>
              )}
              {processingStage === 'transcribing' && (
                <>
                  <span className="inline-block animate-spin">✨</span> Converting...
                </>
              )}
              {processingStage === 'finalizing' && (
                <>
                  <span className="inline-block animate-bounce">🎯</span> Almost done...
                </>
              )}
              {!processingStage && (
                <>
                  <span className="inline-block animate-spin">✨</span> Processing...
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Error indicator */}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg max-w-60 text-center">
              <span className="inline-block animate-bounce">⚠️</span> Try again
            </div>
          </motion.div>
        )}

        {/* Idle state hint */}
        {buttonState === "idle" && !disabled && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.5 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg opacity-75">
              <span className="inline-block">🎙️</span> Tap to speak
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 