/**
 * Fallback Transformer
 * Deterministic rule-based transformation when OpenAI API is unavailable
 */

import { ACTIVITY_VERB_MAP, VOCABULARY_MAP } from './constants';

/**
 * Apply deterministic transformation rules to create a basic compliant narrative
 * This is a fallback when AI is unavailable - follows core rules but less polished
 */
export function applyDeterministicRules(
  activity: string,
  subject: string,
  goal: string
): string {
  // Step 1: Get the base verb from activity type
  const baseVerb = ACTIVITY_VERB_MAP[activity] || 'Performed';

  // Step 2: Clean and enhance the subject
  const cleanSubject = cleanText(subject);

  // Step 3: Clean and enhance the goal
  const cleanGoal = cleanText(goal);

  // Step 4: Apply vocabulary mapping to goal if it contains generic terms
  const enhancedGoal = enhanceWithVocabulary(cleanGoal);

  // Step 5: Construct the narrative using Golden Formula
  // ActionVerb + SpecificTask + Context/Reason
  const narrative = constructNarrative(baseVerb, cleanSubject, enhancedGoal);

  return narrative;
}

/**
 * Clean text: capitalize first letter, remove extra spaces
 */
function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize first letter
}

/**
 * Enhance text by replacing generic terms with better vocabulary
 */
function enhanceWithVocabulary(text: string): string {
  let enhanced = text.toLowerCase();

  // Replace generic terms with professional alternatives
  Object.entries(VOCABULARY_MAP).forEach(([generic, alternatives]) => {
    const regex = new RegExp(`\\b${generic}\\b`, 'gi');
    if (regex.test(enhanced)) {
      // Use first alternative for consistency
      enhanced = enhanced.replace(regex, alternatives[0].toLowerCase());
    }
  });

  return enhanced;
}

/**
 * Construct narrative following Golden Formula
 */
function constructNarrative(
  verb: string,
  subject: string,
  goal: string
): string {
  // Determine the connecting phrase based on verb type
  let connector = 'regarding';
  
  // Special cases for certain activity types
  if (verb.toLowerCase().includes('conference') || verb.toLowerCase().includes('call')) {
    connector = 'with';
  } else if (verb.toLowerCase().includes('draft') || verb.toLowerCase().includes('prepar')) {
    connector = 'for';
  }

  // Construct the narrative
  // Format: [Verb] [connector] [Subject] [regarding/to] [Goal]
  let narrative = '';

  if (connector === 'with') {
    // "Telephone conference with [Subject] regarding [Goal]"
    narrative = `${verb} ${subject} regarding ${goal}`;
  } else if (connector === 'for') {
    // "Drafted [Subject] to [Goal]"
    narrative = `${verb} ${subject} to ${goal}`;
  } else {
    // "Analyzed [Subject] regarding [Goal]"
    narrative = `${verb} ${subject} regarding ${goal}`;
  }

  // Ensure proper capitalization
  narrative = narrative.charAt(0).toUpperCase() + narrative.slice(1);

  // Add period if not present
  if (!narrative.endsWith('.')) {
    narrative += '.';
  }

  return narrative;
}

/**
 * Detect if input contains block billing (multiple activities)
 * Returns array of separate activities if detected
 */
export function detectBlockBilling(goal: string): string[] | null {
  const blockBillingIndicators = [' and ', ' also ', ' then ', ', and ', '; '];
  
  for (const indicator of blockBillingIndicators) {
    if (goal.toLowerCase().includes(indicator)) {
      // Split on the indicator
      const parts = goal.split(new RegExp(indicator, 'i'));
      if (parts.length > 1) {
        return parts.map((part) => part.trim()).filter((part) => part.length > 0);
      }
    }
  }

  return null;
}

/**
 * Apply active voice conversion to passive/gerund forms
 */
export function convertToActiveVoice(text: string): string {
  const conversions: Record<string, string> = {
    'reviewing': 'reviewed',
    'analyzing': 'analyzed',
    'drafting': 'drafted',
    'preparing': 'prepared',
    'working on': 'worked on',
    'looking at': 'examined',
    'going over': 'reviewed',
    'checking': 'checked',
    'updating': 'updated',
    'revising': 'revised',
  };

  let converted = text.toLowerCase();
  
  Object.entries(conversions).forEach(([passive, active]) => {
    const regex = new RegExp(`\\b${passive}\\b`, 'gi');
    converted = converted.replace(regex, active);
  });

  return converted;
}
