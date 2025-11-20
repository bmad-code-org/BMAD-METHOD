# UX Writing Benchmarks & Research-Backed Metrics

Research-validated benchmarks for creating effective interface copy.

## Sentence Length & Comprehension

### Comprehension Rates by Word Count

Based on readability research:

- **8 words or fewer**: 100% user comprehension
- **14 words or fewer**: 90% user comprehension
- **20 words**: 80% user comprehension
- **25 words**: Maximum before significant comprehension drop
- **30+ words**: Comprehension drops below 60%

### Recommended Sentence Lengths by Content Type

**Critical Content (errors, warnings, confirmations):**
- Target: 8-14 words maximum
- Why: Users need immediate understanding in high-stress moments
- Example: "Delete account? You'll lose all data and this can't be undone." (12 words - 90% comprehension)

**Instructions & Guidance:**
- Target: 14 words ideal, 20 words maximum
- Why: Clear step-by-step requires brevity
- Example: "Connect your bank to see spending insights. We'll guide you through it." (13 words)

**Body/Explanatory Text:**
- Target: 15-20 words average per sentence
- Why: Provides context while maintaining readability
- Example: "Your free trial includes all premium features for 30 days. After that, choose a plan or continue with our free version." (22 words - acceptable for explanation)

**Buttons & CTAs:**
- Target: 2-4 words ideal, 6 words absolute maximum
- Why: Users need instant recognition of action
- Examples: "Save changes" (2 words), "Start free trial" (3 words)

**Titles & Headers:**
- Target: 3-6 words, 40 characters maximum
- Why: Scannable navigation and orientation
- Examples: "Account settings" (2 words), "Your trip history" (3 words)

---

## Character & Line Length

### Optimal Reading Line Length

**Research-backed range: 40-60 characters per line**

**Why it matters:**
- **Below 40 chars**: Too choppy, excessive eye movement
- **40-60 chars**: Optimal reading rhythm and comprehension
- **Above 60 chars**: Eye strain, loss of reading position

### Character Limits by UI Element

**Buttons:**
- Ideal: 15-25 characters
- Maximum: 40 characters
- Examples: "Save changes" (12 chars ✓), "Submit application" (18 chars ✓)

**Page Titles:**
- Ideal: 20-40 characters
- Maximum: 50 characters
- Truncates in most UIs beyond this

**Notification Titles:**
- Ideal: 25-35 characters
- Maximum: 45 characters
- Mobile truncation happens earlier

**Notification Body:**
- Ideal: 80-120 characters
- Maximum: 180 characters
- 2-3 lines on mobile

**Error Messages:**
- Ideal: 80-140 characters
- Maximum: 200 characters
- Includes problem + solution

**Toast/Snackbar Messages:**
- Ideal: 40-80 characters
- Maximum: 100 characters
- Brief, glanceable confirmations

---

## Reading Level Guidelines

### Flesch-Kincaid Grade Level Targets

**General Public / Consumer Products:**
- **Target**: 7th-8th grade
- **Why**: Accessible to 80% of US adults
- **Examples**: Banking apps, social media, e-commerce

**Professional Tools / B2B SaaS:**
- **Target**: 9th-10th grade
- **Why**: Professional audience expects slight elevation
- **Examples**: Project management, CRM, analytics tools

**Technical Products / Developer Tools:**
- **Target**: 10th-11th grade
- **Why**: Technical terminology necessary
- **Examples**: IDEs, API documentation, dev platforms

**Specialized Fields (Legal, Medical, Academic):**
- **Target**: 11th-12th grade
- **Why**: Domain-specific language required
- **Note**: Only when absolutely necessary; plain language preferred

### Reading Ease Scores (Flesch Reading Ease)

- **90-100**: Very Easy (5th grade)
- **80-90**: Easy (6th grade)
- **70-80**: Fairly Easy (7th grade) ← Target for consumer products
- **60-70**: Standard (8th-9th grade) ← Target for professional tools
- **50-60**: Fairly Difficult (10th-12th grade)
- **30-50**: Difficult (College)
- **0-30**: Very Difficult (Graduate)

