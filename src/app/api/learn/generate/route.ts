import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerateRequest } from '@/types/api';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { getApiKey, handleApiError } from '@/lib/ai';
import logger from '@/lib/server-logger';
import { getLearningSeriesPrompt, learningStepInstructions } from '@/prompts/learnPrompts';

const EXPECTED_STEPS = 6;
const MAX_RETRIES = 3;

async function generateLearningSteps(model: any, prompt: string, attempt: number = 1): Promise<{ success: boolean; steps: any[]; message?: string; error?: string }> {
    logger.info({ prompt, attempt }, '[learn generate] attempting to generate learning steps');
    
    try {
        let learningSeriesMasterPrompt = getLearningSeriesPrompt(prompt);
        
        const response = await model.generateContent(learningSeriesMasterPrompt, {
            // @ts-ignore - generationConfig is required for image generation but not in type definition
            generationConfig: {
                maxOutputTokens: 5000, // Set the max token size here
            } as any,
        });
        
        logger.info({ attempt }, "[learn generate] AI API response received");

        if (!response.response?.candidates?.[0]?.content?.parts) {
            logger.error({ attempt }, '[learn generate] no response from AI API');
            return { success: false, steps: [], error: 'No response from AI API' };
        }

        const steps: { image: string, instruction: string }[] = [];
        let message = '';
        let index = 0;

        // Process all parts from the response
        for (const part of response.response?.candidates?.[0]?.content?.parts) {
            if (part.text) {
                message = part.text;
                logger.debug({ text: part.text, attempt }, "[learn generate] received text response");
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                logger.debug({ length: imageData.length, step: index + 1, attempt }, "[learn generate] received image data");

                // Include the base64 data in the response
                steps.push({ image: imageData, instruction: learningStepInstructions[index] });
                index++;
            }
        }

        logger.info({ steps: steps.length, expected: EXPECTED_STEPS, attempt }, "[learn generate] processed all steps");

        // Check if we got the expected number of steps
        if (steps.length === EXPECTED_STEPS) {
            logger.info({ attempt }, '[learn generate] successfully generated expected number of steps');
            return { success: true, steps, message };
        } else {
            logger.warn({ 
                stepsReceived: steps.length, 
                expected: EXPECTED_STEPS, 
                attempt 
            }, '[learn generate] received incorrect number of steps');
            
            let errorMessage = `Expected ${EXPECTED_STEPS} steps but received ${steps.length}`;
            if (steps.length < EXPECTED_STEPS) {
                errorMessage = `The AI only generated ${steps.length} steps instead of ${EXPECTED_STEPS}. This sometimes happens when the AI is busy. We'll try again automatically!`;
            } else {
                errorMessage = `The AI generated ${steps.length} steps instead of ${EXPECTED_STEPS}. We'll try again to get the right number!`;
            }
            
            return { 
                success: false, 
                steps: [], 
                error: errorMessage
            };
        }

    } catch (error: any) {
        logger.error({ error: error.message, attempt }, '[learn generate] error during generation attempt');
        
        // Check if the error is related to safety/content filtering
        if (error.message && error.message.includes('safety_settings')) {
            return {
                success: false,
                steps: [],
                error: `This drawing idea isn't suitable for our creative space. Let's keep it fun, kid-friendly, and appropriate for all ages! 🎨✨`
            };
        }

        if (error.status === 429) {
            const kidsCount = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
            return {
                success: false,
                steps: [],
                error: `${kidsCount} other kids are drawing right now, which is causing a bit of a jam. Please try again in a moment! 🎨`
            };
        }

        return {
            success: false,
            steps: [],
            error: error.message || 'Unknown error occurred'
        };
    }
}

export async function POST(request: Request) {
    logger.info('[learn generate] received request');
    try {
        // Parse the request body
        const body = await request.json() as GenerateRequest;
        const { prompt, customApiKey } = body;

        if (!prompt) {
            logger.warn('[learn generate] prompt is required');
            return NextResponse.json(
                { success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // Use custom API key if provided, otherwise use the one from environment variables
        const apiKey = getApiKey(customApiKey);
        logger.info('[learn generate] api key obtained');

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

        logger.info({ prompt }, "[learn generate] starting generation with retry logic");

        // Try to generate steps with retry logic
        let lastError: string | undefined;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            logger.info({ 
                prompt, 
                attempt, 
                maxRetries: MAX_RETRIES,
                attemptNumber: `${attempt}/${MAX_RETRIES}`
            }, '[learn generate] starting generation attempt');
            
            const result = await generateLearningSteps(model, prompt, attempt);
            
            if (result.success) {
                logger.info({ 
                    prompt, 
                    stepsGenerated: result.steps.length, 
                    totalAttempts: attempt,
                    successOnAttempt: attempt
                }, '[learn generate] successfully generated learning steps');
                
                return NextResponse.json({
                    success: true,
                    message: result.message,
                    steps: result.steps
                });
            }
            
            lastError = result.error;
            logger.warn({ 
                attempt, 
                maxRetries: MAX_RETRIES, 
                error: result.error,
                attemptsRemaining: MAX_RETRIES - attempt
            }, '[learn generate] generation attempt failed, will retry if attempts remaining');
            
            // If this is not the last attempt, wait a bit before retrying
            if (attempt < MAX_RETRIES) {
                const delay = Math.min(1000 * attempt, 3000); // Exponential backoff, max 3 seconds
                logger.info({ delay, attempt, nextAttempt: attempt + 1 }, '[learn generate] waiting before retry');
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        // If we get here, all attempts failed
        logger.error({ 
            prompt, 
            totalAttempts: MAX_RETRIES, 
            lastError 
        }, '[learn generate] all generation attempts failed');
        
        return NextResponse.json(
            { 
                success: false, 
                error: lastError || 'Failed to generate learning steps after multiple attempts. Please try again!' 
            },
            { status: 500 }
        );

    } catch (error: any) {
        logger.error(error, '[learn generate] unexpected error in main handler');
        return handleApiError(error);
    }
} 