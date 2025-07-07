import { NextResponse } from 'next/server';

// Helper function to validate the API key
export const validateApiKey = (apiKey: string): boolean => {
  return apiKey.startsWith('AI') && apiKey.length > 20;
};

// Helper function to get API key
export const getApiKey = (customApiKey?: string): string => {
  const defaultKey = process.env.AI_API_KEY;
  if (customApiKey && validateApiKey(customApiKey)) {
    return customApiKey;
  }
  if (!defaultKey) {
    throw new Error('No valid API key provided');
  }
  return defaultKey;
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  console.error(error); // Log the actual error for debugging

  let errorMessage = 'An unexpected error occurred. Please try again later.';
  let statusCode = 500;

  if (error.message.includes('No valid API key provided')) {
    errorMessage = 'No API key available. Please provide a valid API key.';
    statusCode = 400;
  } else if (error.status === 429) {
    errorMessage = 'You have exceeded your API quota. Please check your plan and billing details.';
    statusCode = 429;
  } else if (error.status >= 500) {
    errorMessage = "Sorry, we're having some trouble on our end! Please try again in a moment.";
    statusCode = error.status;
  }

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status: statusCode }
  );
}; 