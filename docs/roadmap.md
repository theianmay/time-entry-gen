# MVP Development Roadmap

## Project Overview

**Goal:** Build a client-side Next.js application that transforms attorney time entries into compliant billing narratives using the Golden Formula.

**Timeline:** 2-3 weeks for MVP launch  
**Team:** Solo developer  
**Deployment Target:** Vercel

---

## Development Phases

### Phase 0: Project Setup & Foundation
**Timeline:** 1-2 days  
**Status:** ✅ Complete

#### Tasks

- [x] **Initialize Next.js Project**
  ```bash
  npx create-next-app@latest time-entry-gen --typescript --tailwind --app
  ```
  - ✅ Use App Router
  - ✅ Enable TypeScript
  - ✅ Enable TailwindCSS
  - ✅ Enable ESLint

- [x] **Install Core Dependencies**
  ```bash
  npm install react-hook-form @hookform/resolvers zod
  npm install openai
  npm install next-themes
  npm install lucide-react
  ```

- [x] **Setup shadcn/ui**
  ```bash
  npx shadcn@latest init
  npx shadcn@latest add button card input textarea label form select
  ```

- [x] **Configure Environment Variables**
  - ✅ Create `.env.local` with `NEXT_PUBLIC_OPENAI_API_KEY`
  - ✅ Create `.env.example` template
  - ✅ `.env.local` in `.gitignore`

- [x] **Setup Git Repository**
  - ✅ Initialize Git repo
  - ✅ Create `.gitignore`
  - ✅ Initial commit

- [ ] **Configure Vercel Project** *(Deferred to later stage)*
  - Link GitHub repo to Vercel
  - Add environment variable in Vercel dashboard
  - Test initial deployment

**Deliverables:**
- ✅ Working Next.js app running on `localhost:3000`
- ✅ shadcn/ui components available
- ✅ All dependencies installed
- ✅ Environment variables configured
- ⏸️ Vercel deployment (deferred)

---

### Phase 1: Core UI & Layout
**Timeline:** 2-3 days  
**Status:** ✅ Complete

#### Tasks

- [x] **Create Base Layout**
  - ✅ Update `app/layout.tsx` with ThemeProvider
  - ✅ Add global styles in `app/globals.css` (shadcn configured)
  - ✅ Create main container with max-width centering
  - ✅ Update metadata (title, description)

- [x] **Implement Theme Toggle**
  - ✅ Create `components/theme-toggle.tsx`
  - ✅ Add sun/moon icons (Lucide)
  - ✅ Position in top-right corner
  - ✅ Test light/dark mode switching

- [x] **Build Activity Selection Component**
  - ✅ Create `components/activity-selector.tsx`
  - ✅ Design card/button layout for activities
  - ✅ Activities: Call, Document Review, Drafting, Research, Email, Meeting, Analysis
  - ✅ Implement selection state (active styling)
  - ✅ Make responsive (grid layout)
  - ✅ Add icons for each activity type

- [x] **Create Form Component Structure**
  - ✅ Create `components/entry-form.tsx`
  - ✅ Setup React Hook Form with Zod schema
  - ✅ Add form fields: activity, subject, goal, time
  - ✅ Implement progressive disclosure (subject appears after activity)

- [x] **Style Form Components**
  - ✅ Use shadcn/ui Input, Textarea, Label
  - ✅ Add placeholder text and help text
  - ✅ Style validation errors
  - ✅ Add loading states
  - ✅ Time input with 0.1 hour increments

- [x] **Create Output Display Component**
  - ✅ Create `components/output-display.tsx`
  - ✅ Design output card layout
  - ✅ Add "Copy to Clipboard" button
  - ✅ Add "Generate New Entry" button
  - ✅ Show fallback mode indicator

- [x] **Create Supporting Files**
  - ✅ `types/index.ts` - TypeScript type definitions
  - ✅ `lib/constants.ts` - Activity definitions and vocabulary mappings
  - ✅ `app/page.tsx` - Main application page with state management

