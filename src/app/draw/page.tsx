"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, LoaderCircle, Trash2, X, Download, Share2, Pencil, Eraser, Palette, Sparkles, File, Copy, Twitter, MessageCircle, Home } from "lucide-react";
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import {
  DrawingTemplate
} from "@/types/drawing";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionModal } from "@/components/ui/subscriptionmodal";
import { Loader } from "@/components/ui/loader";
import { LoadingButton } from "@/components/ui/loading-button";
import { WarningModal } from "@/components/ui/WarningModal";
import { Slider } from "@/components/ui/slider";
import EditsCounter from "@/components/ui/edits-counter";

const fireConfetti = () => {
  // First burst - center
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.6 }
  });

  // Delayed side bursts
  setTimeout(() => {
    // Left side burst
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 0, y: 0.6 },
      angle: 60,
      colors: ['#9B6DFF', '#7DD181', '#FFE66D']
    });

    // Right side burst
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 1, y: 0.6 },
      angle: 120,
      colors: ['#9B6DFF', '#7DD181', '#FFE66D']
    });
  }, 200);

  // Final top burst
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { x: 0.5, y: 0 },
      gravity: 0.8,
      ticks: 400
    });
  }, 400);
};

const getRandomItem = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const generateRandomName = (): string => {
  const adjectives: string[] = [
    "Happy", "Silly", "Bright", "Sparkly", "Wobbly", "Zany",
    "Magical", "Dancing", "Playful", "Bouncy", "Giggly", "Colorful",
    "Brave", "Curious", "Friendly", "Sneaky", "Speedy", "Tiny",
    "Giant", "Sleepy", "Singing", "Flying"
  ];

  const nouns: string[] = [
    "Doodle", "Picture", "Creation", "Masterpiece", "Imagination", "Drawing",
    "Sketch", "Adventure", "Story", "Wonder", "Dream", "Fantasy",
    "World", "Land", "Kingdom", "Galaxy", "Forest", "Ocean",
    "Castle", "House", "Playground", "Party", "Journey", "Surprise"
  ];

  const characters: string[] = [
    "Mickey", "Minnie", "Goofy", "Donald", "Daisy",
    "SpongeBob", "Patrick", "Sandy",
    "Peppa", "George",
    "Bluey", "Bingo",
    "Pikachu", "Charmander",
    "Sonic", "Tails"
  ];

  const actions: string[] = [
    "LovesToDraw", "IsPainting", "MakesArt", "ImaginesThings", "DreamsBig",
    "GoesOnAdventure", "ExploresTheWorld", "PlaysGames", "HasFun", "SingsLoud",
    "BuildsCastles", "FindsTreasure"
  ];

  const places: string[] = [
    "Wonderland", "Neverland", "CandyKingdom", "BikiniBottom",
    "TheSavanna", "OuterSpace", "RainbowRoad", "PirateShip"
  ];

  const randomAdjective = getRandomItem(adjectives);
  const randomNoun = getRandomItem(nouns);
  const randomCharacter = getRandomItem(characters);
  const randomAction = getRandomItem(actions);
  const randomPlace = getRandomItem(places);
  const randomNumber = Math.floor(Math.random() * 100);

  const structureOptions: string[] = [
    `${randomAdjective}${randomNoun}${randomNumber}`,
    `${randomCharacter}${randomAction}`,
    `${randomAdjective}In${randomPlace}`,
    `${randomCharacter}The${randomNoun}`,
    `${randomAction}With${randomCharacter}`
  ];

  return getRandomItem(structureOptions);
};

// Update the DrawingEvent interface
interface ExtendedDrawingEvent extends MouseEvent {
  target: HTMLCanvasElement;
  nativeEvent: {
    offsetX: number;
    offsetY: number;
    touches?: TouchList;
  } & MouseEvent;
}

