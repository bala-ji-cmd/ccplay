export interface DrawingTemplate {
  name: string;
  src: string;
}

export interface AICharacter {
  name: string;
  avatar: string;
  color: string;
  description: string;
}

export interface CanvasCoordinates {
  x: number;
  y: number;
}

export interface DrawingState {
  prompt: string;
  generatedImage: string | null;
  isLoading: boolean;
  isPrompting: boolean;
  isColorizing: boolean;
  isColorMode: boolean;
  hasColorized: boolean;
  hasCanvasContent: boolean;
  isInFinalState: boolean;
  editCount: number;
  drawingName: string;
  isEditingName: boolean;
  downloadFileName: string;
  isColorizingAnimation: boolean;
}

export interface ModalState {
  showErrorModal: boolean;
  showShareModal: boolean;
  showDownloadModal: boolean;
  showNewDrawingModal: boolean;
  showTemplates: boolean;
  errorMessage: string;
}

export type DrawingEvent = (React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) & {
  nativeEvent: {
    offsetX?: number;
    offsetY?: number;
    touches?: TouchList;
    changedTouches?: TouchList;
  };
}

export interface Step {
  title?: string;
  step?: number;
  instruction?: string;
  image?: string;
}

export interface StepGalleryProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export interface PromptBarProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
  onNewDrawing: () => void;
}

export interface DrawingCanvasProps {
  currentImage: string;
  currentInstruction: string;
  stepNumber: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
} 