**Deliverables:**
- ✅ Fully styled, responsive UI
- ✅ Activity selection working
- ✅ Progressive disclosure functioning
- ✅ Theme toggle working
- ✅ Form validation with Zod
- ✅ Mock generation (1.5s delay)
- ✅ Copy to clipboard functionality
- ⚠️ No API integration yet (Phase 2)

---

### Phase 2: API Integration & Core Logic
**Timeline:** 3-4 days  
**Status:** ✅ Complete

#### Tasks

- [x] **Create Type Definitions**
  - ✅ Create `types/index.ts`
  - ✅ Define `FormData`, `HistoryEntry`, `GenerationResult` types
  - ✅ Export all types

- [x] **Build Prompt Engineering System**
  - ✅ Create `lib/prompt-builder.ts`
  - ✅ Implement `buildSystemPrompt()` with all transformation rules
  - ✅ Implement `buildUserPrompt(activity, subject, goal)`
  - ✅ Document prompt structure
  - ✅ Add retry prompt builder

- [x] **Implement OpenAI Client**
  - ✅ Create `lib/openai-client.ts`
  - ✅ Initialize OpenAI SDK with API key
  - ✅ Implement `generateBillingNarrative()` function
  - ✅ Configure model: `gpt-4o-mini`
  - ✅ Set temperature: 0.3
  - ✅ Set max_tokens: 300
  - ✅ Add API key validation helpers

- [x] **Build Fallback Transformer**
  - ✅ Create `lib/fallback-transformer.ts`
  - ✅ Implement Rule A: Active voice conversion (regex-based)
  - ✅ Implement Rule D: Vocabulary mapping (lookup table)
  - ✅ Implement basic narrative construction
  - ✅ Create `applyDeterministicRules()` function
  - ✅ Add block billing detection

- [x] **Create Transformation Rules Module**
  - ✅ Already created in Phase 1: `lib/constants.ts`
  - ✅ Centralize vocabulary mappings
  - ✅ Activity-to-verb mappings
  - ✅ Export constants and helper functions

- [x] **Implement Error Handling Wrapper**
  - ✅ Create `lib/transformation-engine.ts`
  - ✅ Create `generateWithFallback()` function
  - ✅ Try OpenAI API first
  - ✅ Catch errors and attempt fallback
  - ✅ Return result with method indicator
  - ✅ Add retry logic for transient failures (exponential backoff)
  - ✅ Add output validation

- [x] **Integrate API with Form**
  - ✅ Connect form submission to API call in `app/page.tsx`
  - ✅ Show loading state during generation
  - ✅ Display results in output component
  - ✅ Handle errors gracefully
  - ✅ Show fallback mode indicator

**Deliverables:**
- ✅ OpenAI API integration working
- ✅ Fallback mode functional
- ✅ End-to-end generation flow complete
- ✅ Error handling tested

---

### Phase 3: Session History & UX Polish
**Timeline:** 2-3 days  
**Status:** ✅ Complete

#### Tasks

- [x] **Create Session History Component**
  - ✅ Create `components/session-history.tsx`
  - ✅ Design collapsible card layout
  - ✅ Show newest entries first
  - ✅ Display timestamp, input summary, and output
  - ✅ Add "Copy" button for each entry
  - ✅ Implement expand/collapse for entry details
  - ✅ Add "Clear All" button
  - ✅ Show fallback indicator for entries

- [x] **Add State Management for History**
  - ✅ Add `history` state to main page
  - ✅ Add entries to history on successful generation
  - ✅ Store: id, timestamp, input, output, usedFallback
  - ✅ Keep in component state (in-memory only)
  - ✅ Implement `handleClearHistory()` function

- [x] **Implement Copy to Clipboard**
  - ✅ Use Clipboard API
  - ✅ Add visual feedback (icon color change)
  - ✅ Include time duration in copied text
  - ✅ Handle clipboard errors

- [x] **Add Form Reset After Generation**
  - ✅ Clear form fields after successful generation (React Hook Form reset)
  - ✅ Reset to initial state
  - ✅ Activity selector clears

- [x] **Implement Loading States**
  - ✅ Disable form during generation
  - ✅ Show spinner on Generate button
  - ✅ Display "Generating..." message
  - ✅ Form inputs disabled via isGenerating prop

