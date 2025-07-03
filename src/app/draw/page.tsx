"use client";

import { useEffect, useState } from "react";
import { SendHorizontal, Pencil, Eraser, Palette, Sparkles, File, Download, Share2, Trash2 } from "lucide-react";
import { motion } from 'framer-motion';
import { DrawingTemplate } from "@/types/drawing";
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionModal } from "@/components/ui/subscriptionmodal";
import { Loader } from "@/components/ui/loader";
import { LoadingButton } from "@/components/ui/loading-button";
import { WarningModal } from "@/components/ui/WarningModal";
import EditsCounter from "@/components/ui/edits-counter";
import { ShareModal } from "@/components/drawing/modals/ShareModal";
import { DownloadModal } from "@/components/drawing/modals/DownloadModal";
import { NewDrawingModal } from "@/components/drawing/modals/NewDrawingModal";
import { ErrorModal } from "@/components/drawing/modals/ErrorModal";
import { VersionHistory } from "@/components/drawing/VersionHistory";
import { HowItWorks } from "@/components/drawing/HowItWorks";
import { useDrawingOrchestrator } from "@/hooks/useDrawingOrchestrator";

export default function DrawPage() {
  const {
    prompt, setPrompt,
    isLoading,
    customApiKey, setCustomApiKey,
    showShareModal, setShowShareModal,
    showDownloadModal, setShowDownloadModal,
    showTemplates, setShowTemplates,
    isColorizing,
    hasColorized,
    drawingName, setDrawingName,
    editCount,
    maxEdits,
    isEditingName, setIsEditingName,
    isInFinalState,
    isPrompting,
    showStrokeOptions, setShowStrokeOptions,
    showWarningModal, setShowWarningModal,
    warningMessage,
    versionHistory,
    shareId, setShareId,
    showErrorModal, setShowErrorModal,
    showNewDrawingModal, setShowNewDrawingModal,
    showSubscriptionModal, setShowSubscriptionModal,
    canvasRef,
    activeTool, setActiveTool,
    pencilSize, setPencilSize,
    eraserSize, setEraserSize,
    hasCanvasContent,
    currentHistoryIndex,
    startDrawing,
    draw,
    stopDrawing,
    handleUndo,
    playPop,
    handleSubmit,
    handleColorize,
    handleSave,
    handleShare,
    handleDownload,
    handleDownloadSave,
    handleStartNewDrawing,
    clearCanvas,
    resetCanvasState,
    saveCanvasState,
  } = useDrawingOrchestrator();

  const { subscriptionStatus } = useSubscription();

  useEffect(() => {
    if (subscriptionStatus && !subscriptionStatus.isActive) {
      setShowSubscriptionModal(true);
    }
  }, [subscriptionStatus, setShowSubscriptionModal]);
  
  useEffect(() => {
    window.scrollTo({ top: 80, behavior: 'smooth' });
  }, []);

  const strokeSizes = [2, 4, 8] as const;
  const eraserSizes = [10, 20, 30] as const;
  const drawingTemplates: DrawingTemplate[] = [
    { name: 'Dragon', src: '/templates/dragon.png' },
    { name: 'Princess', src: '/templates/princess.png' },
    { name: 'Spaceship', src: '/templates/spaceship.png' },
    { name: 'Forest', src: '/templates/forest.png' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.stroke-size-option') && !target.closest('.menu-button')) {
        setShowStrokeOptions(false);
      }
    };

    if (showStrokeOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStrokeOptions, setShowStrokeOptions]);

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
    handleStartNewDrawing();
  };

  const canvasWrapperClass = `relative mb-6 ${isPrompting ? 'canvas-thinking' : ''}`;

  return (
    <div className="min-h-screen notebook-paper-bg">
      <style jsx>{`
        .button-press {
          position: relative;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
          transform-style: preserve-3d;
          transform: translateZ(0);
        }

        .button-press:active {
          transform: translateY(4px) scale(0.98);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .button-press:active::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.05);
          border-radius: inherit;
        }

        .button-press:disabled {
          transform: none;
          box-shadow: none;
        }

        .button-press:disabled:active {
          transform: none;
          box-shadow: none;
        }
      `}</style>

      {showSubscriptionModal && <SubscriptionModal message="You've used your free drawing! Subscribe now to unlock unlimited magical creations." onClose={() => setShowSubscriptionModal(false)} />}

      {showWarningModal && (
        <WarningModal
          isOpen={showWarningModal}
          onClose={handleWarningModalClose}
          message={warningMessage}
        />
      )}

      <main className="container mx-auto px-3 sm:px-6 py-5 sm:py-10 pb-32 max-w-5xl w-full min-h-screen flex flex-col gap-6 justify-center">
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              {isEditingName ? (
                <motion.input
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="text"
                  value={drawingName}
                  onChange={(e) => setDrawingName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                  className="px-3 py-1 border-4 border-[#FFD900] rounded-xl focus:outline-none focus:border-[#FFC800] text-2xl sm:text-3xl font-bold bg-white text-[#8549BA]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  autoFocus
                />
              ) : (
                <motion.div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setIsEditingName(true)}
                  whileHover={{ scale: 1.02 }}
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#8549BA] group-hover:text-[#7038A8]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                    {drawingName}
                  </h1>
                  <Pencil className="w-4 h-4 text-[#8549BA] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )}
              <motion.button
                onClick={handleStartNewDrawing}
                className="bg-[#8549BA] text-white hover:bg-[#7038A8] rounded-full p-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <line x1="12" x2="12" y1="8" y2="16" />
                  <line x1="8" x2="16" y1="12" y2="12" />
                </svg>
              </motion.button>
            </div>

            <menu className="flex items-center gap-2 relative">
              {!isInFinalState && !hasColorized && editCount < maxEdits && (
                <div className="mr-4">
                  <EditsCounter count={maxEdits - editCount} />
                </div>
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTool("pencil");
                    setShowStrokeOptions(!showStrokeOptions);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${activeTool === "pencil" ? "bg-[#58CC02] text-white" : "bg-white text-[#4B4B4B] border-2 border-[#E5E5E5]"}`}
                >
                  <Pencil className="w-5 h-5" />
                </button>

                {showStrokeOptions && activeTool === "pencil" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-full ml-2 bg-white rounded-xl shadow-lg p-2 flex flex-col gap-2 z-50 border-4 border-[#FFD900]"
                  >
                    {strokeSizes.map((size) => (
                      <button
                        key={size}
                        className={`stroke-size-option w-10 h-10 rounded-md flex items-center justify-center hover:bg-[#F7F7F7] ${pencilSize === size ? "bg-[#E5FFC2] ring-2 ring-[#58CC02]" : "bg-white"}`}
                        onClick={() => { setPencilSize(size); playPop(); setShowStrokeOptions(false); }}
                      >
                        <div className="bg-black rounded-full" style={{ width: Math.max(size * 2, 4), height: Math.max(size * 2, 4), opacity: pencilSize === size ? 1 : 0.6 }} />
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTool("eraser");
                    setShowStrokeOptions(!showStrokeOptions);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${activeTool === "eraser" ? "bg-[#FF9600] text-white" : "bg-white text-[#4B4B4B] border-2 border-[#E5E5E5]"}`}
                >
                  <Eraser className="w-5 h-5" />
                </button>

                {showStrokeOptions && activeTool === "eraser" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-full ml-2 bg-white rounded-xl shadow-lg p-2 flex flex-col gap-2 z-50 border-4 border-[#FFD900]"
                  >
                    {eraserSizes.map((size) => (
                      <button
                        key={size}
                        className={`stroke-size-option w-10 h-10 rounded-md flex items-center justify-center hover:bg-[#F7F7F7] ${eraserSize === size ? "bg-[#FFF9E5] ring-2 ring-[#FF9600]" : "bg-white"}`}
                        onClick={() => { setEraserSize(size); playPop(); setShowStrokeOptions(false); }}
                      >
                        <div className="bg-white border-2 border-black rounded-full" style={{ width: Math.max(size / 2, 4), height: Math.max(size / 2, 4), opacity: eraserSize === size ? 1 : 0.6 }} />
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <button
                type="button"
                onClick={handleUndo}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${currentHistoryIndex <= 0 ? "bg-gray-200 text-gray-400" : "bg-white text-[#1CB0F6] border-2 border-[#E5E5E5] hover:bg-[#F7F7F7]"}`}
                disabled={currentHistoryIndex <= 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 14L4 9l5-5" />
                  <path d="M4 9h14c3.314 0 6 2.686 6 6s-2.686 6-6 6H5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={clearCanvas}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white text-[#FF4B4B] border-2 border-[#E5E5E5] hover:bg-[#F7F7F7]"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </menu>
          </div>

          <motion.div className="mb-4">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="mb-2 px-4 py-2 bg-[#1CB0F6] text-white rounded-xl hover:bg-[#1BA0E1] font-bold border-b-2 border-[#1BA0E1] shadow-md flex items-center gap-2"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              <Sparkles className="w-5 h-5" />
              Drawing Ideas 💡
            </button>

            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow-md border-4 border-[#FFD900]"
              >
                {drawingTemplates.map((template) => (
                  <motion.button
                    key={template.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const img = new Image();
                      img.onload = () => {
                        const canvas = canvasRef.current;
                        if (!canvas) return;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        saveCanvasState("from template");
                      };
                      img.src = template.src;
                    }}
                    className="p-2 text-center hover:bg-[#FFF9E5] rounded-lg border-2 border-[#FFD900]"
                  >
                    <img src={template.src || "/placeholder.svg"} alt={template.name} className="w-full h-32 object-contain mb-2" />
                    <span className="text-sm font-bold text-[#4B4B4B]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                      {template.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {!isEditingName && (
            <>
              <div className={`${canvasWrapperClass} mb-4`}>
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full hover:cursor-crosshair sm:h-[60vh] h-[30vh] min-h-[320px] bg-white/90 touch-none border-8 border-[#FFD900] rounded-2xl shadow-lg"
                  style={{ touchAction: "none" }}
                />

                {isPrompting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/50 pointer-events-none flex items-center justify-center"
                  >
                    <Loader size="lg" />
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                {!isInFinalState && !hasColorized && editCount < maxEdits && (
                  <div className="relative w-full max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative">
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={hasCanvasContent ? "What should we add next?" : "Add your change..."}
                        className="w-full px-4 py-3 pr-12 rounded-full border-4 border-[#58CC02] focus:border-[#46A302] focus:outline-none shadow-md"
                        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#58CC02] hover:text-[#46A302] disabled:text-[#A9D98F]"
                      >
                        {isLoading ? (
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-[#58CC02] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                            <div className="w-1.5 h-1.5 bg-[#58CC02] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-1.5 h-1.5 bg-[#58CC02] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        ) : (
                          <SendHorizontal className="w-5 h-5" />
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {hasCanvasContent && (
                  <motion.div
                    className="flex justify-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {!hasColorized && (
                      <LoadingButton onClick={handleColorize} isLoading={isColorizing} loadingText="Colorizing..." className="px-4 py-2 bg-[#FF9600] hover:bg-[#E68600] text-white font-bold rounded-xl border-b-2 border-[#E68600] hover:border-[#CC7700] transition-all flex items-center gap-2 shadow-md" disabled={isLoading}>
                        <Palette className="w-5 h-5" />
                        Colorize
                      </LoadingButton>
                    )}

                    {editCount < maxEdits && !isInFinalState && (
                      <LoadingButton onClick={handleSave} isLoading={isLoading} loadingText="Saving..." className="px-4 py-2 bg-[#58CC02] hover:bg-[#46A302] text-white font-bold rounded-xl border-b-2 border-[#46A302] hover:border-[#378700] transition-all flex items-center gap-2 shadow-md" disabled={isColorizing}>
                        <File className="w-5 h-5" />
                        Save
                      </LoadingButton>
                    )}

                    <button onClick={handleDownload} className="px-4 py-2 bg-[#1CB0F6] hover:bg-[#1BA0E1] text-white font-bold rounded-xl border-b-2 border-[#1BA0E1] hover:border-[#1990CC] transition-all flex items-center gap-2 shadow-md" disabled={isLoading || isColorizing}>
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                    <button onClick={handleShare} className="px-4 py-2 bg-[#8549BA] hover:bg-[#7038A8] text-white font-bold rounded-xl border-b-2 border-[#7038A8] hover:border-[#5D2E8C] transition-all flex items-center gap-2 shadow-md" disabled={isLoading || isColorizing}>
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </motion.div>
                )}

                {(isInFinalState || hasColorized || editCount >= maxEdits) && (
                  <div className="text-sm text-[#4B4B4B] mt-2 text-center font-bold bg-[#FFF9E5] p-3 rounded-xl border-2 border-[#FFD900]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                    {hasColorized ? "Your colorized drawing is ready! You can download or share it." : editCount >= maxEdits ? "You've reached the maximum number of edits. You can still colorize, download, or share your drawing!" : "Drawing is complete! You can now colorize, download, or share your creation."}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {showErrorModal && <ErrorModal initialApiKey={customApiKey} onSubmit={setCustomApiKey} onClose={() => setShowErrorModal(false)} />}
        {showShareModal && <ShareModal shareId={shareId} onClose={() => { setShowShareModal(false); setShareId(null); }} />}
        {showDownloadModal && <DownloadModal initialFileName={drawingName} onSave={handleDownloadSave} onClose={() => setShowDownloadModal(false)} />}
        {showNewDrawingModal && <NewDrawingModal onConfirm={resetCanvasState} onClose={() => setShowNewDrawingModal(false)} />}
        
        {versionHistory.length > 0 && <VersionHistory versionHistory={versionHistory} />}
      </main>

      <HowItWorks />
    </div>
  );
}