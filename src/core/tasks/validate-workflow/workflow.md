# Validate Workflow Output

**Goal:** Run a checklist against a document with thorough analysis and produce a validation report.

**Inputs:**

- **workflow** (required) — Workflow path containing `checklist.md`
- **checklist** (optional) — Checklist to validate against (defaults to the workflow's `checklist.md`)
- **document** (optional) — Document to validate (ask user if not specified)

## STEPS

### Step 1: Setup

- If checklist not provided, load `checklist.md` from the workflow location
- Try to fuzzy-match files similar to the input document name; if document not provided or unsure, ask user: "Which document should I validate?"
- Load both the checklist and document

### Step 2: Validate (CRITICAL)

**For EVERY checklist item, WITHOUT SKIPPING ANY:**

1. Read the requirement carefully
2. Search the document for evidence along with any ancillary loaded documents or artifacts (quotes with line numbers)
3. Analyze deeply — look for explicit AND implied coverage

**Mark each item as:**

- **PASS** `✓` — Requirement fully met (provide evidence)
- **PARTIAL** `⚠` — Some coverage but incomplete (explain gaps)
- **FAIL** `✗` — Not met or severely deficient (explain why)
- **N/A** `➖` — Not applicable (explain reason)

**DO NOT SKIP ANY SECTIONS OR ITEMS.**

### Step 3: Generate Report

Create `validation-report-{timestamp}.md` in the document's folder with the following format:

```markdown
# Validation Report

**Document:** {document-path}
**Checklist:** {checklist-path}
**Date:** {timestamp}

## Summary

- Overall: X/Y passed (Z%)
- Critical Issues: {count}

## Section Results

### {Section Name}

Pass Rate: X/Y (Z%)

[MARK] {Item description}
Evidence: {Quote with line# or explanation}
{If FAIL/PARTIAL: Impact: {why this matters}}

## Failed Items

{All ✗ items with recommendations}

## Partial Items

{All ⚠ items with what's missing}

## Recommendations

1. Must Fix: {critical failures}
2. Should Improve: {important gaps}
3. Consider: {minor improvements}
```

### Step 4: Summary for User

- Present section-by-section summary
- Highlight all critical issues
- Provide path to saved report
- **HALT** — do not continue unless user asks

## HALT CONDITIONS

- HALT after presenting summary in Step 4
- HALT with error if no checklist is found and none is provided
- HALT with error if no document is found and user does not specify one
