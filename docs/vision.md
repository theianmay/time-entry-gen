# Legal Billing Narrative Generator - MVP Vision

## Overview

This application transforms raw, unstructured attorney notes into compliant, value-justified billing narratives. The system enforces best practices in legal billing through AI-powered transformation rules, ensuring every entry follows the "Golden Formula."

---

## Core Function

**Input:** Raw attorney notes (passive, vague, or block-billed entries)  
**Output:** Compliant, value-driven billing narratives

### The Golden Formula

Every generated output adheres to this syntax:

```
ActionVerb + SpecificTask + Context/Reason (Value)
```

**Example:**  
`Analyzed Series A Term Sheet to identify non-standard control provisions`

---

## MVP User Flow

**Pattern:** Structured Three-Field with Progressive Disclosure

### Input Fields

1. **Activity Type** (Required)
   - UI: Card/button interface
   - Options: Call, Document Review, Drafting, Research, Email/Correspondence, Meeting, Analysis, etc.
   - Maps to: `ActionVerb` component of Golden Formula

2. **Subject/Who/What** (Required)
   - UI: Dropdown or text field (conditionally revealed after Activity selection)
   - Examples: "Founder", "Series A Term Sheet", "Co-counsel", "Cap Table", "Stock Purchase Agreement"
   - Maps to: `SpecificTask` component of Golden Formula

3. **Goal/Purpose** (Required)
   - UI: Free-text field
   - Prompt: "What was the purpose or goal?"
   - Examples: "discuss funding structure", "identify control provisions", "clarify dilution terms"
   - Maps to: `Context/Reason (Value)` component of Golden Formula

4. **Time Duration** (Optional)
   - UI: Number input
   - Format: 0.1-hour increments (6-minute billing blocks)
   - Default: Empty (can be added to time tracking later)

### Flow Sequence

```
User lands on form
    ↓
Selects Activity Type (cards/buttons)
    ↓
Subject field appears (progressive disclosure)
    ↓
User fills Subject + Goal
    ↓
(Optional) User adds time duration
    ↓
Clicks "Generate"
    ↓
System outputs compliant narrative(s)
```

### Example Entry

**Input:**
- Activity: `Call`
- Subject: `Founder`
- Goal: `discuss Series A term sheet provisions`
- Time: `0.3` (18 minutes)

**Output:**
```
"Telephone conference with Founder regarding Series A term sheet 
provisions to identify non-standard control rights and liquidation 
preferences"
```

---

## Transformation Rules

The AI enforces four core rules to ensure best-practice output:

### Rule A: Active Voice Enforcement

**Logic:**  
- Detect passive/gerund inputs: `"Reviewing"`, `"Working on"`, `"Drafting"`
- Convert to past tense active verbs: `"Analyzed"`, `"Structured"`, `"Drafted"`

**Constraint:**  
- Never start sentences with `"Client"`, `"Meeting"`, or `"Call"`
- Always start with the action verb

**Example:**
```
Input:  "Reviewing contract"
Output: "Analyzed contract to..."
```

---

### Rule B: "Why" Injection (Context)

**Logic:**  
- System combines predefined activity type with user-provided goal
- Infers context based on document type when possible
- Uses templates: `"...in order to [Goal]"` or `"...regarding [Issue]"`

**Example:**
```
Activity: "Call"
Goal:     "discuss funding terms"
Output:   "Telephone conference with Founder regarding funding terms 
           to determine Series A structure"
```

---

### Rule C: Block Billing Splitter

**Logic:**  
- Detect conjunctions: `"and"`, `"also"`, `"then"`
- Identify multiple distinct verbs in single input
- Break into separate line items

**Example:**
```
Input:    "Drafted email and called investor"

Output 1: "Drafted correspondence to investor regarding..."
Output 2: "Telephone conference with investor to..."
```

---

### Rule D: Startup/Tech Vocabulary Mapping

**Logic:**  
Replace generic legal terms with commercial, value-driven language suitable for startup/tech clients.

| Raw Input (Generic) | Generated Output (High Value) |
|---------------------|-------------------------------|
| Review / Look at    | Audit / Analyze / Validate    |
| Write / Draft       | Structure / Configure / Iterate |
| Talk to / Email     | Strategize / Advise / Confer  |
| Fix / Change        | Reconcile / Redline / Refine  |

---

## Validation Examples

The MVP is successful if it achieves these transformations:

### Scenario 1: The Vague Email

```
Input:  "emails re cap table"
Output: "Correspondence with client regarding capitalization table 
         reconciliation to ensure accurate dilution modeling"
```

### Scenario 2: The Passive Review

```
Input:  "reviewing term sheet"
Output: "Analyzed Series A Term Sheet to identify non-standard 
         control provisions and liquidation preferences"
```

### Scenario 3: The Block Bill

```
Input:  "call with co-counsel and worked on motion"

Output:
  1. "Telephone conference with co-counsel regarding strategy 
      for upcoming hearing"
  2. "Drafted initial arguments for Motion to Dismiss"
```

---

## The "Forbidden" Filter

The system auto-corrects phrases that commonly cause billing write-offs:

| Forbidden Input | Auto-Correction |
|----------------|------------------|
| "Research" (standalone) | "Legal research regarding [Specific Issue]..." |
| "Meeting" | "Strategy conference..." |
| "Review file" | "Analysis of case status..." |
| "Miscellaneous" | *(Not available in MVP)* |

---

## Success Criteria

- Converts all passive/gerund inputs to active voice
- Integrates user-selected activity with goal context
- Splits block-billed entries into discrete line items
- Applies startup/tech vocabulary consistently
- Prevents forbidden phrases from appearing in output
- Supports optional time entry in 0.1-hour increments