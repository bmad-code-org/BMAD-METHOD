---
name: 'step-04-capture-after'
description: 'Document the improved version and save the linked pair'
---

# Step 4: Capture After & Save Pair

## STEP GOAL
Document the improved design and save the complete learning as a linked pair.

## CAPTURE THE IMPROVEMENT

### With Screenshot (preferred)
Screenshot the improved design and write a 100-200 word description:
- What changed specifically (the delta)
- Why the new version works better
- What design principle this reinforces

### Without Screenshot
Write a detailed text description of the improved state.

## SAVE THE LINKED PAIR

```
capture_feedback_pair({
  before_description: "[from step 2 — the starting state]",
  before_image_base64: "[screenshot if available]",
  after_description: "[the improved version — focus on what makes it better]",
  after_image_base64: "[screenshot if available]",
  reasoning: "[from step 3 — why the improvement works]",
  pattern_type_before: "rejected",
  pattern_type_after: "approved",
  project: "[current project]",
  topics: ["relevant", "tags"],
  components: ["affected", "components"]
})
```

## CONFIRM WITH DESIGNER

Tell the designer what was learned. Frame it positively:

**Good:** "Learned: light heading weight (300) creates more elegance than bold for this brand. Applied to future hero sections."

**Bad:** "Noted: you don't like bold headings."

The confirmation should sound like a design principle, not a complaint.

## TAG STRATEGY

Choose topics that make this findable for similar future decisions:
- Design dimension: `typography`, `spacing`, `color`, `layout`, `hierarchy`
- Brand quality: `elegance`, `warmth`, `boldness`, `minimalism`
- Component: `hero-banner`, `card`, `navigation`, `footer`
- Context: `mobile`, `desktop`, `dark-theme`

## SUCCESS
- Improvement captured with specific details
- Linked pair saved with shared pair_id
- Reasoning focuses on what works and why
- Designer confirmed the learning
- Topics tagged for future searchability
