# Improve UX Text Task

Transform existing interface copy using the Four Quality Standards framework with before/after comparison and detailed scoring.

## Task Overview

This task takes existing UX text and improves it through systematic application of the Four Quality Standards: Purposeful, Concise, Conversational, and Clear.

## Elicitation Process

### 1. Get Original Text
```
Please share the interface text you want to improve.
```

### 2. Gather Context
```
Help me understand:

1. What type of UI element is this? (button, error, notification, etc.)
2. What is the user trying to do when they see this?
3. Where does this appear in your product?
4. What is the user's likely emotional state?
5. Are there any constraints? (character limits, technical requirements, brand guidelines)
```

### 3. Identify Priorities
```
What's most important to improve?

1. Make it more helpful/purposeful
2. Make it more concise
3. Make it sound more natural/human
4. Make it clearer/easier to understand
5. All of the above

(This helps prioritize if there are tradeoffs)
```

## Improvement Process

### Step 1: Analyze Original

Score the original text against four standards (0-10 each):

**Purposeful:**
- Does it help user achieve goals?
- Is value clear?
- Are concerns addressed?

**Concise:**
- Word count vs. benchmarks
- Unnecessary words?
- Front-loaded?

**Conversational:**
- Natural language?
- Active voice?
- Human tone?

**Clear:**
- Unambiguous?
- Specific verbs?
- Appropriate reading level?

### Step 2: Identify Issues

Common problems to look for:

**Purposeful issues:**
- Generic/vague purpose
- Doesn't help user progress
- Missing user benefit
- Doesn't address concerns

**Concise issues:**
- Redundant words ("please note that...")
- Passive constructions ("your request has been received")
- Unnecessary qualifiers ("very", "quite", "really")
- Buried key information

**Conversational issues:**
- Robotic phrases ("an error has occurred")
- Excessive passive voice
- Corporate jargon
- Missing natural connectors

**Clear issues:**
- Ambiguous language
- Technical jargon without explanation
- Generic verbs ("handle", "process")
- High reading level
- Inconsistent terminology

### Step 3: Apply Improvements

**For Purposeful:**
1. Front-load user benefit
2. Add missing context
3. Anticipate questions
4. Make value explicit

**For Concise:**
1. Remove qualifier words
2. Combine redundant phrases
3. Use shorter alternative words
4. Eliminate unnecessary preambles

**For Conversational:**
1. Convert passive to active voice
2. Replace robotic phrases with natural language
3. Write how you'd say it aloud
4. Add contractions where appropriate

**For Clear:**
1. Replace generic verbs with specific ones
2. Simplify complex words
3. Break long sentences
4. Add concrete details

### Step 4: Validate Improvements

Check improved version:
- [ ] Scores higher on all four standards
- [ ] Meets accessibility requirements
- [ ] Follows pattern best practices
- [ ] Respects any constraints
- [ ] Maintains appropriate tone

## Output Format

