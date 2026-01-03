---
name: 'step-05-output-format-validation'
description: 'Validate output format compliance - template type, final polish, step-to-output mapping'

nextStepFile: './step-06-validation-design-check.md'
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
validationReportFile: '{targetWorkflowPath}/validation-report-{new_workflow_name}.md'
outputFormatStandards: '../data/output-format-standards.md'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'
---

# Validation Step 5: Output Format Validation

## STEP GOAL:

To validate that the workflow's output format matches the design - correct template type, proper final polish step if needed, and step-to-output mapping is correct.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 DO NOT BE LAZY - LOAD AND REVIEW EVERY FILE
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, ensure entire file is read
- ✅ Validation does NOT stop for user input - auto-proceed through all validation steps

### Step-Specific Rules:

- 🎯 Validate output format against design specifications
- 🚫 DO NOT skip any checks
- 💬 Append findings to report, then auto-load next step
- 🚪 This is validation - systematic and thorough

## EXECUTION PROTOCOLS:

- 🎯 Load output format standards first
- 💾 Check template type matches design
- 📖 Check for final polish step if needed
- 🚫 DO NOT halt for user input - validation runs to completion

## CONTEXT BOUNDARIES:

- Check template file in templates/ folder
- Review design in {workflowPlanFile} for output format specification
- Validate step-to-output mapping
- Check if final polish step is present (if needed)

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip or shortcut.

### 1. Load Output Format Standards

Load {outputFormatStandards} to understand:

**Golden Rule:** Every step MUST output to document BEFORE loading next step.

**Four Template Types:**
1. **Free-form** (Recommended) - Minimal structure, progressive append
2. **Structured** - Required sections, flexible within each
3. **Semi-structured** - Core sections plus optional additions
4. **Strict** - Exact format, specific fields (rare)

**Final Polish Step:**
- For free-form workflows, include a polish step that optimizes the entire document
- Loads entire document, reviews for flow, removes duplication

### 2. Check Design Specification

From {workflowPlanFile}, identify:
- Does this workflow produce a document?
- If yes, what template type was designed?
- Is a final polish step needed?

### 3. Validate Template File

**If workflow produces documents:**

1. Load the template file from `templates/` folder
2. Check it matches the designed type:

**For Free-form (most common):**
- ✅ Has frontmatter with `stepsCompleted: []`
- ✅ Has `lastStep: ''`
- ✅ Has `date: ''`
- ✅ Has `user_name: ''`
- ✅ Document title header
- ✅ No rigid section structure (progressive append)

**For Structured:**
- ✅ Has clear section headers
- ✅ Section placeholders with {{variable}} syntax
- ✅ Consistent structure

**For Semi-structured:**
- ✅ Has core required sections
- ✅ Has optional section placeholders

**For Strict:**
- ✅ Has exact field definitions
- ✅ Validation rules specified

### 4. Check for Final Polish Step

**If free-form template:**
- ✅ A final polish step should exist in the design
- ✅ The step loads entire document
- ✅ The step optimizes flow and coherence
- ✅ The step removes duplication
- ✅ The step ensures ## Level 2 headers

**If no final polish step for free-form:**
- ⚠️ WARNING - Free-form workflows typically need final polish

### 5. Validate Step-to-Output Mapping

**For EACH step that outputs to document:**

1. Check the step has `outputFile` in frontmatter
2. Check the step appends/writes to output before loading next
3. Check the menu C option saves to output before proceeding

**Steps should be in ORDER of document appearance:**
- Step 1 creates doc
- Step 2 → ## Section 1
- Step 3 → ## Section 2
- Step N → Polish step

### 6. Document Findings

```markdown
### Output Format Validation Results

**Workflow Produces Documents:** [Yes/No]

**Template Type:** [Free-form/Structured/Semi-structured/Strict]

**Template File Check:**
- Template exists: ✅/❌
- Matches designed type: ✅/❌
- Proper frontmatter: ✅/❌

**Final Polish Step:**
- Required: [Yes/No - based on template type]
- Present: ✅/❌
- Loads entire document: ✅/❌
- Optimizes flow: ✅/❌

**Step-to-Output Mapping:**
| Step | Has Output Variable | Saves Before Next | Status |
|------|-------------------|-------------------|--------|
| step-01-init.md | ✅ | ✅ | ✅ |
| step-02-*.md | ✅ | ✅ | ✅ |
| step-03-*.md | ❌ | N/A | ❌ FAIL |

**Issues Found:**
[List any issues with template, polish step, or mapping]

**Status:** ✅ PASS / ❌ FAIL / ⚠️ WARNINGS
```

### 7. Append to Report

Update {validationReportFile} - replace "## Output Format Validation *Pending...*" with actual findings.

### 8. Save Report and Auto-Proceed

**CRITICAL:** Save the validation report BEFORE loading next step.

Then immediately load, read entire file, then execute {nextStepFile}.

**Display:**
"**Output Format validation complete.** Proceeding to Validation Design Check..."

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Template type matches design
- Final polish step present if needed
- Step-to-output mapping validated
- All findings documented
- Report saved before proceeding
- Next validation step loaded

### ❌ SYSTEM FAILURE:

- Not checking template file
- Missing final polish step for free-form
- Not documenting mapping issues
- Not saving report before proceeding

**Master Rule:** Validation is systematic and thorough. DO NOT BE LAZY. Check template, polish step, and mapping. Auto-proceed through all validation steps.
