---
name: 'step-01-init'
description: 'Initialize site analysis — confirm URL and check existing data'
nextStepFile: './step-02-structural-dna.md'
---

# Step 1: Initialize Site Analysis

## STEP GOAL
Confirm the target website, check the Design Space for existing analysis, and prepare for systematic capture.

## MANDATORY SEQUENCE

### 1. Confirm Target URL
Ask the user: "Which website should I analyze?"
- Validate URL format
- Confirm project tag for Design Space entries
- Confirm pattern_type: `baseline` (own site) or `inspiration` (reference/competitor)

### 2. Check Existing Analysis
```
search_space({
  query: "[site domain] design patterns",
  project: "[project-tag]",
  threshold: 0.5,
  limit: 10
})
```
If entries exist: "I found [N] existing entries for this site. Should I add to the existing analysis or start fresh?"

### 3. Navigate and Map
- Navigate to the URL using browser tools
- Extract page structure: sections, IDs, heights, total page length
- Dismiss cookie banners
- List all internal links (subpages available for deeper analysis)
- Extract global design tokens: font families, colors, spacing

### 4. Present Site Map
Show the user:
- Page height and section count
- Section names and approximate positions
- Navigation structure
- Number of subpages available
- Any existing Design Space entries

Ask: "Ready to start the analysis? I'll go through structural DNA, visual DNA, and content DNA."

## SUCCESS
- URL confirmed
- Page structure mapped
- Existing entries checked
- User approved to proceed

## FAILURE
- URL inaccessible
- Page structure unclear (heavy SPA with no sections)

→ Load next: `./step-02-structural-dna.md`
