# Fagan Inspection Workflow

Comprehensive Fagan inspection for systematic bug analysis and resolution.

## Context

This workflow performs systematic defect analysis using the proven 6-phase Fagan inspection methodology, achieving 60-90% defect detection rates through formal peer review.

## Prerequisites

- Clear bug description or symptom
- Access to source code repository
- Recent commit history available
- Test suite and execution results
- Environment and configuration details

## Instructions

Execute the following phases in order:

### Phase 1: Planning

1. Ask user for bug description if not already provided
2. Identify inspection scope based on bug description
3. Define inspection criteria and success metrics
4. Load `debug-inspection-checklist.md` from knowledge base
5. Determine affected components and stakeholders
6. Document planning phase results

### Phase 2: Overview

1. Analyze recent commits for context and potential causes (search git history)
2. Review feature specifications and implementation plans
3. Gather background context and related documentation
4. Identify impact scope and affected systems
5. Create preliminary timeline of issue
6. Document overview findings

### Phase 3: Preparation

1. Systematic artifact examination:
   - Execute code analysis using pattern detection (load `debug-patterns.md`)
   - Analyze test coverage and execution results
   - Review configuration and environment settings
   - Check documentation consistency
2. Perform dependency analysis and check for version conflicts
3. Review performance metrics and resource usage (if applicable)
4. Generate preliminary defect hypotheses
5. Document preparation findings

### Phase 4: Inspection Meeting

1. Execute systematic defect identification using `common-defects.md`:
   - Logic defects: Algorithm errors, control flow issues
   - Interface defects: API misuse, parameter mismatches
   - Data defects: Type mismatches, validation failures
   - Documentation defects: Outdated or incorrect documentation
2. Perform root cause analysis using fishbone methodology
3. Conduct impact assessment: Severity, scope, risk level
4. Categorize defects by type and priority (P0-P3)
5. Document inspection findings with evidence

### Phase 5: Rework Planning

1. Generate fix proposals with tradeoff analysis
2. Design test strategy for validation
3. Perform risk assessment for proposed changes
4. Create implementation timeline and effort estimate
5. Plan regression testing approach
6. Document rework plan

### Phase 6: Follow-up

1. Provide recommendations for validating fix effectiveness
2. List documentation updates needed
3. Capture lessons learned for prevention
4. Generate comprehensive debug report using template
5. Save report to output folder

## Output Requirements

Generate a structured debug report containing:

- Executive Summary (problem, impact, root cause, solution)
- Detailed Problem Description (symptoms, reproduction, environment, timeline)
- Technical Analysis (root cause, code analysis, patterns, test coverage)
- Impact Assessment (severity matrix, business impact)
- Solution Recommendations (immediate fix, short-term, long-term, process improvements)
- Implementation Plan (steps, timeline, validation)
- Lessons Learned

## Completion Criteria

- [ ] All 6 phases completed systematically
- [ ] Root cause identified with evidence trail
- [ ] Fix recommendations provided with tradeoffs
- [ ] Test strategy defined for validation
- [ ] Risk assessment completed
- [ ] Debug report generated and saved
- [ ] Lessons learned documented

## Elicitation Points

<elicit required="true">
Bug Description: Ask user to provide detailed bug description including:
- What is the expected behavior?
- What is the actual behavior?
- When was this first observed?
- How frequently does it occur?
- Which environment(s) are affected?
</elicit>

<elicit required="false">
Additional Context: Ask if user can provide:
- Related issue/ticket numbers
- Recent changes or deployments
- Error messages or stack traces
- Steps to reproduce
</elicit>
