declare module 'canvas-confetti' {
  interface ConfettiConfig {
    particleCount?: number;
    spread?: number;
    origin?: { x: number; y: number };
    angle?: number;
    colors?: string[];
    gravity?: number;
    ticks?: number;
  }

  function confetti(config?: ConfettiConfig): Promise<void>;
  export default confetti;
} 