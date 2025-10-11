# fagan-inspection

Comprehensive Fagan inspection for systematic bug analysis and resolution.

## Context

This task performs systematic defect analysis using the proven 6-phase Fagan inspection methodology, achieving 60-90% defect detection rates through formal peer review.

## Task Execution

### Phase 1: Planning

1. Identify inspection scope based on bug description
2. Define inspection criteria and success metrics
3. Generate inspection checklist based on bug type
4. Determine affected components and stakeholders

### Phase 2: Overview

1. Analyze recent commits for context and potential causes
2. Review feature specifications and implementation plans
3. Gather background context and related documentation
4. Identify impact scope and affected systems

### Phase 3: Preparation

1. Systematic artifact examination:
   - Code analysis using pattern detection
   - Test coverage analysis and execution results
   - Configuration and environment analysis
   - Documentation consistency check
2. Dependency analysis and version conflicts
3. Performance metrics and resource usage (if applicable)
4. Generate preliminary defect hypotheses

### Phase 4: Inspection Meeting

1. Execute systematic defect identification:
   - Logic defects: Algorithm errors, control flow issues
   - Interface defects: API misuse, parameter mismatches
   - Data defects: Type mismatches, validation failures
   - Documentation defects: Outdated or incorrect documentation
2. Root cause analysis using fishbone methodology
3. Impact assessment: Severity, scope, risk level
4. Categorize defects by type and priority

### Phase 5: Rework Planning

1. Generate fix proposals with tradeoff analysis
2. Design test strategy for validation
3. Risk assessment for proposed changes
4. Create implementation timeline
5. Plan regression testing approach

### Phase 6: Follow-up

1. Validate fix effectiveness against original bug
2. Update documentation and specifications
3. Capture lessons learned for prevention
4. Generate comprehensive debug report

## Output Format

Generate a structured debug report containing:

```markdown
# Debug Report: [Bug Description]

Session ID: [timestamp]
Date: [date]

## Executive Summary

[Brief overview of findings and recommendations]

## Defect Analysis

### Primary Defect

- Type: [Logic/Interface/Data/Documentation]
- Severity: [Critical/High/Medium/Low]
- Location: [file:line]
- Description: [detailed description]

### Contributing Factors

[List of contributing issues]

## Root Cause Identification

### Root Cause

[Detailed root cause explanation]

### Evidence Trail

[Step-by-step evidence leading to root cause]

## Fix Recommendations

### Immediate Fix

[Code or configuration changes needed]

### Long-term Prevention

[Systemic improvements to prevent recurrence]

## Test Strategy

[Required tests to validate fix]

## Risk Assessment

- Regression Risk: [High/Medium/Low]
- Side Effects: [Potential side effects]
- Mitigation: [Risk mitigation steps]

## Lessons Learned

[Key takeaways for future prevention]
```

## Completion Criteria

- [ ] All 6 phases completed
- [ ] Root cause identified with evidence
- [ ] Fix recommendations provided
- [ ] Test strategy defined
- [ ] Debug report generated
