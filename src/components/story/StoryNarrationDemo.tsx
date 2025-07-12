"use client";

import React, { useState } from 'react';
import { AnimalCharacterSelector } from './AnimalCharacterSelector';
import { StoryAudioPlayer } from './StoryAudioPlayer';
import { useStoryNarration } from '@/hooks/useStoryNarration';
import { useCharacterPreferences } from '@/hooks/useCharacterPreferences';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const DEMO_STORY = `Once upon a time, in a magical forest filled with colorful flowers and sparkling streams, there lived a brave little mouse named Whiskers. Every morning, Whiskers would wake up early to explore the wonderful world around him.

One sunny day, Whiskers discovered a mysterious golden key hidden beneath the roots of an old oak tree. "What could this key open?" he wondered aloud.

Following a winding path through the forest, Whiskers found a tiny door painted with rainbow colors. The golden key fit perfectly! Inside, he discovered a room filled with books that told stories of friendship, courage, and kindness.

From that day forward, Whiskers became the forest's storyteller, sharing wonderful tales with all his animal friends. And they all lived happily ever after.

The End.`;

export const StoryNarrationDemo: React.FC = () => {
  const { selectedCharacterId, selectCharacter, isLoading } = useCharacterPreferences();
  const { generateNarration, hasAudio, ...narrationState } = useStoryNarration();
  const [showDemo, setShowDemo] = useState(false);

  const handleCharacterSelect = (characterId: string) => {
    selectCharacter(characterId);
  };

  const handleGenerateDemo = async () => {
    if (!selectedCharacterId) return;
    
    setShowDemo(true);
    await generateNarration(DEMO_STORY, {
      characterId: selectedCharacterId
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#777777]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            Loading preferences...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Demo Header */}
      <div className="text-center">
        <h1 
          className="text-3xl font-bold text-[#4B4B4B] mb-4"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          🎭 Story Narration Demo
        </h1>
        <p 
          className="text-lg text-[#777777]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Test the character selector and audio player components
        </p>
      </div>

      {/* Character Selection */}
      <div className="bg-white rounded-2xl border-4 border-[#FFD900] p-6 shadow-lg">
        <AnimalCharacterSelector
          selectedCharacterId={selectedCharacterId || undefined}
          onCharacterSelect={handleCharacterSelect}
          className="mb-6"
        />

        {/* Generate Demo Button */}
        {selectedCharacterId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              onClick={handleGenerateDemo}
              disabled={narrationState.isLoading}
              className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 px-8 rounded-2xl text-lg border-b-4 border-[#46A302] hover:border-[#378700] transition-all"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              {narrationState.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Story...
                </div>
              ) : (
                '🎯 Generate Demo Story'
              )}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Demo Story Display */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border-4 border-[#8549BA] p-6 shadow-lg"
        >
          <h2 
            className="text-2xl font-bold text-[#8549BA] mb-4 text-center"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            📚 Demo Story: The Brave Little Mouse
          </h2>
          
          <div 
            className="text-sm text-[#4B4B4B] mb-6 leading-relaxed"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            {DEMO_STORY.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Audio Player */}
          <StoryAudioPlayer
            audioUrl={narrationState.audioUrl || undefined}
            audioData={narrationState.audioData || undefined}
            isLoading={narrationState.isLoading}
            error={narrationState.error || undefined}
            onRetry={() => handleGenerateDemo()}
          />
        </motion.div>
      )}

      {/* Component Info */}
      <div className="bg-[#FFF9E5] rounded-2xl border-4 border-[#FFD900] p-6">
        <h3 
          className="text-xl font-bold text-[#4B4B4B] mb-4"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          🔧 Component Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-[#58CC02] mb-2">Character Selector:</h4>
            <ul className="text-sm text-[#4B4B4B] space-y-1">
              <li>• 6 Animal characters with unique personalities</li>
              <li>• Voice preview functionality</li>
              <li>• Responsive grid layout</li>
              <li>• Local storage persistence</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#58CC02] mb-2">Audio Player:</h4>
            <ul className="text-sm text-[#4B4B4B] space-y-1">
              <li>• Play/pause/stop/restart controls</li>
              <li>• Interactive progress bar</li>
              <li>• Volume controls with slider</li>
              <li>• Kid-friendly design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 