import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerateContentResult, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
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
      // @ts-ignore: responseModalities is required for image generation but not in type definition
      generationConfig: {
        responseModalities: ['Text', 'Image']
      } as any,
      safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        }
    ],
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
          { text: `Apply bright and solid colors to this 1280 x 720 line drawing, filling it in like a children's coloring book. Use vibrant, cheerful colors suitable for children's illustrations. Each distinct element should have its own clear color. Avoid grayscale, maintaining the original black line work while adding solid, clean colors between the lines.` }
        ];
      } else {
        // Regular black and white sketch generation
        generationContent = [
          imagePart,
          { text: `${prompt}. Keep a 1280 x 720 canvas (16:9 aspect ratio) with a minimal line doodle style. Ensure clean, bold strokes with sharp edges, avoiding any blurring or feathering. The lines should be well-defined and suitable for a children's drawing.` }
        ];
      }
    } else {
      // Initial sketch creation
      generationContent = `${prompt}. Create a black and white hand-drawn sketch on a 1280 x 720 canvas (16:9 aspect ratio). Use thick, bold strokes similar to a heavy marker or ink pen. Ensure the lines are sharp, solid, and well-defined with no blurring, feathering, or shading—just clean black outlines on a white background`;
    }

    console.log("Calling LLM API...");
    const response = await model.generateContent(generationContent);
    console.log("LLM API response received");

    // Initialize response data
    const result = {
      success: true,
      message: '',
      imageData: null as string | null
    };

    // Process response parts
    if (!response.response?.candidates?.[0]?.content?.parts) {
      console.error("No response parts received from Gemini API");
      return NextResponse.json(
        { success: false, error: 'No response received from Gemini API' },
        { status: 500 }
      );
    }

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

    if (!result.imageData) {
      console.error("No image data received in response");
      return NextResponse.json(
        { success: false, error: 'No image was generated' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error generating content:", error);

    // Check if the error is related to safety/content filtering
    if (error instanceof Error && error.message.includes('safety_settings')) {
      return NextResponse.json(
          {
              success: false,
              error: `This drawing idea isn't suitable for our creative space. Let's keep it fun, kid-friendly, and appropriate for all ages! 🎨✨`
          },
          { status: 400 }
      );
    }

    // More detailed error response
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}