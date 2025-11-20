# Analyze UX Text Task

Analyze interface copy against the Four Quality Standards framework and provide objective scoring with improvement recommendations.

## Task Overview

This task evaluates UX text (buttons, error messages, labels, etc.) using the research-backed Four Quality Standards: Purposeful, Concise, Conversational, and Clear.

## Inputs Required

1. **The text to analyze**: The actual interface copy
2. **Context**: What is this text for? (button, error message, notification, etc.)
3. **User scenario**: What is the user trying to do?
4. **Current location**: Where does this appear in the product?

## Elicitation Process

Ask the user for the following information:

**1. Share the text**
```
Please provide the interface text you'd like me to analyze.
```

**2. Gather context**
```
Help me understand the context:
1. What type of UI element is this? (button, error message, notification, empty state, form label, etc.)
2. What is the user trying to accomplish when they see this?
3. Where does this appear in your product?
4. What is the user's likely emotional state? (confident, frustrated, confused, cautious)
```

**3. Optional: Target audience**
```
Who is your target audience? (general public, professionals, technical users, etc.)
```

## Analysis Framework

### Score Each Standard (0-10 scale)

**1. Purposeful (Does it help user/business achieve goals?)**
- 9-10: Clear user benefit, addresses concerns, advances goals
- 5-8: Some user benefit but could be more targeted
- 1-4: Unclear purpose or doesn't help user/business
- 0: No discernible purpose

**Evaluation questions:**
- Does this help the user accomplish their goal?
- Is the value to the user clear?
- Are user concerns anticipated and addressed?
- Does it serve a business objective?

**2. Concise (Uses fewest words without losing meaning?)**
- 9-10: No wasted words, perfectly concise
- 5-8: Generally concise but some redundancy
- 1-4: Verbose, needs significant trimming
- 0: Extremely wordy

**Evaluation questions:**
- Can any words be removed without losing meaning?
- Is information front-loaded?
- Does every word earn its space?
- Does it meet length benchmarks?

**Benchmarks:**
- Buttons: 2-4 words ideal, 6 maximum
- Error messages: 12-18 words including solution
- Instructions: 14 words ideal, 20 maximum
- Titles: 3-6 words, 40 characters maximum

**3. Conversational (Sounds natural and human?)**
- 9-10: Natural, human, conversational
- 5-8: Mostly natural with some stiffness
- 1-4: Robotic, corporate, unnatural
- 0: Extremely robotic

**Evaluation questions:**
- Would you say this out loud?
- Does it use active voice?
- Are there natural connecting words?
- Is it free of corporate jargon?

**Guidelines:**
- Active voice target: 85% of content
- Include prepositions and articles naturally
- Avoid phrases like "an error has occurred"

**4. Clear (Unambiguous and easy to understand?)**
- 9-10: Crystal clear, unambiguous, accurate
- 5-8: Generally clear with minor ambiguities
- 1-4: Confusing, ambiguous, unclear
- 0: Incomprehensible

**Evaluation questions:**
- Is there only one way to interpret this?
- Are verbs specific and meaningful?
- Is terminology consistent with the product?
- Does it meet readability targets?

**Benchmarks:**
- Reading level: 7th-10th grade (general audience)
- Sentence length: 8-14 words for critical content
- Avoid jargon and technical terms

## Output Format

Present the analysis in this structure:

```markdown
## UX Text Analysis

**Original Text:**
[The text being analyzed]

**Context:** [Type of UI element and user scenario]

---

### Quality Standards Scoring

#### 1. Purposeful: [Score]/10
**Assessment:** [Explanation of why this score]

**Strengths:**
- [What works well]

**Opportunities:**
- [What could be improved]

#### 2. Concise: [Score]/10
**Assessment:** [Explanation with word count if relevant]

**Strengths:**
- [What works well]

**Opportunities:**
- [What could be improved]

#### 3. Conversational: [Score]/10
**Assessment:** [Explanation]

**Strengths:**
- [What works well]

**Opportunities:**
- [What could be improved]

#### 4. Clear: [Score]/10
**Assessment:** [Explanation with reading level if relevant]

**Strengths:**
- [What works well]

**Opportunities:**
- [What could be improved]

---

### Overall Score: [Average]/10

**Overall Assessment:** [Brief summary of the text quality]

---

### Recommended Improvements

[If score is below 8/10, provide specific improvement suggestions]

**Suggested revision:**
[Improved version of the text]

**Why this is better:**
1. **Purposeful:** [Explanation]
2. **Concise:** [Explanation]
3. **Conversational:** [Explanation]
4. **Clear:** [Explanation]

**Improved scores:**
- Purposeful: [New score]/10
- Concise: [New score]/10
- Conversational: [New score]/10
- Clear: [New score]/10
- **Overall: [New average]/10**
```

## Additional Checks

When analyzing, also consider:

### Accessibility
- Does it work for screen readers?
- Is it paired with visual indicators?
- Is language plain and simple?

### Pattern Compliance
- Does it follow best practices for this UI element type?
- Buttons: Imperative verb + object?
- Errors: Problem + solution?
- Empty states: Explanation + CTA?

### Tone Appropriateness
- Does the tone match user emotional state?
- Is it empathetic for error states?
- Is it encouraging for success states?
- Is it serious for high-stakes actions?

## Tips for Analysis

1. **Read aloud** - If it sounds awkward, it likely is
2. **Check word count** - Compare against benchmarks
3. **Test comprehension** - Can user understand in 2 seconds?
4. **Consider context** - Same text works differently in different situations
5. **Think accessibility** - How does this work for all users?
6. **Apply patterns** - Does it follow proven UX text patterns?

## Example Analysis

**Text:** "An error has occurred while processing your request. Please try again later."

**Analysis:**
- **Purposeful: 3/10** - Doesn't explain what failed or provide actionable next steps
- **Concise: 5/10** - 12 words, but "an error has occurred" is 4 wasted words
- **Conversational: 3/10** - Robotic system-speak, passive voice
- **Clear: 2/10** - What error? When is "later"? Vague and unhelpful
- **Overall: 3.25/10**

**Improved:** "We couldn't process your request. Check your connection and try again."
- Purposeful: 8/10, Concise: 9/10, Conversational: 9/10, Clear: 8/10
- **Overall: 8.5/10**

## Completion

After providing the analysis:
1. Ask if user wants to see improved version (if not already provided)
2. Offer to analyze additional text
3. Suggest running full audit if multiple pieces of text need review
