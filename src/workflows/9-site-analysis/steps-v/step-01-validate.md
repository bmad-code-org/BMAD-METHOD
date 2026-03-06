---
name: 'step-01-validate'
description: 'Validate completeness of an existing site analysis'
---

# Validate: Site Analysis Completeness

## STEP GOAL
Check an existing site analysis for completeness, gaps, and quality.

## VALIDATION SEQUENCE

### 1. Load Existing Analysis
```
search_space({
  query: "[site name] site analysis",
  project: "[project]",
  limit: 50,
  threshold: 0.3
})
```

### 2. Coverage Check
Score each area (0-3):
- 0 = Not captured
- 1 = Partial (missing details)
- 2 = Captured but could be richer
- 3 = Fully captured with good context

| Area | Score | Notes |
|------|-------|-------|
| Navigation pattern | | |
| Page structure | | |
| Layout patterns | | |
| Color palette | | |
| Typography scale | | |
| Spacing rhythm | | |
| Section screenshots | | |
| Brand voice | | |
| CTA patterns | | |
| Content blocks | | |

### 3. Visual Coverage
Check that major sections have dual embeddings:
- Count entries with visual embeddings
- List sections that are text-only (missing screenshot)
- Identify any screenshots that are low quality

### 4. Quality Check
For each entry, verify:
- Content is specific (includes values, examples, context)
- Topics and components are tagged
- Project tag is set
- Source is "site-analysis"
- Pattern type is appropriate (usually "baseline" for analysis)

### 5. Report
Present findings:
```
Site Analysis Validation: [Site Name]
Coverage: [X]/30 points
Visual entries: [X] with dual embeddings
Text entries: [X] knowledge-only

Gaps:
- [list missing areas]

Quality issues:
- [list specific quality concerns]

Recommendation: [complete / needs gap fill / needs re-analysis]
```

## SUCCESS
- Coverage scored for all 10 areas
- Visual coverage verified
- Quality issues identified
- Clear recommendation provided
