---
name: 'step-v-06c-requirement-attributes'
description: 'Requirement Attributes Validation - Verify each requirement has required attributes (ID, priority, source, V&V method)'

# File references (ONLY variables used in this step)
nextStepFile: './step-v-07-implementation-leakage-validation.md'
prdFile: '{prd_file_path}'
validationReportPath: '{validation_report_path}'
---

# Step 6c: Requirement Attributes Completeness Validation (Enterprise Track)

## STEP GOAL:

Verify that each requirement has the required attributes: unique ID, priority (MoSCoW), source reference, rationale, verification method, and risk level. This is primarily an Enterprise track check.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Focus ONLY on requirement attribute completeness
- 🎯 This step is MANDATORY for Enterprise track, SKIP for other tracks
- 🚪 This is a validation sequence step - auto-proceeds when complete

### Track-Aware Execution:

**Check the PRD frontmatter for `track` value:**
- If `track: 'enterprise'` → Run full attribute validation
- If `track: 'bmad'` or not set → Skip this step entirely, proceed to next step
- Log decision in report

## EXECUTION PROTOCOLS:

- 🎯 Extract all requirements and check for required attributes
- 💾 Append findings to validation report
- 📖 Display "Proceeding to next check..." and load next step

## VALIDATION SEQUENCE:

### 1. Track Check

If not Enterprise track:
- Append to report: "**Requirement Attributes:** SKIPPED (not Enterprise track)"
- Proceed to {nextStepFile}

### 2. Extract and Check Attributes (Enterprise Only)

For each FR and NFR, verify presence of:

**Required Attributes:**
- [ ] **Unique ID**: Follows consistent pattern (FR-[AREA]-###, NFR-[AREA]-###)
- [ ] **Priority**: Must / Should / Could / Won't (MoSCoW)
- [ ] **Source**: StRS reference or stakeholder name
- [ ] **Rationale**: Why this requirement exists
- [ ] **Verification Method**: Test / Analysis / Demonstration / Inspection
- [ ] **Risk**: High / Medium / Low

### 3. Generate Findings

```markdown
### Requirement Attributes Completeness

**Requirements Checked:** [count]

**Attribute Coverage:**
| Attribute | Present | Missing | Coverage % |
|-----------|---------|---------|------------|
| Unique ID | | | |
| Priority (MoSCoW) | | | |
| Source Reference | | | |
| Rationale | | | |
| Verification Method | | | |
| Risk Level | | | |

**Missing Attributes:**
[List specific requirements with missing attributes]

**Severity:** [PASS / CONCERNS / FAIL]
```

### 4. Append to Report and Proceed

Append findings to `{validationReportPath}`.

Display: "**Requirement Attributes:** [PASS/CONCERNS/FAIL] - [X]% attribute coverage. Proceeding to implementation leakage check..."

Read fully and follow: `{nextStepFile}`

## SUCCESS METRICS:

✅ Track correctly detected and appropriate action taken
✅ All requirements checked for attribute completeness
✅ Coverage percentages calculated per attribute type
✅ Missing attributes identified with specific requirements
✅ Findings appended to validation report

## FAILURE MODES:

❌ Running Enterprise validation on non-Enterprise track
❌ Not identifying specific requirements with missing attributes
❌ Not calculating coverage percentages
