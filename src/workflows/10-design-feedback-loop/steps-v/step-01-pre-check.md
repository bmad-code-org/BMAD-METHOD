---
name: 'step-01-pre-check'
description: 'Check proposed design against known improvements'
---

# Validate: Pre-Check Against Known Improvements

## STEP GOAL
Before presenting a new design, check if it resembles a known "before" state that was later improved. If so, apply the learned improvement proactively.

## PRE-CHECK SEQUENCE

### 1. Describe Your Proposed Design
Write a clear description of what you're about to present:
- Layout choices
- Color usage
- Typography decisions
- Component patterns
- Overall feeling

### 2. Run the Check
```
search_preference_patterns({
  description: "[your description from above]",
  image_base64: "[screenshot if available]",
  project: "[current project]",
  designer: "marten"
})
```

### 3. Interpret Results

**No matches:** Design passes — proceed with presenting it.

**Matches found:** Read each match carefully:
- What was the "before" state that's similar?
- What was the improvement that was made?
- What was the reasoning?

### 4. Apply Learned Improvements
If a match is found:
1. Read the approved alternative (the improvement)
2. Adjust your design to incorporate the learned solution
3. Present the adjusted version
4. Mention it naturally: "I applied [X approach] — it's worked well in similar designs."

### 5. When to Override
Sometimes the match is contextually wrong:
- Different project with different brand personality
- Different component where the pattern doesn't transfer
- The match is only surface-level similar

In these cases, proceed but note why: "This resembles [pattern] but the context is different because [reason]."

## SUCCESS
- Proposed design checked against known improvements
- Applicable improvements applied proactively
- Non-applicable matches noted with reasoning
- Design presented with confidence