- [x] **Add Validation Error Messages**
  - ✅ Show field-level errors (red text via FormMessage)
  - ✅ Highlight invalid fields
  - ✅ Show error on empty required fields (Zod validation)
  - ✅ Format time field validation (0.1 increments)
  - ✅ Disable autocomplete on subject/goal fields

- [x] **Mobile Responsive Design**
  - ✅ Activity cards use responsive grid (2/3/4 columns)
  - ✅ History component stacks properly on mobile
  - ✅ Container max-width for readability
  - ✅ Touch-friendly button sizes

**Deliverables:**
- ✅ Session history working
- ✅ Copy to clipboard functional
- ✅ Form resets properly
- ✅ Mobile responsive
- ✅ All loading/error states handled

---

### Phase 4: Testing & Refinement
**Timeline:** 2-3 days  
**Status:** Not Started

#### Tasks

- [ ] **Manual Testing Scenarios**
  - Test all activity types
  - Test progressive disclosure
  - Test validation (empty fields, invalid time)
  - Test OpenAI API success path
  - Test fallback mode (disconnect internet)
  - Test error recovery and retry
  - Test theme toggle persistence
  - Test session history (add 10+ entries)
  - Test copy to clipboard

- [ ] **Cross-Browser Testing**
  - Chrome/Edge (Chromium)
  - Firefox
  - Safari (macOS/iOS)
  - Mobile browsers (iOS Safari, Chrome Android)

- [ ] **Accessibility Audit**
  - Keyboard navigation works
  - Focus indicators visible
  - ARIA labels on interactive elements
  - Color contrast meets WCAG AA
  - Screen reader compatible

- [ ] **Performance Optimization**
  - Check bundle size
  - Optimize images (if any)
  - Lazy load components if needed
  - Test API response times
  - Monitor Vercel build times

- [ ] **Error Scenario Testing**
  - Invalid API key
  - Rate limit exceeded
  - Network timeout
  - Malformed API response
  - Empty API response

- [ ] **UI Polish**
  - Smooth transitions/animations
  - Consistent spacing
  - Clean typography
  - Professional color scheme
  - Polish hover states

**Deliverables:**
- ✅ All test scenarios pass
- ✅ No critical bugs
- ✅ Accessible to WCAG AA standards
- ✅ Fast load times (<2s)
- ✅ Professional appearance

---

### Phase 5: Documentation & Launch
**Timeline:** 1-2 days  
**Status:** Not Started

#### Tasks

- [ ] **Write README.md**
  - Project description
  - Features list
  - Setup instructions
  - Environment variables guide
  - Deployment instructions
  - Usage guide with screenshots

- [ ] **Add Code Comments**
  - Document complex logic
  - Add JSDoc comments to key functions
  - Explain prompt engineering decisions
  - Comment transformation rules

- [ ] **Create User Guide**
  - How to use the app
  - Activity type descriptions
  - Examples for each scenario
  - Tips for best results

- [ ] **Prepare Demo Data**
  - Create example entries for screenshots
  - Test scenarios for demonstrations

- [ ] **Final Deployment**
  - Merge all changes to main branch
  - Trigger production deployment on Vercel
  - Verify production environment variables
  - Test production build thoroughly

- [ ] **Monitor Initial Usage**
  - Check Vercel logs for errors
  - Monitor OpenAI API usage
  - Track costs
  - Collect initial feedback

**Deliverables:**
- ✅ Complete README
- ✅ User-facing documentation
- ✅ Production deployment live
- ✅ Monitoring in place

---

## Milestones

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Project Setup Complete | Day 2 | ⏳ Pending |
| UI/UX Foundation Ready | Day 5 | ⏳ Pending |
| API Integration Working | Day 9 | ⏳ Pending |
| Feature Complete | Day 12 | ⏳ Pending |
| Testing Complete | Day 15 | ⏳ Pending |
| Production Launch | Day 17 | ⏳ Pending |

---

## Success Criteria

