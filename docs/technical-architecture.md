# Technical Architecture

## Overview

A client-side Next.js application that transforms attorney time entries into compliant billing narratives using OpenAI's GPT-4o-mini API. The application runs entirely in the browser with no backend database or server-side processing beyond API calls to OpenAI.

---

## Tech Stack

### Core Framework
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**

### Styling & UI
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Component library (built on Radix UI)
- **Lucide React** - Icon library
- **next-themes** - Light/dark mode management

### API Integration
- **OpenAI API** (GPT-4o-mini)
- **openai npm package** - Official OpenAI SDK

### Deployment
- **Vercel** - Hosting and serverless functions

### Form Handling & State Management
- **React Hook Form** - Form state and validation
- **Zod** - Schema validation and type inference
- **React useState/useReducer** - Component-level app state

---

## Form Handling & State Management

### Form State: React Hook Form + Zod

**Rationale:**
- Progressive disclosure requires conditional field rendering
- Type-safe validation with minimal boilerplate
- Built-in error handling and field watching
- Seamless integration with shadcn/ui Form components

**Implementation:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema with Zod
const formSchema = z.object({
  activity: z.string().min(1, 'Please select an activity'),
  subject: z.string().min(1, 'Subject/Who/What is required'),
  goal: z.string().min(1, 'Goal/Purpose is required'),
  time: z.number().min(0.1).step(0.1).optional(),
});

type FormData = z.infer<typeof formSchema>;

// Initialize form with validation
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    activity: '',
    subject: '',
    goal: '',
    time: undefined,
  },
});

// Watch for progressive disclosure
const selectedActivity = form.watch('activity');
```

**Progressive Disclosure Pattern:**
```typescript
{/* Subject field only appears after activity selection */}
{selectedActivity && (
  <FormField
    control={form.control}
    name="subject"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Subject/Who/What</FormLabel>
        <Input {...field} />
        <FormMessage />
      </FormItem>
    )}
  />
)}
```

### App State: Component-Level useState

**State Structure:**
```typescript
// Generated output
const [output, setOutput] = useState<string | null>(null);

// Session history (in-memory)
interface HistoryEntry {
  id: string;
  timestamp: Date;
  input: FormData;
  output: string;
}
const [history, setHistory] = useState<HistoryEntry[]>([]);

// Loading and error states
const [isGenerating, setIsGenerating] = useState(false);
const [error, setError] = useState<string | null>(null);
const [usedFallback, setUsedFallback] = useState(false);
```

**Why useState is Sufficient:**
- ✅ Single page application (no routing state complexity)
- ✅ No prop drilling (all state in main page component)
- ✅ Simple, predictable data flow
- ✅ No shared state between distant components
- ✅ Theme state handled by `next-themes` (localStorage)

**When to Upgrade:**
- ❌ NOT needed: Global state (Redux, Zustand) - no cross-component sharing
- ❌ NOT needed: Server state (React Query, SWR) - only one-off API calls
- Future: If multi-page app emerges, consider URL state or Context API

### Dependencies Added

```json
{
  "dependencies": {
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.6.0",
    "zod": "^3.23.0"
  }
}
```

**Bundle Impact:**
- React Hook Form: ~8KB gzipped
- Zod: ~14KB gzipped
- **Total**: ~22KB - acceptable tradeoff for DX benefits

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌───────────────────────────────────────────────┐  │
│  │         User Interface (React)                 │  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │  Activity Selection Cards                 │ │  │
│  │  │  Subject/Who/What Input (Progressive)     │ │  │
│  │  │  Goal/Purpose Input                       │ │  │
│  │  │  Time Entry (Optional)                    │ │  │
│  │  │  Generate Button                          │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  │                                                │  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │  Generated Output Display                 │ │  │
│  │  │  - Copy to Clipboard Button               │ │  │
│  │  │  - Regenerate/Clear Options               │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  │                                                │  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │  Session History Sidebar                  │ │  │
│  │  │  (In-memory, cleared on refresh)          │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────┘  │
│                                                       │
│  ┌───────────────────────────────────────────────┐  │
│  │         Client State Management                │  │
│  │  - React useState for form data                │  │
│  │  - Session history array (in-memory)           │  │
│  │  - Theme state (localStorage via next-themes)  │  │
│  └───────────────────────────────────────────────┘  │
│                                                       │
│  ┌───────────────────────────────────────────────┐  │
│  │       Transformation Logic Layer               │  │
│  │  - OpenAI API client                           │  │
│  │  - Fallback deterministic transformer          │  │
│  │  - Prompt engineering utilities                │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────┐
│              OpenAI API (External)                   │
│           GPT-4o-mini (gpt-4o-mini)                  │
└─────────────────────────────────────────────────────┘
```