---

## Word Count Benchmarks

### By UI Pattern

**Buttons:**
- Minimum: 1 word (rare, only icons + ARIA labels)
- Ideal: 2-4 words
- Maximum: 6 words
- Examples:
  - "Save" (1 word - acceptable for common actions)
  - "Save changes" (2 words - ideal)
  - "Save and continue" (3 words - good)
  - "Delete account permanently" (3 words - maximum for destructive)

**Error Messages:**
- Inline validation: 3-6 words
  - "Email must include @" (4 words)
- Detour errors: 10-15 words
  - "Payment failed. Check your card details and try again." (10 words)
- Blocking errors: 15-25 words
  - "Service temporarily unavailable. We're updating and will be back in 15 minutes. Your data is safe." (17 words)

**Success Messages:**
- Brief confirmations: 2-5 words
  - "Changes saved" (2 words)
  - "Email sent successfully" (3 words)
- Detailed success: 8-15 words
  - "Trip saved. You'll get a reminder 30 minutes before your bus arrives." (13 words)

**Empty States:**
- Title: 2-5 words
  - "No messages yet" (3 words)
- Body: 8-15 words
  - "Start a conversation to connect with your team." (8 words)
- Total: 10-20 words (title + body + CTA)

**Notifications:**
- Title only: 4-8 words
  - "Your bus is arriving" (4 words)
- Title + body: 15-25 words total
  - "Your bus is arriving. Route 42 to Downtown arrives in 2 minutes at Bay St." (15 words)

**Form Labels:**
- Ideal: 2-4 words
- Maximum: 6 words
- Examples: "Email address" (2 words), "Phone number" (2 words)

**Form Instructions (Helper Text):**
- Ideal: 6-12 words
- Maximum: 20 words
- Example: "We'll send trip updates to this email" (7 words)

**Tooltips:**
- Ideal: 8-15 words
- Maximum: 25 words
- Brief, contextual explanation

---

## Active vs. Passive Voice

### Target: 85% Active Voice

**Why it matters:**
- Active voice is clearer and more engaging
- Passive voice adds words and obscures responsibility
- Active voice feels more conversational and human

**Examples:**

| Passive (Wordy & Unclear) | Active (Clear & Concise) | Words Saved |
|---------------------------|-------------------------|-------------|
| "Your payment has been processed" | "We processed your payment" | 1 word |
| "Your request has been received" | "We received your request" | 1 word |
| "An error has occurred" | "We found an error" | 1 word |
| "Your file is being uploaded" | "We're uploading your file" | 1 word |

**When passive voice is acceptable:**
- When actor is unknown: "Your session expired" (vs unclear "We expired your session")
- When action is more important than actor: "File deleted" (vs "You deleted the file")
- When avoiding blame: "Payment declined" (vs "Your bank declined payment")

---

## Accessibility Benchmarks

### WCAG Compliance

**WCAG Level AA Requirements for Text:**
- Color contrast: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- Text alternatives: All images and icons have text equivalents
- Link text: Descriptive (not "click here")
- Form labels: Present and programmatically associated
- Error identification: Text description (not color alone)

### Cognitive Accessibility

**Sentence length for maximum accessibility:**
- **8-14 words**: Optimal for users with cognitive disabilities
- **Keep paragraphs to 3-4 sentences maximum**
- **Use headings every 3-4 paragraphs**

**Plain language requirements:**
- Define abbreviations on first use
- Avoid idioms and metaphors
- Use common words over complex ones
- Provide explanations for technical terms

---

## Mobile vs. Desktop Considerations

### Mobile-Specific Benchmarks

**Character limits (tighter due to screen size):**
- Button labels: 12-18 characters (vs 25 desktop)
- Page titles: 25-35 characters (vs 50 desktop)
- Notification text: 60-100 characters (vs 180 desktop)

