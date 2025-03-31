"use client"

import { useSubscription } from "@/hooks/useSubscription";
import { useEffect, useState, useCallback } from "react";
import { SubscriptionModal } from "@/components/ui/subscriptionmodal";
import { DrawingCanvas } from "@/components/drawing/DrawingCanvas";
import { PromptBar } from "@/components/drawing/PromptBar";
import { StepGallery } from "@/components/drawing/StepGallery";
// import { ShareDownload } from "@/components/drawing/ShareDownload";
import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";

interface Step {
  title?: string;
  step?: number;
  instruction?: string;
  image?: string;
}

export default function LearnPage() {
  const { subscriptionStatus } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [drawingSteps, setDrawingSteps] = useState<Step[]>([]);
  const [showPromptBar, setShowPromptBar] = useState(true);

  useEffect(() => {
    if (subscriptionStatus) {
      if ((subscriptionStatus.planType !== 'tier2' && subscriptionStatus.planType !== 'tier3') || !subscriptionStatus.isActive) {
        setShowSubscriptionModal(true);
      }
    }
  }, [subscriptionStatus]);

  useEffect(() => {
    if (drawingSteps.length > 0) {
      console.log('Updated drawing steps:', drawingSteps);
      console.log('Current step data:', drawingSteps[currentStep]);
    }
  }, [drawingSteps, currentStep]);

  const handlePromptSubmit = async (inputPrompt: string) => {
    setIsGenerating(true);
    setPrompt(inputPrompt);
    
    try {
      console.log('Sending request with prompt:', inputPrompt);
      const response = await fetch('/api/learn/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });
      
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw API Response:', data);

      if (data.success && Array.isArray(data.steps)) {
        console.log('Received steps:', data.steps);
        setDrawingSteps(data.steps);
        setCurrentStep(0);
      } else {
        console.error('Failed to generate drawing steps:', data.error);
        // Show error message to user
      }
    } catch (error) {
      console.error('Error generating drawing steps:', error);
      // Show error message to user
    } finally {
      setIsGenerating(false);
      setShowPromptBar(false);
      window.scrollTo({
        top: 160,
        behavior: 'smooth'
      });
    }
  };

  const handleNewDrawing = () => {
    setPrompt("");
    setDrawingSteps([]);
    setCurrentStep(0);
    setShowPromptBar(true);
  };

  const handleStepChange = useCallback((newStep: number) => {
    if (newStep >= 0 && newStep < drawingSteps.length) {
      setCurrentStep(newStep);
    }
  }, [drawingSteps.length]);

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-4">
      {showSubscriptionModal && (
        <SubscriptionModal message="This feature is not available for your plan. Please upgrade to a higher plan to use this feature." />
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {showPromptBar ? (
          <>
            <header className="flex justify-between items-center">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h1 className="text-3xl font-bold text-center text-purple-600">Learn to Draw! 🎨</h1>
            </header>

            <PromptBar 
              onSubmit={handlePromptSubmit}
              isGenerating={isGenerating}
              onNewDrawing={handleNewDrawing}
            />
          </>
        ) : (
          <header className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 
                  className="text-2xl sm:text-3xl font-bold text-purple-600"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                 {prompt}
                </h1>
                
                <motion.button
                  onClick={handleNewDrawing}
                  className="menu-button new-drawing bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full p-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Start a new drawing"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="12" x2="12" y1="8" y2="16" />
                    <line x1="8" x2="16" y1="12" y2="12" />
                  </svg>
                </motion.button>
              </div>

              
            </div>

            
          </header>
        )}

        {drawingSteps.length > 0 && (  
          console.log('Drawing steps:', drawingSteps),
          <>
            <StepGallery
              steps={drawingSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />

            <DrawingCanvas
              currentImage={drawingSteps[currentStep]?.image || ''}
              currentInstruction={drawingSteps[currentStep]?.instruction || ''}
              stepNumber={currentStep}
              totalSteps={drawingSteps.length} 
              onStepChange={handleStepChange}
            />
          </>
        )}
        {!showPromptBar && (
          <div className="flex gap-2 justify-center">
          <button
            onClick={handleDownload}
            className="action-button bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full px-4 py-2 flex items-center gap-2 transition-colors"
            disabled={isGenerating}
          >
            <Download className="w-5 h-5" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="action-button bg-purple-100 text-purple-600 hover:bg-purple-200 rounded-full px-4 py-2 flex items-center gap-2 transition-colors"
            disabled={isGenerating}
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
    </div>
        )}
      </motion.div>
      
    </div>
  );
} 