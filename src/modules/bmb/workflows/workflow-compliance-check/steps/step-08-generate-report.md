---
name: 'step-08-generate-report'
description: 'Generate comprehensive compliance report with fix recommendations'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/workflows/workflow-compliance-check'

# File References
thisStepFile: '{workflow_path}/steps/step-08-generate-report.md'
workflowFile: '{workflow_path}/workflow.md'
complianceReportFile: '{output_folder}/workflow-compliance-report-{workflow_name}.md'
targetWorkflowFile: '{target_workflow_path}'

# Template References
complianceReportTemplate: '{workflow_path}/templates/compliance-report.md'

# Documentation References
stepTemplate: '{project-root}/.bmad/bmb/docs/workflows/templates/step-template.md'
workflowTemplate: '{project-root}/.bmad/bmb/docs/workflows/templates/workflow-template.md'
---

# Step 8: Comprehensive Compliance Report Generation

## STEP GOAL:

Generate comprehensive compliance report compiling all validation findings, provide severity-ranked fix recommendations, and offer concrete next steps for achieving full compliance.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a compliance validator and quality assurance specialist
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring report generation and strategic recommendation expertise
- ✅ User brings their validated workflow and needs actionable improvement plan

### Step-Specific Rules:

- 🎯 Focus only on compiling comprehensive compliance report
- 🚫 FORBIDDEN to generate report without including all findings from previous phases
- 💬 Approach: Systematic compilation with clear, actionable recommendations
- 📋 Ensure report is complete, accurate, and immediately useful

## EXECUTION PROTOCOLS:

- 🎯 Compile all findings from previous validation phases
- 💾 Generate structured compliance report with clear sections
- 📖 Provide severity-ranked recommendations with specific fixes
- 🚫 FORBIDDEN to overlook any validation findings or recommendations

## CONTEXT BOUNDARIES:

- Available context: Complete validation findings from all previous phases
- Focus: Comprehensive report generation and strategic recommendations
- Limits: Report generation only, no additional validation
- Dependencies: Successful completion of all previous validation phases

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Initialize Report Generation

"**Phase 5: Comprehensive Compliance Report Generation**
Target: `{target_workflow_name}`

Compiling all validation findings into structured compliance report with actionable recommendations..."

### 2. Generate Compliance Report Structure

Create comprehensive report at {complianceReportFile}:

```markdown
# Workflow Compliance Report

**Workflow:** {target_workflow_name}
**Date:** {current_date}
**Standards:** BMAD workflow-template.md and step-template.md

---

## Executive Summary

**Overall Compliance Status:** [PASS/FAIL/PARTIAL]
**Critical Issues:** [number] - Must be fixed immediately
**Major Issues:** [number] - Significantly impacts quality/maintainability
**Minor Issues:** [number] - Standards compliance improvements

**Compliance Score:** [percentage]% based on template adherence

---

## Phase 1: Workflow.md Validation Results

### Critical Violations

[Critical issues with template references and specific fixes]

### Major Violations

[Major issues with template references and specific fixes]

### Minor Violations

[Minor issues with template references and specific fixes]

---

## Phase 2: Step-by-Step Validation Results

### Summary by Step

[Each step file with its violation summary]

### Most Common Violations

1. [Most frequent violation type with count]
2. [Second most frequent with count]
3. [Third most frequent with count]

### Workflow Type Assessment

**Workflow Type:** [editing/creation/validation/etc.]
**Template Appropriateness:** [appropriate/needs improvement]
**Recommendations:** [specific suggestions]

---

## Phase 3: Holistic Analysis Results

### Flow Validation

[Flow analysis findings with specific issues]

### Goal Alignment

**Alignment Score:** [percentage]%
**Stated vs. Actual:** [comparison with gaps]

### Optimization Opportunities

[Priority improvements with expected benefits]

---

## Meta-Workflow Failure Analysis

### Issues That Should Have Been Prevented

**By create-workflow:**

- [Specific issues that should have been caught during creation]
- [Suggested improvements to create-workflow]

**By edit-workflow (if applicable):**

- [Specific issues introduced during editing]
- [Suggested improvements to edit-workflow]

### Recommended Meta-Workflow Improvements

[Specific actionable improvements for meta-workflows]

---

## Severity-Ranked Fix Recommendations

### IMMEDIATE - Critical (Must Fix for Functionality)

1. **[Issue Title]** - [File: filename.md]
   - **Problem:** [Clear description]
   - **Template Reference:** [Specific section]
   - **Fix:** [Exact action needed]
   - **Impact:** [Why this is critical]

### HIGH PRIORITY - Major (Significantly Impacts Quality)

1. **[Issue Title]** - [File: filename.md]
   - **Problem:** [Clear description]
   - **Template Reference:** [Specific section]
   - **Fix:** [Exact action needed]
   - **Impact:** [Quality/maintainability impact]

### MEDIUM PRIORITY - Minor (Standards Compliance)

1. **[Issue Title]** - [File: filename.md]
   - **Problem:** [Clear description]
   - **Template Reference:** [Specific section]
   - **Fix:** [Exact action needed]
   - **Impact:** [Standards compliance]

---

## Automated Fix Options

### Fixes That Can Be Applied Automatically

[List of violations that can be automatically corrected]

### Fixes Requiring Manual Review

[List of violations requiring human judgment]

---

## Next Steps Recommendation

**Recommended Approach:**

1. Fix all Critical issues immediately (workflow may not function)
2. Address Major issues for reliability and maintainability
3. Implement Minor issues for full standards compliance
4. Update meta-workflows to prevent future violations

**Estimated Effort:**

- Critical fixes: [time estimate]
- Major fixes: [time estimate]
- Minor fixes: [time estimate]
```

