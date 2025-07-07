"use client"
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from '@/lib/supabase';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useError } from '@/contexts/ErrorContext';

interface Step {
  title?: string;
  step?: number;
  instruction?: string;
  image?: string;
}

const base64ToBlob = (base64Data: string): Blob => {
    const base64WithoutPrefix = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const binaryString = window.atob(base64WithoutPrefix);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'image/png' });
};

export const useLearnDrawing = () => {
    const { subscriptionStatus, useCredits } = useSubscription();
    const { user } = useAuth();
    const router = useRouter();
    const { setErrorMessage } = useError();

    const [prompt, setPrompt] = useState("");
    const [drawingSteps, setDrawingSteps] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [shareId, setShareId] = useState<string | null>(null);

    useEffect(() => {
        if (subscriptionStatus && (subscriptionStatus.planType !== 'tier2' && subscriptionStatus.planType !== 'tier3' || !subscriptionStatus.isActive)) {
            setErrorMessage("This feature is not available for your plan. Please upgrade to a higher plan to use this feature.");
        }
    }, [subscriptionStatus, setErrorMessage]);

    const handlePromptSubmit = async (inputPrompt: string) => {
        if (!user) {
            router.push('/auth/login?redirectTo=/learn');
            return;
        }

        if (!(await useCredits(25, 'learn'))) {
            setErrorMessage("You don't have enough credits. Please upgrade your plan.");
            return;
        }

        setIsGenerating(true);
        setPrompt(inputPrompt);

        try {
            console.log('[learn] Starting generation for prompt:', inputPrompt);
            
            const response = await fetch('/api/learn/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: inputPrompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            if (data.success && Array.isArray(data.steps)) {
                console.log('[learn] Successfully generated', data.steps.length, 'steps');
                
                // Validate that we got exactly 6 steps
                if (data.steps.length !== 6) {
                    console.warn('[learn] Expected 6 steps but got', data.steps.length);
                    throw new Error(`Expected 6 drawing steps but received ${data.steps.length}. Please try again!`);
                }
                
                setDrawingSteps(data.steps);
                setCurrentStep(0);
                setIsSaved(false);
                setShareId(null);
            } else {
                throw new Error(data.error || 'Failed to generate drawing steps.');
            }
        } catch (err) {
            console.error('[learn] Error during generation:', err);
            setErrorMessage(err instanceof Error ? err.message : 'DEFAULT_ERROR');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSave = async () => {
        if (!user) {
            router.push('/auth/login?redirectTo=/learn');
            return null;
        }
    
        if (isSaved) return { id: shareId };
    
        setIsGenerating(true);
        try {
            const images = drawingSteps.map(step => step.image?.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')).filter(Boolean) as string[];
            if (images.length === 0) throw new Error("No images to save");
    
            const { data, error } = await supabase
                .from('user_learnings')
                .insert([{ user_id: user.id, drawing_name: prompt, images: images }])
                .select('id')
                .single();
    
            if (error) throw error;
    
            setShareId(data.id);
            setIsSaved(true);
            return data;
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "DEFAULT_ERROR");
            return null;
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleShare = async () => {
        if (!shareId) {
            const saveData = await handleSave();
            if (!saveData) return;
        }
        return shareId;
    };

    const processDownload = async (fileName: string) => {
        if (!drawingSteps.length) return;

        setIsDownloading(true);
        try {
            const zip = new JSZip();
            const folder = zip.folder(fileName);
            if (!folder) throw new Error("Failed to create zip folder");

            drawingSteps.forEach((step, index) => {
                if (step.image) {
                    const blob = base64ToBlob(step.image);
                    folder.file(`step-${index + 1}.png`, blob);
                }
            });

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${fileName}.zip`);
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : "DEFAULT_ERROR");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleNewDrawing = () => {
        setPrompt("");
        setDrawingSteps([]);
        setCurrentStep(0);
        setIsSaved(false);
        setShareId(null);
    };

    const handleStepChange = useCallback((newStep: number) => {
        if (newStep >= 0 && newStep < drawingSteps.length) {
            setCurrentStep(newStep);
        }
    }, [drawingSteps.length]);

    return {
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
    };
}; 