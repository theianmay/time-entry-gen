# TimeCraft User Guide

Complete guide to using TimeCraft for legal billing narratives.

---

## Getting Started

### First Time Setup

1. Open TimeCraft in your browser
2. The app opens in dark mode by default
3. Click the sun/moon icon (top right) to toggle themes
4. You're ready to generate your first entry!

---

## Creating a Billing Narrative

### Step 1: Select Activity Type

Click one of the activity cards:

| Activity | Use For | Example Output Starts With |
|----------|---------|----------------------------|
| **Call** | Phone/video calls | "Telephone conference with..." |
| **Document Review** | Analyzing documents | "Analyzed [document] to..." |
| **Drafting** | Creating documents | "Drafted [document] for..." |
| **Research** | Legal research | "Researched [topic] regarding..." |
| **Email/Correspondence** | Written communications | "Correspondence with [party]..." |
| **Meeting** | In-person/virtual meetings | "Strategy conference with..." |
| **Analysis** | Strategic analysis | "Analyzed [subject] to..." |

**Tip:** The selected card will highlight in blue.

### Step 2: Fill in Subject/Who/What

After selecting an activity, a text field appears.

**Enter who or what was involved:**
- Person: "Founder", "Co-counsel", "Opposing counsel"
- Document: "Series A Term Sheet", "Stock Purchase Agreement"
- Entity: "Board of Directors", "Investor group"

