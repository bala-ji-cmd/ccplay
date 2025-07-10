"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from 'next/navigation';
import useSound from 'use-sound';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useError } from '@/contexts/ErrorContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useDrawingState } from '@/hooks/useDrawingState';
import { useCanvas } from '@/hooks/useCanvas';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { generateRandomName, fireConfetti, dataURLtoFile } from "@/lib/utils";

// We need to import the actual confetti library to use it here. Let's assume it is globally available or imported elsewhere.
// To make this fully self-contained, we would need to `npm install canvas-confetti` and `import confetti from 'canvas-confetti';`
declare var confetti: any;

export const useDrawingOrchestrator = () => {
    const state = useDrawingState();
    const canvas = useCanvas();
    const { user } = useAuth();
    const router = useRouter();
    const { useCredits } = useSubscription();
    const { setErrorMessage } = useError();
    const [playPop] = useSound('/sounds/pop.mp3', { volume: 0.5 });

    // Voice recording integration
    const voiceRecording = useVoiceRecording();
    
    // Ref to track processed audioBlob to prevent infinite loop
    const processedAudioBlobRef = useRef<Blob | null>(null);

    const {
        setGeneratedImage,
        setIsLoading,
        setIsColorMode,
        setHasColorized,
        setDrawingName,
        setEditCount,
        setIsInFinalState,
        setShowNewDrawingModal,
        setIsPrompting,
        setIsSaved,
        setShareId,
        setShowShareModal,
        setVersionHistory,
        setPrompt,
        setShowDownloadModal,
        setWarningMessage,
        setShowWarningModal,
        setShowSubscriptionModal,
        savedDrawingId,
        setSavedDrawingId
    } = state;

    const {
        canvasRef,
        drawImageToCanvas,
        clearCanvas: clearCanvasFromHook,
        canvasHistory,
        currentHistoryIndex,
        saveCanvasHistory: addStateToHistory,
        setCanvasHistory,
        setCurrentHistoryIndex
    } = canvas;

    const performSave = async (imageDataUrl: string) => {
        if (!user) {
            router.push('/auth/login?redirectTo=/draw');
            return null;
        }

        const fileName = `${state.drawingName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
        const imageFile = dataURLtoFile(imageDataUrl, fileName);
        if (!imageFile) {
            throw new Error("Could not convert canvas drawing to an image file.");
        }

        const filePath = `${user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage
            .from('drawings')
            .upload(filePath, imageFile, { cacheControl: '3600', upsert: false, contentType: 'image/png' });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('drawings').getPublicUrl(filePath);
        if (!publicUrl) throw new Error("Could not retrieve public URL for the uploaded drawing.");

        const { data: drawingData, error: drawingError } = await supabase
            .from('user_images')
            .insert([{ user_id: user.id, image_data: publicUrl, drawing_name: state.drawingName }])
            .select('id')
            .single();

        if (drawingError) throw drawingError;

        if (!state.isSaved) {
            if (!(await useCredits(25, 'draw'))) {
                setShowSubscriptionModal(true);
                return null;
            }
        }

        setIsSaved(true);
        setSavedDrawingId(drawingData.id);
        fireConfetti();
        return drawingData;
    };

    // Synchronize generatedImage with canvas background
    useEffect(() => {
        if (state.generatedImage && canvas.backgroundImageRef.current) {
            const img = new window.Image();
            img.onload = () => {
                canvas.backgroundImageRef.current = img;
                drawImageToCanvas(false, state.isColorMode);
            };
            img.src = state.generatedImage;
        }
    }, [state.generatedImage, canvas.backgroundImageRef, drawImageToCanvas, state.isColorMode]);

    // Initialize drawing name
    useEffect(() => {
        if (!state.drawingName) {
            setDrawingName(generateRandomName());
        }
    }, [state.drawingName, setDrawingName]);

    // Voice recording handlers
    const handleVoiceStart = async () => {
        if (!voiceRecording.isSupported) {
            setErrorMessage('Voice recording is not supported on this device.');
            return;
        }

        try {
            // Reset processed audioBlob reference when starting new recording
            processedAudioBlobRef.current = null;
            playPop(); // Play sound feedback
            await voiceRecording.startRecording({
                silenceThreshold: 15,
                silenceTimeout: 3000, // 3 seconds for drawing prompts
                maxRecordingTime: 30000, // 30 seconds max
                enableSilenceDetection: true
            });
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to start voice recording.');
        }
    };

    const handleVoiceStop = () => {
        playPop(); // Play sound feedback
        voiceRecording.stopRecording();
    };

    const handleVoiceTranscription = useCallback(async (audioBlob: Blob) => {
        if (!audioBlob) return;

        voiceRecording.setProcessing(true);
        
        // Progressive processing stages for better UX
        const stages = ['uploading', 'analyzing', 'transcribing', 'finalizing'] as const;
        let currentStageIndex = 0;
        
        // Set initial stage
        voiceRecording.setProcessingStage(stages[currentStageIndex]);
        
        // Update processing stage every 800ms to show progress
        const stageInterval = setInterval(() => {
            if (currentStageIndex < stages.length - 1) {
                currentStageIndex++;
                voiceRecording.setProcessingStage(stages[currentStageIndex]);
            }
        }, 800);
        
        try {
            // Create FormData for the API call
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice-prompt.webm');
            if (state.customApiKey) {
                formData.append('customApiKey', state.customApiKey);
            }

            const response = await fetch('/api/voice-prompt', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success && data.data?.text) {
                // Update the prompt with transcribed text
                setPrompt(data.data.text);
                voiceRecording.setTranscribedText(data.data.text);
                playPop(); // Success sound
            } else {
                throw new Error(data.error || 'Failed to transcribe voice');
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Failed to process voice recording.');
        } finally {
            clearInterval(stageInterval);
            voiceRecording.setProcessing(false);
            voiceRecording.setProcessingStage(null);
        }
    }, [voiceRecording, state.customApiKey, setPrompt, setErrorMessage, playPop]);

    // Monitor voice recording completion - using ref to prevent infinite loop
    useEffect(() => {
        if (voiceRecording.audioBlob && 
            !voiceRecording.recording && 
            !voiceRecording.processing && 
            voiceRecording.audioBlob !== processedAudioBlobRef.current) {
            
            // Mark this audioBlob as processed to prevent re-processing
            processedAudioBlobRef.current = voiceRecording.audioBlob;
            handleVoiceTranscription(voiceRecording.audioBlob);
        }
    }, [voiceRecording.audioBlob, voiceRecording.recording, voiceRecording.processing, handleVoiceTranscription]);

    // Also reset the processed audioBlob reference when voice recording is cleared
    useEffect(() => {
        if (!voiceRecording.audioBlob) {
            processedAudioBlobRef.current = null;
        }
    }, [voiceRecording.audioBlob]);

    const saveCanvasState = (prompt?: string, type: 'drawn' | 'generated' | 'colorized' = 'drawn') => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas) return;

        if (type === 'colorized') {
            drawImageToCanvas(true, state.isColorMode);
        }

        const newState = currentCanvas.toDataURL();

        if (type === 'colorized' && !state.isColorMode) {
            drawImageToCanvas(false, state.isColorMode);
        }

        if (canvasHistory.length === 0 || newState !== canvasHistory[currentHistoryIndex]) {
            addStateToHistory(newState);
            setVersionHistory(prev => [...prev, { image: newState, prompt, type }].slice(-6));
        }
    };

    const handleColorize = async () => {
        if (state.isColorizing) return;
        playPop();
        state.setIsColorizing(true);
        state.setIsColorizingAnimation(true);

        try {
            const currentCanvas = canvasRef.current;
            if (!currentCanvas) return;
            const drawingData = currentCanvas.toDataURL("image/png").split(",")[1];
            const response = await fetch("/api/draw/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: "[COLORIZE] Apply bright and solid colors to this black and white line drawing...",
                    drawingData,
                    customApiKey: state.customApiKey
                }),
            });

            const data = await response.json();
            if (data.success && data.imageData) {
                const newImage = `data:image/png;base64,${data.imageData}`;
                await new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.onload = async () => {
                        try {
                            canvas.backgroundImageRef.current = img;
                            drawImageToCanvas(true, true); // Force color
                            const finalImageData = canvasRef.current!.toDataURL('image/png');
    
                            setGeneratedImage(newImage);
                            setHasColorized(true);
                            setIsColorMode(true);
                            setIsInFinalState(true);
                            saveCanvasState('colorized', 'colorized');
                            
                            // Automatically save the colorized drawing
                            await performSave(finalImageData);

                            fireConfetti();
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    };
                    img.onerror = () => reject(new Error("Failed to load colorized image."));
                    img.src = newImage;
                });
            } else {
                setErrorMessage(data.error || 'DEFAULT_ERROR');
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "DEFAULT_ERROR");
        } finally {
            state.setIsColorizing(false);
            state.setIsColorizingAnimation(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            router.push('/auth/login?redirectTo=/draw');
            return;
        }

        setIsLoading(true);
        try {
            const currentCanvas = canvasRef.current;
            if (!currentCanvas) return;

            let wasColorizedOnSave = false;
            if (!state.hasColorized) {
                await handleColorize();
                wasColorizedOnSave = true;
            }

            if (wasColorizedOnSave) {
                // The drawing was already saved by handleColorize, so we're done.
                return;
            }

            // If it was already colorized, save it directly.
            drawImageToCanvas(true, true);
            const imageDataUrl = currentCanvas.toDataURL('image/png');
            await performSave(imageDataUrl);

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "DEFAULT_ERROR");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!state.prompt.trim() || state.isLoading || state.isPrompting) return;

        setIsLoading(true);
        setIsPrompting(true);

        try {
            const currentCanvas = canvasRef.current;
            if (!currentCanvas) throw new Error("Canvas not initialized");
            const drawingData = currentCanvas.toDataURL("image/png").split(",")[1];
            const response = await fetch("/api/draw/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: state.prompt, drawingData, customApiKey: state.customApiKey }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to generate image');

            if (data.success && data.imageData) {
                const newImage = `data:image/png;base64,${data.imageData}`;
                setGeneratedImage(newImage);
                canvas.setHasCanvasContent(true);
                const newEditCount = state.editCount + 1;
                setEditCount(newEditCount);

                const img = new Image();
                img.onload = () => {
                    canvas.backgroundImageRef.current = img;
                    drawImageToCanvas(false, state.isColorMode);
                    saveCanvasState(state.prompt, 'generated');
                };
                img.src = newImage;

                setPrompt("");
                if (newEditCount >= state.maxEdits) {
                    fireConfetti();
                    setIsInFinalState(true);
                }
            } else {
                setErrorMessage(data.error || 'DEFAULT_ERROR');
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "DEFAULT_ERROR");
        } finally {
            setIsPrompting(false);
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        if (!user) {
            router.push('/auth/login?redirectTo=/draw');
            return;
        }

        if (!state.isSaved || !state.savedDrawingId) {
            // Now, we simply inform the user to save first.
            // This prevents the unexpected modal cascade.
            setWarningMessage("Please save your drawing before sharing.");
            setShowWarningModal(true);
            return;
        }

        setIsLoading(true);
        try {
            const currentCanvas = canvasRef.current;
            if (!currentCanvas) return;
            
            drawImageToCanvas(true, true);
            const imageDataUrl = currentCanvas.toDataURL('image/png');

            const drawingData = await performSave(imageDataUrl);
            if (drawingData) {
                setShareId(drawingData.id);
                setShowShareModal(true);
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "DEFAULT_ERROR");
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetCanvasState = () => {
        clearCanvasFromHook();
        setGeneratedImage(null);
        setCanvasHistory([]);
        setCurrentHistoryIndex(-1);
        setPrompt("");
        setEditCount(0);
        setHasColorized(false);
        setIsColorMode(false);
        canvas.setHasCanvasContent(false);
        setIsInFinalState(false);
        setDrawingName(generateRandomName());
        saveCanvasState();
    };

    const clearCanvas = () => {
        clearCanvasFromHook();
        setGeneratedImage(null);
        setIsColorMode(false);
        setHasColorized(false);
        setDrawingName(generateRandomName());
        setEditCount(0);
        setIsSaved(false);
        if (canvasRef.current) {
            saveCanvasState();
        }
    };

    const handleStartNewDrawing = () => {
        if (state.isInFinalState || state.hasColorized || state.editCount >= state.maxEdits) {
            resetCanvasState();
            return;
        }
        const hasDrawing = canvasHistory.length > 1 || state.generatedImage;
        if (hasDrawing) {
            setShowNewDrawingModal(true);
        } else {
            resetCanvasState();
        }
    };

    const handleDownload = () => {
        setShowDownloadModal(true);
    };

    const processDownloadWithFileName = (fileName: string) => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas) return;
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = currentCanvas.width;
            tempCanvas.height = currentCanvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(currentCanvas, 0, 0, currentCanvas.width, currentCanvas.height);

            const defaultFileName = state.drawingName.trim().replace(/\s+/g, '-').toLowerCase();
            const finalFileName = (fileName.trim() || defaultFileName) + '.png';

            const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = finalFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setWarningMessage(error instanceof Error ? error.message : "Failed to download drawing");
            setShowWarningModal(true);
        } finally {
            setShowDownloadModal(false);
        }
    };

    const handleDownloadSave = (fileName: string) => {
        setDrawingName(fileName);
        processDownloadWithFileName(fileName);
    };

    return {
        ...state,
        ...canvas,
        playPop,
        
        // Voice recording state and actions
        voiceRecording: {
            ...voiceRecording,
            onStartRecording: handleVoiceStart,
            onStopRecording: handleVoiceStop,
        },
        
        // Actions
        handleSubmit,
        handleColorize,
        handleSave,
        handleShare,
        handleDownload,
        handleDownloadSave,
        processDownloadWithFileName,
        handleStartNewDrawing,
        resetCanvasState,
        clearCanvas,
        saveCanvasState,
    };
}; 