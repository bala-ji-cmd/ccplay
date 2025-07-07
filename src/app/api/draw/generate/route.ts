import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GenerateRequest } from '@/types/api';
import { getApiKey, handleApiError } from '@/lib/ai';
import logger from '@/lib/server-logger';
import { getInitialSketchPrompt, getColorizePrompt, getRedrawPrompt } from '@/prompts/drawPrompts';

export async function POST(request: Request) {
  logger.info('[draw generate] received request');
  try {
    // Parse the request body
    const body = await request.json() as GenerateRequest;
    const { prompt, drawingData, customApiKey } = body;

    if (!prompt) {
      logger.warn('[draw generate] prompt is required');
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Use custom API key if provided, otherwise use the one from environment variables
    const apiKey = getApiKey(customApiKey);

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
    let isColorize = false;

    if (drawingData) {
      const imagePart = {
        inlineData: {
          data: drawingData,
          mimeType: "image/png"
        }
      };

      // Different prompt handling for colorize vs normal generation
      if (prompt.includes("[COLORIZE]")) {
        isColorize = true;
        logger.info('[draw generate] colorizing image');
        generationContent = [
          imagePart,
          { text: getColorizePrompt() }
        ];
      } else {
        // Regular black and white sketch generation
        logger.info('[draw generate] generating from existing drawing');
        generationContent = [
          imagePart,
          { text: getRedrawPrompt(prompt) }
        ];
      }
    } else {
      // Initial sketch creation
      logger.info('[draw generate] creating initial sketch');
      generationContent = getInitialSketchPrompt(prompt);
    }

    logger.info({ isColorize: isColorize, prompt: prompt }, "[draw generate] calling AI API");
    const response = await model.generateContent(generationContent);
    logger.info("[draw generate] AI API response received");

    // Initialize response data
    const result = {
      success: true,
      message: '',
      imageData: null as string | null
    };

    // Process response parts
    if (!response.response?.candidates?.[0]?.content?.parts) {
      logger.error("[draw generate] no response parts received from AI API");
      return NextResponse.json(
        { success: false, error: 'No response received from AI API' },
        { status: 500 }
      );
    }

    for (const part of response.response.candidates[0].content.parts) {
      // Based on the part type, either get the text or image data
      if (part.text) {
        result.message = part.text;
        logger.debug({ text: part.text}, "[draw generate] received text response");
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        logger.debug({ length: imageData.length}, "[draw generate] received image data");

        // Include the base64 data in the response
        result.imageData = imageData;
      }
    }

    if (!result.imageData) {
      logger.error("[draw generate] no image data received in response");
      return NextResponse.json(
        { success: false, error: 'No image was generated' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error: any) {
    logger.error(error, "[draw generate] error");
    // Check if the error is related to safety/content filtering
    if (error.message && error.message.includes('safety_settings')) {
      return NextResponse.json(
          {
              success: false,
              error: `This drawing idea isn't suitable for our creative space. Let's keep it fun, kid-friendly, and appropriate for all ages! 🎨✨`
          },
          { status: 400 }
      );
    }

    if (error.status === 429) {
        const kidsCount = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
        return NextResponse.json(
            {
                success: false,
                error: `${kidsCount} other kids are drawing right now, which is causing a bit of a jam. Please try again in a moment! 🎨`,
            },
            { status: 429 }
        );
    }
    
    return handleApiError(error);
  }
}