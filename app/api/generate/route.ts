/**
 * Server-side API route for generating billing narratives
 * Keeps OpenAI API key secure on the server
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt-builder';

// Initialize OpenAI client server-side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-side only, no NEXT_PUBLIC_ prefix
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activity, subject, goal } = body;

    // Validate input
    if (!activity || !subject || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured', useFallback: true },
        { status: 503 }
      );
    }

    // Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(activity, subject, goal);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const output = completion.choices[0]?.message?.content?.trim();

    if (!output) {
      return NextResponse.json(
        { error: 'Empty response from API', useFallback: true },
        { status: 500 }
      );
    }

    return NextResponse.json({
      output,
      method: 'ai',
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);

    // Handle rate limiting
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', useFallback: true },
        { status: 429 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: error?.message || 'Generation failed', useFallback: true },
      { status: 500 }
    );
  }
}
