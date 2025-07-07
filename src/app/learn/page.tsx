"use client"

import { useState } from "react";
import { SubscriptionModal } from "@/components/ui/subscriptionmodal";
import { WarningModal } from "@/components/ui/WarningModal";
import { DrawingCanvas } from "@/components/drawing/DrawingCanvas";
import { PromptBar } from "@/components/drawing/PromptBar";
import { StepGallery } from "@/components/drawing/StepGallery";
import { motion } from "framer-motion";
import { Download, Share2 } from 'lucide-react';
import { Loader } from "@/components/ui/loader";
import { useLearnDrawing } from "@/hooks/useLearnDrawing";
import { LoadingOverlay } from "@/components/story/LoadingOverlay";
import { UnifiedModal } from "@/components/ui/UnifiedModal";

export default function LearnPage() {
    const {
        prompt,
        drawingSteps,
        currentStep,
        isGenerating,
        isDownloading,
        shareId,
        handlePromptSubmit,
        handleSave,
        handleShare,
        processDownload,
        handleNewDrawing,
        handleStepChange,
    } = useLearnDrawing();

    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadFileName, setDownloadFileName] = useState('');

    const onShare = async () => {
        await handleShare();
        setShowShareModal(true);
    };

    const onDownload = async () => {
        await handleSave();
        setDownloadFileName(prompt || 'my-drawing-steps');
        setShowDownloadModal(true);
    };

    const onProcessDownload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        processDownload(downloadFileName);
        setShowDownloadModal(false);
    };

    const shareUrl = shareId ? `${window.location.origin}/share/learn/${shareId}` : '';

    return (
        <div className="min-h-screen bg-[#FFF9E5] p-4">
            {showSubscriptionModal && (
                <SubscriptionModal 
                    message="This feature is not available for your plan. Please upgrade to a higher plan to use this feature." 
                    onClose={() => setShowSubscriptionModal(false)} 
                />
            )}

            <LoadingOverlay 
                isVisible={isGenerating} 
                message="Creating your drawing steps... We're generating 6 step-by-step images for you! 🎨"
            />

            <UnifiedModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                type="share"
                title="Share your creation"
                shareUrl={shareUrl}
                shareText="Check out my drawing steps!"
            />

            <UnifiedModal
                isOpen={showDownloadModal}
                onClose={() => setShowDownloadModal(false)}
                type="download"
                title="Save your artwork"
                fileName={downloadFileName}
                onFileNameChange={setDownloadFileName}
                onSubmit={onProcessDownload}
                isDownloading={isDownloading}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-16 py-12 px-4 sm:px-6 lg:px-8"
            >
                {drawingSteps.length === 0 ? (
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
                                            onClick={onDownload}
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
                                            onClick={onShare}
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
                                            setCurrentStep={handleStepChange}
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