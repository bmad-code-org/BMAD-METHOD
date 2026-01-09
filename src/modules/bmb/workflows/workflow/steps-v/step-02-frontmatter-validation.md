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

To validate that EVERY step file's frontmatter follows the frontmatter standards - correct variables, proper relative paths, NO unused variables.

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

- All step files in the workflow must be validated
- Load {frontmatterStandards} for validation criteria
- Check for: unused variables, non-relative paths, missing required fields, forbidden patterns

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip or shortcut.

### 1. Load Frontmatter Standards

Load {frontmatterStandards} to understand validation criteria.

**Key Rules:**
1. Only variables USED in the step may be in frontmatter
2. All file references MUST use `{variable}` format
3. Paths within workflow folder MUST be relative - NO `workflow_path` allowed

**Forbidden Patterns:**
- `workflow_path: '...'` - use relative paths instead
- `thisStepFile: '...'` - remove unless actually referenced in body
- `workflowFile: '...'` - remove unless actually referenced in body
- `{workflow_path}/steps/...` - use `./step-XX.md`
- `{workflow_path}/templates/...` - use `../template.md`

### 2. Validate EVERY Step File - Systematic Algorithm

**DO NOT BE LAZY - For EACH step file:**

#### Step 2.1: Extract Frontmatter Variables

```python
# Algorithm to extract variables from frontmatter:
1. Find content between first `---` and second `---`
2. For each line, extract key before `:`
3. Skip `name`, `description`, and comment lines starting with `#`
4. Collect all variable names
```

Example frontmatter:
```yaml
---
# File References
nextStepFile: './step-02-vision.md'
outputFile: '{planning_artifacts}/product-brief-{{project_name}}.md'
workflow_path: '{project-root}/...'  # ❌ FORBIDDEN
thisStepFile: './step-01-init.md'     # ❌ Likely unused
---
```

Variables extracted: `nextStepFile`, `outputFile`, `workflow_path`, `thisStepFile`

#### Step 2.2: Check Each Variable Is Used

```python
# Algorithm to check variable usage:
for each variable in extracted_variables:
    search_body = "{variableName}"  # with curly braces
    if search_body NOT found in step body (after frontmatter):
        MARK_AS_UNUSED(variable)
```

**Example:**
- Variable `nextStepFile`: Search body for `{nextStepFile}` → Found in line 166 ✅
- Variable `thisStepFile`: Search body for `{thisStepFile}` → Not found ❌ VIOLATION

#### Step 2.3: Check Path Formats

For each variable containing a file path:

```python
# Algorithm to validate paths:
if path contains "{workflow_path}":
    MARK_AS_VIOLATION("workflow_path is forbidden - use relative paths")

if path is to another step file:
    if not path.startswith("./step-"):
        MARK_AS_VIOLATION("Step-to-step paths must be ./filename.md")

if path is to parent folder template:
    if not path.startswith("../"):
        MARK_AS_VIOLATION("Parent folder paths must be ../filename.md")

if path contains "{project-root}" and is internal workflow reference:
    MARK_AS_VIOLATION("Internal paths must be relative, not project-root")
```

### 3. Document Findings

Create report table:

```markdown
### Frontmatter Validation Results

| File | Required | All Vars Used | Relative Paths | No Forbidden | Status |
|------|----------|---------------|----------------|-------------|--------|
| step-01-init.md | ✅ | ❌ Unused: thisStepFile, workflowFile | ✅ | ✅ | ❌ FAIL |
| step-02-vision.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
```

### 4. List All Violations

For EACH file with violations:

```markdown
### Violations Found

**step-01-init.md:**
- ❌ Unused variable: `thisStepFile` (defined but {thisStepFile} never appears in body)
- ❌ Unused variable: `workflowFile` (defined but {workflowFile} never appears in body)
- ❌ Forbidden pattern: `workflow_path` variable found (use relative paths instead)

**step-02-vision.md:**
- ✅ All checks passed
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

- EVERY step file's frontmatter validated using systematic algorithm
- Each variable checked for usage in step body
- Each path checked for proper relative format
- All violations documented with specific variable names
- Findings appended to report
- Report saved before proceeding
- Next validation step loaded

### ❌ SYSTEM FAILURE:

- Not checking every file
- Not systematically checking each variable for usage
- Missing forbidden pattern detection
- Not documenting violations with specific details
- Not saving report before proceeding

**Master Rule:** Validation is systematic and thorough. DO NOT BE LAZY. For EACH variable in frontmatter, verify it's used in the body. For EACH path, verify it's relative. Auto-proceed through all validation steps.
