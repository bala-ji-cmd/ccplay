"use client";

import { useState, useRef, useCallback, useEffect } from 'react';

export const useCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const backgroundImageRef = useRef<HTMLImageElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [penColor] = useState<string>("#000000");
    const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
    const [activeTool, setActiveTool] = useState<'pencil' | 'eraser'>('pencil');
    const [pencilSize, setPencilSize] = useState<number>(6);
    const [eraserSize, setEraserSize] = useState<number>(10);
    const [hasCanvasContent, setHasCanvasContent] = useState(false);

    const get2dContext = useCallback(() => canvasRef.current?.getContext('2d'), []);

    const initializeCanvas = useCallback(() => {
        const ctx = get2dContext();
        if (!canvasRef.current || !ctx) return;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHasCanvasContent(false);
    }, [get2dContext]);
    
    useEffect(() => {
        initializeCanvas();
    }, [initializeCanvas]);

    const drawImageToCanvas = useCallback((forceColor: boolean = false, isColorMode: boolean) => {
        const canvas = canvasRef.current;
        const ctx = get2dContext();
        if (!canvas || !ctx) return;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!isColorMode && !forceColor) {
            ctx.filter = 'grayscale(100%) contrast(1000%)';
        } else {
            ctx.filter = 'none';
        }

        if (backgroundImageRef.current) {
            ctx.drawImage(
                backgroundImageRef.current,
                0, 0,
                canvas.width, canvas.height
            );
        }
        ctx.filter = 'none';
    }, [get2dContext]);

    useEffect(() => {
        const ctx = get2dContext();
        if (ctx) {
            ctx.lineWidth = activeTool === 'eraser' ? eraserSize : pencilSize;
        }
    }, [pencilSize, eraserSize, activeTool, get2dContext]);

    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
    
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
    
        if ('touches' in e) {
            const touch = e.touches[0];
            return {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };
        }
    
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const ctx = get2dContext();
        if (!ctx) return;

        try {
            e.preventDefault();
        } catch (err) {
            // Ignore prevention errors for touch events
        }

        const coords = getCoordinates(e);
        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : penColor;
        ctx.lineWidth = activeTool === 'eraser' ? eraserSize : pencilSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const ctx = get2dContext();
        if (!ctx) return;

        try {
            e.preventDefault();
        } catch (err) {
            //console.log('Touch event prevention skipped');
        }

        const coords = getCoordinates(e);

        ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : penColor;
        ctx.lineWidth = activeTool === 'eraser' ? eraserSize : pencilSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        setHasCanvasContent(true);
    };

    const saveCanvasHistory = (newState: string) => {
        setCanvasHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), newState]);
        setCurrentHistoryIndex(prev => prev + 1);
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = get2dContext();
        if (!ctx) return;

        setIsDrawing(false);
        ctx.beginPath();

        const currentDrawing = canvas.toDataURL();
        saveCanvasHistory(currentDrawing);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = get2dContext();
        if (!ctx) return;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        backgroundImageRef.current = null;
        setHasCanvasContent(false);
        const blankState = canvas.toDataURL();
        setCanvasHistory([blankState]);
        setCurrentHistoryIndex(0);
    };

    const handleUndo = () => {
        if (currentHistoryIndex <= 0) return;

        const canvas = canvasRef.current;
        const ctx = get2dContext();
        if (!canvas || !ctx) return;
        const img = new Image();
        img.onload = () => {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            setCurrentHistoryIndex(prev => prev - 1);
        };
        img.src = canvasHistory[currentHistoryIndex - 1];
    };

    return {
        canvasRef,
        backgroundImageRef,
        activeTool,
        setActiveTool,
        pencilSize,
        setPencilSize,
        eraserSize,
        setEraserSize,
        hasCanvasContent,
        setHasCanvasContent,
        currentHistoryIndex,
        startDrawing,
        draw,
        stopDrawing,
        clearCanvas,
        handleUndo,
        drawImageToCanvas,
        saveCanvasHistory,
        canvasHistory,
        setCanvasHistory,
        setCurrentHistoryIndex,
    };
}; 