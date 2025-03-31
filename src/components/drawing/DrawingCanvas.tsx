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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [instructions, setInstructions] = useState<string>("");
  // In DrawingCanvas.tsx
console.log('Canvas image:', currentImage);
console.log('Canvas instruction:', currentInstruction);
 
  // // Mock instructions - in real implementation, these would come from the AI
  // const mockInstructions = [
  //   "Start by drawing a big circle for the head! 🎨",
  //   "Add two small circles for the eyes 👀",
  //   "Draw a happy smile curve ⭐",
  // ];

  // useEffect(() => {
  //   setInstructions(mockInstructions[stepNumber - 1] || "Keep going! You're doing great! 🌟");
  // }, [stepNumber]);

  console.log('DrawingCanvas props:', {
    currentImage: currentImage?.substring(0, 100) + '...', // Log first 100 chars of image data
    currentInstruction,
    stepNumber,
    totalSteps
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Canvas Container */}
      <div className="relative aspect-video mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-xl transform -rotate-1"></div>
        <div className="relative bg-white rounded-xl p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
          {currentImage && (
            <img
              src={`data:image/png;base64,${currentImage}`}
              alt={`Drawing step ${stepNumber}`}
              className="w-full h-full object-contain"
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
        className="text-center mb-6"
      >
        <h3 className="text-2xl font-bold text-purple-600 mb-2">
          Step {stepNumber+1} of {totalSteps}
        </h3>
        <p className="text-lg text-gray-700">{currentInstruction}</p>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onStepChange(stepNumber - 1)}
          disabled={stepNumber <= 0}
          className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => onStepChange(stepNumber + 1)}
          disabled={stepNumber >= totalSteps}
          className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stepNumber / (totalSteps-1)) * 100}%` }}
            className="h-full bg-purple-500"
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
} 