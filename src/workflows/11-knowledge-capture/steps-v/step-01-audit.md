---
name: 'step-01-audit'
description: 'Audit existing Design Space entries for quality'
---

# Validate: Quality Audit

## STEP GOAL
Review existing entries in the Design Space for quality, tagging consistency, and usefulness.

## AUDIT SEQUENCE

### 1. Load Entries
```
recent_knowledge({
  limit: 50,
  project: "[project or leave empty for all]"
})
```

### 2. Quality Score Each Entry

For each entry, score 1-5:
- **1:** Vague, no context, untagged — should be deleted or rewritten
- **2:** Has some detail but missing context or tags
- **3:** Acceptable — specific enough to be useful
- **4:** Good — specific, contextual, well-tagged
- **5:** Excellent — tells a complete story, immediately actionable

### 3. Common Issues to Check

- [ ] **Too vague:** "X is good" without context
- [ ] **Missing project tag:** Can't filter by project
- [ ] **Missing topics:** Not findable via search
- [ ] **Duplicate entries:** Same insight captured twice
- [ ] **Negative framing:** Focuses on complaints instead of solutions
- [ ] **Missing visuals:** Should have a screenshot but doesn't
- [ ] **Wrong category:** e.g., methodology tagged as general

### 4. Recommendations

For each issue found, recommend:
- **Rewrite:** Capture again with better quality
- **Enrich:** Add missing tags/context
- **Delete:** Remove duplicates or truly useless entries
- **Merge:** Combine related entries into one richer entry

### 5. Report

```
Design Space Quality Audit
──────────────────────────
Entries reviewed: [X]
Average quality: [X.X] / 5

Score distribution:
  5 (Excellent): [X]
  4 (Good):      [X]
  3 (Acceptable): [X]
  2 (Needs work): [X]
  1 (Poor):       [X]

Top issues:
1. [issue + count]
2. [issue + count]
3. [issue + count]

Recommendations:
- [action items]
```

## SUCCESS
- All entries reviewed and scored
- Issues identified with specific examples
- Actionable recommendations provided
- Quality baseline established for future captures
