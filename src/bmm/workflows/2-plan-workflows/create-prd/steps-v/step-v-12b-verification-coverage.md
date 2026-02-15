---
name: 'step-v-12b-verification-coverage'
description: 'Verification Coverage Validation - Check that all requirements have assigned verification methods'

# File references (ONLY variables used in this step)
nextStepFile: './step-v-12c-interface-coverage.md'
prdFile: '{prd_file_path}'
validationReportPath: '{validation_report_path}'
---

# Step 12b: Verification Coverage Validation (Enterprise Track)

## STEP GOAL:

Validate that all requirements have assigned verification methods and that the verification approach section is complete.

## MANDATORY EXECUTION RULES (READ FIRST):

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- 🚪 This is a validation sequence step - auto-proceeds when complete

### Track-Aware Execution:

- If `track: 'enterprise'` → Run full verification coverage check
- If `track: 'bmad'` or not set → Check if verification section exists, basic review only
- Log decision in report

## VALIDATION SEQUENCE:

### 1. Check Verification Section Exists

Look for "## Verification Approaches" or similar section in the PRD.

**If Enterprise track:**
- Section MUST exist → FAIL if missing
- Every requirement category must have a verification method assigned
- Verification dependencies must be documented

**If BMad track:**
- Section is OPTIONAL → Note if missing but don't fail
- If present, do a basic quality check

### 2. Verify Coverage (Enterprise)

For each requirement category (FRs, NFRs, Interfaces, Constraints):
- Is a primary verification method assigned?
- Is the method appropriate for the requirement type?
- Are verification dependencies identified?

### 3. Generate Findings

```markdown
### Verification Coverage Validation

**Verification Section:** [Present / Missing]

**Coverage by Category:**
| Requirement Category | V&V Method Assigned | Appropriate | Notes |
|---------------------|-------------------|-------------|-------|
| Functional | [Yes/No] | [Yes/No] | |
| Performance NFRs | [Yes/No] | [Yes/No] | |
| Security NFRs | [Yes/No] | [Yes/No] | |
| Interface | [Yes/No] | [Yes/No] | |
| Constraints | [Yes/No] | [Yes/No] | |

**Verification Dependencies:** [Documented / Not documented]

**Severity:** [PASS / CONCERNS / FAIL]
```

### 4. Append to Report and Proceed

Append findings to `{validationReportPath}`.

Display: "**Verification Coverage:** [PASS/CONCERNS/FAIL]. Proceeding to interface coverage check..."

Read fully and follow: `{nextStepFile}`

## SUCCESS METRICS:

✅ Verification section existence checked
✅ Track-appropriate depth of validation
✅ All requirement categories checked for V&V assignment
✅ Verification method appropriateness validated
✅ Dependencies identified

## FAILURE MODES:

❌ Not checking verification section for Enterprise track
❌ Not validating method appropriateness
