# Quick Debug Workflow

Rapid triage and initial analysis for simple issues.

## Context

This workflow provides fast initial assessment of bugs and issues, classifying severity and determining next steps without full formal inspection.

## Prerequisites

- Bug description or symptom
- Basic reproduction information

## Instructions

### Step 1: Initial Triage

1. Ask user for issue description
2. Classify severity (P0-P3)
3. Determine urgency and impact
4. Assess complexity (simple, moderate, complex)

### Step 2: Quick Analysis

1. Review error messages or symptoms
2. Check for known patterns in `debug-patterns.md`
3. Identify likely component or area
4. Assess if quick fix is possible

### Step 3: Recommend Next Steps

Based on complexity:

- **Simple:** Provide immediate fix suggestion
- **Moderate:** Recommend `*root-cause` workflow
- **Complex:** Recommend `*inspect` workflow for full Fagan inspection

### Step 4: Document Findings

Provide brief summary with:

- Severity classification
- Initial assessment
- Recommended next steps
- Estimated effort

## Completion Criteria

- [ ] Issue classified by severity
- [ ] Initial assessment provided
- [ ] Next steps recommended
- [ ] Findings documented

<elicit required="true">
Issue Description: Ask user to describe:
- What is happening?
- Expected vs actual behavior
- How critical is this?
</elicit>