---

## Component Structure

```
/app
├── layout.tsx                    # Root layout with theme provider
├── page.tsx                      # Main entry form page
├── globals.css                   # Global styles + Tailwind

/components
├── ui/                           # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   └── ...
├── theme-toggle.tsx              # Light/dark mode switcher
├── activity-selector.tsx         # Activity type cards
├── entry-form.tsx                # Main form component
├── output-display.tsx            # Generated narrative display
└── session-history.tsx           # In-session history sidebar

/lib
├── openai-client.ts              # OpenAI API integration
├── prompt-builder.ts             # System prompt construction
├── fallback-transformer.ts       # Deterministic transformation rules
├── transformation-rules.ts       # Golden Formula logic
└── utils.ts                      # Helper utilities

/types
└── index.ts                      # TypeScript type definitions
```

---

## Data Flow

### 1. Form Submission Flow

```
User fills form
    ↓
Click "Generate"
    ↓
Validate inputs (all required fields present)
    ↓
Show loading state
    ↓
Build prompt with system instructions + user inputs
    ↓
Call OpenAI API (GPT-4o-mini)
    ↓
┌─── Success? ───┐
│                │
YES              NO
│                │
↓                ↓
Parse response   Check error type
↓                ↓
Apply final      ┌─ API Error (rate limit, auth)
polish           │  → Show error + Retry button
↓                │
Display output   └─ Network/Unknown Error
↓                   → Show error + Retry button
Add to session      → Run fallback transformer
history             → Display fallback output (unpolished)
↓
Clear form
↓
Enable "Copy to Clipboard"
```

### 2. Error Handling & Fallback Strategy

**Three-Tier Approach:**

1. **Primary**: OpenAI API with GPT-4o-mini
2. **Fallback**: Deterministic rule-based transformation
3. **User Action**: Retry button for transient failures

**Fallback Transformation Logic:**
```
Input: {activity, subject, goal}
    ↓
Apply vocabulary mapping (Rule D)
    ↓
Convert to active voice (Rule A - basic regex)
    ↓
Construct narrative: "[Verb] [Subject] [regarding/to] [Goal]"
    ↓
No AI enhancement - raw but compliant output
```

---

## API Integration Details

### OpenAI Configuration

**File:** `/lib/openai-client.ts`

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Client-side usage
});

export async function generateBillingNarrative(
  activity: string,
  subject: string,
  goal: string
): Promise<string> {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(activity, subject, goal);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3, // Lower for consistency
    max_tokens: 200,  // Billing entries are short
  });

  return completion.choices[0].message.content || '';
}
```

### System Prompt Structure

**File:** `/lib/prompt-builder.ts`

The system prompt encodes all transformation rules:

```typescript
export function buildSystemPrompt(): string {
  return `
You are a legal billing narrative generator for startup/tech law firms.

GOLDEN FORMULA (MANDATORY):
ActionVerb + SpecificTask + Context/Reason (Value)

TRANSFORMATION RULES:

1. ACTIVE VOICE ENFORCEMENT
   - Convert all passive/gerund verbs to past tense active
   - Examples: "Reviewing" → "Analyzed", "Working on" → "Structured"
   - NEVER start with: "Client", "Meeting", "Call"
   - ALWAYS start with: Action verb

2. CONTEXT INJECTION
   - Use templates: "...regarding [Issue]" or "...to [Goal]"
   - Always explain WHY the work was done

3. BLOCK BILLING SPLITTER
   - If multiple activities detected, output as separate numbered entries
   - Split on: "and", "also", "then"

4. STARTUP/TECH VOCABULARY
   - Replace generic terms:
     * "Review" → "Analyze/Audit/Validate"
     * "Draft" → "Structure/Configure"
     * "Talk/Email" → "Confer/Strategize"
     * "Fix" → "Reconcile/Refine"

5. FORBIDDEN PHRASES (auto-correct):
   - "Research" → "Legal research regarding [specific issue]"
   - "Meeting" → "Strategy conference"
   - "Review file" → "Analysis of case status"

OUTPUT: Single compliant billing narrative (or numbered list if block billing detected).
`;
}