```markdown
## UX Text Improvement

### Before

**Original Text:**
[The original text]

**Context:** [UI element type and scenario]

**Quality Scoring:**
- Purposeful: [X]/10
- Concise: [X]/10
- Conversational: [X]/10
- Clear: [X]/10
- **Overall: [X]/10**

**Issues Identified:**
1. [Specific problem with standard reference]
2. [Specific problem with standard reference]
3. [Specific problem with standard reference]

---

### After

**Improved Text:**
[The improved text]

**Quality Scoring:**
- Purposeful: [X]/10 ↑ +[improvement]
- Concise: [X]/10 ↑ +[improvement]
- Conversational: [X]/10 ↑ +[improvement]
- Clear: [X]/10 ↑ +[improvement]
- **Overall: [X]/10** ↑ +[total improvement]

---

### What Changed & Why

**1. Purposeful Improvements:**
[Specific changes and why they help user/business goals]

**Example:**
- Removed: [vague phrase]
- Added: [specific user benefit]
- Impact: User now understands [what they gain]

**2. Concise Improvements:**
[Specific changes and word count reduction]

**Example:**
- Original word count: [X] words
- Improved word count: [Y] words
- Reduction: [Z] words ([%] shorter)
- Removed: [unnecessary phrases]

**3. Conversational Improvements:**
[Specific changes and natural language improvements]

**Example:**
- Changed: [robotic phrase] → [natural phrase]
- Voice: Passive → Active
- Tone: [how it's more natural]

**4. Clear Improvements:**
[Specific changes and clarity enhancements]

**Example:**
- Replaced: [generic verb] with [specific verb]
- Simplified: [complex phrase] to [simple phrase]
- Reading level: [old] → [new] grade

---

### Comparison Summary

| Aspect | Before | After | Improvement |
|--------|--------|-------|-------------|
| Word count | [X] | [Y] | -[Z] words |
| Character count | [X] | [Y] | -[Z] chars |
| Reading level | [X] grade | [Y] grade | Clearer |
| Active voice | No/Partial | Yes | More natural |
| User benefit | Unclear | Clear | More purposeful |

---

### Alternative Variations

[Provide 2-3 alternative improved versions with different approaches]

**Variation 1: [Focus]** (e.g., "Ultra-concise")
[Alternative text]
- When to use: [Context where this works better]

**Variation 2: [Focus]** (e.g., "More empathetic")
[Alternative text]
- When to use: [Context where this works better]

**Variation 3: [Focus]** (e.g., "More detailed")
[Alternative text]
- When to use: [Context where this works better]
```

## Common Improvements by Pattern

### Button Text
**Before:** "Submit Form" → **After:** "Submit application"
- More specific object
- Maintains active imperative

**Before:** "Click here to download" → **After:** "Download report"
- Removed "click here"
- Specific about what downloads

### Error Messages
**Before:** "Error 404: Page not found" → **After:** "We can't find that page. Check the URL or return home."
- Removed error code
- Added recovery action
- More empathetic

**Before:** "Invalid email address" → **After:** "Email must include @"
- Removed blame word "invalid"
- Specific requirement
- Shorter

### Empty States
**Before:** "There are no items here." → **After:** "No items yet. Add your first item to get started."
- Added "yet" for encouragement
- Clear call to action
- Future-oriented

### Success Messages
**Before:** "Your request has been successfully processed." → **After:** "Request processed."
- Removed passive voice
- Removed unnecessary "successfully"
- More concise

### Form Instructions
**Before:** "Please enter your email address in the field below." → **After:** "We'll send updates to this email."
- Focus on user benefit
- Removed obvious instruction
- More purposeful

## Accessibility Impact

When improving, ensure:

**Screen readers:**
- Improved text works without visual context
- Labels are descriptive
- Links describe destination

**Cognitive load:**
- Shorter sentences (8-14 words for critical content)
- Simpler vocabulary
- Clearer structure

**Plain language:**
- Lower reading level
- No jargon
- Common words

## Example Improvement

**Original:**
"An error has occurred while processing your payment transaction. Please try again later or contact our customer support team if the problem persists."

**Analysis:**
- Purposeful: 2/10 (doesn't explain or guide)
- Concise: 3/10 (22 words, very verbose)
- Conversational: 2/10 (robotic, passive)
- Clear: 2/10 (vague timing, unclear problem)
- **Overall: 2.25/10**

**Improved:**
"We couldn't process your payment. Check your card details and try again."

**New Analysis:**
- Purposeful: 9/10 (clear problem + solution)
- Concise: 9/10 (11 words, 50% shorter)
- Conversational: 9/10 (active voice, natural)
- Clear: 9/10 (specific action)
- **Overall: 9/10** ↑ +6.75

**What Changed:**
1. **Purposeful:** Specified what failed (payment), removed vague "contact support"
2. **Concise:** Removed "an error has occurred", "transaction", "if problem persists" (11 words saved)
3. **Conversational:** Changed passive to active ("we couldn't" vs "has occurred")
4. **Clear:** Specific action (check card) instead of vague (try later)

## Completion

After providing improvements:
1. Ask if user wants alternative versions
2. Offer to improve related text for consistency
3. Suggest full audit if multiple pieces need improvement
