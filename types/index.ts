// Form data types
export interface FormData {
  activity: string;
  subject: string;
  goal: string;
  time?: number;
}

// Session history entry
export interface HistoryEntry {
  id: string;
  timestamp: Date;
  input: FormData;
  output: string;
  usedFallback: boolean;
}

// API generation result
export interface GenerationResult {
  output: string;
  method: 'ai' | 'fallback';
}

// Activity types
export type ActivityType = 
  | 'call'
  | 'document-review'
  | 'drafting'
  | 'research'
  | 'email'
  | 'meeting'
  | 'analysis';

export interface Activity {
  id: ActivityType;
  label: string;
  icon: string;
  description: string;
}
