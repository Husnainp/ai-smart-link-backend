import httpStatus from 'http-status';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApiError } from '../utils/ApiError.js';


 const generateDescription = async (request) => {
  try {
    const { title } = request;

    // Ensure Gemini API key is configured (env or alternative key)
    const apiKey = process.env.GEMINI_API_KEY ;
    if (!apiKey) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Gemini API key not configured');
    }

    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use Gemini 2.0 Flash model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: Number(process.env.GEMINI_TEMPERATURE) || 0.7,
        maxOutputTokens: Number(process.env.GEMINI_MAX_TOKENS) || 150,
        topP: 0.8,
        topK: 40,
      },
    });

    // Prepare the prompt
    const prompt = `
      Write a brief, engaging description (2–3 sentences, max 500 characters)
      for a website titled "${title}".
      The description should be informative, appealing, and encourage users to visit.
      Focus on what makes this website useful or interesting.
    `.trim();

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();

    // Validate and clean
    if (!generatedText || generatedText.length < 10) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Generated description is too short');
    }

    // Truncate if too long
    const description =
      generatedText.length > 500
        ? generatedText.substring(0, 497) + '...'
        : generatedText;

    return { description };
  } catch (error) {
    console.error('Gemini API Error:', error);

    if (error instanceof ApiError) throw error;

    if (error.message?.includes('API_KEY_INVALID')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Gemini API key');
    } else if (error.message?.includes('QUOTA_EXCEEDED')) {
      throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Gemini API quota exceeded');
    } else if (error.message?.includes('SAFETY')) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Content blocked by safety filters');
    } else if (error.message?.includes('timeout')) {
      throw new ApiError(httpStatus.REQUEST_TIMEOUT, 'Request to Gemini API timed out');
    }

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to generate description. Please try again later.'
    );
  }
};

/**
 * Validate Gemini configuration
 * @returns {boolean}
 */
export const validateGeminiConfig = () => {
  return !!(process.env.GEMINI_API_KEY);
};

export { generateDescription };