export default function DrawPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [penColor] = useState<string>("#000000");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [hasCanvasContent, setHasCanvasContent] = useState(false);
  const [isInFinalState, setIsInFinalState] = useState(false);
  const [showNewDrawingModal, setShowNewDrawingModal] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isColorizingAnimation, setIsColorizingAnimation] = useState(false);
  const [playPop] = useSound('/sounds/pop.mp3', { volume: 0.5 });
  const [activeTool, setActiveTool] = useState<'pencil' | 'eraser'>('pencil');
  const [pencilSize, setPencilSize] = useState<number>(6);
  const [eraserSize, setEraserSize] = useState<number>(10);
  const [showStrokeOptions, setShowStrokeOptions] = useState<boolean>(false);
  const strokeSizes = [2, 4, 8] as const;
  const eraserSizes = [10, 20, 30] as const;
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Add new state for tracking version history
  const [versionHistory, setVersionHistory] = useState<Array<{
    image: string;
    prompt?: string;
    type: 'drawn' | 'generated' | 'colorized';
  }>>([]);

  // Add shareId state at the top with other state declarations
  const [shareId, setShareId] = useState<string | null>(null);

  const drawingTemplates: DrawingTemplate[] = [
    { name: 'Dragon', src: '/templates/dragon.png' },
    { name: 'Princess', src: '/templates/princess.png' },
    { name: 'Spaceship', src: '/templates/spaceship.png' },
    { name: 'Forest', src: '/templates/forest.png' }
  ];

  // Add auth context
  const { user, session } = useAuth();
  const router = useRouter();
  const { subscriptionStatus, useCredits } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Replace the existing useEffect with this one
  useEffect(() => {
    if (subscriptionStatus) {
      // Show subscription modal if subscription is not valid
      if (!subscriptionStatus.isActive) {
        setShowSubscriptionModal(true);
      }
    }
  }, [subscriptionStatus]);

  // Modify the generatedImage useEffect to not save state
  useEffect(() => {
    if (generatedImage && canvasRef.current) {
      const img = new window.Image();
      img.onload = () => {
        backgroundImageRef.current = img;
        drawImageToCanvas();
      };
      img.src = generatedImage;
    }
  }, [generatedImage]);

  // Initialize canvas with white background when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      initializeCanvas();
    }
  }, []);



  useEffect(() => {
    // Scroll down slightly after component mounts
    window.scrollTo({
      top: 80, // This will hide the navbar by default
      behavior: 'smooth'
    });
  }, []); // Empty dependency array means this runs once when component mounts

  useEffect(() => {
    if (!drawingName) {
      setDrawingName(generateRandomName());
    }
  }, []);

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
  }, [showStrokeOptions]);

  useEffect(() => {
    // This will run after pencilSize changes

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = activeTool === 'eraser' ? eraserSize : pencilSize;
      }
    }
  }, [pencilSize, activeTool, eraserSize]); // isDrawing removed from dependencies

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasCanvasContent(false);
  };

  const drawImageToCanvas = (forceColor: boolean = false) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
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
  };

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

  // Update the event handler types
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
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

    // Always use the current pencilSize or eraserSize state
    const currentLineWidth = activeTool === 'eraser' ? eraserSize : pencilSize;
    ctx.lineWidth = currentLineWidth;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
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

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(false);
    ctx.beginPath();

    // Save the current state to history
    const currentDrawing = canvas.toDataURL();
    setCanvasHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), currentDrawing]);
    setCurrentHistoryIndex(prev => prev + 1);
    // setHasCanvasContent(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setGeneratedImage(null);
    backgroundImageRef.current = null;
    setIsColorMode(false);
    setHasColorized(false);
    setDrawingName(generateRandomName());
    setEditCount(0);
    setHasCanvasContent(false);
    setIsEditingName(false);
    saveCanvasState();
    setIsSaved(false)
  };

  const handleUndo = () => {
    if (currentHistoryIndex <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setCurrentHistoryIndex(prev => prev - 1);
    };
    img.src = canvasHistory[currentHistoryIndex - 1];
  };

  const saveCanvasState = (prompt?: string, type: 'drawn' | 'generated' | 'colorized' = 'drawn') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If this is a colorized version, temporarily draw in color
    if (type === 'colorized') {
      drawImageToCanvas(true); // Force color display
    }

    const newState = canvas.toDataURL();

    // Restore original display if needed
    if (type === 'colorized' && !isColorMode) {
      drawImageToCanvas(false); // Restore grayscale if needed
    }

    if (canvasHistory.length === 0 || newState !== canvasHistory[currentHistoryIndex]) {
      setCanvasHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), newState]);
      setCurrentHistoryIndex(prev => prev + 1);

      // Add to version history
      setVersionHistory(prev => [...prev, {
        image: newState,
        prompt,
        type
      }].slice(-6)); // Keep only last 6 versions
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push('/auth/login?redirectTo=/draw');
      return;
    }

    try {
      setIsLoading(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      // If not colorized yet, colorize first and wait for it to complete
      if (!hasColorized) {
        await handleColorize();
        // Wait a bit to ensure colorization is complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Force color mode before capturing image data
      drawImageToCanvas(true);
      
      const imageData = canvas.toDataURL('image/png');
     
      // console.log('imageData', imageData);
      // console.log('hasColorized', hasColorized);
      // console.log('isColorMode', isColorMode);

      // Save drawing
      const { data: drawingData, error: drawingError } = await supabase
        .from('user_images')
        .insert([{
          user_id: user.id,
          image_data: imageData,
          drawing_name: drawingName,
        }])
        .select('id')
        .single();

      if (drawingError) throw drawingError;
      // console.log('saved drawing');

      if(!isSaved){
        // Check subscription status and use credits
        if (!(await useCredits(25, 'draw'))) {
          setShowSubscriptionModal(true);
          return;
        } else {
          // console.log('used credits');
        }
      }

      setIsSaved(true)
      fireConfetti();

      return drawingData;

    } catch (error) {
      console.error('Error saving drawing:', error);
      setWarningMessage(error instanceof Error ? error.message : "Failed to save drawing");
      setShowWarningModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    setDownloadFileName(drawingName);
    setShowDownloadModal(true);
  };

  const processDownload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Create a temporary canvas with the same dimensions
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Draw the original canvas onto the temporary canvas
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

      const defaultFileName = drawingName.trim().replace(/\s+/g, '-').toLowerCase();
      const fileName = (downloadFileName.trim() || defaultFileName) + '.png';

      // Get high quality PNG data URL
      const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // console.log('downloaded drawing');

      
    } catch (error) {
      console.error('Error during download:', error);
      setWarningMessage(error instanceof Error ? error.message : "Failed to download drawing");
      setShowWarningModal(true);
    } finally {
      setShowDownloadModal(false);
      setDownloadFileName('');
      // Save the drawing after successful download
       
      // handleSave();
    }
  };


  // Add a helper function to check if edits are maxed out
  const isEditsMaxedOut = () => editCount >= maxEdits;


  // Update handleSubmit to use useCredits
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || isPrompting) return;

    setIsLoading(true);
    setIsPrompting(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Canvas not initialized");
      }

      const drawingData = canvas.toDataURL("image/png").split(",")[1];

      const response = await fetch("/api/draw/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          drawingData,
          customApiKey
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.success && data.imageData) {
        console.log('[SUCCESS] Image data received, length:', data.imageData.length);
        const newImage = `data:image/png;base64,${data.imageData}`;
        setGeneratedImage(newImage);
        setHasCanvasContent(true);
        const newEditCount = editCount + 1;
        setEditCount(newEditCount);

        // Wait for the image to load before saving state
        const img = new Image();
        img.onload = async () => {
          backgroundImageRef.current = img;
          drawImageToCanvas(true); // Force color display
          saveCanvasState(prompt, 'generated'); // Save state after drawing
        };
        img.src = newImage;

        setPrompt("");
        if (newEditCount >= maxEdits) {
          fireConfetti();
          setIsInFinalState(true);
        }
      } else {
        console.error("Failed to generate image:", data.error);
        setErrorMessage(data.error || 'Failed to generate image');
        setShowErrorModal(true);
      }
    } catch (error: unknown) {
      console.error("Error submitting drawing:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
      setShowErrorModal(true);
    } finally {
      setIsPrompting(false);
      setIsLoading(false);
    }
  };

  // Update the handleShare function to set the shareId
  const handleShare = async () => {
    if (!user?.email) {
      setErrorMessage("Please login to share your drawing");
      setShowErrorModal(true);
      return;
    }

    try {
      setIsLoading(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      let savedData;
      if (!isSaved) {
        savedData = await handleSave(); // Ensure saveCanvasState returns the saved data
        if (!savedData) {
          throw new Error("Failed to save to database");
        }
      } else {
        // If already saved, fetch the latest drawing
        const { data, error } = await supabase
          .from('user_images')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        savedData = data;
      }

      // Set the shareId from the saved drawing data
      setShareId(savedData.id);
      setShowShareModal(true);

      // Copy to clipboard
      const shareUrl = `${window.location.origin}/share/draw/${savedData.id}`;
      await navigator.clipboard.writeText(shareUrl);

    } catch (error) {
      console.error('Error sharing image:', error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to share drawing");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };


  // Similarly update handleColorize to use useCredits
  const handleColorize = async () => {
    if (isColorizing) return;

    playPop();
    setIsColorizing(true);
    setIsColorizingAnimation(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const drawingData = canvas.toDataURL("image/png").split(",")[1];

      const requestPayload = {
        prompt: "[COLORIZE] Apply bright and solid colors to this black and white line drawing...",
        drawingData,
        customApiKey
      };

      const response = await fetch("/api/draw/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();

      if (data.success && data.imageData) {
        const newImage = `data:image/png;base64,${data.imageData}`;
        setIsColorMode(true);

        // Create a promise to handle the image loading and state updates
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = async () => {
            backgroundImageRef.current = img;
            drawImageToCanvas(true); // Force color display
            setGeneratedImage(newImage); // Update state before saving
            setHasColorized(true);
            setIsColorMode(true);
            setIsInFinalState(true);
            saveCanvasState('colorized', 'colorized');
            fireConfetti();
            resolve(true);
          };
          img.src = newImage;
        });

        // Now that all state updates are complete, save the drawing
        // await handleSave();
        // console.log('colorized, proceeding to save');
      } else {
        console.error("Failed to colorize image:", data.error);
        setErrorMessage(data.error);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error colorizing drawing:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
      setShowErrorModal(true);
    } finally {
      setIsColorizingAnimation(false);
      setIsColorizing(false);
    }
  };



  const resetCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Reset all states
    setGeneratedImage(null);
    backgroundImageRef.current = null;
    setCanvasHistory([]);
    setCurrentHistoryIndex(-1);
    setPrompt("");
    setEditCount(0);
    setHasColorized(false);
    setIsColorMode(false);
    setHasCanvasContent(false);
    setIsInFinalState(false);
    setDrawingName(generateRandomName());
    saveCanvasState();
  };

  const handleStartNewDrawing = () => {
    // Skip confirmation if drawing is in final state
    if (isInFinalState || hasColorized || isEditsMaxedOut()) {
      resetCanvasState();
      return;
    }

    // Show confirmation only if there's a drawing and not in final state
    const hasDrawing = canvasHistory.length > 1 || generatedImage;
    if (hasDrawing) {
      setShowNewDrawingModal(true);
    } else {
      resetCanvasState();
    }
  };

  // Add CSS classes for animations
  const canvasWrapperClass = `relative mb-6 ${isPrompting ? 'canvas-thinking' : ''
    }`;


  const handleWarningModalClose = () => {
    setShowWarningModal(false);
    handleStartNewDrawing(); // Reset the state and show prompt bar
  };

  const ShareModal = () => (

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full border-8 border-[#FFD900]">
        <h3
          className="text-xl font-bold mb-4 text-[#4B4B4B]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Share your creation
        </h3>
        <div className="space-y-4">
          <div className="p-3 bg-[#FFF9E5] rounded-xl flex items-center gap-2 border-2 border-[#FFD900]">
            <input
              type="text"
              value={shareId ? `${window.location.origin}/share/draw/${shareId}` : ''}
              className="flex-1 bg-transparent outline-none"
              readOnly
            />
            <button
              onClick={async () => {
                if (shareId) {
                  await navigator.clipboard.writeText(`${window.location.origin}/share/draw/${shareId}`);
                  // You could add a toast notification here to show "Copied!"
                }
              }}
              className="text-[#1CB0F6] hover:text-[#1BA0E1]"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={shareId ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/share/draw/${shareId}`)}&text=${encodeURIComponent('Check out my drawing!')}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2 bg-[#1CB0F6] text-white rounded-xl hover:bg-opacity-90 font-bold border-b-2 border-[#1BA0E1]"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </a>
            <a
              href={shareId ? `https://wa.me/?text=${encodeURIComponent(`Check out my drawing! ${window.location.origin}/share/draw/${shareId}`)}` : '#'}
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

  const DownloadModal = () => {
    const [localFileName, setLocalFileName] = useState(downloadFileName || drawingName);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setDownloadFileName(localFileName);
      setDrawingName(localFileName);
      processDownload(e);
    };

    return (
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

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={localFileName}
              onChange={(e) => setLocalFileName(e.target.value)}
              placeholder={drawingName}
              className="w-full px-4 py-2 border-4 border-[#E5E5E5] rounded-xl mb-4 focus:outline-none focus:border-[#1CB0F6]"
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
                className="px-4 py-2 text-sm bg-[#58CC02] text-white rounded-xl hover:bg-[#46A302] font-bold border-b-2 border-[#46A302]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  const NewDrawingModal = () => (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border-8 border-[#FFD900]"
      >
        <h3
          className="text-xl font-bold text-[#4B4B4B] mb-4"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Start a New Drawing?
        </h3>
        <p className="text-[#4B4B4B] mb-6 text-base">
          Starting a new drawing will clear the current canvas. Are you sure you want to continue?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowNewDrawingModal(false)}
            className="px-4 py-2 text-[#4B4B4B] border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] rounded-xl transition-colors font-bold"
          >
            No, Keep Drawing
          </button>
          <button
            onClick={() => {
              resetCanvasState();
              setShowNewDrawingModal(false);
            }}
            className="px-4 py-2 bg-[#FF9600] text-white rounded-xl hover:bg-[#E68600] transition-colors font-bold border-b-2 border-[#E68600]"
          >
            Yes, Start New
          </button>
        </div>
      </motion.div>
    </motion.div>

  );

  const ErrorModal = () => (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border-8 border-[#FFD900]">
        <div className="flex justify-between items-start mb-4">
          <h3
            className="text-xl font-bold text-[#FF4B4B]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Failed to generate
          </h3>
          <button
            onClick={() => setShowErrorModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          setShowErrorModal(false);
        }}>
          <label className="block text-sm font-medium text-[#4B4B4B] mb-2">
            Add your own Gemini API key from{" "}
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1CB0F6] hover:underline"
            >
              Google AI Studio
            </a>
          </label>
          <input
            type="text"
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            placeholder="API Key..."
            className="w-full px-4 py-2 border-4 border-[#E5E5E5] rounded-xl mb-4 focus:outline-none focus:border-[#1CB0F6]"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className="px-4 py-2 text-sm border-2 border-[#E5E5E5] rounded-xl hover:bg-[#F7F7F7] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-[#58CC02] text-white rounded-xl hover:bg-[#46A302] font-bold border-b-2 border-[#46A302]"
            >
              Use My API Key
            </button>
          </div>
        </form>
      </div>
    </div>

  );

  const VersionHistory = () => (
    <div className="mt-8 p-4 bg-white rounded-2xl shadow-md border-4 border-[#FFD900]">
      <h3
        className="text-lg font-bold mb-4 text-[#8549BA]"
        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
      >
        Version History
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {versionHistory.map((version, index) => (
          <div key={index} className="relative bg-[#FFF9E5] p-3 rounded-xl border-2 border-[#FFD900]">
            <img
              src={version.image || "/placeholder.svg"}
              alt={`Version ${index + 1}`}
              style={{ filter: 'none' }}
              className="w-full h-32 object-contain mb-2"
            />

            <div
              className="text-center mt-1 text-sm text-[#4B4B4B] font-medium"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              "{version.prompt}"
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#58CC02] text-white rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );


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

      {showSubscriptionModal && <SubscriptionModal message="You've used your free drawing! Subscribe now to unlock unlimited magical creations." />}

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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingName(false)
                    }
                  }}
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
                  <h1
                    className="text-2xl sm:text-3xl font-bold text-[#8549BA] group-hover:text-[#7038A8]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    {drawingName}
                  </h1>
                  <Pencil className="w-4 h-4 text-[#8549BA] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )}
              <motion.button
                onClick={handleStartNewDrawing}
                className="bg-[#8549BA] text-white hover:bg-[#7038A8] rounded-full p-2 shadow-md"
                data-tooltip-id="new-drawing-tooltip"
                data-tooltip-content="Start a new drawing"
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

            <menu className="flex items-center gap-2 relative">
              {!isInFinalState && !hasColorized && !isEditsMaxedOut() && (
                <div className="mr-4">
                  <EditsCounter count={maxEdits - editCount} />
                </div>
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTool("pencil")
                    setShowStrokeOptions(!showStrokeOptions)
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${activeTool === "pencil"
                      ? "bg-[#58CC02] text-white"
                      : "bg-white text-[#4B4B4B] border-2 border-[#E5E5E5]"
                    }`}
                  aria-label="Pencil"
                  data-tooltip-id="toolbar-tooltip"
                  data-tooltip-content="Pencil"
                >
                  <Pencil className="w-5 h-5" />
                </button>

                {/* Stroke size options */}
                {showStrokeOptions && activeTool === "pencil" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-full ml-2 bg-white rounded-xl shadow-lg p-2 flex flex-col gap-2 z-50 border-4 border-[#FFD900]"
                  >
                    {strokeSizes.map((size) => (
                      <button
                        key={size}
                        className={`stroke-size-option w-10 h-10 rounded-md flex items-center justify-center hover:bg-[#F7F7F7] 
                      ${pencilSize === size ? "bg-[#E5FFC2] ring-2 ring-[#58CC02]" : "bg-white"}`}
                        onClick={() => {
                          // Use an immediately invoked function to ensure correct closure values
                          ; ((selectedSize) => {

                            // Update state
                            setPencilSize(selectedSize)

                            // Play sound & close menu
                            playPop()
                            setShowStrokeOptions(false)

                            // Immediately update canvas context as well
                            const canvas = canvasRef.current
                            if (canvas) {
                              const ctx = canvas.getContext("2d")
                              if (ctx) {
                                ctx.lineWidth = selectedSize
                              }
                            }
                          })(size) // Pass the size value to ensure correct closure
                        }}
                      >
                        <div
                          className="bg-black rounded-full"
                          style={{
                            width: Math.max(size * 2, 4),
                            height: Math.max(size * 2, 4),
                            opacity: pencilSize === size ? 1 : 0.6,
                          }}
                        />
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveTool("eraser")
                    setShowStrokeOptions(!showStrokeOptions)
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${activeTool === "eraser"
                      ? "bg-[#FF9600] text-white"
                      : "bg-white text-[#4B4B4B] border-2 border-[#E5E5E5]"
                    }`}
                  aria-label="Eraser"
                  data-tooltip-id="toolbar-tooltip"
                  data-tooltip-content="Eraser"
                >
                  <Eraser className="w-5 h-5" />
                </button>

                {/* Stroke size options */}
                {showStrokeOptions && activeTool === "eraser" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-full ml-2 bg-white rounded-xl shadow-lg p-2 flex flex-col gap-2 z-50 border-4 border-[#FFD900]"
                  >
                    {eraserSizes.map((size) => (
                      <button
                        key={size}
                        className={`stroke-size-option w-10 h-10 rounded-md flex items-center justify-center hover:bg-[#F7F7F7] 
                      ${eraserSize === size ? "bg-[#FFF9E5] ring-2 ring-[#FF9600]" : "bg-white"}`}
                        onClick={() => {
                          // Use an immediately invoked function to ensure correct closure values
                          ; ((selectedSize) => {

                            // Update state
                            setEraserSize(selectedSize)

                            // Play sound & close menu
                            playPop()
                            setShowStrokeOptions(false)

                            // Immediately update canvas context as well
                            const canvas = canvasRef.current
                            if (canvas) {
                              const ctx = canvas.getContext("2d")
                              if (ctx && activeTool === "eraser") {
                                ctx.lineWidth = selectedSize
                              }
                            }
                          })(size) // Pass the size value to ensure correct closure
                        }}
                      >
                        <div
                          className="bg-white border-2 border-black rounded-full"
                          style={{
                            width: Math.max(size / 2, 4),
                            height: Math.max(size / 2, 4),
                            opacity: eraserSize === size ? 1 : 0.6,
                          }}
                        />
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <button
                type="button"
                onClick={handleUndo}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${currentHistoryIndex <= 0
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white text-[#1CB0F6] border-2 border-[#E5E5E5] hover:bg-[#F7F7F7]"
                  }`}
                aria-label="Undo"
                disabled={currentHistoryIndex <= 0}
                data-tooltip-id="toolbar-tooltip"
                data-tooltip-content="Undo"
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
                  <path d="M9 14L4 9l5-5" />
                  <path d="M4 9h14c3.314 0 6 2.686 6 6s-2.686 6-6 6H5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={clearCanvas}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white text-[#FF4B4B] border-2 border-[#E5E5E5] hover:bg-[#F7F7F7]"
                aria-label="Clear Canvas"
                data-tooltip-id="toolbar-tooltip"
                data-tooltip-content="Clear Canvas"
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
                      const img = new Image()
                      img.onload = () => {
                        const canvas = canvasRef.current
                        if (!canvas) return

                        const ctx = canvas.getContext("2d")
                        if (!ctx) return

                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                        saveCanvasState("from template")
                        setShowTemplates(false)
                        setHasCanvasContent(true)
                      }
                      img.src = template.src
                    }}
                    className="p-2 text-center hover:bg-[#FFF9E5] rounded-lg border-2 border-[#FFD900]"
                  >
                    <img
                      src={template.src || "/placeholder.svg"}
                      alt={template.name}
                      style={{ filter: 'none' }}
                      className="w-full h-32 object-contain mb-2"
                    />
                    <span
                      className="text-sm font-bold text-[#4B4B4B]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
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
                  onTouchMove={(e) => {
                    // For touch events, explicitly prevent default to avoid scrolling
                    try {
                      e.preventDefault()
                    } catch (err) {
                      // Ignore errors from passive listeners
                    }
                    draw(e)
                  }}
                  onTouchEnd={stopDrawing}
                  className="w-full hover:cursor-crosshair sm:h-[60vh] h-[30vh] min-h-[320px] bg-white/90 touch-none border-8 border-[#FFD900] rounded-2xl shadow-lg"
                  style={{ touchAction: "none" }}
                />

                {/* Thinking Animation Overlay */}
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
                {!isInFinalState && !hasColorized && !isEditsMaxedOut() && (
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
                        aria-label={isLoading ? "Loading" : "Submit"}
                      >
                        {isLoading ? (
                          <div className="flex gap-1">
                            <div
                              className="w-1.5 h-1.5 bg-[#58CC02] rounded-full animate-bounce"
                              style={{ animationDelay: "0s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-[#58CC02] rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-[#58CC02] rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
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
                      <LoadingButton
                        onClick={handleColorize}
                        isLoading={isColorizing}
                        loadingText="Colorizing..."
                        className="px-4 py-2 bg-[#FF9600] hover:bg-[#E68600] text-white font-bold rounded-xl border-b-2 border-[#E68600] hover:border-[#CC7700] transition-all flex items-center gap-2 shadow-md"
                        disabled={isLoading}
                      >
                        <Palette className="w-5 h-5" />
                        Colorize
                      </LoadingButton>
                    )}

                    {!isEditsMaxedOut() && !isInFinalState && (
                      <LoadingButton
                        onClick={handleSave}
                        isLoading={isLoading}
                        loadingText="Saving..."
                        className="px-4 py-2 bg-[#58CC02] hover:bg-[#46A302] text-white font-bold rounded-xl border-b-2 border-[#46A302] hover:border-[#378700] transition-all flex items-center gap-2 shadow-md"
                        disabled={isColorizing}
                      >
                        <File className="w-5 h-5" />
                        Save
                      </LoadingButton>
                    )}

                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-[#1CB0F6] hover:bg-[#1BA0E1] text-white font-bold rounded-xl border-b-2 border-[#1BA0E1] hover:border-[#1990CC] transition-all flex items-center gap-2 shadow-md"
                      disabled={isLoading || isColorizing}
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                    <button
                      onClick={handleShare}
                      className="px-4 py-2 bg-[#8549BA] hover:bg-[#7038A8] text-white font-bold rounded-xl border-b-2 border-[#7038A8] hover:border-[#5D2E8C] transition-all flex items-center gap-2 shadow-md"
                      disabled={isLoading || isColorizing}
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </motion.div>
                )}

                {(isInFinalState || hasColorized || isEditsMaxedOut()) && (
                  <div
                    className="text-sm text-[#4B4B4B] mt-2 text-center font-bold bg-[#FFF9E5] p-3 rounded-xl border-2 border-[#FFD900]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    {hasColorized
                      ? "Your colorized drawing is ready! You can download or share it."
                      : isEditsMaxedOut()
                        ? "You've reached the maximum number of edits. You can still colorize, download, or share your drawing!"
                        : "Drawing is complete! You can now colorize, download, or share your creation."}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {showErrorModal && <ErrorModal />}

        {showShareModal && <ShareModal />}

        {showDownloadModal && <DownloadModal />}

        {showNewDrawingModal && <NewDrawingModal />}


        {/* Add Version History Display after the canvas */}
        {versionHistory.length > 0 && (
          <VersionHistory />
        )}
      </main>


      {/* How It Works Section */}
      <section className="bg-[#FFF9E5] py-12 px-4 sm:px-6 mt-8 rounded-2xl border-4 border-[#FFD900]">
  <div className="max-w-5xl mx-auto">
    <h2 
      className="text-3xl font-bold text-center mb-8 text-[#8549BA]"
      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
    >
      Let's Make Awesome Art Together! 🎨
    </h2>

    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {/* Step 1 */}
      <div className="text-center bg-white p-6 rounded-2xl border-4 border-[#FFD900] shadow-md">
        <div className="bg-[#E5FFC2] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-[#58CC02]">
          <Pencil className="w-10 h-10 text-[#58CC02]" />
        </div>
        <h3 
          className="font-bold text-lg mb-2 text-[#58CC02]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          First, You Draw!
        </h3>
        <p className="text-[#4B4B4B]">
          Use your finger or mouse to draw anything you like on the big white space. Go wild with your ideas!
        </p>
      </div>

      {/* Step 2 */}
      <div className="text-center bg-white p-6 rounded-2xl border-4 border-[#FFD900] shadow-md">
        <div className="bg-[#E5F8FF] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-[#1CB0F6]">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <SendHorizontal className="w-10 h-10 text-[#1CB0F6]" />
          </motion.div>
        </div>
        <h3 
          className="font-bold text-lg mb-2 text-[#1CB0F6]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Tell the Computer What to Add!
        </h3>
        <p className="text-[#4B4B4B]">
          Type what you want to add in the box and watch as your ideas come to life!
        </p>
      </div>

      {/* Step 3 */}
      <div className="text-center bg-white p-6 rounded-2xl border-4 border-[#FFD900] shadow-md">
        <div className="bg-[#F9E9FF] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-[#8549BA]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-10 h-10 text-[#8549BA]" />
          </motion.div>
        </div>
        <h3 
          className="font-bold text-lg mb-2 text-[#8549BA]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Watch the Magic Happen!
        </h3>
        <p className="text-[#4B4B4B]">
          Press the green arrow and see your drawing transform with AI magic!
        </p>
      </div>

      {/* Step 4 */}
      <div className="text-center bg-white p-6 rounded-2xl border-4 border-[#FFD900] shadow-md">
        <div className="bg-[#FFF1E5] w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-[#FF9600]">
          <Palette className="w-10 h-10 text-[#FF9600]" />
        </div>
        <h3 
          className="font-bold text-lg mb-2 text-[#FF9600]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Make it Colorful!
        </h3>
        <p className="text-[#4B4B4B]">
          Click the Colorize button to fill your drawing with magical colors!
        </p>
      </div>
    </div>

    <div className="mt-12 text-center">
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-[#58CC02] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#46A302] transition-all border-b-4 border-[#46A302] shadow-lg"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Start Drawing Now! ✨
        </button>
      </motion.div>
    </div>

    <div className="mt-8 text-center">
      <p 
        className="text-sm bg-[#FFF9E5] inline-block px-4 py-2 rounded-full border-2 border-[#FFD900] font-bold text-[#4B4B4B]"
        style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
      >
        You can make up to 5 changes and then add colors to create your masterpiece!
      </p>
    </div>
  </div>
</section>



    </div>
  );
}