---
name: 'step-07f-sidecar-validation'
description: 'Validate sidecar structure and paths'

# File References
nextStepFile: './step-09-celebrate.md'
criticalActions: ../data/critical-actions.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'
sidecarFolder: '{bmb_creations_output_folder}/{agent-name}/{agent-name}-sidecar/'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---
# STEP GOAL

Validate the sidecar folder structure and referenced paths for Expert agents to ensure all sidecar files exist, are properly structured, and paths in the main agent YAML correctly reference them.

# MANDATORY EXECUTION RULES

1. **ONLY runs for Expert agents** - Simple agents should never reach this step
2. **MUST verify sidecar folder exists** before proceeding
3. **ALWAYS cross-reference YAML paths** with actual files
4. **NEVER create missing sidecar files** - Report issues, don't auto-fix
5. **MUST validate sidecar file structure** for completeness
6. **ALWAYS check critical actions file** if referenced
7. **PROVIDE clear remediation steps** for any missing or malformed files

# EXECUTION PROTOCOLS

## Context Awareness

- User has an Expert agent with sidecar configuration
- Structural validation (7E) already passed
- Sidecar folder should have been created during build
- This is the final validation before celebration
- Missing sidecar components may break agent functionality

## User Expectations

- Comprehensive sidecar structure validation
- Clear identification of missing files
- Path reference verification
- Actionable remediation guidance
- Professional but approachable tone

## Tone and Style

- Thorough and systematic
- Clear and specific about issues
- Solution-oriented (focus on how to fix)
- Encouraging when sidecar is complete
- Not pedantic about minor formatting issues

# CONTEXT BOUNDARIES

## What to Validate

- Sidecar folder existence and location
- All referenced files exist in sidecar
- Sidecar file structure completeness
- Path references in main YAML accuracy
- Critical actions file if referenced
- File naming conventions
- File content completeness (not empty)

## What NOT to Validate

- Content quality of sidecar files
- Artistic choices in sidecar documentation
- Optional sidecar components
- File formatting preferences

## When to Escalate

- Sidecar folder completely missing
- Critical files missing (actions, core modules)
- Path references pointing to non-existent files
- Empty sidecar files that should have content

# EXECUTION SEQUENCE

## 1. Load Sidecar Context

```bash
# Verify main agent YAML exists
agentYaml = read(builtYaml)

# Extract sidecar path from YAML or use template default
sidecarPath = extractSidecarPath(agentYaml) or sidecarFolder

# Check if sidecar folder exists
sidecarExists = directoryExists(sidecarPath)

# Load critical actions reference if needed
criticalActionsRef = read(criticalActions)
```

**Action:** Present discovery status:
```markdown
🔍 SIDECAR VALIDATION INITIALIZED

Agent: {agent-name}
Type: Expert (requires sidecar)

Main YAML: {builtYaml}
Sidecar Path: {sidecarPath}

Status: {✅ Folder Found | ❌ Folder Missing}
```

## 2. Validate Sidecar Structure

### A. Folder Existence Check

```markdown
## 📁 FOLDER STRUCTURE VALIDATION

**Sidecar Location:** {sidecarPath}
**Status:** [EXISTS | MISSING | WRONG LOCATION]
```

If missing:
```markdown
❌ **CRITICAL ISSUE:** Sidecar folder not found!

**Expected Location:** {sidecarPath}

**Possible Causes:**
1. Build process didn't create sidecar
2. Sidecar path misconfigured in agent YAML
3. Folder moved or deleted after build

**Required Action:**
[ ] Re-run build process with sidecar enabled
[ ] Verify sidecar configuration in agent YAML
[ ] Check folder was created in correct location
```

### B. Sidecar File Inventory

If folder exists, list all files:
```bash
sidecarFiles = listFiles(sidecarPath)
```

```markdown
## 📄 SIDECAR FILE INVENTORY

Found {count} files in sidecar:

{For each file:}
- {filename} ({size} bytes)
```

### C. Cross-Reference Validation

Extract all sidecar path references from agent YAML:
```yaml
# Common sidecar reference patterns
sidecar:
  critical-actions: './{agent-name}-sidecar/critical-actions.md'
  modules:
    - path: './{agent-name}-sidecar/modules/module-01.md'
```

Validate each reference:
```markdown
## 🔗 PATH REFERENCE VALIDATION

**Checked {count} references from agent YAML:**

{For each reference:}
**Source:** {field in agent YAML}
**Expected Path:** {referenced path}
**Status:** [✅ Found | ❌ Missing | ⚠️  Wrong Location]
```

## 3. Validate Sidecar File Contents

For each sidecar file found, check:

### A. File Completeness
```markdown
## 📋 FILE CONTENT VALIDATION

{For each file:}
### {filename}
**Size:** {bytes}
**Status:** [✅ Complete | ⚠️  Empty | ❌ Too Small]
**Last Modified:** {timestamp}
```

### B. Critical Actions File (if present)

Special validation for critical-actions.md:
```markdown
## 🎯 CRITICAL ACTIONS VALIDATION

**File:** {sidecarPath}/critical-actions.md
**Status:** [PRESENT | MISSING | EMPTY]

{If Present:}
**Sections Found:**
{List sections detected}

**Completeness:**
[ ] Header/metadata present
[ ] Actions defined
[ ] No critical sections missing
```

### C. Module Files (if present)

