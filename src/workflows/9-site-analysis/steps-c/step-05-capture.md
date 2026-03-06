---
name: 'step-05-capture'
description: 'Batch capture all findings with dual embeddings into Design Space'
nextStepFile: './step-06-summary.md'
---

# Step 5: Capture

## STEP GOAL
Ensure all findings from steps 2-4 are captured into the Design Space with proper tagging and dual embeddings.

## MANDATORY SEQUENCE

### 1. Review Captured Knowledge
Check what was already captured during steps 2-4:
```
search_space({
  query: "[site name] site analysis",
  project: "[project]",
  limit: 50,
  threshold: 0.3
})
```

### 2. Gap Analysis
Compare captured entries against this checklist:

**Structural DNA:**
- [ ] Navigation pattern
- [ ] Page structure / section flow
- [ ] Layout patterns per section
- [ ] Page type taxonomy

**Visual DNA:**
- [ ] Color palette (with values)
- [ ] Typography scale
- [ ] Spacing rhythm
- [ ] Section screenshots (each major section)
- [ ] Icon/illustration system

**Content DNA:**
- [ ] Brand voice analysis
- [ ] Messaging hierarchy
- [ ] CTA patterns
- [ ] Content block patterns

### 3. Fill Gaps
For any uncaptured items, capture now using:
- `capture_knowledge` for text insights
- `capture_visual` for sections with screenshots

**Rate limit reminder:** Wait 25 seconds between `capture_visual` calls on Voyage AI free tier.

### 4. Cross-Reference Check
Run visual similarity search against other projects:
```
search_visual_similarity({
  image_base64: "[hero screenshot]",
  limit: 5,
  threshold: 0.5
})
```

Note any cross-project patterns discovered.

### 5. Tag Consistency
Verify all entries use consistent:
- `project` tag matching the project name
- `source: "site-analysis"`
- Relevant `topics` and `components` arrays

## SUCCESS
- All structural, visual, and content DNA captured
- No gaps in the checklist
- Cross-project patterns noted
- Consistent tagging across all entries

→ Load next: `./step-06-summary.md`
