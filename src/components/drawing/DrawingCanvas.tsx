"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-100">
      {/* Canvas Container */}
      <div className="relative w-full max-w-[960px] mx-auto" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-xl transform -rotate-1"></div>
        <div className="relative bg-white rounded-xl p-3 transform rotate-1 hover:rotate-0 transition-transform duration-300 h-full">
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
        className="text-center my-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-5 py-2 mb-3"
        >
          <h3 className="text-xl font-bold">
            Step {stepNumber + 1} of {totalSteps}
          </h3>
        </motion.div>
        <p className="text-lg text-gray-700 font-medium">{currentInstruction}</p>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 my-4">
        <motion.button
          onClick={() => onStepChange(stepNumber - 1)}
          disabled={stepNumber <= 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => onStepChange(stepNumber + 1)}
          disabled={stepNumber >= totalSteps - 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((stepNumber + 1) / totalSteps) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
} 