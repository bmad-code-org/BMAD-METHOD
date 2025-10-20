# Implementation Ready Check Workflow

## Overview

The Implementation Ready Check workflow provides a systematic validation of all planning and solutioning artifacts before transitioning from Phase 3 (Solutioning) to Phase 4 (Implementation) in the BMad Method. This workflow ensures that PRDs, architecture documents, and story breakdowns are properly aligned with no critical gaps or contradictions.

## Purpose

This workflow is designed to:

- **Validate Completeness**: Ensure all required planning documents exist and are complete
- **Verify Alignment**: Check that PRD, architecture, and stories are cohesive and aligned
- **Identify Gaps**: Detect missing stories, unaddressed requirements, or sequencing issues
- **Assess Risks**: Find contradictions, conflicts, or potential implementation blockers
- **Provide Confidence**: Give teams confidence that planning is solid before starting development

## When to Use

This workflow should be invoked:

- At the end of Phase 3 (Solutioning) for Level 2-4 projects
- Before beginning Phase 4 (Implementation)
- After significant planning updates or architectural changes
- When validating readiness for Level 0-1 projects (simplified validation)

## Project Level Adaptations

The workflow adapts its validation based on project level:

### Level 0-1 Projects

- Validates tech spec and simple stories only
- Checks internal consistency and basic coverage
- Lighter validation appropriate for simple projects

### Level 2 Projects

- Validates PRD, tech spec (with embedded architecture), and stories
- Ensures PRD requirements are fully covered
- Verifies technical approach aligns with business goals

### Level 3-4 Projects

- Full validation of PRD, architecture document, and comprehensive stories
- Deep cross-reference checking across all artifacts
- Validates architectural decisions don't introduce scope creep
- Checks UX artifacts if applicable

## How to Invoke

### Via Scrum Master Agent

```
*solutioning-gate-check
```

### Direct Workflow Invocation

```
workflow solutioning-gate-check
```

## Expected Inputs

The workflow will automatically search your project's output folder for:

- Product Requirements Documents (PRD)
- Architecture documents
- Technical Specifications
- Epic and Story breakdowns
- UX artifacts (if applicable)

No manual input file specification needed - the workflow discovers documents automatically.

## Generated Output

The workflow produces a comprehensive **Implementation Readiness Report** containing:

1. **Executive Summary** - Overall readiness status
2. **Document Inventory** - What was found and reviewed
3. **Alignment Validation** - Cross-reference analysis results
4. **Gap Analysis** - Missing items and risks identified
5. **Findings by Severity** - Critical, High, Medium, Low issues
6. **Recommendations** - Specific actions to address issues
7. **Readiness Decision** - Ready, Ready with Conditions, or Not Ready

Output Location: `{output_folder}/implementation-readiness-report-{date}.md`

## Workflow Steps

1. **Initialize** - Get current workflow status and project level
2. **Document Discovery** - Find all planning artifacts
3. **Deep Analysis** - Extract requirements, decisions, and stories
4. **Cross-Reference Validation** - Check alignment between all documents
5. **Gap and Risk Analysis** - Identify issues and conflicts
6. **UX Validation** (optional) - Verify UX concerns are addressed
7. **Generate Report** - Compile comprehensive readiness assessment
8. **Status Update** (optional) - Offer to advance workflow to next phase

## Validation Criteria

The workflow uses systematic validation rules adapted to each project level:

- **Document completeness and quality**
- **Requirement to story traceability**
- **Architecture to implementation alignment**
- **Story sequencing and dependencies**
- **Greenfield project setup coverage**
- **Risk identification and mitigation**

For projects using the new architecture workflow (decision-architecture.md), additional validations include:

- **Implementation patterns defined for consistency**
- **Technology versions verified and current**
- **Starter template initialization as first story**
- **UX specification alignment (if provided)**

## Special Features

### Intelligent Adaptation

- Automatically adjusts validation based on project level
- Recognizes when UX workflow is active
- Handles greenfield vs. brownfield projects differently

### Comprehensive Coverage

- Validates not just presence but quality and alignment
- Checks for both gaps and gold-plating
- Ensures logical story sequencing

### Actionable Output

- Provides specific, actionable recommendations
- Categorizes issues by severity
- Includes positive findings and commendations

## Integration with BMad Method

This workflow integrates seamlessly with the BMad Method workflow system:

- Uses workflow-status to understand project context
- Can update workflow status to advance to next phase
- Follows standard BMad document naming conventions
- Searches standard output folders automatically

## Troubleshooting

### Documents Not Found

- Ensure documents are in the configured output folder
- Check that document names follow BMad conventions
- Verify workflow-status is properly configured

### Validation Too Strict

- The workflow adapts to project level automatically
- Level 0-1 projects get lighter validation
- Consider if your project level is set correctly

### Report Too Long

- Focus on Critical and High priority issues first
- Use the executive summary for quick decisions
- Review detailed findings only for areas of concern

## Support

For issues or questions about this workflow:

- Consult the BMad Method documentation
- Check the SM agent for workflow guidance
- Review validation-criteria.yaml for detailed rules

---

_This workflow is part of the BMad Method v6-alpha suite of planning and solutioning tools_
