---
name: 'step-03-tools-overview'
description: 'Present available tools from CSV and gather initial user requirements'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-03-tools-overview.md'
nextStepFile: '{workflow_path}/steps/step-04-core-tools.md'
workflowFile: '{workflow_path}/workflow.md'
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'

# Documentation References
commonToolsCsv: '{project-root}/{bmad_folder}/bmb/docs/workflows/common-workflow-tools.csv'
---

# Step 3: Tools Overview

## STEP GOAL:

Load and present available tools from the CSV, then gather the user's general tool requirements for their workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and integration specialist
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD tools and workflow optimization
- ✅ User brings their workflow requirements

## EXECUTION PROTOCOLS:

- 🎯 Load CSV and present tools dynamically
- 💾 Gather user's general tool requirements
- 📖 Document requirements in workflow plan
- 🚫 FORBIDDEN to proceed without user input

## SEQUENCE OF INSTRUCTIONS:

### 1. Initialize Tools Discussion

"Beginning **Tools Integration and Configuration**

Based on your workflow requirements, I'll help identify the best tools and integrations. Let me first load the available tools from our reference."

### 2. Load and Present Available Tools

Load `{commonToolsCsv}` and present tools organized by type:

"**Available BMAD Tools and Integrations:**

**Always Available (Recommended for Most Workflows):**

- [List tools from CSV where propose='always', organized by type]

**Example Tools (Available When Needed):**

- [List tools from CSV where propose='example', organized by type]

\*\*Tools requiring installation will be noted."

### 3. Gather Initial Requirements

"**Your Tool Requirements:**

Based on your workflow type and goals, what tools do you anticipate needing?

1. **Core BMAD Tools:** Do you want collaborative idea generation, critical evaluation, or brainstorming capabilities?
2. **LLM Features:** Will you need web access, file management, sub-agents, or parallel processing?
3. **Memory:** Does your workflow need persistent state across sessions?
4. **External Tools:** Will you need MCP integrations like documentation access, browser automation, or database connections?

**Initial Tool Preferences:** [gather user's general requirements]"

### 4. Document Requirements

Append to {workflowPlanFile}:

```markdown
## Tool Requirements Summary

**Initial Tool Preferences:**

- Core BMAD Tools: [user selections]
- LLM Features: [user selections]
- Memory Requirements: [user selections]
- External Tools: [user selections]
  **Installation Willingness:** [user comfort level with installing tools]
```

### 5. Menu Options

Display: **Select an Option:** [C] Continue to Core Tools [M] Modify Requirements

#### Menu Handling Logic:

- IF C: Append tools overview to {workflowPlanFile}, update frontmatter, then load {nextStepFile}
- IF M: Refine requirements discussion

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and requirements are documented will you load {nextStepFile} to configure core tools.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- CSV loaded and tools presented clearly
- User's initial tool requirements gathered
- Requirements documented in workflow plan
- User ready to proceed to detailed configuration

### ❌ SYSTEM FAILURE:

- Not loading tools from CSV
- Duplicating CSV content in step file
- Proceeding without user requirements input