**Word counts (same or fewer):**
- Follow desktop benchmarks or go shorter
- Mobile users scan even faster
- Thumb-friendly tap targets need brief labels

**Line length (narrower):**
- Target: 30-50 characters per line
- Mobile screens naturally constrain line length
- Avoid artificially wide text blocks

---

## Industry-Specific Benchmarks

### E-commerce

**Product titles:** 50-60 characters optimal for search
**Add to cart button:** "Add to cart" (3 words) or "Add to bag" (3 words)
**Checkout buttons:** "Proceed to checkout" (3 words), "Complete purchase" (2 words)
**Error messages:** Critical for cart abandonment - must be under 15 words

### Finance/Banking

**Security messages:** Can be slightly longer (18-25 words) to establish trust
**Transaction confirmations:** Be very specific - 12-20 words
**Reading level:** Target 8th grade despite professional domain
**Error messages:** Must include recovery steps - 15-20 words

### Healthcare

**Privacy notices:** Can be longer but break into sections
**Appointment confirmations:** Be extremely specific - 15-25 words
**Medication instructions:** Critical clarity - 10-18 words per step
**Reading level:** 6th-7th grade (lowest acceptable for health literacy)

### SaaS/Productivity

**Onboarding:** Can be more verbose (20-30 words) to educate
**Feature tooltips:** 12-20 words for explanation
**Error messages:** Include support links - 15-25 words
**Empty states:** Emphasize value - 15-25 words total

---

## Testing & Measurement Tools

### Readability Testing

**Free Tools:**
- **Hemingway Editor** (hemingwayapp.com): Highlights complex sentences, passive voice
- **Readable** (readable.com): Multiple readability scores
- **Microsoft Word**: Built-in Flesch-Kincaid scoring
- **Grammarly**: Readability score and suggestions

**What to measure:**
- Flesch-Kincaid Grade Level
- Flesch Reading Ease Score
- Average sentence length
- Passive voice percentage

### Usability Testing

**Comprehension testing:**
- Show text to 5 users
- Ask: "What do you think happens when you click this?"
- Target: 100% correct interpretation

**Time to comprehension:**
- Users should understand in 2 seconds or less
- If users pause or reread, text needs work

**A/B testing:**
- Test concise vs. verbose versions
- Measure task completion rate
- Track error rates

---

## Quick Reference Table

| UI Element | Words | Characters | Reading Level | Comprehension |
|-----------|-------|-----------|---------------|---------------|
| Button | 2-4 (6 max) | 15-25 | 7th grade | 100% |
| Error inline | 3-6 | 25-40 | 7th grade | 100% |
| Error detour | 10-15 | 80-120 | 7th grade | 90% |
| Error blocking | 15-25 | 120-180 | 8th grade | 90% |
| Success brief | 2-5 | 15-35 | 7th grade | 100% |
| Success detailed | 8-15 | 60-100 | 7th grade | 90% |
| Empty state title | 2-5 | 20-35 | 7th grade | 100% |
| Empty state body | 8-15 | 60-100 | 7th grade | 90% |
| Notification | 15-25 | 100-180 | 8th grade | 90% |
| Form label | 2-4 | 15-30 | 7th grade | 100% |
| Form instruction | 6-12 | 50-80 | 7th grade | 90% |
| Tooltip | 8-15 | 60-100 | 8th grade | 90% |

---

## References & Research Sources

- Nielsen Norman Group: "How Users Read on the Web" (F-pattern, scanning behavior)
- Readable.io: Sentence length and comprehension studies
- American Press Institute: Readability research
- WCAG 2.1: Accessibility guidelines
- Flesch-Kincaid: Reading ease formula
- Material Design: Content guidelines
- Sarah Richards: "Content Design" (UK Government Digital Service research)
- Ginny Redish: "Letting Go of the Words" (usability research)

