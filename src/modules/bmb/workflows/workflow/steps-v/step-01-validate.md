---
name: 'step-01-validate'
description: 'Initialize validation: create report and check file structure & size'

nextStepFile: './step-02-frontmatter-validation.md'
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'
validationReportFile: '{targetWorkflowPath}/validation-report-{new_workflow_name}.md'
stepFileRules: '../data/step-file-rules.md'
---

# Validation Step 1: File Structure & Size

## STEP GOAL:

To create the validation report and check that the workflow has correct file structure and all step files are within size limits.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 DO NOT BE LAZY - LOAD AND REVIEW EVERY FILE
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ Validation does NOT stop for user input - auto-proceed through all validation steps

### Step-Specific Rules:

- 🎯 Create validation report with header structure
- 🚫 DO NOT skip checking any file
- 💬 Append findings to report, then auto-load next step
- 🚪 This is validation - systematic and thorough

## EXECUTION PROTOCOLS:

- 🎯 Load and check EVERY file in the workflow
- 💾 Append findings to validation report
- 📖 Save report before loading next validation step
- 🚫 DO NOT halt for user input - validation runs to completion

## CONTEXT BOUNDARIES:

- Workflow has been built in steps-c/
- Check the entire folder structure
- Verify all required files exist
- Check file sizes against limits

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip or shortcut.

### 1. Create Validation Report

Create {validationReportFile} with header structure:

```markdown
---
validationDate: [current date]
workflowName: {new_workflow_name}
workflowPath: {targetWorkflowPath}
validationStatus: IN_PROGRESS
---

# Validation Report: {new_workflow_name}

**Validation Started:** [current date]
**Validator:** BMAD Workflow Validation System
**Standards Version:** BMAD Workflow Standards

---

## File Structure & Size

*Validation in progress...*

## Frontmatter Validation
*Pending...*

## Menu Handling Validation
*Pending...*

## Step Type Validation
*Pending...*

## Output Format Validation
*Pending...*

## Validation Design Check
*Pending...*

## Instruction Style Check
*Pending...*

## Collaborative Experience Check
*Pending...*

## Cohesive Review
*Pending...*

## Summary
*Pending...*
```

### 2. Load File Structure Standards

Load {stepFileRules} to understand:
- File size limits (<200 recommended, 250 max)
- Required folder structure
- Required files

### 3. Check Folder Structure

**DO NOT BE LAZY - List EVERY folder and file:**

Use bash commands to list the entire structure:
```
{targetWorkflowPath}/
├── workflow.md
├── steps-c/
│   ├── step-01-init.md
│   ├── step-01b-continue.md (if continuable)
│   ├── step-02-*.md
│   └── ...
├── steps-v/
│   └── [this validation]
├── data/
│   └── [as needed]
└── templates/
    └── [as needed]
```

**Check:**
- ✅ workflow.md exists
- ✅ steps-c/ folder exists with all step files
- ✅ data/ folder exists (may be empty)
- ✅ templates/ folder exists (may be empty)
- ✅ No unexpected files
- ✅ Folder names follow conventions

### 4. Check File Sizes

**DO NOT BE LAZY - Check EVERY step file:**

For each file in `steps-c/`:
1. Read the file
2. Count lines
3. Check against limits:
   - < 200 lines: ✅ Good
   - 200-250 lines: ⚠️ Approaching limit
   - > 250 lines: ❌ Exceeds limit

**Check for Large Data Files:**

For each file in `data/` folder:
1. Check file size in lines
2. If > 500 lines: ⚠️ WARNING - Large data file detected
3. If > 1000 lines: ❌ ERROR - Data file too large for direct loading

**For large data files, recommend:**
- Create an index/csv/yaml so LLM knows what's available and can load specific sections
- Use sharding technique (core module has sharding tool) to split large files
- Consider if all data is needed or if lookup/reference pattern would work better

**Report format:**
```markdown
### File Size Check

| File | Lines | Status |
|------|-------|--------|
| step-01-init.md | 180 | ✅ Good |
| step-02-*.md | 245 | ⚠️ Approaching limit |
| step-03-*.md | 267 | ❌ Exceeds limit - should split |

### Data File Size Check

| Data File | Lines | Status |
|-----------|-------|--------|
| reference-data.csv | 150 | ✅ Good |
| large-data.md | 2500 | ❌ Too large - use sharding or create index |
```

### 5. Verify File Presence

From the design in {workflowPlanFile}, verify:
- Every step from design has a corresponding file
- Step files are numbered sequentially
- No gaps in numbering
- Final step exists

### 6. Append Findings to Report

Replace the "## File Structure & Size" section in {validationReportFile} with actual findings:

```markdown
## File Structure & Size

### Folder Structure
[Report findings - is structure correct?]

### Files Present
[Report findings - are all required files present?]

### File Size Check
[Table as shown above]

### Issues Found
[List any issues:
- Missing files
- Extra files
- Size violations
- Naming convention violations]

### Status
✅ PASS / ❌ FAIL / ⚠️ WARNINGS
```

### 7. Save Report and Auto-Proceed

**CRITICAL:** Save the validation report BEFORE loading next step.

Then immediately load, read entire file, then execute {nextStepFile}.

**Display:**
"**File Structure & Size validation complete.** Proceeding to Frontmatter Validation..."

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Validation report created with header structure
- EVERY file checked for structure and size
- Findings appended to report
- Report saved before proceeding
- Next validation step loaded

### ❌ SYSTEM FAILURE:

- Not checking every file
- Skipping size checks
- Not saving report before proceeding
- Halting for user input

**Master Rule:** Validation is systematic and thorough. DO NOT BE LAZY. Check EVERY file. Auto-proceed through all validation steps.