export function buildUserPrompt(
  activity: string,
  subject: string,
  goal: string
): string {
  return `
Activity Type: ${activity}
Subject/Who/What: ${subject}
Goal/Purpose: ${goal}

Generate a compliant billing narrative following the Golden Formula.
`;
}
```

---

## Environment Variables

**File:** `.env.local` (gitignored)

```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk-...your-key-here
```

**Note:** Using `NEXT_PUBLIC_` prefix makes it available to client-side code. For MVP with your personal key only, this is acceptable. For production with user keys, consider a serverless API route or Vercel Edge Function.

---

## Session History Implementation

**State Management:**

```typescript
// In main page component
const [history, setHistory] = useState<HistoryEntry[]>([]);

interface HistoryEntry {
  id: string;
  timestamp: Date;
  input: {
    activity: string;
    subject: string;
    goal: string;
    time?: number;
  };
  output: string;
}

// Add to history after generation
function addToHistory(entry: HistoryEntry) {
  setHistory(prev => [entry, ...prev]); // Newest first
}
```

**Features:**
- Stored in component state (in-memory only)
- Cleared on page refresh
- Display as collapsible sidebar
- Click to view previous entries
- Copy button for each history item

---

## Theme Management

**Setup:** Using `next-themes` package

**File:** `/app/layout.tsx`

```typescript
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**File:** `/components/theme-toggle.tsx`

```typescript
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="..."
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </button>
  );
}
```

**TailwindCSS Config:** Enable dark mode class strategy

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
};
```

---

## Deployment Configuration

### Vercel Setup

1. **Connect Repository**: Link GitHub repo to Vercel project

2. **Environment Variables**: Set in Vercel dashboard
   ```
   NEXT_PUBLIC_OPENAI_API_KEY = sk-...
   ```

3. **Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`

4. **Domain**: Auto-deployed to `*.vercel.app`

### Build Optimization

```json
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
}
```

---

## Performance Considerations

### Client-Side API Calls

**Pros:**
- No backend infrastructure needed
- Instant deployment updates
- Simpler architecture for MVP

**Cons:**
- API key exposed in browser (mitigated: using your personal key only)
- Rate limiting applies per client
- No caching between users

**For MVP:** Acceptable. For production, consider Vercel Edge Functions as proxy.

### Loading States

```typescript
const [isGenerating, setIsGenerating] = useState(false);

async function handleGenerate() {
  setIsGenerating(true);
  try {
    const result = await generateBillingNarrative(...);
    // Handle result
  } catch (error) {
    // Handle error
  } finally {
    setIsGenerating(false);
  }
}
```

**UI Feedback:**
- Disable form inputs during generation
- Show spinner on Generate button
- Display "Generating..." status message

---

## Error Handling Strategy

### Error Types & Responses

| Error Type | Detection | User Message | Action |
|------------|-----------|--------------|---------|
| **Invalid API Key** | 401 status | "API configuration error" | Contact admin (N/A for MVP) |
| **Rate Limit** | 429 status | "API rate limit reached. Using fallback..." | Auto-fallback |
| **Network Error** | Timeout/offline | "Connection failed. Retry or use fallback?" | Retry + Fallback buttons |
| **API Error** | 500/503 status | "Service temporarily unavailable" | Retry button |
| **Validation Error** | Missing fields | "Please fill all required fields" | Highlight fields |

