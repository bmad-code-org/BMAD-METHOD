---
name: 'step-03-menu-validation'
description: 'Validate menu handling compliance across all step files'

nextStepFile: './step-04-step-type-validation.md'
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
validationReportFile: '{targetWorkflowPath}/validation-report-{new_workflow_name}.md'
menuHandlingStandards: '../data/menu-handling-standards.md'
---

# Validation Step 3: Menu Handling Validation

## STEP GOAL:

To validate that EVERY step file's menus follow the menu handling standards - proper handlers, execution rules, appropriate menu types.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 DO NOT BE LAZY - LOAD AND REVIEW EVERY FILE
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ Validation does NOT stop for user input - auto-proceed through all validation steps

### Step-Specific Rules:

- 🎯 Load and validate EVERY step file's menus
- 🚫 DO NOT skip any files or checks
- 💬 Append findings to report, then auto-load next step
- 🚪 This is validation - systematic and thorough

## EXECUTION PROTOCOLS:

- 🎯 Load menu standards first
- 💾 Check EVERY file's menu structure
- 📖 Append findings to validation report
- 🚫 DO NOT halt for user input - validation runs to completion

## CONTEXT BOUNDARIES:

- All step files in steps-c/ must be validated
- Load {menuHandlingStandards} for validation criteria
- Check for: handler section, execution rules, reserved letters, inappropriate A/P

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip or shortcut.

### 1. Load Menu Standards

Load {menuHandlingStandards} to understand validation criteria:

**Reserved Letters:** A (Advanced Elicitation), P (Party Mode), C (Continue/Accept), X (Exit/Cancel)

**Required Structure:**
1. Display section
2. Handler section (MANDATORY)
3. Execution Rules section

**When To Include A/P:**
- DON'T: Step 1 (init), validation sequences, simple data gathering
- DO: Collaborative content creation, user might want alternatives, quality gates

### 2. Check EVERY Step File

**DO NOT BE LAZY - For EACH file in steps-c/:**

1. Load the file
2. Find the menu section (if present)
3. Validate against each rule:

**Check 1: Handler Section Exists**
- ✅ Handler section immediately follows Display
- ❌ If missing: mark as violation

**Check 2: Execution Rules Section Exists**
- ✅ "EXECUTION RULES" section present
- ✅ Contains "halt and wait" instruction
- ❌ If missing: mark as violation

**Check 3: Non-C Options Redisplay Menu**
- ✅ A/P options specify "redisplay menu"
- ❌ If missing: mark as violation

**Check 4: C Option Sequence**
- ✅ C option: save → update frontmatter → load next step
- ❌ If sequence wrong: mark as violation

**Check 5: A/P Only Where Appropriate**
- Step 01 should NOT have A/P (inappropriate for init)
- Validation sequences should auto-proceed, not have menus
- ❌ If A/P in wrong place: mark as violation

### 3. Document Findings

Create report table:

```markdown
### Menu Handling Validation Results

| File | Has Menu | Handler Section | Exec Rules | A/P Appropriate | Status |
|------|----------|----------------|------------|-----------------|--------|
| step-01-init.md | ✅ (C-only) | ✅ | ✅ | N/A | ✅ PASS |
| step-02-*.md | ✅ (A/P/C) | ✅ | ✅ | ✅ | ✅ PASS |
| step-03-*.md | ✅ (C-only) | ❌ Missing | ⚠️ Incomplete | N/A | ❌ FAIL |
| step-04-*.md | ❌ No menu | N/A | N/A | Should have A/P/C | ⚠️ WARN |
```

### 4. List Violations

```markdown
### Menu Violations Found

**step-03-[name].md:**
- Missing handler section after menu display
- EXECUTION RULES section incomplete

**step-04-[name].md:**
- No menu found - this is a collaborative content step, should have A/P/C menu

**step-05-[name].md:**
- A/P options don't specify "redisplay menu" after execution

**step-06-[name].md:**
- All checks passed ✅
```

### 5. Append to Report

Update {validationReportFile} - replace "## Menu Handling Validation *Pending...*" with actual findings.

### 6. Save Report and Auto-Proceed

**CRITICAL:** Save the validation report BEFORE loading next step.

Then immediately load, read entire file, then execute {nextStepFile}.

**Display:**
"**Menu Handling validation complete.** Proceeding to Step Type Validation..."

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- EVERY step file's menus validated
- All violations documented
- Findings appended to report
- Report saved before proceeding
- Next validation step loaded

### ❌ SYSTEM FAILURE:

- Not checking every file's menus
- Skipping menu structure checks
- Not documenting violations
- Not saving report before proceeding

**Master Rule:** Validation is systematic and thorough. DO NOT BE LAZY. Check EVERY file's menus. Auto-proceed through all validation steps.
