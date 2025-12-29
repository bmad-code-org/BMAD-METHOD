---
name: 'step-01-validate-goal'
description: 'Confirm workflow path and validation goals before proceeding'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/workflow-compliance-check'

# File References
thisStepFile: '{workflow_path}/steps/step-01-validate-goal.md'
nextStepFile: '{workflow_path}/steps/step-02-workflow-validation.md'
workflowFile: '{workflow_path}/workflow.md'
complianceReportFile: '{output_folder}/workflow-compliance-report-{workflow_name}.md'

# Template References
complianceReportTemplate: '{workflow_path}/templates/compliance-report.md'

# Documentation References
stepTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md'
workflowTemplate: '{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md'
---

# Step 1: Goal Confirmation and Workflow Target

## STEP GOAL:

Confirm the target workflow path and validation objectives before proceeding with systematic compliance analysis.

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
- ✅ You bring compliance expertise and systematic validation skills
- ✅ User brings their workflow and specific compliance concerns

### Step-Specific Rules:

- 🎯 Focus only on confirming workflow path and validation scope
- 🚫 FORBIDDEN to proceed without clear target confirmation
- 💬 Approach: Systematic and thorough confirmation of validation objectives
- 📋 Ensure user understands the compliance checking process and scope

## EXECUTION PROTOCOLS:

- 🎯 Confirm target workflow path exists and is accessible
- 💾 Establish clear validation objectives and scope
- 📖 Explain the three-phase compliance checking process
- 🚫 FORBIDDEN to proceed without user confirmation of goals

## CONTEXT BOUNDARIES:

- Available context: User-provided workflow path and validation concerns
- Focus: Goal confirmation and target validation setup
- Limits: No actual compliance analysis yet, just setup and confirmation
- Dependencies: Clear workflow path and user agreement on validation scope

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Workflow Target Confirmation

Present this to the user:

"I'll systematically validate your workflow against BMAD standards through three phases:

1. **Workflow.md Validation** - Against workflow-template.md standards
2. **Step-by-Step Compliance** - Each step against step-template.md
3. **Holistic Analysis** - Flow optimization and goal alignment"

IF {user_provided_path} has NOT been provided, ask the user:

**What workflow should I validate?** Please provide the full path to the workflow.md file."

### 2. Workflow Path Validation

Once user provides path:

"Validating workflow path: `{user_provided_path}`"
[Check if path exists and is readable]

**If valid:** "✅ Workflow found and accessible. Ready to begin compliance analysis."
**If invalid:** "❌ Cannot access workflow at that path. Please check the path and try again."

### 3. Validation Scope Confirmation

"**Compliance Scope:** I will check:

- ✅ Frontmatter structure and required fields
- ✅ Mandatory execution rules and sections
- ✅ Menu patterns and continuation logic
- ✅ Path variable format consistency
- ✅ Template usage appropriateness
- ✅ Workflow flow and goal alignment
- ✅ Meta-workflow failure analysis

**Report Output:** I'll generate a detailed compliance report with:

- Severity-ranked violations (Critical/Major/Minor)
- Specific template references for each violation
- Recommended fixes (automated where possible)
- Meta-feedback for create/edit workflow improvements

**Is this validation scope acceptable?**"

### 4. Final Confirmation

"**Ready to proceed with compliance check of:**

- **Workflow:** `{workflow_name}`
- **Validation:** Full systematic compliance analysis
- **Output:** Detailed compliance report with fix recommendations

**Select an Option:** [C] Continue [X] Exit"

## Menu Handling Logic:

- IF C: Initialize compliance report, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF X: End workflow gracefully with guidance on running again later
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#4-final-confirmation)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [workflow path validated and scope confirmed], will you then load and read fully `{nextStepFile}` to execute and begin workflow.md validation phase.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Workflow path successfully validated and accessible
- User confirms validation scope and objectives
- Compliance report initialization prepared
- User understands the three-phase validation process
- Clear next steps established for systematic analysis

### ❌ SYSTEM FAILURE:

- Proceeding without valid workflow path confirmation
- Not ensuring user understands validation scope and process
- Starting compliance analysis without proper setup
- Failing to establish clear reporting objectives

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