### Implementation

```typescript
async function generateWithFallback(
  activity: string,
  subject: string,
  goal: string
): Promise<{ output: string; method: 'ai' | 'fallback' }> {
  try {
    const output = await generateBillingNarrative(activity, subject, goal);
    return { output, method: 'ai' };
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Attempt fallback transformation
    const fallbackOutput = applyDeterministicRules(activity, subject, goal);
    
    return { 
      output: fallbackOutput, 
      method: 'fallback' 
    };
  }
}
```

**User Notification:**
```
⚠️ Using fallback mode (AI unavailable)
Output may be less polished but follows all core rules.
[Retry with AI] button
```

---

## Security Considerations

### API Key Protection

**Current Approach (MVP):**
- Environment variable at build time
- Your personal key only
- Client-side exposure acceptable for MVP

**Future Considerations:**
- Move to serverless API route (`/api/generate`)
- Keep API key server-side only
- Or: User provides their own key (stored in localStorage)

### CORS & Content Security

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

---

## Testing Strategy

### Unit Tests
- Transformation rules (Rule A, B, C, D)
- Fallback transformer logic
- Prompt builder functions

### Integration Tests
- API client with mocked OpenAI responses
- Error handling scenarios

### Manual Testing Checklist
- ✅ All activity types generate correctly
- ✅ Progressive disclosure works (Subject field appears)
- ✅ Fallback mode produces valid output
- ✅ Session history persists within session
- ✅ Theme toggle works correctly
- ✅ Copy to clipboard functionality
- ✅ Form clears after generation
- ✅ Mobile responsive design

---

## Future Enhancements (Not in MVP)

See `future-enhancements.md` for full list. Architecture implications:

- **User Authentication**: Add Clerk or NextAuth.js
- **Persistent Storage**: Vercel Postgres or Supabase
- **Batch Processing**: Server-side API route with job queue
- **Analytics**: Vercel Analytics or Plausible
- **A/B Testing**: Different prompt strategies

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Set environment variable
echo "NEXT_PUBLIC_OPENAI_API_KEY=sk-..." > .env.local

# Run dev server
npm run dev

# Open http://localhost:3000
```

### Deployment

```bash
# Push to main branch
git push origin main

# Vercel auto-deploys
# Or manual: vercel deploy --prod
```

---

## Cost Estimation

### OpenAI API (GPT-4o-mini)

**Pricing:**
- Input: $0.150 per 1M tokens
- Output: $0.600 per 1M tokens

**Per Request Estimate:**
- System prompt: ~500 tokens
- User input: ~50 tokens
- Output: ~100 tokens
- **Total: ~650 tokens per generation**

**Monthly Cost (Example):**
- 100 generations/day = 3,000/month
- 3,000 × 650 tokens = 1.95M tokens
- Input cost: ~$0.11
- Output cost: ~$0.18
- **Total: ~$0.30/month**

**Very affordable for MVP usage.**

---

## Monitoring & Observability

### Vercel Analytics (Built-in)
- Page views
- Web Vitals
- Deployment status

### Custom Logging
```typescript
// lib/logger.ts
export function logGeneration(
  success: boolean,
  method: 'ai' | 'fallback',
  duration: number
) {
  if (process.env.NODE_ENV === 'production') {
    // Could send to analytics service
    console.log({ success, method, duration });
  }
}
```

### Error Tracking
Consider adding Sentry for production error monitoring (future enhancement).

---

## Summary

This architecture provides:

✅ **Zero-backend complexity** - Pure client-side with external API  
✅ **Fast development** - Next.js + shadcn/ui + Vercel  
✅ **Graceful degradation** - Fallback mode when API fails  
✅ **Modern UX** - Progressive disclosure, dark mode, session history  
✅ **Cost-effective** - ~$0.30/month API costs for typical usage  
✅ **Production-ready** - TypeScript, error handling, responsive design  

**Next Steps:** Begin implementation with project scaffolding and core components.
