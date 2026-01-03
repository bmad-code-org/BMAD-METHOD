---
name: 'step-02-frontmatter-validation'
description: 'Validate frontmatter compliance across all step files'

nextStepFile: './step-03-menu-validation.md'
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
validationReportFile: '{targetWorkflowPath}/validation-report-{new_workflow_name}.md'
frontmatterStandards: '../data/frontmatter-standards.md'
---

# Validation Step 2: Frontmatter Validation

## STEP GOAL:

To validate that EVERY step file's frontmatter follows the frontmatter standards - correct variables, proper path formatting, no unused variables.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 DO NOT BE LAZY - LOAD AND REVIEW EVERY FILE
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ Validation does NOT stop for user input - auto-proceed through all validation steps

### Step-Specific Rules:

- 🎯 Load and validate EVERY step file's frontmatter
- 🚫 DO NOT skip any files or checks
- 💬 Append findings to report, then auto-load next step
- 🚪 This is validation - systematic and thorough

## EXECUTION PROTOCOLS:

- 🎯 Load frontmatter standards first
- 💾 Check EVERY file against standards
- 📖 Append findings to validation report
- 🚫 DO NOT halt for user input - validation runs to completion

## CONTEXT BOUNDARIES:

- All step files in steps-c/ must be validated
- Load {frontmatterStandards} for validation criteria
- Check for: unused variables, hardcoded paths, missing required fields

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip or shortcut.

### 1. Load Frontmatter Standards

Load {frontmatterStandards} to understand validation criteria:

**Golden Rules:**
1. Only variables USED in the step may be in frontmatter
2. All file references MUST use `{variable}` format
3. Paths within workflow folder MUST be relative

**Required Fields:**
- `name` - must be present, kebab-case
- `description` - must be present

### 2. Check EVERY Step File

**DO NOT BE LAZY - For EACH file in steps-c/:**

1. Load the file
2. Extract frontmatter
3. Validate against each rule:

**Check 1: Required Fields**
- ✅ `name` exists and is kebab-case
- ✅ `description` exists

**Check 2: All Frontmatter Variables Are Used**
- For each variable in frontmatter, check if it appears in step body
- ❌ If not used: mark as violation

**Check 3: No Hardcoded Paths**
- Check all file references use `{variable}` format
- ❌ If absolute path found: mark as violation

**Check 4: Relative Paths Within Workflow**
- Paths to same workflow should be relative (`../data/`)
- ❌ If absolute path for same-folder: mark as violation

**Check 5: External References Use Full Variable Paths**
- `{project-root}` variables for external references
- ✅ Correct: `advancedElicitationTask: '{project-root}/_bmad/core/...'`

### 3. Document Findings

Create report table:

```markdown
### Frontmatter Validation Results

| File | Required Fields | Variables Used | Relative Paths | Status |
|------|----------------|----------------|----------------|--------|
| step-01-init.md | ✅ | ✅ | ✅ | ✅ PASS |
| step-02-*.md | ✅ | ❌ Unused: partyModeWorkflow | ✅ | ❌ FAIL |
| step-03-*.md | ❌ Missing description | ✅ | ❌ Hardcoded path | ❌ FAIL |
```

### 4. List Violations

```markdown
### Violations Found

**step-02-[name].md:**
- Unused variable in frontmatter: `partyModeWorkflow` (not used in step body)

**step-03-[name].md:**
- Missing required field: `description`
- Hardcoded path: `someTemplate: '/absolute/path/template.md'` should use relative or variable

**step-05-[name].md:**
- All checks passed ✅
```

### 5. Append to Report

Update {validationReportFile} - replace "## Frontmatter Validation *Pending...*" with actual findings.

### 6. Save Report and Auto-Proceed

**CRITICAL:** Save the validation report BEFORE loading next step.

Then immediately load, read entire file, then execute {nextStepFile}.

**Display:**
"**Frontmatter validation complete.** Proceeding to Menu Handling Validation..."

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- EVERY step file's frontmatter validated
- All violations documented
- Findings appended to report
- Report saved before proceeding
- Next validation step loaded

### ❌ SYSTEM FAILURE:

- Not checking every file
- Skipping frontmatter checks
- Not documenting violations
- Not saving report before proceeding

**Master Rule:** Validation is systematic and thorough. DO NOT BE LAZY. Check EVERY file's frontmatter. Auto-proceed through all validation steps.
