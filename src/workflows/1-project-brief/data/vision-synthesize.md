# Substep 4: Synthesize & Document

## Task

Create concise vision statement and document with conversation context.

## Instructions

### 1. Craft Vision Statement

Based on confirmed understanding, create 1-2 sentence vision statement that:
- Captures aspirational direction
- Is concise and clear
- Feels natural to project context

**Adapt to stakes:**
- **Personal:** Playful, energetic
- **Business:** Professional, value-focused
- **Enterprise:** Measured, outcome-oriented

### 2. Document in Product Brief

Add to `product-brief.md`:

```markdown
## Vision

[Vision statement]

**Key Insights from Discussion:**
- [Insight 1 - context that matters]
- [Insight 2 - important decision point]
- [Insight 3 - unique angle]
```

### 3. Update Agent Dialog

**Mandatory:** Update `dialog/02-vision.md` before marking this step complete.

**Fill in:**
- Opening question + user's first response
- 3-4 key exchanges showing signal-based follow-ups
- Conversation flow summary
- Reflection checkpoint (synthesis + user confirmation/correction)
- Final vision statement
- Key insights captured

**Then:** Mark Step 2 complete in `dialog/progress-tracker.md` progress tracker

---

## Examples by Stakes

**Personal/Hobby:**
> "Build a delightful tool that helps designers organize inspiration in a way that actually makes sense - visual, fast, and connected to real projects."

**Small Business (Källa):**
> "Create a professional web presence that clearly shows the breadth of our services - from lawnmowers to tour buses - to build credibility with summer tourists while filtering out calls we can't help with."

**Enterprise:**
> "Transform customer service from reactive ticket resolution to proactive issue prevention through intelligent automation, reducing response time by 70% while freeing agents to handle complex cases that require human judgment."

---

## Full Example (Källa)

**Vision statement:**
> "Create a professional web presence that clearly shows the breadth of our services - from lawnmowers to tour buses - to build credibility with summer tourists while filtering out calls we can't help with."

**Key insights documented:**
- Primary audience is summer tourists who need fast help (time-sensitive, stressed)
- Owner wants efficiency not growth - already at capacity
- AutoExperten certification is key trust signal
- Current phone calls are repetitive - website should answer common questions
- Service breadth (lawnmowers → tour buses) is unique selling point

---

## Next

After documenting, load and execute: `step-03-positioning.md`