### 3. Final Report Summary

"**Compliance Report Generated:** `{complianceReportFile}`

**Report Contents:**

- ✅ Complete violation analysis from all validation phases
- ✅ Severity-ranked recommendations with specific fixes
- ✅ Meta-workflow failure analysis with improvement suggestions
- ✅ Automated vs manual fix categorization
- ✅ Strategic next steps and effort estimates

**Key Findings:**

- **Overall Compliance Score:** [percentage]%
- **Critical Issues:** [number] requiring immediate attention
- **Major Issues:** [number] impacting quality
- **Minor Issues:** [number] for standards compliance

**Meta-Workflow Improvements Identified:** [number] specific suggestions

### 4. Offer Next Steps

"**Phase 6 Complete:** Comprehensive compliance analysis finished
All 8 validation phases completed with full report generation

**Compliance Analysis Complete. What would you like to do next?**"

**Available Options:**

- **[A] Apply Automated Fixes** - I can automatically correct applicable violations
- **[B] Launch edit-agent** - Edit the workflow with this compliance report as guidance
- **[C] Manual Review** - Use the report for manual fixes at your pace
- **[D] Update Meta-Workflows** - Strengthen create/edit workflows with identified improvements

**Recommendation:** Start with Critical issues, then proceed through High and Medium priority items systematically."

### 5. Report Completion Options

Display: "**Select an Option:** [A] Apply Automated Fixes [B] Launch Edit-Agent [C] Manual Review [D] Update Meta-Workflows [X] Exit"

## Menu Handling Logic:

- IF A: Begin applying automated fixes from the report
- IF B: Launch edit-agent workflow with this compliance report as context
- IF C: End workflow with guidance for manual review using the report
- IF D: Provide specific recommendations for meta-workflow improvements
- IF X: Save report and end workflow gracefully

## CRITICAL STEP COMPLETION NOTE

The workflow is complete when the comprehensive compliance report has been generated and the user has selected their preferred next step. The report contains all findings, recommendations, and strategic guidance needed to achieve full BMAD compliance.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Comprehensive compliance report generated with all validation findings
- Severity-ranked fix recommendations provided with specific actions
- Meta-workflow failure analysis completed with improvement suggestions
- Clear next steps offered based on user preferences
- Report saved and accessible for future reference
- User has actionable plan for achieving full compliance

### ❌ SYSTEM FAILURE:

- Generating incomplete report without all validation findings
- Missing severity rankings or specific fix recommendations
- Not providing clear next steps or options
- Failing to include meta-workflow improvement suggestions
- Creating report that is not immediately actionable

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
