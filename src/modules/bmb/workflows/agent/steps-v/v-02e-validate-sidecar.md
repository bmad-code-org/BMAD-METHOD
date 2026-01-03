---
name: 'v-02e-validate-sidecar'
description: 'Validate sidecar structure and append to report'

nextStepFile: './v-03-summary.md'
validationReport: '{bmb_creations_output_folder}/validation-report-{agent-name}.md'
expertValidation: ../data/expert-agent-validation.md
criticalActions: ../data/critical-actions.md
agentFile: '{agent-file-path}'
sidecarFolder: '{agent-sidecar-folder}'
---

# Validate Step 2e: Validate Sidecar

## STEP GOAL

Validate the agent's sidecar structure (if Expert type) against BMAD standards as defined in expertValidation.md. Append findings to validation report and auto-advance.

## MANDATORY EXECUTION RULES

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Read validationReport and expertValidation first
- 🔄 CRITICAL: Load the actual agent file to check for sidecar
- 🚫 NO MENU - append findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Validate sidecar against expertValidation.md rules (for Expert agents)
- 📊 Append findings to validation report
- 🚫 FORBIDDEN to present menu

## EXECUTION PROTOCOLS

- 🎯 Load expertValidation.md reference
- 🎯 Load the actual agent file for validation
- 📊 Validate sidecar if Expert type, skip for Simple/Module
- 💾 Append findings to validation report
- ➡️ Auto-advance to summary step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load References

Read `{expertValidation}`, `{criticalActions}`, `{validationReport}`, and `{agentFile}`.

### 2. Conditional Validation

**IF (module = "stand-alone" AND hasSidecar = true) OR (module ≠ "stand-alone" AND hasSidecar = true):**
Perform these checks systematically - validate EVERY rule specified in expertValidation.md:

#### A. Sidecar Folder Validation
- [ ] Sidecar folder exists at specified path
- [ ] Sidecar folder is accessible and readable
- [ ] Sidecar folder path in metadata matches actual location
- [ ] Folder naming follows convention: `{agent-name}-sidecar`

#### B. Sidecar File Inventory
- [ ] List all files in sidecar folder
- [ ] Verify expected files are present
- [ ] Check for unexpected files
- [ ] Validate file names follow conventions

#### C. Path Reference Validation
For each sidecar path reference in agent YAML:
- [ ] Extract path from YAML reference
- [ ] Verify file exists at referenced path
- [ ] Check path format is correct (relative/absolute as expected)
- [ ] Validate no broken path references

#### D. Critical Actions File Validation (if present)
- [ ] critical-actions.md file exists
- [ ] File has proper frontmatter
- [ ] Actions section is present and not empty
- [ ] No critical sections missing
- [ ] File content is complete (not just placeholder)

#### E. Module Files Validation (if present)
- [ ] Module files exist at referenced paths
- [ ] Each module file has proper frontmatter
- [ ] Module file content is complete
- [ ] No empty or placeholder module files

#### F. Sidecar Structure Completeness
- [ ] All referenced sidecar files present
- [ ] No orphaned references (files referenced but not present)
- [ ] No unreferenced files (files present but not referenced)
- [ ] File structure matches expert agent requirements

**IF (module = "stand-alone" AND hasSidecar = false):**
- [ ] Mark sidecar validation as N/A
- [ ] Confirm no sidecar-folder path in metadata
- [ ] Confirm no sidecar references in menu handlers

### 3. Append Findings to Report

Append to `{validationReport}`:

```markdown
### Sidecar Validation

**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL / N/A}

**Agent Type:** {simple|expert|module with sidecar}

**Checks:**
- [ ] metadata.sidecar-folder present (Expert only)
- [ ] sidecar-path format correct
- [ ] Sidecar files exist at specified path
- [ ] All referenced files present
- [ ] No broken path references

**Detailed Findings:**

*PASSING (for Expert agents):*
{List of passing checks}

*WARNINGS:*
{List of non-blocking issues}

*FAILURES:*
{List of blocking issues that must be fixed}

*N/A (for Simple agents):*
N/A - Agent is Simple type (module = "stand-alone" + hasSidecar: false, no sidecar required)
```

### 4. Auto-Advance

Load and execute `{nextStepFile}` immediately.

---

**Compiling validation summary...**