**Examples:**
- ✅ "Founder"
- ✅ "Series A Term Sheet"
- ✅ "Cap Table"
- ❌ "the founder" (don't include "the")
- ❌ "reviewing" (don't include verbs)

### Step 3: Enter Goal/Purpose

**Describe what you were trying to accomplish:**
- "discuss funding structure"
- "identify control provisions"
- "clarify dilution terms"
- "determine next steps for closing"

**Tips:**
- Be specific but concise
- Focus on the "why" not the "what"
- Use business/legal terminology
- Avoid passive voice

### Step 4: Add Time (Optional)

**Enter time in 0.1 hour increments:**
- 0.1 hours = 6 minutes
- 0.5 hours = 30 minutes
- 1.0 hours = 60 minutes

**Note:** Time will be included when you copy to clipboard.

### Step 5: Generate

Click "Generate Billing Narrative" and wait 2-5 seconds.

**What happens:**
1. Form is disabled during generation
2. Button shows spinner and "Generating..."
3. Output appears below
4. Form resets automatically
5. Entry is added to session history

---

## Understanding the Output

### AI Mode (Default)

When your API key is valid and rate limits not exceeded:

**Input:**
- Activity: Call
- Subject: Founder
- Goal: discuss Series A structure

**Output:**
> "Telephone conference with Founder regarding Series A funding structure to determine optimal capitalization strategy and liquidation preferences."

**Characteristics:**
- Polished, professional language
- Adds context and value
- Follows Golden Formula precisely
- No fallback indicator

### Fallback Mode

When API is unavailable or rate limited:

**Same Input:**

**Output:**
> "Telephone conference with Founder regarding discuss Series A structure."

**Characteristics:**
- Simpler, more direct
- Follows basic rules
- Amber "Fallback Mode" indicator shown
- Still compliant with billing standards

---

## Using Session History

### Viewing History

After generating entries, a "Session History" card appears below.

**Shows:**
- Timestamp of generation
- Activity type and subject
- Fallback indicator (if applicable)
- Expand/collapse button
- Copy button

### Expanding Entries

Click the down arrow to see:
- Full goal/purpose
- Time duration (if entered)
- Complete output text

### Copying from History

Click the copy icon next to any entry to copy it to clipboard.

**What gets copied:**
- Full narrative text
- Time duration (if present)

### Clearing History

Click "Clear All" to remove all entries.

**Note:** History is cleared when you:
- Refresh the page
- Close the browser
- Clear browser data

---

## Tips for Best Results

### Writing Good Goals

**✅ Good:**
- "identify non-standard control provisions"
- "determine optimal cap table structure"
- "clarify vesting schedule terms"

**❌ Avoid:**
- "look at stuff" (too vague)
- "reviewing the document" (passive voice)
- "to see what's in it" (not professional)

### Activity Selection

**Choose the most specific activity:**
- Use "Call" for phone/video (not "Meeting")
- Use "Drafting" for creating docs (not "Document Review")
- Use "Email/Correspondence" for written comms (not "Call")

### Subject Clarity

**Be specific:**
- ✅ "Series A Term Sheet" (not "term sheet")
- ✅ "Co-founder" (not "founder" if there are multiple)
- ✅ "Stock Purchase Agreement" (not "SPA" unless standard)

---

## Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter/Space**: Select activity card (when focused)
- **Enter**: Submit form (when in text field)
- **Escape**: Clear focus

---

## Common Issues

### "Fallback Mode" Indicator

**Causes:**
- Rate limit exceeded (10/min, 60/hr, 200/day)
- Invalid or missing API key
- OpenAI API temporarily down
- Network connectivity issues

**Solution:**
- Wait for rate limit to reset
- Check API key in `.env.local`
- Use fallback output (still compliant)

### Form Won't Submit

**Check:**
- All required fields filled (red asterisk)
- Activity selected (card highlighted)
- No validation errors shown

### Output Seems Generic

**In Fallback Mode:**
- Expected - uses rule-based transformation
- Still follows billing best practices
- Wait for rate limit reset for AI mode

**In AI Mode:**
- Make goal more specific
- Add more context to subject
- Try regenerating

### History Disappeared

**Causes:**
- Page refreshed (history is session-only)
- Browser closed
- Browser data cleared

**Prevention:**
- Copy important entries immediately
- Use "Copy to Clipboard" before closing

---

## Rate Limits Explained

### Why Rate Limits?

- Prevent accidental API abuse
- Control costs (~$0.06/day max)
- Ensure fair usage

### Current Limits

| Window | Limit | Reset Time |
|--------|-------|------------|
| Minute | 10 | 60 seconds |
| Hour | 60 | 60 minutes |
| Day | 200 | 24 hours |

### What Happens When Limited?

1. Request automatically uses fallback mode
2. No error shown to user
3. Fallback indicator appears
4. Console shows reset time

### Checking Usage

Open browser console (F12) and run:
```javascript
localStorage.getItem('timecraft_rate_limit')
```

---

## Best Practices

### For Accuracy
1. Select the most specific activity type
2. Use proper names and titles
3. Be specific in goals
4. Review output before copying

### For Efficiency
1. Keep subject and goal concise
2. Use consistent terminology
3. Copy immediately after generation
4. Use session history for reference

### For Cost Control
1. Don't rapid-fire generate
2. Review before regenerating
3. Use fallback mode when appropriate
4. Clear history when done

---

## Examples by Practice Area

### Startup/Venture Capital

**Call with Founder**
- Subject: "Founder"
- Goal: "discuss Series A term sheet provisions"
- Output: "Telephone conference with Founder regarding Series A term sheet provisions to identify non-standard control rights and liquidation preferences."

**Document Review**
- Subject: "Stock Purchase Agreement"
- Goal: "identify representations and warranties"
- Output: "Analyzed Stock Purchase Agreement to identify representations and warranties requiring modification."

### Corporate

**Board Meeting**
- Subject: "Board of Directors"
- Goal: "discuss merger approval process"
- Output: "Strategy conference with Board of Directors regarding merger approval process to determine voting requirements and timeline."

### Litigation

**Call with Co-Counsel**
- Subject: "Co-counsel"
- Goal: "discuss discovery strategy"
- Output: "Telephone conference with co-counsel regarding discovery strategy to coordinate document production timeline."

---

## Troubleshooting

### Problem: Can't see Subject field

**Solution:** Select an activity type first (progressive disclosure)

### Problem: Time validation error

**Solution:** Use 0.1 increments only (0.1, 0.2, 0.3, etc.)

### Problem: Output too generic

**Solution:** Add more specific details to goal field

### Problem: Always in fallback mode

**Solution:** Check API key in `.env.local` file

---

## FAQ

**Q: Is my data saved?**  
A: No. History is session-only and cleared on refresh.

**Q: Can I edit generated output?**  
A: No. Copy to clipboard and edit in your billing system.

**Q: How much does it cost to use?**  
A: ~$0.0003 per generation with GPT-4o-mini. Max ~$0.06/day with rate limits.

**Q: Can I use this for multiple matters?**  
A: Yes. Generate as many entries as needed within rate limits.

**Q: Does it work offline?**  
A: Fallback mode works offline. AI mode requires internet.

**Q: Can I customize the output format?**  
A: Not in MVP. See future-enhancements.md for planned features.

---

## Getting Help

- Check this guide first
- Review [testing-checklist.md](testing-checklist.md) for known issues
- Check browser console for errors (F12)
- Open GitHub issue for bugs

---

**Last Updated:** Phase 5 Complete  
**Version:** 1.0
