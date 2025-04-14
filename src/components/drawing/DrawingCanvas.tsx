"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DrawingCanvasProps {
  currentImage: string;
  currentInstruction: string;
  stepNumber: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}

export function DrawingCanvas({ currentImage, currentInstruction, stepNumber, totalSteps, onStepChange }: DrawingCanvasProps) {
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && stepNumber > 0) {
        onStepChange(stepNumber - 1);
      } else if (e.key === 'ArrowRight' && stepNumber < totalSteps - 1) {
        onStepChange(stepNumber + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stepNumber, totalSteps, onStepChange]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-[6px] border-[#FFD900]">
      {/* Canvas Container */}
      <div className="relative w-full max-w-[960px] mx-auto" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 bg-[#FFF9E5] rounded-2xl transform -rotate-1"></div>
        <div className="relative bg-white rounded-2xl p-3 transform rotate-1 hover:rotate-0 transition-transform duration-300 h-full border-4 border-[#E5E5E5]">
          {currentImage && (
            <img
              src={`data:image/png;base64,${currentImage}`}
              alt={`Drawing step ${stepNumber + 1}`}
              className="w-full h-full object-contain"
              style={{ maxHeight: '540px' }}
              onError={(e) => console.error('Image loading error:', e)}
            />
          )}
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={stepNumber}
        className="text-center my-6"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-block bg-[#8549BA] text-white rounded-2xl px-6 py-3 mb-4 border-b-4 border-[#6B3A9C]"
        >
          <h3 
            className="text-xl font-bold"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Step {stepNumber + 1} of {totalSteps}
          </h3>
        </motion.div>
        <p 
          className="text-lg text-[#4B4B4B] font-medium px-4 py-2 bg-[#FFF9E5] rounded-2xl inline-block border-2 border-[#FFD900]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          {currentInstruction}
        </p>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-6 my-6">
        <motion.button
          onClick={() => onStepChange(stepNumber - 1)}
          disabled={stepNumber <= 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-4 rounded-full bg-[#1CB0F6] text-white hover:bg-[#1BA0E1] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-b-4 border-[#1BA0E1] disabled:border-b-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => onStepChange(stepNumber + 1)}
          disabled={stepNumber >= totalSteps - 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-4 rounded-full bg-[#58CC02] text-white hover:bg-[#46A302] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-b-4 border-[#46A302] disabled:border-b-0"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="h-4 bg-[#E5E5E5] rounded-full overflow-hidden border-2 border-[#DDDDDD]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((stepNumber + 1) / totalSteps) * 100}%` }}
            className="h-full bg-[#58CC02]"
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}