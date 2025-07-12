"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { animalCharacterVoices } from '@/lib/audioUtils';
import { useAuth } from '@/contexts/AuthContext';

interface AnimalCharacterSelectorProps {
  selectedCharacterId?: string;
  onCharacterSelect: (characterId: string) => void;
  onPreview?: (characterId: string) => void;
  className?: string;
  disabled?: boolean;
}

interface CharacterCardProps {
  characterId: string;
  character: any;
  isSelected: boolean;
  isPreviewPlaying: boolean;
  onSelect: () => void;
  onPreview: () => void;
  disabled?: boolean;
}

// Character avatar mapping with emojis
const characterAvatars = {
  'friendly-bear': '🐻',
  'cheerful-bunny': '🐰',
  'wise-owl': '🦉',
  'playful-puppy': '🐶',
  'gentle-elephant': '🐘',
  'curious-cat': '🐱'
};

// Character background colors
const characterColors = {
  'friendly-bear': 'from-amber-100 to-orange-200',
  'cheerful-bunny': 'from-pink-100 to-purple-200',
  'wise-owl': 'from-blue-100 to-indigo-200',
  'playful-puppy': 'from-green-100 to-emerald-200',
  'gentle-elephant': 'from-gray-100 to-slate-200',
  'curious-cat': 'from-yellow-100 to-amber-200'
};

