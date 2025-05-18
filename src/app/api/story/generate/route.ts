import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Define the request type
type GenerateRequest = {
  storyIdea?: string;
  childAge: string;
  language: string;
  user_id: string;
  customApiKey?: string;
  isRandomStory: boolean;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

// Function to generate a custom story based on user input
async function generateCustomStory(model: any, storyIdea: string, childAge: string, language: string) {
  const prompt = `You are a storyteller for kids. Your job is to create short, magical bedtime stories for children aged ${childAge} that are full of imagination, warmth, and fun. Every story should feel like a cartoon coming to life, starring a lovable character inspired by everyday things in a kid's world — like a sock, crayon, snack, backpack, or pet.

🎨 Plot Idea:
Base the story on this idea: "${storyIdea} in language ${language}".  
It should feel magical, relatable, and age-appropriate.

🌀 Genre Variety  
Before starting, randomly pick one genre from this list (without repeating the same genre twice in a row):  
- Magical Everyday Object  
- Animal Adventures  
- Imagination Worlds  
- Lost-and-Found Quests  
- Super Tiny Heroes  
- Talking Food  
- Dreamland Diaries  
- Bedtime Magic  
- Friendship Forest  
- Courage Quest  
- Kindness Carnival  
- Silly Mix-Ups  
- Invisible Helpers  
- Schoolyard Sorcery  
- Rebel Toys  
- Weather Wonders  
- Time-Ticklers  
- Home Sweet Home  
- Nature's Secret Life  
- Seasonal Adventures  

✍️ Story Instructions  
- **Length:** Under 500 words  
- **Character:** The character should be a lovable character that fits the chosen theme. Use different characters for different genres. Strictly use different names for different characters don't repeat the same name for different characters.
- **Tone:** Simple, warm, fun, and cartoonish — like Pixar Shorts, Bluey, or Dr. Seuss  
- **Language:** Use {language}. Keep sentences short, clear, and easy to follow for {age_range}  
- **Perspective:** Centered around a cute character with emotions and a voice  
- **Relatable:** Rooted in things kids experience  
- **Fantasy Twist:** Set in a magical place or with a surprising fantasy event  
- **Structure:**  
  - Beginning: Introduce the character and situation  
  - Middle: A small adventure or challenge  
  - End: A happy, warm resolution  
- **Moral:** Gently teach one small life value (e.g., sharing, kindness, patience, honesty, bravery, friendship)

🎨 Banner Image Instructions  
Generate a colorful, cartoon-style banner image matching the story:  
- **Style:** Soft-edged, bright pastel colors, cheerful mood  
- **Characters:** Show the main character(s) mid-action or in an emotional moment  
- **Setting:** Show the magical world/background reflecting the story's tone  
- **Feel:** It should look like a beautiful page out of a children's picture book  

📦 Final Output Format (strict JSON alone not anything else included in the response)
{
  "genre": "Selected genre",
  "title": "A fun, catchy, and short title (max 10 words)",
  "story": "Under 500 words. Use short paragraphs.",
  "moral": "The life lesson taught.",
  "banner_image_description": "A vivid 3-4 sentence description for the image generator."
}  `;

  // console.log("[custom story] response", response);
  let response = await model.generateContent(prompt);
  // console.log("[random story] response", response.response.text());
  response = response.response.text().replace(/```json\s*|\s*```/g, '').trim()
  // console.log("response after removing ```json and ```", response);
  let result = JSON.parse(response);
  // console.log("result", result);
  // console.log("result", result);

  return result;
}

// Function to generate a random magical story
async function generateRandomStory(model: any, childAge: string, language: string) {
  const selectedGenre = getRandomGenre();
  
  const prompt = `You are a storyteller for kids. Your job is to create a magical ${selectedGenre} story for children aged ${childAge} that is full of imagination, warmth, and fun. Every story should feel like a cartoon coming to life, starring a lovable character that fits the ${selectedGenre} theme.

✍️ Story Instructions  
- **Genre:** ${selectedGenre} - Make sure the story strongly fits this theme
- **Length:** Under 500 words  
- **Character:** The character should be a lovable character that fits the ${selectedGenre} theme. Use different characters for different genres. Strictly use different names for different characters don't repeat the same name for different characters.
- **Tone:** Simple, warm, fun, and cartoonish — like Pixar Shorts, Bluey, or Dr. Seuss  
- **Language:** Use English. Keep sentences short, clear, and easy to follow for ages 3-8  
- **Perspective:** Centered around a cute character with emotions and a voice  
- **Relatable:** Rooted in things kids experience  
- **Fantasy Twist:** Set in a magical place or with a surprising fantasy event  
- **Structure:**  
  - Beginning: Introduce the character and situation  
  - Middle: A small adventure or challenge  
  - End: A happy, warm resolution  
- **Moral:** Gently teach one small life value (e.g., sharing, kindness, patience, honesty, bravery, friendship)

🎨 Banner Image Instructions  
Generate a colorful, cartoon-style banner image matching the story:  
- **Style:** Soft-edged, bright pastel colors, cheerful mood  
- **Characters:** Show the main character(s) mid-action or in an emotional moment  
- **Setting:** Show the magical world/background reflecting the story's tone  
- **Feel:** It should look like a beautiful page out of a children's picture book  

📦 Final Output Format (strict JSON alone not anything else included in the response)
{
  "genre": "${selectedGenre}",
  "title": "A fun, catchy, and short title (max 10 words)",
  "story": "Under 500 words. Use short paragraphs.",
  "moral": "The life lesson taught.",
  "banner_image_description": "A vivid 3–4 sentence description for the image generator."
}`;

  let response = await model.generateContent(prompt);
  // console.log("[random story] response", response.response.text());
  response = response.response.text().replace(/```json\s*|\s*```/g, '').trim()
  // console.log("response after removing ```json and ```", response);
  let result = JSON.parse(response);
  // console.log("result", result);

  // let result = null;
  // Process response parts
  // for (const part of response.response.candidates[0].content.parts) {
  //   // Based on the part type, either get the text or image data
  //   if (part.text) {
  //     console.log("Received text response");
  //     result = JSON.parse(part.text);
  //   }
  // }
  // console.log("result", result);

  return result;
}

export async function POST(req: Request) {
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
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
    });

    // Generate story based on type
    const generatedStory = isRandomStory 
      ? await generateRandomStory(model, childAge, language)
      : await generateCustomStory(model, storyIdea!, childAge, language);

    // console.log("generatedStory", generatedStory);

    const imagePrompt = 'Generate only image of a cheerful, soft-edged cartoon illustration for a children\'s book. ' + generatedStory.banner_image_description + ' Image size: 1024x768. Don\'t respond with anything else except the image.';
    
    console.log("imagePrompt", imagePrompt);
    console.log("calling gemini api for banner image");
    const banner_image = await model.generateContent(imagePrompt);


    // let result = null;
    for (const part of banner_image.response.candidates[0].content.parts) {
      // Based on the part type, either get the text or image data
      if (part.inlineData) {
        console.log("Received image response : ", part.inlineData.data.length);
        
      } 

      if(part.text) {
        console.log("Received text response : ", part.text);
      }
    }

    // generatedStory.banner_image = result;
    
    // console.log("result", result);
    
  if (banner_image.response.candidates && banner_image.response.candidates[0].content.parts && banner_image.response.candidates[0].content.parts[0].inlineData) {
      generatedStory.banner_image = banner_image.response.candidates[0].content.parts[0].inlineData.data;
      console.log("generated banner image size : ", generatedStory.banner_image.length);
    } else {
      console.log("no banner image generated");
      generatedStory.banner_image = null;
    }

    try {
      const storyData = generatedStory;
      return NextResponse.json(storyData);
    } catch (error) {
      console.error("Error parsing story data:", error);
      return NextResponse.json(
        { error: "Failed to generate a valid story" },
        { status: 500 }
      );
    }

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

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image'
      },
      { status: 500 }
    );
  }
} 