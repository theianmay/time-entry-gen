/**
 * OpenAI API Client
 * Handles communication with OpenAI GPT-4o-mini
 */

import OpenAI from 'openai';
import { buildSystemPrompt, buildUserPrompt } from './prompt-builder';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

export interface GenerateOptions {
  activity: string;
  subject: string;
  goal: string;
  retryCount?: number;
}

/**
 * Generate a billing narrative using OpenAI GPT-4o-mini
 */
export async function generateBillingNarrative(
  options: GenerateOptions
): Promise<string> {
  const { activity, subject, goal, retryCount = 0 } = options;

  try {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(activity, subject, goal);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temperature for consistency
      max_tokens: 300, // Billing entries are typically short
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const output = completion.choices[0]?.message?.content?.trim();

    if (!output) {
      throw new Error('Empty response from OpenAI');
    }

    return output;
  } catch (error) {
    // Log error for debugging
    console.error('OpenAI API error:', error);

    // If this is a retryable error and we haven't exceeded retry limit
    if (retryCount < 2 && isRetryableError(error)) {
      console.log(`Retrying... (attempt ${retryCount + 1})`);
      await delay(1000 * (retryCount + 1)); // Exponential backoff
      return generateBillingNarrative({
        ...options,
        retryCount: retryCount + 1,
      });
    }

    // Re-throw error to be handled by fallback system
    throw error;
  }
}

/**
 * Check if an error is retryable (network issues, rate limits, etc.)
 */
function isRetryableError(error: any): boolean {
  // Network errors
  if (error.message?.includes('fetch')) return true;
  
  // Rate limit errors (429)
  if (error.status === 429) return true;
  
  // Server errors (500, 502, 503, 504)
  if (error.status >= 500 && error.status < 600) return true;
  
  // Timeout errors
  if (error.code === 'ETIMEDOUT') return true;
  
  return false;
}

/**
 * Delay helper for retry logic
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate API key is configured
 */
export function validateApiKey(): boolean {
  return !!process.env.NEXT_PUBLIC_OPENAI_API_KEY && 
         process.env.NEXT_PUBLIC_OPENAI_API_KEY !== 'sk-your-api-key-here';
}

/**
 * Get API key status for debugging
 */
export function getApiKeyStatus(): {
  configured: boolean;
  isPlaceholder: boolean;
} {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  return {
    configured: !!key,
    isPlaceholder: key === 'sk-your-api-key-here',
  };
}
