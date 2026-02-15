---
name: 'step-v-06b-per-requirement-quality'
description: 'Per-Requirement Quality Validation - Validate each requirement against 9 ISO 29148 quality criteria'

# File references (ONLY variables used in this step)
nextStepFile: './step-v-06c-requirement-attributes.md'
prdFile: '{prd_file_path}'
validationReportPath: '{validation_report_path}'
requirementQualityChecklist: '{project-root}/_bmad/bmm/workflows/shared/templates/requirement-quality-checklist.md'
---

# Step 6b: Per-Requirement Quality Validation (Enterprise Track)

## STEP GOAL:

Validate each individual requirement against the 9 ISO 29148 quality criteria: necessary, implementation-free, unambiguous, consistent, complete, singular, feasible, traceable, verifiable.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a Validation Architect and Quality Assurance Specialist
- ✅ This step runs autonomously - no user input needed
- ✅ You bring ISO 29148 requirement quality expertise

### Step-Specific Rules:

- 🎯 Focus ONLY on per-requirement quality validation
- 🎯 This step is MANDATORY for Enterprise track, OPTIONAL for BMad Method track
- 🚫 FORBIDDEN to validate other aspects in this step
- 🚪 This is a validation sequence step - auto-proceeds when complete

### Track-Aware Execution:

**Check the PRD frontmatter for `track` value:**
- If `track: 'enterprise'` → Run full per-requirement quality validation
- If `track: 'bmad'` or not set → Run a lightweight sample check (spot-check 5 requirements)
- Log which track mode was used in the report

## EXECUTION PROTOCOLS:

- 🎯 Load the requirement quality checklist
- 🎯 Extract all FRs and NFRs from the PRD
- 🎯 Validate a representative sample (or all for Enterprise) against 9 criteria
- 💾 Append findings to validation report
- 📖 Display "Proceeding to next check..." and load next step
- 🚫 FORBIDDEN to pause or request user input

## CONTEXT BOUNDARIES:

- PRD document from previous validation steps is available
- Quality checklist provides the 9 criteria
- Focus on individual requirement quality, not document-level quality

## VALIDATION SEQUENCE:

### 1. Load Quality Criteria

Load the requirement quality checklist from: `{requirementQualityChecklist}`

### 2. Extract Requirements

Extract all FRs and NFRs from the PRD document:
- Count total requirements
- Group by category (FR capability areas, NFR categories)

### 3. Validate Requirements

**For Enterprise track:** Validate ALL requirements against 9 criteria
**For BMad track:** Spot-check 5 representative requirements

**For each requirement, check:**
1. **Necessary:** Does it trace to a stakeholder need?
2. **Implementation-Free:** Does it state WHAT, not HOW?
3. **Unambiguous:** Is there only one interpretation?
4. **Consistent:** Does it conflict with other requirements?
5. **Complete:** Is there sufficient detail?
6. **Singular:** Is it one requirement, not compound?
7. **Feasible:** Is it achievable within constraints?
8. **Traceable:** Does it have an ID and source?
9. **Verifiable:** Can it be tested or inspected?

### 4. Generate Findings

Create a quality report:

```markdown
### Per-Requirement Quality Validation

**Track Mode:** [Enterprise (full) / BMad (sample)]
**Requirements Analyzed:** [count] of [total]

**Quality Summary:**
| Criterion | Pass | Fail | Pass Rate |
|-----------|------|------|-----------|
| Necessary | | | |
| Implementation-Free | | | |
| Unambiguous | | | |
| Consistent | | | |
| Complete | | | |
| Singular | | | |
| Feasible | | | |
| Traceable | | | |
| Verifiable | | | |

**Issues Found:**
[List specific requirements that fail criteria with details]

**Severity:** [PASS / CONCERNS / FAIL]
```

### 5. Append to Report and Proceed

Append findings to `{validationReportPath}`.

Display: "**Per-Requirement Quality:** [PASS/CONCERNS/FAIL] - [X] requirements checked, [Y] issues found. Proceeding to requirement attributes check..."

Read fully and follow: `{nextStepFile}`

## SUCCESS METRICS:

✅ Quality checklist loaded and applied
✅ Requirements extracted and counted
✅ Representative or full sample validated against 9 criteria
✅ Quality summary table generated
✅ Specific issues identified with requirement references
✅ Findings appended to validation report
✅ Auto-proceeded to next step

## FAILURE MODES:

❌ Not loading the quality checklist
❌ Validating document-level quality instead of per-requirement
❌ Not reporting specific failing requirements
❌ Skipping criteria in the check
