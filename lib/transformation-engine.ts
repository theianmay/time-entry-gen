/**
 * Transformation Engine
 * Orchestrates AI generation with fallback to deterministic rules
 */

import { generateBillingNarrative, validateApiKey } from './openai-client';
import { applyDeterministicRules } from './fallback-transformer';
import { GenerationResult } from '@/types';

export interface TransformOptions {
  activity: string;
  subject: string;
  goal: string;
}

/**
 * Generate billing narrative with automatic fallback
 * Tries OpenAI first, falls back to deterministic rules if API fails
 */
export async function generateWithFallback(
  options: TransformOptions
): Promise<GenerationResult> {
  const { activity, subject, goal } = options;

  // Check if API key is configured
  if (!validateApiKey()) {
    console.warn('OpenAI API key not configured, using fallback mode');
    const output = applyDeterministicRules(activity, subject, goal);
    return {
      output,
      method: 'fallback',
    };
  }

  try {
    // Attempt OpenAI generation
    const output = await generateBillingNarrative({
      activity,
      subject,
      goal,
    });

    return {
      output,
      method: 'ai',
    };
  } catch (error) {
    console.error('OpenAI generation failed, using fallback:', error);

    // Fall back to deterministic rules
    const output = applyDeterministicRules(activity, subject, goal);
    
    return {
      output,
      method: 'fallback',
    };
  }
}

/**
 * Validate that the generated output follows basic quality rules
 */
export function validateOutput(output: string): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check minimum length
  if (output.length < 20) {
    issues.push('Output too short');
  }

  // Check if starts with forbidden words
  const forbiddenStarts = ['client', 'meeting', 'call', 'the client'];
  const startsWithForbidden = forbiddenStarts.some((word) =>
    output.toLowerCase().startsWith(word)
  );
  if (startsWithForbidden) {
    issues.push('Starts with forbidden word');
  }

  // Check if contains action verb (should start with verb)
  const firstWord = output.split(' ')[0].toLowerCase();
  const commonVerbs = [
    'analyzed', 'reviewed', 'drafted', 'prepared', 'conducted',
    'telephone', 'correspondence', 'researched', 'examined',
    'structured', 'configured', 'advised', 'conferred', 'strategized',
  ];
  const hasVerb = commonVerbs.some((verb) => firstWord.includes(verb));
  if (!hasVerb) {
    issues.push('May not start with action verb');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Format output for display (handle multiple entries if block billing detected)
 */
export function formatOutput(output: string): string {
  // If output already has numbered list, return as-is
  if (/^\d+\./.test(output.trim())) {
    return output;
  }

  // Otherwise return the single narrative
  return output;
}
