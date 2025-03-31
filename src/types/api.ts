export interface GenerateRequest {
  prompt: string;
  drawingData?: string;
  customApiKey?: string;
}

export interface GenerateResponse {
  success: boolean;
  imageData?: string;
  error?: string;
  message?: string;
} 