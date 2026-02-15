---
name: 'step-v-12c-interface-coverage'
description: 'Interface Coverage Validation - Check that external interface requirements are complete'

# File references (ONLY variables used in this step)
nextStepFile: './step-v-13-report-complete.md'
prdFile: '{prd_file_path}'
validationReportPath: '{validation_report_path}'
---

# Step 12c: Interface Coverage Validation (Enterprise Track)

## STEP GOAL:

Validate that external interface requirements are complete and cover all integration points mentioned in the PRD.

## MANDATORY EXECUTION RULES (READ FIRST):

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`
- 🚪 This is a validation sequence step - auto-proceeds when complete

### Track-Aware Execution:

- If `track: 'enterprise'` → Run full interface coverage check
- If `track: 'bmad'` or not set → Check if interface section exists, note for awareness
- Log decision in report

## VALIDATION SEQUENCE:

### 1. Check Interface Section Exists

Look for "## External Interface Requirements" or similar section in the PRD.

### 2. Cross-Reference Analysis (Enterprise)

Scan the entire PRD for mentions of:
- External systems, APIs, services
- User interface platforms (web, mobile, CLI)
- Hardware devices or sensors
- Communication protocols
- Third-party integrations

Compare these mentions against what's documented in the Interface Requirements section.

### 3. Generate Findings

```markdown
### Interface Coverage Validation

**Interface Section:** [Present / Missing]

**Interface Category Coverage:**
| Category | Section Present | Completeness | Notes |
|----------|---------------|-------------|-------|
| User Interfaces | [Yes/No/N/A] | [Complete/Partial/Missing] | |
| Hardware Interfaces | [Yes/No/N/A] | [Complete/Partial/Missing] | |
| Software Interfaces | [Yes/No/N/A] | [Complete/Partial/Missing] | |
| Communication Interfaces | [Yes/No/N/A] | [Complete/Partial/Missing] | |

**Cross-Reference Issues:**
[List any integrations mentioned in PRD but not documented in interface section]

**Severity:** [PASS / CONCERNS / FAIL]
```

### 4. Append to Report and Proceed

Append findings to `{validationReportPath}`.

Display: "**Interface Coverage:** [PASS/CONCERNS/FAIL]. Proceeding to final report..."

Read fully and follow: `{nextStepFile}`

## SUCCESS METRICS:

✅ Interface section existence checked
✅ Cross-reference analysis performed
✅ Missing interfaces identified
✅ Track-appropriate validation depth

## FAILURE MODES:

❌ Not cross-referencing integrations mentioned elsewhere in PRD
❌ Not checking all four interface categories
