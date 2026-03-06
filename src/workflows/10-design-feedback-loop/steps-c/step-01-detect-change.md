---
name: 'step-01-detect-change'
description: 'Recognize a designer preference signal'
nextStepFile: './step-02-capture-before.md'
---

# Step 1: Detect Change

## STEP GOAL
Recognize when the designer is giving a preference signal that should trigger the feedback loop.

## TRIGGER CONDITIONS

The feedback loop activates when the designer:
- Suggests a direction: "make it more..." or "try something different"
- Refines the design: "move this here" or "use a different color"
- Approves with refinement: "yes, but..." or "almost, just..."
- Redirects the approach: "let's go a different direction with..."

## NON-TRIGGERS

Do NOT trigger the loop for:
- Technical corrections: "fix the typo" or "the link is broken"
- Requirements clarifications: "actually, there should be 4 items, not 3"
- Questions without decisions: "what if we added...?" (wait for a decision)
- Undo requests: "go back to the previous version" (this IS a trigger if they explain why)

## WHAT TO NOTE

Before proceeding, identify:
1. **What is being changed?** (layout, color, typography, spacing, component, content)
2. **What is the current state?** (be specific — exact values if possible)
3. **What is the desired direction?** (what the designer wants instead)

## SUCCESS
- Preference signal recognized
- Current state identified
- Direction of change understood

→ Load next: `./step-02-capture-before.md`
