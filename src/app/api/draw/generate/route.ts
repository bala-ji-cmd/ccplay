import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import { GenerateRequest, GenerateResponse } from '@/types/api';

// Helper function to validate the API key
const validateApiKey = (apiKey: string): boolean => {
  return apiKey.startsWith('AI') && apiKey.length > 20;
};

// Helper function to get API key
const getApiKey = (customApiKey?: string): string => {
  const defaultKey = process.env.GEMINI_API_KEY;
  if (customApiKey && validateApiKey(customApiKey)) {
    return customApiKey;
  }
  if (!defaultKey) {
    throw new Error('No valid API key provided');
  }
  return defaultKey;
};


export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json() as GenerateRequest;
    const { prompt, drawingData, customApiKey } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Use custom API key if provided, otherwise use the one from environment variables
    let apiKey: string;
    try {
      apiKey = getApiKey(customApiKey);
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No API key available. Please provide a valid Gemini API key.' 
        },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Set responseModalities to include "Image" so the model can generate an image
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      },
    });
    let generationContent;
    
    if (drawingData) {
      const imagePart = {
        inlineData: {
          data: drawingData,
          mimeType: "image/png"
        }
      };
      
      // Different prompt handling for colorize vs normal generation
      if (prompt.includes("[COLORIZE]")) {
        generationContent = [
          imagePart,
          { text: `Apply bright and solid colors to this 960x540 line drawing, filling it in like a children's coloring book. Use vibrant, cheerful colors suitable for children's illustrations. Each distinct element should have its own clear color. Avoid grayscale, maintaining the original black line work while adding solid, clean colors between the lines.` }
        ];
      } else {
        // Regular black and white sketch generation
        generationContent = [
          imagePart,
          { text: `${prompt}. Maintain a 960x540 canvas size (16:9 aspect ratio) with the same minimal line doodle style. Use clean, bold strokes suitable for a children's drawing.` }
        ];
      }
    } else {
      // Initial sketch creation
      generationContent = `${prompt}. Create a simple black and white sketch sized for a 960x540 canvas (16:9 aspect ratio). Use thick, bold lines like a drawing made with a heavy marker. Ensure solid, well-defined strokes with no color, blurring, or shading - just clean, prominent black outlines on white background.`;
    }
    
    console.log("Calling Gemini API...");
    const response = await model.generateContent(generationContent);
    console.log("Gemini API response received");
    

        // Initialize response data
    const result = {
      success: true,
      message: '',
      imageData: null
    };
    
    // Process response parts
    for (const part of response.response.candidates[0].content.parts) {
      // Based on the part type, either get the text or image data
      if (part.text) {
        result.message = part.text;
        console.log("Received text response:", part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        console.log("Received image data, length:", imageData.length);
        
        // Include the base64 data in the response
        result.imageData = imageData;
      }
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate image'
      },
      { status: 500 }
    );
  }
}