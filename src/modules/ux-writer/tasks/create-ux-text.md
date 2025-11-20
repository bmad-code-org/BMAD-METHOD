# Create UX Text Task

Create new interface copy for specific UI patterns using the Four Quality Standards framework and research-backed best practices.

## Task Overview

This task guides you through creating effective interface copy for common UI elements: buttons, error messages, success messages, empty states, notifications, form fields, and onboarding flows.

## Elicitation Process

### 1. Identify Pattern Type

```
What type of interface copy do you need?

1. Button or link
2. Error message
3. Success/confirmation message
4. Empty state
5. Notification
6. Form field (label, instruction, placeholder)
7. Onboarding step
8. Other (please describe)

Please select a number or describe your need.
```

### 2. Gather Context

**For all patterns, ask:**
```
Help me understand the context:

1. **User goal:** What is the user trying to accomplish?
2. **User state:** How is the user likely feeling? (confident, frustrated, confused, cautious, excited)
3. **Stakes:** Is this low-stakes (changing theme) or high-stakes (deleting data)?
4. **Constraints:** Any character limits, technical constraints, or requirements?
```

### 3. Pattern-Specific Questions

**For buttons:**
- What action does this button trigger?
- Is this primary, secondary, or destructive action?

**For error messages:**
- What failed or went wrong?
- Why did it fail (if known)?
- What can the user do to fix it?
- What type: inline validation, system error, or blocking error?

**For empty states:**
- Why is this empty? (first use, user cleared, no results)
- What action would populate this?

**For success messages:**
- What action just completed?
- What benefit did the user get?

**For notifications:**
- What information needs to be communicated?
- Is action required or is this passive information?
- How time-sensitive is this?

**For form fields:**
- What information are you collecting?
- Why do you need this information?
- Are there specific format requirements?

## Creation Framework

Apply the Four Quality Standards:

### 1. Purposeful
- Identify the primary goal (user + business)
- Anticipate user questions/concerns
- Include value proposition when needed

### 2. Concise
- Start with conversational version, then trim
- Remove unnecessary words
- Meet pattern-specific benchmarks
- Front-load key information

### 3. Conversational
- Write how you'd say it
- Use active voice (85% of time)
- Include natural connecting words
- Avoid corporate jargon

### 4. Clear
- Use specific, accurate verbs
- Target appropriate reading level
- Avoid ambiguity
- Use consistent terminology

## Pattern-Specific Guidelines

### Buttons
**Format:** `[Verb] [object]`
**Style:** Active imperative, sentence case
**Length:** 2-4 words ideal, 6 maximum

**Examples:**
- ✅ "Save changes"
- ✅ "Delete account"
- ✅ "Start free trial"
- ❌ "Submit"
- ❌ "OK"
- ❌ "Click here"

**Process:**
1. Identify the action
2. Choose specific verb (not generic)
3. Add object for clarity
4. Keep under 6 words

### Error Messages

**Format:** `[What failed]. [Why, if known]. [What to do].`

**Types:**

**Inline (validation):** Brief guidance
- Pattern: `[Field] [requirement]`
- Example: "Email must include @"
- Length: 3-6 words

**Detour (recoverable):** Problem + solution
- Example: "Payment failed. Check your card details and try again."
- Length: 10-15 words

**Blocking (system):** Explanation + timeline + reassurance
- Example: "Service temporarily unavailable. We're updating our systems and will be back in 15 minutes. Your data is safe."
- Length: 15-25 words

**Key principles:**
- Never blame user
- Be empathetic
- Provide clear recovery path
- Use active voice
- Front-load the problem

### Success Messages
**Format:** `[Action completed] [result/benefit]`
**Style:** Past tense, specific, encouraging
**Length:** 2-5 words ideal

**Examples:**
- ✅ "Changes saved"
- ✅ "Email sent"
- ✅ "Profile updated"
- ❌ "Success!"
- ❌ "Operation completed successfully"

### Empty States
**Format:** Explanation + CTA

**Structure:**
- **Title:** Why it's empty (3-6 words)
- **Body:** Brief guidance (8-15 words)
- **CTA:** Clear next action (2-4 words)

