"use client";

import { useState, useRef, useCallback, useEffect } from 'react';

export interface VoiceRecordingState {
    recording: boolean;
    processing: boolean;
    error: string | null;
    audioBlob: Blob | null;
    transcribedText: string | null;
    duration: number;
    isSupported: boolean;
    audioLevel: number;
    silenceDetected: boolean;
    processingStage: 'uploading' | 'analyzing' | 'transcribing' | 'finalizing' | null;
}

export interface VoiceRecordingOptions {
    silenceThreshold?: number;      // Audio level threshold (0-100)
    silenceTimeout?: number;        // Silence duration in ms before auto-stop
    maxRecordingTime?: number;      // Maximum recording time in ms
    enableSilenceDetection?: boolean;
}

export interface VoiceRecordingActions {
    startRecording: (options?: VoiceRecordingOptions) => Promise<void>;
    stopRecording: () => void;
    clearRecording: () => void;
    resetError: () => void;
    setProcessing: (processing: boolean) => void;
    setTranscribedText: (text: string | null) => void;
    setProcessingStage: (stage: 'uploading' | 'analyzing' | 'transcribing' | 'finalizing' | null) => void;
}

export interface VoiceRecordingHook extends VoiceRecordingState, VoiceRecordingActions {}

// Default configuration
const DEFAULT_OPTIONS: Required<VoiceRecordingOptions> = {
    silenceThreshold: 15,           // 15% audio level threshold
    silenceTimeout: 2000,           // 2 seconds of silence
    maxRecordingTime: 30000,        // 30 seconds max recording
    enableSilenceDetection: true
};

