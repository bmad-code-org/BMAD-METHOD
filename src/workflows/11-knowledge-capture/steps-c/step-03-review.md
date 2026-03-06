---
name: 'step-03-review'
description: 'Verify captures and identify gaps'
---

# Step 3: Review

## STEP GOAL
Verify the captures landed correctly and identify any gaps.

## REVIEW SEQUENCE

### 1. Check Recent Entries
```
recent_knowledge({
  limit: 20,
  project: "[project]"
})
```

Verify all intended captures appear.

### 2. Search Verification
For each capture, run a quick search to confirm it's findable:
```
search_space({
  query: "[key phrase from the capture]",
  project: "[project]",
  limit: 3
})
```

### 3. Gap Analysis
Ask the designer:
- "Is there anything else from this session worth capturing?"
- "Any decisions we made that should be recorded?"
- "Any process improvements we discovered?"

### 4. Summary
Present what was captured:
```
Knowledge Capture Summary
─────────────────────────
Project: [project]
Entries: [X] text, [Y] visual
Categories: [list]
Topics covered: [list]
```

## SUCCESS
- All captures verified in the Space
- Findable via search
- No gaps identified
- Designer confirms completeness