If sidecar contains modules:
```markdown
## 📚 MODULE VALIDATION

**Modules Found:** {count}

{For each module:}
### {module-filename}
**Status:** [✅ Valid | ⚠️  Issues Found]
**Checks:**
[ ] Frontmatter complete
[ ] Content present
[ ] References valid
```

## 4. Generate Validation Report

```markdown
# 🎯 SIDECAR VALIDATION REPORT

## Agent: {agent-name}
Sidecar Path: {sidecarPath}
Validation Date: {timestamp}

---

## ✅ VALIDATION CHECKS PASSED

**Folder Structure:**
- [x] Sidecar folder exists
- [x] Located at expected path
- [x] Accessible and readable

**File Completeness:**
- [x] All referenced files present
- [x] No broken path references
- [x] Files have content (not empty)

**Content Quality:**
- [x] Critical actions complete
- [x] Module files structured
- [x] No obvious corruption

---

## ⚠️  ISSUES IDENTIFIED ({count})

{If issues:}
### Issue #{number}: {issue type}
**Severity:** [CRITICAL|MODERATE|MINOR]
**Component:** {file or folder}
**Problem:** {clear description}
**Impact:** {what this breaks}
**Remediation:**
1. {specific step 1}
2. {specific step 2}
3. {specific step 3}

{If no issues:}
### 🎉 NO ISSUES FOUND
Your agent's sidecar is complete and properly structured!
All path references are valid and files are in place.

---

## 📊 SUMMARY

**Overall Status:** [PASSED|FAILED|CONDITIONAL]
**Files Validated:** {count}
**Issues Found:** {count}
**Critical Issues:** {count}
**Sidecar Ready:** [YES|NO]

---

## 5. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [F] Fix Findings [P] Party Mode [C] Continue"

### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF F: Apply auto-fixes to {builtYaml} or sidecar files for identified issues, then redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Proceed to celebration step, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## 6. Issue Resolution (if [F] selected)

Work through each issue systematically:

**For Missing Files:**
```markdown
### 🔧 FIXING: Missing {filename}

**Required File:** {path}
**Purpose:** {why it's needed}

**Option 1:** Re-run Build
- Sidecar may not have been created completely
- Return to build step and re-execute

**Option 2:** Manual Creation
- Create file at: {full path}
- Use template from: {template reference}
- Minimum required content: {specification}

**Option 3:** Update References
- Remove reference from agent YAML if not truly needed
- Update path if file exists in different location

Which option? [1/2/3]:
```

**For Broken Path References:**
```markdown
### 🔧 FIXING: Invalid Path Reference

**Reference Location:** {agent YAML field}
**Current Path:** {incorrect path}
**Expected File:** {filename}
**Actual Location:** {where file actually is}

**Fix Options:**
1. Update path in agent YAML to: {correct path}
2. Move file to expected location: {expected path}
3. Remove reference if file not needed

Which option? [1/2/3]:
```

**For Empty/Malformed Files:**
```markdown
### 🔧 FIXING: {filename} - {Issue}

**Problem:** {empty/too small/malformed}
**Location:** {full path}

**Remediation:**
- View current content
- Compare to template/standard
- Add missing sections
- Correct formatting

Ready to view and fix? [Y/N]:
```

After each fix:
- Re-validate the specific component
- Confirm resolution
- Move to next issue
- Final re-validation when all complete

## 6. Route to Celebration

When validation passes or user chooses to continue:

```markdown
# 🚀 SIDECAR VALIDATION COMPLETE

## Expert Agent: {agent-name}

✅ **Sidecar Structure:** Validated
✅ **Path References:** All correct
✅ **File Contents:** Complete

---

## 🎯 READY FOR CELEBRATION

Your Expert agent with sidecar is fully validated and ready!

**Next Step:** Celebration (Step 8)
**Final Status:** All checks passed

Press [Enter] to proceed to celebration...
```

# CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [validation complete with any findings addressed], will you then load and read fully `{nextStepFile}` to execute and begin [celebration].

**BEFORE proceeding to Step 8:**

1. ✅ Sidecar folder exists and is accessible
2. ✅ All referenced files present
3. ✅ Path references validated
4. ✅ File contents checked for completeness
5. ✅ User informed of validation status
6. ✅ Issues resolved or explicitly accepted
7. ⚠️  **CRITICAL:** Only Expert agents should reach this step
8. ⚠️  **CRITICAL:** Sidecar must be complete for agent to function

**DO NOT PROCEED IF:**
- Sidecar folder completely missing
- Critical files absent (actions, core modules)
- User unaware of sidecar issues
- Validation not completed

# SUCCESS METRICS

## Step Complete When:
- [ ] Sidecar folder validated
- [ ] All path references checked
- [ ] File contents verified
- [ ] Validation report presented
- [ ] Issues resolved or accepted
- [ ] User ready to proceed

## Quality Indicators:
- Thoroughness of file inventory
- Accuracy of path reference validation
- Clarity of issue identification
- Actionability of remediation steps
- User confidence in sidecar completeness

## Failure Modes:
- Missing sidecar folder completely
- Skipping file existence checks
- Not validating path references
- Proceeding with critical files missing
- Unclear validation report
- Not providing remediation guidance

---

## 🎓 NOTE: Expert Agent Sidecars

Sidecars are what make Expert agents powerful. They enable:
- Modular architecture
- Separation of concerns
- Easier updates and maintenance
- Shared components across agents

A validated sidecar ensures your Expert agent will:
- Load correctly at runtime
- Find all referenced resources
- Execute critical actions as defined
- Provide the advanced capabilities designed

Take the time to validate thoroughly - it pays off in agent reliability!
