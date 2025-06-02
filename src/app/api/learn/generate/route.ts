import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerateRequest } from '@/types/api';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
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
        const { prompt, customApiKey } = body;

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

        //console.log("API key obtained, initializing LLM API...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp-image-generation",
            // @ts-ignore - responseModalities is required for image generation but not in type definition
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



        // console.log('Steps map:', stepsMap);

        const result = {
            success: true,
            message: '',
            steps: [] as { image: string, instruction: string }[]
        };


        let learningSeriesMasterPrompt = [{
//             text: `
//     "Generate a step-by-step drawing guide for a kid to learn how to draw "${thing_to_draw}" in 6 simple steps. Each step should be easy to follow and should progressively add new details to build the final drawing. Keep in mind that kids may struggle with complex shapes, so use basic, easy-to-replicate forms at first and gradually refine them. The goal is to make learning fun, intuitive, and encouraging at every step."

// Breakdown of Each Step:
// Start with the simplest shape – Use basic circles, squares, or lines to outline the core structure.

// Add more structure – Introduce additional simple shapes to develop the main form.

// Define key features – Outline recognizable features while keeping it minimal.

// Refine the details – Enhance proportions slightly, but keep it simple.

// Final touches – Add any small but important finishing elements.

// Complete and color – Encourage creativity by suggesting fun ways to color or customize.

// Example: Drawing a Cat in 6 Steps
// Draw a big circle (head) and a small oval (body).

// Add two triangle ears and a curved tail.

// Draw two dots for eyes and a small upside-down triangle for the nose.

// Add whiskers and a smiling mouth.

// Refine the body shape and add legs.

// Color the cat and add stripes or patterns! 🎨✨
    
//     `
            text: `
---

**Generate a step-by-step drawing guide for a kid to learn how to draw "${prompt}" in 6 simple steps.**  

- Each step should be **easy to follow** and progressively build the final drawing.  
- Use **bold stroke lines (heavy marker style)** for clarity.  
- Keep the **resolution high (1920x1080 Full HD)**  16:9 aspect ratio to maintain quality.  
- **Do not add any annotations, text, or labels to the images**—they should be purely visual.  

### **Breakdown of Each Step:**  
1️⃣ **Start with the simplest shape** – Begin with **basic circles, squares, or lines** to outline the structure.  
2️⃣ **Add more structure** – Introduce additional **simple shapes** to develop the main form.  
3️⃣ **Define key features** – Outline **recognizable features** while keeping it minimal.  
4️⃣ **Refine the details** – Enhance proportions slightly, but **keep it simple**.  
5️⃣ **Final touches** – Add any small but important finishing elements.  
6️⃣ **Complete and color** – Encourage creativity by suggesting fun ways to **color or customize** the drawing.  



By ensuring **bold strokes, high resolution, and structured simplicity**, kids will have a fun and intuitive drawing experience! 🚀  

---            
            `

        }];


        const instructions = [`Start with the simplest shape – Begin with basic circles, squares, or lines to outline the structure.`,
            `Add more structure – Introduce additional simple shapes to develop the main form.`,
            `Define key features – Outline recognizable features while keeping it minimal.`,
            `Refine the details – Enhance proportions slightly, but keep it simple.`,
            `Final touches – Add any small but important finishing elements.`,
            `Complete and color – Encourage creativity by suggesting fun ways to color or customize the drawing.`]



        console.log("Calling LLM API...");
        // console.log('generationContent', generationContent);

        const response = await model.generateContent(learningSeriesMasterPrompt, {
            // @ts-ignore - generationConfig is required for image generation but not in type definition
            generationConfig: {
                maxOutputTokens: 5000, // Set the max token size here
            } as any,
        });
        console.log("LLM API response received");

        if (!response.response?.candidates?.[0]?.content?.parts) {
            return NextResponse.json(
                { success: false, error: 'No response from Gemini API' },
                { status: 500 }
            );
        }

        //streaming
        // for await (const chunk of response.stream) {
        //     // Check if chunk and its properties are defined before accessing them
        //     if (chunk?.candidates?.[0]?.content?.parts?.[0]) {
        //         console.log('chunk text', chunk.candidates[0].content.parts[0].text);
        //         console.log('chunk inlineData length', chunk.candidates[0].content.parts[0].inlineData?.data.length);
        //         // console.log('chunk parts', chunk.candidates[0].content.parts[0]);

        //         if (chunk.candidates[0].content.parts[0].inlineData?.data) {
        //             result.steps.push({ image: chunk.candidates[0].content.parts[0].inlineData.data, instruction: chunk.candidates[0].content.parts[0].text});
        //         }
        //     } else {
        //         console.log('Received chunk is missing expected properties:', chunk);
        //     }
        // }
        let index = 0;
        // // oneshot
        for (const part of response.response?.candidates?.[0]?.content?.parts) {
            // Based on the part type, either get the text or image data
            if (part.text) {
                result.message = part.text;
                console.log("Received text response:", part.text);
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                console.log("Received image data, length:", imageData.length);

                // Include the base64 data in the response
                result.steps.push({ image: imageData, instruction: instructions[index] });
                index++;
            }
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error generating learning steps:', error);
        
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
                error: error instanceof Error ? error.message : 'An unexpected error occurred'
            },
            { status: 500 }
        );
    }
} 