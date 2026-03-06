---
name: 'step-01-context'
description: 'Establish what to capture and why'
nextStepFile: './step-02-capture.md'
---

# Step 1: Context

## STEP GOAL
Understand what the designer wants to capture and set up the right framing.

## QUESTIONS TO ASK

### 1. What are we capturing?
- A design session's learnings?
- A project milestone's insights?
- Methodology/process improvements?
- External references or inspiration?
- Agent experience notes?

### 2. Which project?
Confirm the project tag to use (e.g., "whiteport", "kalla").

### 3. What category fits best?
Present the relevant categories:
- `successful_pattern` — validated solution worth reusing
- `component_experience` — how a component behaves in real use
- `design_system_evolution` — token/component/API decisions
- `methodology` — process improvements, workflow discoveries
- `agent_experience` — what agents learned about working together
- `inspiration` — external references that influenced direction
- `reference` — articles, videos, tools worth remembering

### 4. Any screenshots to include?
Visual captures get dual embeddings — much richer pattern detection.

## SEARCH FOR EXISTING KNOWLEDGE

Before capturing, check what already exists:
```
search_space({
  query: "[topic description]",
  project: "[project]",
  limit: 10,
  threshold: 0.6
})
```

Flag any potential duplicates.

## SUCCESS
- Capture scope defined
- Project and category confirmed
- Existing knowledge checked for overlaps
- Ready to capture

→ Load next: `./step-02-capture.md`