const CharacterCard: React.FC<CharacterCardProps> = ({
  characterId,
  character,
  isSelected,
  isPreviewPlaying,
  onSelect,
  onPreview,
  disabled = false
}) => {
  const avatar = characterAvatars[characterId as keyof typeof characterAvatars];
  const bgColor = characterColors[characterId as keyof typeof characterColors];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`
        relative bg-white rounded-2xl border-4 cursor-pointer transition-all duration-200 shadow-lg
        ${isSelected 
          ? 'border-[#58CC02] bg-[#E5FFC2] shadow-xl' 
          : 'border-[#FFD900] hover:border-[#58CC02] hover:shadow-xl'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={!disabled ? onSelect : undefined}
    >
      {/* Selected Badge */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-[#58CC02] rounded-full flex items-center justify-center shadow-md"
          >
            <Star className="w-3 h-3 text-white fill-current" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Character Avatar */}
      <div className={`relative p-6 bg-gradient-to-br ${bgColor} rounded-t-xl`}>
        <div className="text-center">
          <div className="text-6xl mb-2 animate-bounce">{avatar}</div>
          <h3 
            className="text-xl font-bold text-[#4B4B4B] capitalize"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            {characterId.replace('-', ' ')}
          </h3>
        </div>
      </div>
      
      {/* Character Info */}
      <div className="p-4">
        <p 
          className="text-sm text-[#8549BA] font-semibold mb-2"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          {character.personality}
        </p>
        <p 
          className="text-xs text-[#777777] mb-4 line-clamp-2"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          {character.description}
        </p>
        
        {/* Preview Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onPreview();
          }}
          disabled={disabled}
          className={`
            w-full text-xs py-2 px-3 rounded-xl font-bold transition-all
            ${isPreviewPlaying 
              ? 'bg-[#FF4B4B] hover:bg-[#E63946] text-white border-b-2 border-[#E63946]' 
              : 'bg-[#1CB0F6] hover:bg-[#1BA0E1] text-white border-b-2 border-[#1BA0E1]'
            }
          `}
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          <div className="flex items-center justify-center gap-2">
            {isPreviewPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            {isPreviewPlaying ? 'Stop Preview' : 'Preview Voice'}
          </div>
        </Button>
      </div>
    </motion.div>
  );
};

export const AnimalCharacterSelector: React.FC<AnimalCharacterSelectorProps> = ({
  selectedCharacterId,
  onCharacterSelect,
  onPreview,
  className = '',
  disabled = false
}) => {
  const { user } = useAuth(); // Add authentication check like drawing flow
  const [previewingCharacter, setPreviewingCharacter] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  // Character entries
  const characterEntries = Object.entries(animalCharacterVoices);

  // Handle character selection
  const handleCharacterSelect = (characterId: string) => {
    if (disabled) return;
    
    // Stop any playing preview
    if (previewAudio) {
      previewAudio.pause();
      setPreviewingCharacter(null);
    }
    
    onCharacterSelect(characterId);
  };

  // Handle character preview
  const handleCharacterPreview = async (characterId: string) => {
    if (disabled) return;
    
    // Check authentication first (like drawing flow)
    if (!user) {
      console.warn('User not authenticated, skipping character preview');
      return;
    }
    
    // Stop current preview if playing
    if (previewAudio) {
      previewAudio.pause();
      setPreviewingCharacter(null);
      setPreviewAudio(null);
    }
    
    // If clicking the same character that's already playing, just stop
    if (previewingCharacter === characterId) {
      return;
    }
    
    try {
      setPreviewingCharacter(characterId);
      
      // Call the preview callback if provided
      if (onPreview) {
        onPreview(characterId);
      }
      
      // Generate preview audio (short sample)
      const character = animalCharacterVoices[characterId as keyof typeof animalCharacterVoices];
      const previewText = `Hello! I'm your ${character.personality.toLowerCase()}. Let me tell you wonderful stories!`;
      
      const response = await fetch('/api/story/narrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyText: previewText,
          characterId: characterId
        }),
      });
      
      const data = await response.json();
      
      if (data.success && (data.audioUrl || data.audioData)) {
        const audio = new Audio();
        
        // Handle both URL and data formats
        if (data.audioUrl) {
          // Use cached URL directly - much more efficient
          audio.src = data.audioUrl;
        } else if (data.audioData) {
          // Convert base64 data to blob URL for better performance
          try {
            const audioBlob = new Blob([Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))], { type: 'audio/wav' });
            audio.src = URL.createObjectURL(audioBlob);
          } catch (conversionError) {
            // Fallback to data URL
            audio.src = `data:audio/wav;base64,${data.audioData}`;
          }
        }
        
        // Setup audio event listeners
        audio.addEventListener('ended', () => {
          setPreviewingCharacter(null);
          setPreviewAudio(null);
        });
        
        audio.addEventListener('error', (e) => {
          console.error('Audio preview error:', e);
          setPreviewingCharacter(null);
          setPreviewAudio(null);
        });
        
        setPreviewAudio(audio);
        await audio.play();
      } else {
        throw new Error(data.error || 'Failed to generate preview audio');
      }
    } catch (error) {
      console.error('Preview error:', error);
      setPreviewingCharacter(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
        setPreviewAudio(null);
      }
    };
  }, [previewAudio]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 
          className="text-2xl font-bold text-[#4B4B4B] mb-2"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          🎭 Choose Your Story Narrator
        </h2>
        <p 
          className="text-lg text-[#777777]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Pick a friendly animal character to tell your story!
        </p>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {characterEntries.map(([characterId, character]) => (
          <CharacterCard
            key={characterId}
            characterId={characterId}
            character={character}
            isSelected={selectedCharacterId === characterId}
            isPreviewPlaying={previewingCharacter === characterId}
            onSelect={() => handleCharacterSelect(characterId)}
            onPreview={() => handleCharacterPreview(characterId)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Selected Character Info */}
      <AnimatePresence>
        {selectedCharacterId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-[#E5FFC2] rounded-2xl border-4 border-[#58CC02]"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">
                {characterAvatars[selectedCharacterId as keyof typeof characterAvatars]}
              </div>
              <h3 
                className="text-xl font-bold text-[#58CC02] mb-2 capitalize"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                {selectedCharacterId.replace('-', ' ')} is ready to tell your story!
              </h3>
              <p 
                className="text-sm text-[#4B4B4B]"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                {animalCharacterVoices[selectedCharacterId as keyof typeof animalCharacterVoices]?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 