**Example:**
```
No messages yet
Start a conversation to connect with your team.
[Send message]
```

**Types:**
- **First use:** Encourage first action
- **User cleared:** Celebrate completion
- **No results:** Suggest alternative

### Notifications
**Format:** Title + optional body

**Structure:**
- **Title:** Verb-first, specific (6-12 words)
- **Body:** Context and details (10-20 words)
- **Action:** Clear CTA if needed (2-4 words)

**Example:**
```
Your bus is arriving
Route 42 to Downtown arrives in 2 minutes at Bay St.
```

### Form Fields
**Elements:**

**Label:** Noun phrase describing input
- Examples: "Email address", "Phone number", "Date of birth"
- Keep to 2-4 words

**Instruction (helper text):** Explain why needed
- Example: "We'll send updates to this email"
- Length: 6-12 words

**Placeholder:** Use sparingly, standard formats only
- Examples: "name@example.com", "(555) 555-5555"

**Error:** Specific correction guidance
- Example: "Must include @ symbol"

## Output Format

Present created copy in this structure:

```markdown
## Created UX Text

**Pattern:** [Type of UI element]
**Context:** [User scenario]

---

### Recommended Copy

[The created text]

---

### Quality Standards Analysis

**Purposeful (9/10):**
[Explain how this helps user achieve goals]

**Concise ([score]/10):**
[Word count and length assessment]

**Conversational ([score]/10):**
[Natural language assessment]

**Clear ([score]/10):**
[Clarity and comprehension assessment]

**Overall: [Average]/10**

---

### Rationale

**Why this works:**
1. [Explanation tied to standards]
2. [Pattern-specific best practice applied]
3. [Accessibility consideration]

**Alternatives to consider:**

1. [Variation 1] - [When to use this]
2. [Variation 2] - [When to use this]
3. [Variation 3] - [When to use this]

[Provide 2-3 alternative versions with different tones or approaches]

---

### Implementation Notes

**Accessibility:**
- [Screen reader consideration]
- [Cognitive load consideration]

**Technical:**
- Character count: [X]
- Reading level: [Grade level]
- Meets benchmark: [Yes/No]

**Tone:**
- [How tone matches user emotional state]
```

## Tone Adaptation

Adjust tone based on user emotional state:

**Frustrated** (errors, failures)
- Empathetic and solution-focused
- Acknowledge problem without blame
- Clear recovery path

**Confused** (first use, complex)
- Patient and explanatory
- Break down steps
- Provide context

**Confident** (routine tasks)
- Efficient and direct
- Minimal explanation
- Quick confirmation

**Cautious** (high-stakes)
- Serious and transparent
- Clear consequences
- Respectful of decision

**Successful** (completions)
- Positive and encouraging
- Proportional to achievement
- Brief celebration

## Accessibility Checklist

Ensure all created copy:
- [ ] Works for screen readers (descriptive labels)
- [ ] Uses plain language (appropriate reading level)
- [ ] Includes text with visual indicators (not color alone)
- [ ] Keeps critical content to 8-14 words
- [ ] Uses specific, meaningful verbs
- [ ] Provides context at point of action

## Example Creation

**User Request:** "I need an error message for when a file upload fails because it's too large."

**Created Copy:**
```
"Upload failed. File is too large. Choose a file under 10MB."
```

**Analysis:**
- **Purposeful: 9/10** - Clear problem and solution
- **Concise: 10/10** - 11 words, efficient
- **Conversational: 9/10** - Natural, active voice
- **Clear: 9/10** - Specific size limit
- **Overall: 9.25/10**

**Alternatives:**
1. "File too large. Please upload under 10MB." (More concise, 7 words)
2. "We couldn't upload your file because it's too large. Please choose a file under 10MB." (More empathetic, 16 words)
3. "File exceeds 10MB limit. Choose a smaller file." (Direct, 8 words)

## Completion

After creating the copy:
1. Provide the recommended version with scoring
2. Offer 2-3 alternatives with different tones
3. Explain when each variation works best
4. Ask if user wants refinements or additional variations
