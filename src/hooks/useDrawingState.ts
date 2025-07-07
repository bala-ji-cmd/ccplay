"use client";

import { useState } from 'react';

export interface Version {
    image: string;
    prompt?: string;
    type: 'drawn' | 'generated' | 'colorized';
}

export const useDrawingState = () => {
    const [prompt, setPrompt] = useState<string>("");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [customApiKey, setCustomApiKey] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadFileName, setDownloadFileName] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);
    const [isColorizing, setIsColorizing] = useState(false);
    const [isColorMode, setIsColorMode] = useState(false);
    const [hasColorized, setHasColorized] = useState(false);
    const [drawingName, setDrawingName] = useState('');
    const [editCount, setEditCount] = useState(0);
    const [maxEdits] = useState(5);

    const [isInFinalState, setIsInFinalState] = useState(false);
    const [showNewDrawingModal, setShowNewDrawingModal] = useState(false);
    const [isPrompting, setIsPrompting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isColorizingAnimation, setIsColorizingAnimation] = useState(false);
    const [showStrokeOptions, setShowStrokeOptions] = useState<boolean>(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [versionHistory, setVersionHistory] = useState<Version[]>([]);
    const [shareId, setShareId] = useState<string | null>(null);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [savedDrawingId, setSavedDrawingId] = useState<string | null>(null);
    const [showEditNameModal, setShowEditNameModal] = useState(false);

    return {
        prompt, setPrompt,
        generatedImage, setGeneratedImage,
        isLoading, setIsLoading,
        customApiKey, setCustomApiKey,
        showShareModal, setShowShareModal,
        isFirstVisit, setIsFirstVisit,
        showDownloadModal, setShowDownloadModal,
        downloadFileName, setDownloadFileName,
        showTemplates, setShowTemplates,
        isColorizing, setIsColorizing,
        isColorMode, setIsColorMode,
        hasColorized, setHasColorized,
        drawingName, setDrawingName,
        editCount, setEditCount,
        maxEdits,

        isInFinalState, setIsInFinalState,
        showNewDrawingModal, setShowNewDrawingModal,
        isPrompting, setIsPrompting,
        isSaved, setIsSaved,
        isColorizingAnimation, setIsColorizingAnimation,
        showStrokeOptions, setShowStrokeOptions,
        warningMessage, setWarningMessage,
        showWarningModal, setShowWarningModal,
        versionHistory, setVersionHistory,
        shareId, setShareId,
        showSubscriptionModal, setShowSubscriptionModal,
        savedDrawingId, setSavedDrawingId,
        showEditNameModal, setShowEditNameModal,
    };
}; 