### Functional Requirements
- ✅ User can select activity type from visual cards
- ✅ Subject field appears after activity selection (progressive disclosure)
- ✅ Form validates all required fields before submission
- ✅ OpenAI API generates compliant billing narratives
- ✅ Fallback mode works when API unavailable
- ✅ Generated output follows Golden Formula syntax
- ✅ Copy to clipboard works reliably
- ✅ Session history persists within browser session
- ✅ Form clears after successful generation
- ✅ Light/dark mode toggle works and persists

### Technical Requirements
- ✅ TypeScript with no `any` types
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Fast load time (<2s on 3G)
- ✅ No console errors in production
- ✅ Accessible (keyboard nav, screen readers)
- ✅ Deployed to Vercel with auto-deploy on push

### User Experience Requirements
- ✅ Intuitive interface (no instructions needed)
- ✅ Clear error messages
- ✅ Smooth transitions and feedback
- ✅ Professional visual design
- ✅ Loading states prevent confusion

---

## Risk Management

### Identified Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **OpenAI API Rate Limits** | High | Medium | Implement fallback transformer, add retry logic |
| **API Key Exposure** | Medium | Low | Using env var (MVP acceptable), document for production |
| **Poor AI Output Quality** | High | Medium | Refine system prompt, test extensively, fallback option |
| **Browser Compatibility** | Medium | Low | Use standard APIs, test cross-browser, provide fallbacks |
| **Mobile UX Issues** | Medium | Medium | Design mobile-first, test early and often |
| **Scope Creep** | Medium | High | Stick to MVP features, defer to future-enhancements.md |

---

## Future Iterations (Post-MVP)

See `future-enhancements.md` for full list. Priority candidates:

1. **User Authentication** - Save history across sessions
2. **Export Options** - CSV, JSON formats
3. **Batch Processing** - Multiple entries at once
4. **Custom Prompts** - User-defined tone/style
5. **Analytics Dashboard** - Usage stats, cost tracking

---

## Daily Development Log

### Week 1
- **Day 1**: [Date] - Project setup, Next.js initialized
- **Day 2**: [Date] - shadcn/ui installed, Vercel connected
- **Day 3**: [Date] - Base layout and theme toggle complete
- **Day 4**: [Date] - Activity selector and form structure built
- **Day 5**: [Date] - Form styling and progressive disclosure working

### Week 2
- **Day 6**: [Date] - Prompt engineering and OpenAI client created
- **Day 7**: [Date] - Fallback transformer implemented
- **Day 8**: [Date] - API integration complete, end-to-end working
- **Day 9**: [Date] - Error handling and retry logic added
- **Day 10**: [Date] - Session history component built

### Week 3
- **Day 11**: [Date] - Copy to clipboard and UX polish
- **Day 12**: [Date] - Mobile responsive design complete
- **Day 13**: [Date] - Manual testing all scenarios
- **Day 14**: [Date] - Cross-browser and accessibility testing
- **Day 15**: [Date] - Bug fixes and final polish
- **Day 16**: [Date] - Documentation and README
- **Day 17**: [Date] - Production deployment and launch

---

## Notes & Decisions

### Architecture Decisions
- **Client-side only**: No backend simplifies MVP, acceptable for single-user
- **React Hook Form + Zod**: Best DX for progressive disclosure and validation
- **shadcn/ui**: Provides professional components quickly
- **GPT-4o-mini**: Balance of quality and cost (~$0.30/month estimated)

### Design Decisions
- **Progressive disclosure**: Reduces cognitive load, guides user input
- **Activity cards**: Visual, faster than dropdown
- **Session history**: Useful reference, no persistence needed for MVP
- **Fallback mode**: Ensures app always produces output

### Deferred Decisions (Future Phases)
- User authentication
- Persistent storage
- Server-side API proxy
- Batch processing
- Custom vocabulary rules

---

## Contact & Resources

**Project Repository:** [GitHub Link TBD]  
**Production URL:** [Vercel URL TBD]  
**Documentation:** See `/docs` folder

**Key Documents:**
- `vision.md` - Product vision and Golden Formula
- `technical-architecture.md` - Technical details
- `future-enhancements.md` - Post-MVP features
- `roadmap.md` - This document

---

*Last Updated: [Date]*  
*Status: Planning Phase*
