"use client"

import { useSubscription } from "@/hooks/useSubscription";
import { useEffect, useState, useCallback } from "react";
import { SubscriptionModal } from "@/components/ui/subscriptionmodal";
import { WarningModal } from "@/components/ui/WarningModal";
import { DrawingCanvas } from "@/components/drawing/DrawingCanvas";
import { PromptBar } from "@/components/drawing/PromptBar";
import { StepGallery } from "@/components/drawing/StepGallery";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Twitter, MessageCircle, X, File } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Step {
  title?: string;
  step?: number;
  instruction?: string;
  image?: string;
}

export default function LearnPage() {
  const { subscriptionStatus, useCredits, refreshSubscription } = useSubscription();
  const { user } = useAuth();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [drawingSteps, setDrawingSteps] = useState<Step[]>([]);
  const [showPromptBar, setShowPromptBar] = useState(true);
  const [shareId, setShareId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (subscriptionStatus) {
      if ((subscriptionStatus.planType !== 'tier2' && subscriptionStatus.planType !== 'tier3') || !subscriptionStatus.isActive) {
        setShowSubscriptionModal(true);
      }
    }
  }, [subscriptionStatus]);

  useEffect(() => {
    if (drawingSteps.length > 0) {
      // console.log('Updated drawing steps:', drawingSteps);
      // console.log('Current step data:', drawingSteps[currentStep]);
    }
  }, [drawingSteps, currentStep]);

  useEffect(() => {
    if (drawingSteps.length > 0 && !isSaved) {
      setHasUnsavedChanges(true);
    }
  }, [drawingSteps, isSaved]);

  const handlePromptSubmit = async (inputPrompt: string) => {
    if (!user) {
      router.push('/auth/login?redirectTo=/learn');
      return;
    }

    try {
      // Check credits first before proceeding
      if (!(await useCredits(25, 'learn'))) {
        setShowSubscriptionModal(true);
        return;
      }

      // Only start generating after credits are successfully deducted
      setIsGenerating(true);
      setPrompt(inputPrompt);

      // console.log('Sending request with prompt:', inputPrompt);
      const response = await fetch('/api/learn/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      const data = await response.json();
      // console.log('Raw API Response:', data);

      if (!response.ok) {
        if (response.status === 400) {
          setWarningMessage(data.error);
          setShowWarningModal(true);
          return;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      if (data.success && Array.isArray(data.steps)) {
        // console.log('Received steps:', data.steps);
        setDrawingSteps(data.steps);
        setCurrentStep(0);
        setShowPromptBar(false);
        
        // Wait for state updates and DOM to reflect changes
        setTimeout(() => {
          const stepGalleryElement = document.querySelector('.step-gallery-section');
          if (stepGalleryElement) {
            stepGalleryElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      } else {
        // console.error('Failed to generate drawing steps:', data.error);
        setWarningMessage(data.error);
        setShowWarningModal(true);
      }
    } catch (error) {
      // console.error('Error generating drawing steps:', error);
      setWarningMessage('Server is busy. Please try again later!');
      setShowWarningModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewDrawing = () => {
    setIsSaved(false);
    setPrompt("");
    setDrawingSteps([]);
    setCurrentStep(0);
    setShowPromptBar(true);
  };

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
    handleNewDrawing(); // Reset the state and show prompt bar
  };

  const handleStepChange = useCallback((newStep: number) => {
    if (newStep >= 0 && newStep < drawingSteps.length) {
      setCurrentStep(newStep);
    }
  }, [drawingSteps.length]);

  const base64ToBlob = (base64Data: string): Blob => {
    // Remove data URL prefix if present
    const base64WithoutPrefix = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    // Convert base64 to binary
    const binaryString = window.atob(base64WithoutPrefix);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: 'image/png' });
  };

  const processDownload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!drawingSteps.length) return;

    try {
      setIsDownloading(true);
      const zip = new JSZip();
      const folder = zip.folder(downloadFileName);

      if (!folder) {
        throw new Error("Failed to create zip folder");
      }

      // Add each image to the zip file
      drawingSteps.forEach((step, index) => {
        try {
          if (!step.image) {
            // console.error(`No image found for step ${index + 1}`);
            return;
          }

          // Convert base64 directly to blob
          const blob = base64ToBlob(step.image);
          folder.file(`step-${index + 1}.png`, blob);

        } catch (error) {
          // console.error(`Error processing step ${index + 1}:`, error);
        }
      });

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${downloadFileName}.zip`);

    } catch (error) {
      // console.error('Error creating zip file:', error);
      setWarningMessage("Failed to create download file");
      setShowWarningModal(true);
    } finally {
      setIsDownloading(false);
      setShowDownloadModal(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push('/auth/login?redirectTo=/learn');
      return;
    }

    try {
      setIsGenerating(true);

      // Extract all images from drawing steps
      const images = drawingSteps.map(step => {
        if (!step.image) return null;
        return step.image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      }).filter(Boolean) as string[];

      if (images.length === 0) {
        throw new Error("No images to save");
      }

      // Save to supabase
      const { data, error } = await supabase
        .from('user_learnings')
        .insert([{
          user_id: user.id,
          drawing_name: prompt,
          images: images
        }])
        .select('id')
        .single();

      if (error) throw error;
      
      setShareId(data.id);
      // console.log('Drawing saved successfully!');

      setIsSaved(true);
      return data;

    } catch (error) {
      // console.error('Error saving drawing:', error);
      setWarningMessage(error instanceof Error ? error.message : "Failed to save drawing");
      setShowWarningModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!user) {
      router.push('/auth/login?redirectTo=/learn');
      return;
    }

    try {
      setIsGenerating(true);
      if(!isSaved){
        await handleSave();
      }

      // Set the shareId and show modal
      setShowShareModal(true);

      // Copy to clipboard
      const shareUrl = `${window.location.origin}/share/learn/${shareId}`;
      await navigator.clipboard.writeText(shareUrl);

    } catch (error) {
      // console.error('Error sharing drawing:', error);
      setWarningMessage(error instanceof Error ? error.message : "Failed to share drawing");
      setShowWarningModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Save first
      await handleSave();

      setDownloadFileName(prompt || 'my-drawing-steps');
      setShowDownloadModal(true);
    } catch (error) {
      // console.error('Error preparing download:', error);
      setWarningMessage(error instanceof Error ? error.message : "Failed to prepare download");
      setShowWarningModal(true);
    }
  };

  const ShareModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full border-8 border-[#FFD900]">
        <div className="flex justify-between items-start mb-4">
          <h3
            className="text-xl font-bold text-[#4B4B4B]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Share your creation
          </h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-[#FFF9E5] rounded-xl flex items-center gap-2 border-2 border-[#FFD900]">
            <input
              type="text"
              value={shareId ? `${window.location.origin}/share/learn/${shareId}` : ''}
              className="flex-1 bg-transparent outline-none"
              readOnly
            />
            <button
              onClick={async () => {
                if (shareId) {
                  await navigator.clipboard.writeText(`${window.location.origin}/share/learn/${shareId}`);
                }
              }}
              className="text-[#1CB0F6] hover:text-[#1BA0E1]"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={shareId ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/share/learn/${shareId}`)}&text=${encodeURIComponent('Check out my drawing steps!')}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 bg-[#1CB0F6] text-white rounded-xl hover:bg-opacity-90 font-bold border-b-2 border-[#1BA0E1]"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </a>
            <a
              href={shareId ? `https://wa.me/?text=${encodeURIComponent(`Check out my drawing steps! ${window.location.origin}/share/learn/${shareId}`)}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 bg-[#58CC02] text-white rounded-xl hover:bg-opacity-90 font-bold border-b-2 border-[#46A302]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
          
          <button
            onClick={() => {
              setShowShareModal(false);
              setShareId(null);
            }}
            className="w-full p-2 border-2 border-[#E5E5E5] rounded-xl hover:bg-[#F7F7F7] font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );

  const DownloadModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border-8 border-[#FFD900]">
        <div className="flex justify-between items-start mb-4">
          <h3 
            className="text-xl font-bold text-[#4B4B4B]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Save your artwork
          </h3>
          <button
            onClick={() => setShowDownloadModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={processDownload}>
          <input
            type="text"
            value={downloadFileName}
            onChange={(e) => setDownloadFileName(e.target.value)}
            placeholder="Enter file name"
            className="w-full px-4 py-3 border-4 border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1CB0F6] mb-4"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowDownloadModal(false)}
              className="px-4 py-2 text-sm border-2 border-[#E5E5E5] rounded-xl hover:bg-[#F7F7F7] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDownloading}
              className="px-4 py-2 text-sm bg-[#58CC02] text-white rounded-xl hover:bg-[#46A302] flex items-center gap-2 font-bold border-b-2 border-[#46A302]"
            >
              {isDownloading ? (
                <>
                  <Loader size="sm" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9E5] p-4">
      {showSubscriptionModal && (
        <SubscriptionModal message="This feature is not available for your plan. Please upgrade to a higher plan to use this feature." />
      )}

      {showWarningModal && (
        <WarningModal
          isOpen={showWarningModal}
          onClose={handleWarningModalClose}
          message={warningMessage}
        />
      )}

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-white/50 flex items-center justify-center z-50"
        >
          <Loader size="lg" />
        </motion.div>
      )}

      {showShareModal && <ShareModal />}
      {showDownloadModal && <DownloadModal />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-16 py-12 px-4 sm:px-6 lg:px-8"
      >
        {showPromptBar ? (
          <div className="flex flex-col items-center justify-center space-y-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center space-y-8 w-full max-w-4xl mx-auto pb-0"
            >
              <h1
                className="text-6xl md:text-7xl font-bold text-center text-[#58CC02] w-full px-4 leading-tight pb-3"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Let's Create Magic!{" "}
                <motion.span
                  initial={{ opacity: 0.5, scale: 0.8 }}
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-block text-8xl text-[#FFD900]"
                  style={{ backgroundColor: 'transparent' }}
                >
                  ✨
                </motion.span>
              </h1>
              <p 
                className="text-2xl text-[#8549BA] font-bold px-4 mt-8 pb-2"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Ready to turn your imagination into amazing drawings? 🎨
              </p>
            </motion.div>

            <motion.div
              className="w-full max-w-3xl px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <PromptBar
                onSubmit={handlePromptSubmit}
                isGenerating={isGenerating}
                onNewDrawing={handleNewDrawing}
              />
            </motion.div>

            <motion.div
              className="flex gap-4 flex-wrap justify-center px-4 w-full max-w-4xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {['Cute puppy', 'Magic unicorn', 'Happy dinosaur', 'Space rocket', 'Friendly dragon'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handlePromptSubmit(suggestion)}
                  className="px-6 py-3 rounded-2xl bg-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-[#8549BA] font-bold border-4 border-[#FFD900]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          <>
            <div className="max-w-6xl mx-auto space-y-6">
              <header className="bg-white rounded-2xl p-6 shadow-lg border-6 border-[#FFD900]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h1
                    className="text-4xl font-bold text-[#58CC02] flex-1 px-4"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    {prompt}
                  </h1>

                  <div className="flex items-center gap-4 flex-wrap justify-center">
                    <motion.button
                      onClick={handleNewDrawing}
                      className="flex items-center gap-2 px-4 py-3 bg-[#8549BA] text-white rounded-xl shadow-md hover:bg-[#6B3A9C] transition-all duration-200 font-bold border-b-4 border-[#6B3A9C]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Start a new drawing"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
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
                      <span>New Drawing</span>
                    </motion.button>

                    <motion.button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-3 bg-[#58CC02] text-white rounded-xl shadow-md hover:bg-[#46A302] transition-all duration-200 font-bold border-b-4 border-[#46A302]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Download Drawing"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      <Download className="w-5 h-5" />
                      <span>Save</span>
                    </motion.button>

                    <motion.button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-3 bg-[#1CB0F6] text-white rounded-xl shadow-md hover:bg-[#1BA0E1] transition-all duration-200 font-bold border-b-4 border-[#1BA0E1]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Share Drawing"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </motion.button>
                  </div>
                </div>
              </header>

              {drawingSteps.length > 0 && (
                <>
                  <div className="bg-white p-2 rounded-2xl shadow-lg border-6 border-[#FFD900] step-gallery-section">
                    <StepGallery
                      steps={drawingSteps}
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                    />
                  </div>

                  <div className="bg-white p-1 rounded-2xl shadow-lg border-6 border-[#FFD900]">
                    <DrawingCanvas
                      currentImage={drawingSteps[currentStep]?.image || ''}
                      currentInstruction={drawingSteps[currentStep]?.instruction || ''}
                      stepNumber={currentStep}
                      totalSteps={drawingSteps.length}
                      onStepChange={handleStepChange}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}