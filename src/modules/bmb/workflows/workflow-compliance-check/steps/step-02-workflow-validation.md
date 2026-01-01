---
name: 'step-02-workflow-validation'
description: 'Validate workflow.md against workflow-template.md standards'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/workflow-compliance-check'

# File References
thisStepFile: '{workflow_path}/steps/step-02-workflow-validation.md'
nextStepFile: '{workflow_path}/steps/step-03-step-validation.md'
workflowFile: '{workflow_path}/workflow.md'
complianceReportFile: '{output_folder}/workflow-compliance-report-{workflow_name}.md'
targetWorkflowFile: '{target_workflow_path}'

# Template References
complianceReportTemplate: '{workflow_path}/templates/compliance-report.md'

# Documentation References
stepTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md'
workflowTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md'
---

# Step 2: Workflow.md Validation

## STEP GOAL:

Perform adversarial validation of the target workflow.md against workflow-template.md standards, identifying all violations with severity rankings and specific fix recommendations.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a compliance validator and quality assurance specialist
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring adversarial validation expertise - your success is finding violations
- ✅ User brings their workflow and needs honest, thorough validation

### Step-Specific Rules:

- 🎯 Focus only on workflow.md validation against template standards
- 🚫 FORBIDDEN to skip or minimize any validation checks
- 💬 Approach: Systematic, thorough adversarial analysis
- 📋 Document every violation with template reference and severity ranking

## EXECUTION PROTOCOLS:

- 🎯 Load and compare target workflow.md against workflow-template.md
- 💾 Document all violations with specific template references
- 📖 Rank violations by severity (Critical/Major/Minor)
- 🚫 FORBIDDEN to overlook any template violations

## CONTEXT BOUNDARIES:

- Available context: Validated workflow path and target workflow.md
- Focus: Systematic validation of workflow.md structure and content
- Limits: Only workflow.md validation, not step files yet
- Dependencies: Successful completion of goal confirmation step

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Initialize Compliance Report

"Beginning **Phase 1: Workflow.md Validation**
Target: `{target_workflow_name}`

**COMPLIANCE STANDARD:** All validation performed against `{workflowTemplate}` - this is THE authoritative standard for workflow.md compliance.

Loading workflow templates and target files for systematic analysis..."
[Load workflowTemplate, targetWorkflowFile]

### 2. Frontmatter Structure Validation

**Check these elements systematically:**

"**Frontmatter Validation:**"

- Required fields: name, description, web_bundle
- Proper YAML format and syntax
- Boolean value format for web_bundle
- Missing or invalid fields

For each violation found:

- **Template Reference:** Section "Frontmatter Structure" in workflow-template.md
- **Severity:** Critical (missing required) or Major (format issues)
- **Specific Fix:** Exact correction needed

### 3. Role Description Validation

**Check role compliance:**

"**Role Description Validation:**"

- Follows partnership format: "In addition to your name, communication_style, and persona, you are also a [role] collaborating with [user type]. This is a partnership, not a client-vendor relationship. You bring [your expertise], while the user brings [their expertise]. Work together as equals."
- Role accurately describes workflow function
- User type correctly identified
- Partnership language present

For violations:

- **Template Reference:** "Your Role" section in workflow-template.md
- **Severity:** Major (deviation from standard) or Minor (incomplete)
- **Specific Fix:** Exact wording or structure correction

### 4. Workflow Architecture Validation

**Validate architecture section:**

"**Architecture Validation:**"

- Core Principles section matches template exactly
- Step Processing Rules includes all 6 rules from template
- Critical Rules section matches template exactly (NO EXCEPTIONS)

For each deviation:

- **Template Reference:** "WORKFLOW ARCHITECTURE" section in workflow-template.md
- **Severity:** Critical (modified core principles) or Major (missing rules)
- **Specific Fix:** Restore template-compliant text

### 5. Initialization Sequence Validation

**Check initialization:**

"**Initialization Validation:**"

- Configuration Loading uses correct path format: `{project-root}/_bmad/[module]/config.yaml` (variable substitution pattern)
- First step follows pattern: `step-01-init.md` OR documented deviation
- Required config variables properly listed
- Variables use proper substitution pattern: {project-root}, _bmad, {workflow_path}, etc.

For violations:

- **Template Reference:** "INITIALIZATION SEQUENCE" section in workflow-template.md
- **Severity:** Major (incorrect paths or missing variables) or Minor (format issues)
- **Specific Fix:** Use proper variable substitution patterns for flexible installation

### 6. Document Workflow.md Findings

"**Workflow.md Validation Complete**
Found [X] Critical, [Y] Major, [Z] Minor violations

**Summary:**

- Critical violations must be fixed before workflow can function
- Major violations impact workflow reliability and maintainability
- Minor violations are cosmetic but should follow standards

**Next Phase:** Step-by-step validation of all step files..."

### 7. Update Compliance Report

Append to {complianceReportFile}:

```markdown
## Phase 1: Workflow.md Validation Results

### Template Adherence Analysis

**Reference Standard:** {workflowTemplate}

### Frontmatter Structure Violations

[Document each violation with severity and specific fix]

### Role Description Violations

[Document each violation with template reference and correction]

### Workflow Architecture Violations

[Document each deviation from template standards]

### Initialization Sequence Violations

[Document each path or reference issue]

### Phase 1 Summary

**Critical Issues:** [number]
**Major Issues:** [number]
**Minor Issues:** [number]

### Phase 1 Recommendations

[Prioritized fix recommendations with specific actions]
```

### 8. Continuation Confirmation

"**Phase 1 Complete:** Workflow.md validation finished with detailed violation analysis.

**Ready for Phase 3:** Step-by-step validation against step-template.md

This will check each step file for:

- Frontmatter completeness and format
- MANDATORY EXECUTION RULES compliance
- Menu pattern and continuation logic
- Path variable consistency
- Template appropriateness

**Select an Option:** [C] Continue to Step Validation [X] Exit"

## Menu Handling Logic:

- IF C: Save workflow.md findings to report, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF X: Save current findings and end workflow with guidance for resuming
- IF Any other comments or queries: respond and redisplay menu

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [workflow.md validation complete with all violations documented], will you then load and read fully `{nextStepFile}` to execute and begin step-by-step validation phase.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complete workflow.md validation against workflow-template.md
- All violations documented with severity rankings and template references
- Specific fix recommendations provided for each violation
- Compliance report updated with Phase 1 findings
- User confirms understanding before proceeding

### ❌ SYSTEM FAILURE:

- Skipping any workflow.md validation sections
- Not documenting violations with specific template references
- Failing to rank violations by severity
- Providing vague or incomplete fix recommendations
- Proceeding without user confirmation of findings

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