export const useVoiceRecording = (): VoiceRecordingHook => {
    // Core state management
    const [recording, setRecording] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcribedText, setTranscribedText] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const [silenceDetected, setSilenceDetected] = useState<boolean>(false);
    const [processingStage, setProcessingStage] = useState<'uploading' | 'analyzing' | 'transcribing' | 'finalizing' | null>(null);

    // Refs for MediaRecorder and related functionality
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const startTimeRef = useRef<number>(0);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Refs for silence detection
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastSpeechTimeRef = useRef<number>(0);
    const optionsRef = useRef<Required<VoiceRecordingOptions>>(DEFAULT_OPTIONS);
    const maxRecordingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize browser support detection
    useEffect(() => {
        const checkSupport = () => {
            const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
            const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
            const hasAudioContext = !!(window.AudioContext || (window as any).webkitAudioContext);
            
            setIsSupported(hasGetUserMedia && hasMediaRecorder && hasAudioContext);
        };

        checkSupport();
    }, []);

    // Audio level monitoring function
    const analyzeAudioLevel = useCallback(() => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate RMS (Root Mean Square) for more accurate volume detection
        let sum = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
            sum += dataArrayRef.current[i] * dataArrayRef.current[i];
        }
        const rms = Math.sqrt(sum / dataArrayRef.current.length);
        const audioLevel = Math.min(100, (rms / 255) * 100);
        
        setAudioLevel(audioLevel);

        // Silence detection logic
        if (optionsRef.current.enableSilenceDetection && recording) {
            if (audioLevel > optionsRef.current.silenceThreshold) {
                // Speech detected - reset silence timer
                lastSpeechTimeRef.current = Date.now();
                setSilenceDetected(false);
                
                if (silenceTimerRef.current) {
                    clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = null;
                }
            } else {
                // Potential silence - start timer if not already running
                if (!silenceTimerRef.current && lastSpeechTimeRef.current > 0) {
                    silenceTimerRef.current = setTimeout(() => {
                        setSilenceDetected(true);
                        stopRecording();
                    }, optionsRef.current.silenceTimeout);
                }
            }
        }
    }, [recording]);

    // Setup audio analysis
    const setupAudioAnalysis = useCallback((stream: MediaStream) => {
        try {
            // Create audio context with legacy browser support
            const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContextConstructor();
            audioContextRef.current = audioContext;

            // Create analyser node
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            analyserRef.current = analyser;

            // Create data array for frequency analysis
            const bufferLength = analyser.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);

            // Connect audio stream to analyser
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            // Start audio level monitoring
            audioLevelIntervalRef.current = setInterval(analyzeAudioLevel, 100); // 10 times per second
            
        } catch (error) {
            console.warn('Audio analysis setup failed:', error);
            // Continue without silence detection if audio analysis fails
            optionsRef.current.enableSilenceDetection = false;
        }
    }, [analyzeAudioLevel]);

    // Cleanup audio analysis
    const cleanupAudioAnalysis = useCallback(() => {
        // Clear audio level monitoring
        if (audioLevelIntervalRef.current) {
            clearInterval(audioLevelIntervalRef.current);
            audioLevelIntervalRef.current = null;
        }

        // Clear silence timer
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }

        // Clear max recording timer
        if (maxRecordingTimerRef.current) {
            clearTimeout(maxRecordingTimerRef.current);
            maxRecordingTimerRef.current = null;
        }

        // Close audio context
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        // Reset analysis references
        analyserRef.current = null;
        dataArrayRef.current = null;
        lastSpeechTimeRef.current = 0;
        
        // Reset audio level and silence state
        setAudioLevel(0);
        setSilenceDetected(false);
    }, []);

    // Start recording function with options
    const startRecording = useCallback(async (options: VoiceRecordingOptions = {}): Promise<void> => {
        // Merge with default options
        optionsRef.current = { ...DEFAULT_OPTIONS, ...options };

        // Reset previous state
        setError(null);
        setAudioBlob(null);
        setTranscribedText(null);
        setDuration(0);
        setAudioLevel(0);
        setSilenceDetected(false);
        chunksRef.current = [];
        lastSpeechTimeRef.current = 0;

        if (!isSupported) {
            setError('Voice recording is not supported on this device');
            return;
        }

        try {
            // Request microphone access with optimized settings for speech
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1,
                    sampleRate: 16000,              // Optimal for speech recognition
                    sampleSize: 16                  // 16-bit samples for speech
                }
            });

            mediaStreamRef.current = stream;
            
            // Setup audio analysis for silence detection
            setupAudioAnalysis(stream);
            
            // Create MediaRecorder with optimized settings for speech
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
                audioBitsPerSecond: 16000,          // 16kbps for speech (vs default 128kbps)
                bitsPerSecond: 16000                // Overall bitrate limit
            });

            mediaRecorderRef.current = mediaRecorder;

            // Set up event handlers
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(audioBlob);
                setRecording(false);
                
                // Clean up media stream
                if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                    mediaStreamRef.current = null;
                }

                // Clear duration interval
                if (durationIntervalRef.current) {
                    clearInterval(durationIntervalRef.current);
                    durationIntervalRef.current = null;
                }

                // Cleanup audio analysis
                cleanupAudioAnalysis();
            };

            mediaRecorder.onerror = (event) => {
                setError('Recording failed. Please try again.');
                setRecording(false);
                cleanupAudioAnalysis();
            };

            // Start recording
            mediaRecorder.start();
            setRecording(true);
            startTimeRef.current = Date.now();
            lastSpeechTimeRef.current = Date.now(); // Initialize speech detection

            // Start duration tracking
            durationIntervalRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);

            // Set maximum recording time limit
            maxRecordingTimerRef.current = setTimeout(() => {
                if (recording) {
                    stopRecording();
                }
            }, optionsRef.current.maxRecordingTime);

        } catch (err) {
            console.error('Error starting recording:', err);
            cleanupAudioAnalysis();
            
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    setError('Microphone access denied. Please allow microphone access and try again.');
                } else if (err.name === 'NotFoundError') {
                    setError('No microphone found. Please check your device settings.');
                } else if (err.name === 'NotReadableError') {
                    setError('Microphone is already in use. Please close other applications and try again.');
                } else {
                    setError('Unable to access microphone. Please try again.');
                }
            } else {
                setError('Unable to start recording. Please try again.');
            }
        }
    }, [isSupported, setupAudioAnalysis, cleanupAudioAnalysis, recording]);

    // Stop recording function
    const stopRecording = useCallback((): void => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
        }
    }, [recording]);

    // Clear recording function
    const clearRecording = useCallback((): void => {
        setRecording(false);
        setProcessing(false);
        setError(null);
        setAudioBlob(null);
        setTranscribedText(null);
        setDuration(0);
        setAudioLevel(0);
        setSilenceDetected(false);
        setProcessingStage(null);
        chunksRef.current = [];
        lastSpeechTimeRef.current = 0;

        // Clean up media recorder
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current = null;
        }

        // Clean up media stream
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        // Clear duration interval
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }

        // Cleanup audio analysis
        cleanupAudioAnalysis();
    }, [cleanupAudioAnalysis]);

    // Reset error function
    const resetError = useCallback((): void => {
        setError(null);
    }, []);

    // Set processing state function
    const setProcessingState = useCallback((processing: boolean): void => {
        setProcessing(processing);
    }, []);

    // Set transcribed text function
    const setTranscribedTextState = useCallback((text: string | null): void => {
        setTranscribedText(text);
    }, []);

    return {
        // State
        recording,
        processing,
        error,
        audioBlob,
        transcribedText,
        duration,
        isSupported,
        audioLevel,
        silenceDetected,
        processingStage,

        // Actions
        startRecording,
        stopRecording,
        clearRecording,
        resetError,
        setProcessing: setProcessingState,
        setTranscribedText: setTranscribedTextState,
        setProcessingStage,
    };
};