---
name: 'step-08-validation'
description: 'Validate architectural coherence and completeness'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture'

# File References
thisStepFile: './step-08-validation.md'
nextStepFile: './step-09-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-architecture.md'
checklistFile: '{workflow_path}/checklist.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 8: Validation

**Progress: Step 8 of 9** - Next: Completion

## STEP GOAL:

Validate that the architecture is coherent, complete, and ready to guide AI agent implementation. Check for conflicts, gaps, and missing coverage.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game architect facilitator
- Validation ensures document completeness
- Catch gaps before implementation begins

### Step-Specific Rules:

- Run through all validation checks
- Fix any issues before proceeding
- User must confirm document is ready

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Present A/P/C menu after validation complete
- ONLY proceed when user chooses C (Continue)
- Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]` before loading next step

## COLLABORATION MENUS (A/P/C):

- **A (Advanced Elicitation)**: Deep dive into gaps
- **P (Party Mode)**: Get perspectives on completeness
- **C (Continue)**: Confirm validation and proceed

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load Validation Checklist

**Load the checklist if available:**

Load `{checklistFile}` for structured validation criteria.

### 2. Decision Compatibility Check

"**Checking Decision Compatibility...**

Verifying all architectural decisions work together:

| Check                          | Status        | Notes     |
| ------------------------------ | ------------- | --------- |
| Engine + patterns compatible   | {{pass/fail}} | {{notes}} |
| Cross-cutting + engine align   | {{pass/fail}} | {{notes}} |
| Structure supports all systems | {{pass/fail}} | {{notes}} |
| No conflicting decisions       | {{pass/fail}} | {{notes}} |

{{if_issues_found}}
**Issues Found:**
{{list_of_conflicts}}

How should we resolve these?
{{/if_issues_found}}"

### 3. GDD Coverage Check

"**Checking GDD Coverage...**

Verifying every GDD requirement has architectural support:

**Core Systems:**
| System | Architecture Support | Status |
| ------ | -------------------- | ------ |
{{systems_coverage_table}}

**Technical Requirements:**
| Requirement | How Addressed | Status |
| ----------- | ------------- | ------ |
{{requirements_coverage_table}}

{{if_gaps_found}}
**Gaps Found:**
{{list_of_gaps}}

How should we address these?
{{/if_gaps_found}}"

### 4. Pattern Completeness Check

"**Checking Pattern Completeness...**

Verifying implementation patterns cover all scenarios:

| Scenario                | Pattern Defined | Status     |
| ----------------------- | --------------- | ---------- |
| Entity creation         | {{yes/no}}      | {{status}} |
| Component communication | {{yes/no}}      | {{status}} |
| State management        | {{yes/no}}      | {{status}} |
| Error handling          | {{yes/no}}      | {{status}} |
| Data access             | {{yes/no}}      | {{status}} |
| Event handling          | {{yes/no}}      | {{status}} |

{{if_missing_patterns}}
**Missing Patterns:**
{{list_of_missing}}

Should we define these now?
{{/if_missing_patterns}}"

### 5. Epic Mapping Check

"**Checking Epic Mapping...**

Verifying every epic/feature maps to architecture:

| Epic/Feature | Location | Patterns | Status |
| ------------ | -------- | -------- | ------ |

{{epic_mapping_table}}

{{if_unmapped_epics}}
**Unmapped Features:**
{{list_of_unmapped}}

Where should these live?
{{/if_unmapped_epics}}"

### 6. Document Completeness Check

"**Checking Document Completeness...**

Mandatory sections:

- [ ] Engine/Framework selection with version
- [ ] Decision summary table
- [ ] Project structure (complete, not placeholder)
- [ ] Cross-cutting concerns
- [ ] Implementation patterns with examples
- [ ] Naming conventions
- [ ] No placeholder text ({{placeholders}}, TODO, etc.)

{{if_incomplete}}
**Incomplete Sections:**
{{list_of_incomplete}}

Let's fix these before proceeding.
{{/if_incomplete}}"

### 7. Resolve Any Issues

**If issues were found in any check:**

For each issue:

1. Present the problem clearly
2. Propose a solution
3. Get user confirmation
4. Update the document

**Repeat validation if significant changes made.**

### 8. Generate Validation Summary

Based on the checks, prepare the summary:

```markdown
## Architecture Validation

### Validation Summary

| Check                  | Result        | Notes     |
| ---------------------- | ------------- | --------- |
| Decision Compatibility | {{pass/fail}} | {{notes}} |
| GDD Coverage           | {{pass/fail}} | {{notes}} |
| Pattern Completeness   | {{pass/fail}} | {{notes}} |
| Epic Mapping           | {{pass/fail}} | {{notes}} |
| Document Completeness  | {{pass/fail}} | {{notes}} |

### Coverage Report

**Systems Covered:** {{count}}/{{total}}
**Patterns Defined:** {{count}}
**Decisions Made:** {{count}}

### Issues Resolved

{{list_of_resolved_issues}}

### Validation Date

{{date}}
```

### 9. Present Validation and Menu

Show the validation results to the user and present:

"**Architecture Validation Complete**

**Results:**

[Show validation summary]

**Overall Status:** {{PASS/NEEDS_WORK}}

{{if_pass}}
Your architecture document is complete and ready to guide implementation.
{{/if_pass}}

{{if_needs_work}}
Some issues need resolution before the architecture is ready.
{{/if_needs_work}}

**Select an Option:**
[A] Advanced Elicitation - Deep dive into any gaps
[P] Party Mode - Get perspectives on completeness
[C] Continue - Save validation and move to Completion (Step 9 of 9)"

### 10. Handle Menu Selection

#### IF A (Advanced Elicitation):

- Execute {advancedElicitationTask} with validation results
- Ask user: "Accept these changes? (y/n)"
- If yes: Update content, re-run validation
- If no: Keep original, return to A/P/C menu

#### IF P (Party Mode):

- Execute {partyModeWorkflow} with validation results
- Ask user: "Accept these changes? (y/n)"
- If yes: Update content, re-run validation
- If no: Keep original, return to A/P/C menu

#### IF C (Continue):

- Append validation summary to `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]`
- Load `{nextStepFile}`

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation content saved with frontmatter updated], will you then load and read fully `{nextStepFile}`.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All validation checks performed
- Issues identified and resolved
- GDD coverage verified
- Pattern completeness confirmed
- Document has no placeholders
- A/P/C menu presented and handled correctly
- Frontmatter updated with stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]

### SYSTEM FAILURE:

- Skipping validation checks
- Proceeding with unresolved issues
- Incomplete document going to completion
- Not presenting A/P/C menu after validation
- Proceeding without user selecting 'C'

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
