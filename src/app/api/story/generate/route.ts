import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { getApiKey, handleApiError } from "@/lib/ai";
import logger from "@/lib/server-logger";
import { supabase } from "@/lib/supabase";
import { getCustomStoryPrompt, getRandomStoryPrompt } from '@/prompts/storyPrompts';

// Define the request type
type GenerateRequest = {
  storyIdea?: string;
  childAge: string;
  language: string;
  user_id: string;
  customApiKey?: string;
  isRandomStory: boolean;
};

const STORY_GENRES = [
  "Magical Everyday Object",
  "Animal Adventures",
  "Imagination Worlds",
  "Lost-and-Found Quests",
  "Super Tiny Heroes",
  "Talking Food",
  "Dreamland Diaries",
  "Bedtime Magic",
  "Friendship Forest",
  "Courage Quest",
  "Kindness Carnival",
  "Silly Mix-Ups",
  "Invisible Helpers",
  "Schoolyard Sorcery",
  "Rebel Toys",
  "Weather Wonders",
  "Time-Ticklers",
  "Home Sweet Home",
  "Nature's Secret Life",
  "Seasonal Adventures"
];

// Helper function to get a random genre
const getRandomGenre = (): string => {
  return STORY_GENRES[Math.floor(Math.random() * STORY_GENRES.length)];
};

// Function to generate a custom story based on user input
async function generateCustomStory(model: any, storyIdea: string, childAge: string, language: string, generationConfig: any) {
  logger.info(`[custom story] generating story for age ${childAge} in ${language} with idea: ${storyIdea}`);
  const prompt = getCustomStoryPrompt(storyIdea, childAge, language);
  try {
    logger.info("[custom story] calling AI API");
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig
    });
    const result = JSON.parse(response.response.text());
    logger.info(`[custom story] result:\n${JSON.stringify(result, null, 2)}`);
    return result;
  } catch(e) {
    logger.error("[custom story] error parsing story", e);
    return null;
  }
}

// Function to generate a random magical story
async function generateRandomStory(model: any, childAge: string, language: string, generationConfig: any) {
  const selectedGenre = getRandomGenre();
  logger.info(`[random story] generating story for age ${childAge} in ${language} with genre: ${selectedGenre}`);
  const prompt = getRandomStoryPrompt(selectedGenre, childAge, language);
  try {
    logger.info("[random story] calling AI API");
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig
    });
    const result = JSON.parse(response.response.text());
    logger.info(`[random story] result:\n${JSON.stringify(result, null, 2)}`);
    return result;
  } catch(e) {
    logger.error("[random story] error parsing story", e);
    return null;
  }
}

export async function POST(req: Request) {
  logger.info("[story generate] received request");
  try {
    // Parse the request body
    const body = await req.json() as GenerateRequest;
    const { storyIdea, childAge, language, user_id, customApiKey, isRandomStory } = body;

    if (!isRandomStory && !storyIdea) {
      return NextResponse.json(
        { error: "Story idea is required for custom stories" },
        { status: 400 }
      );
    }

    // Get API key and initialize model
    const apiKey = getApiKey(customApiKey);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      // @ts-ignore - responseModalities is required for image generation but not in type definition
      generationConfig: {
        responseModalities: ['Text', 'Image']
      } as any,
    });

    const generationConfig = {
      response_mime_type: "application/json",
    };

    // Generate story based on type
    let generatedStory = isRandomStory 
      ? await generateRandomStory(model, childAge, language, generationConfig)
      : await generateCustomStory(model, storyIdea!, childAge, language, generationConfig);

    if (!generatedStory) {
      logger.error("[story generate] story generation failed, fetching latest story from db");
      const { data, error } = await supabase
        .from("bedtime_stories")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .single();
      
      if (error) {
        logger.error("[story generate] error fetching latest story", error);
        return handleApiError(error);
      }
      generatedStory = data;
    }
    
    logger.info({ generatedStory }, "[story generate] full generated story response");

    // The generated story might be an array, take the first element.
    const storyObject = Array.isArray(generatedStory) ? generatedStory[0] : generatedStory;

    if (!storyObject || !storyObject.banner_image_description) {
      logger.error({ storyObject }, "[story generate] story object is invalid or missing banner description");
      return handleApiError(new Error("Generated story is invalid or missing a banner description."));
    }

    const imagePrompt = 'Generate only image of a cheerful, soft-edged cartoon illustration for a children\'s book. ' + storyObject.banner_image_description + ' Image size: 1024x768. Don\'t respond with anything else except the image.';
    
    try {
      logger.info({ imagePrompt }, "[story generate] imagePrompt");
      logger.info("[story generate] calling AI API for banner image");
      const banner_image = await model.generateContent(imagePrompt);

      if (banner_image.response.candidates && banner_image.response.candidates[0].content.parts && banner_image.response.candidates[0].content.parts[0].inlineData) {
          storyObject.banner_image = banner_image.response.candidates[0].content.parts[0].inlineData.data;
          logger.debug("[story generate] generated banner image size : ", storyObject.banner_image.length);
      } else {
          throw new Error("No banner image generated from API");
      }
    } catch (e) {
      logger.error(e, "[story generate] banner image generation failed, using fallback");

      const { data: fallback, error: fallbackError } = await supabase
          .from("bedtime_stories")
          .select("banner_image")
          .not("banner_image", "is", null)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();
      
      if (fallbackError) {
          logger.error(fallbackError, "[story generate] error fetching fallback image");
          storyObject.banner_image = null;
      } else if (fallback && fallback.banner_image) {
          logger.info("[story generate] using fallback image");
          storyObject.banner_image = fallback.banner_image;
      } else {
          logger.warn("[story generate] no fallback image found");
          storyObject.banner_image = null;
      }
    }
    
    return NextResponse.json(storyObject);
  } catch (error) {
    logger.error("[story generate] error", error);
    if (error instanceof Error && error.message.includes('safety_settings')) {
      return NextResponse.json(
          {
              success: false,
              error: `This story idea isn't suitable for our creative space. Let's keep it fun, kid-friendly, and appropriate for all ages! 🎨✨`
          },
          { status: 400 }
      );
    }
    return handleApiError(error);
  }
} 