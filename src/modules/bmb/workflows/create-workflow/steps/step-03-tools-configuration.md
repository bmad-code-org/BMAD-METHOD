---
name: 'step-03-tools-configuration'
description: 'Configure all required tools (core, memory, external) and installation requirements in one comprehensive step'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-03-tools-configuration.md'
nextStepFile: '{workflow_path}/steps/step-04-plan-review.md'

targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'

# Documentation References
commonToolsCsv: '{project-root}/_bmad/bmb/docs/workflows/common-workflow-tools.csv'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
# Template References
# No template needed - will append tools configuration directly to workflow plan
---

# Step 3: Tools Configuration

## STEP GOAL:

To comprehensively configure all tools needed for the workflow (core tools, memory, external tools) and determine installation requirements.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a workflow architect and integration specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD tools and integration patterns
- ✅ User brings their workflow requirements and preferences

### Step-Specific Rules:

- 🎯 Focus ONLY on configuring tools based on workflow requirements
- 🚫 FORBIDDEN to skip tool categories - each affects workflow design
- 💬 Present options clearly, let user make informed choices
- 🚫 DO NOT hardcode tool descriptions - reference CSV

## EXECUTION PROTOCOLS:

- 🎯 Load tools dynamically from CSV, not hardcoded
- 💾 Document all tool choices in workflow plan
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- Requirements from step 2 inform tool selection
- All tool choices affect workflow design
- This is the ONLY tools configuration step
- Installation requirements affect implementation decisions

## TOOLS CONFIGURATION PROCESS:

### 1. Initialize Tools Configuration

"Configuring **Tools and Integrations**

Based on your workflow requirements, let's configure all the tools your workflow will need. This includes core BMAD tools, memory systems, and any external integrations."

### 2. Load and Present Available Tools

Load `{commonToolsCsv}` and present tools by category:

"**Available BMAD Tools and Integrations:**

**Core Tools (Always Available):**

- [List tools from CSV where propose='always', with descriptions]

**Optional Tools (Available When Needed):**

- [List tools from CSV where propose='example', with descriptions]

_Note: I'm loading these dynamically from our tools database to ensure you have the most current options._"

### 3. Configure Core BMAD Tools

"**Core BMAD Tools Configuration:**

These tools significantly enhance workflow quality and user experience:"

For each core tool from CSV (`propose='always'`):

1. **Party-Mode**
   - Use case: [description from CSV]
   - Where to integrate: [ask user for decision points, creative phases]

2. **Advanced Elicitation**
   - Use case: [description from CSV]
   - Where to integrate: [ask user for quality gates, review points]

3. **Brainstorming**
   - Use case: [description from CSV]
   - Where to integrate: [ask user for idea generation, innovation points]

### 4. Configure LLM Features

"**LLM Feature Integration:**

These capabilities enhance what your workflow can do:"

From CSV (`propose='always'` LLM features):

4. **Web-Browsing**
   - Capability: [description from CSV]
   - When needed: [ask user about real-time data needs]

5. **File I/O**
   - Capability: [description from CSV]
   - Operations: [ask user about file operations needed]

6. **Sub-Agents**
   - Capability: [description from CSV]
   - Use cases: [ask user about delegation needs]

7. **Sub-Processes**
   - Capability: [description from CSV]
   - Use cases: [ask user about parallel processing needs]

### 5. Configure Memory Systems

"**Memory and State Management:**

Determine if your workflow needs to maintain state between sessions:"

From CSV memory tools:

8. **Sidecar File**
   - Use case: [description from CSV]
   - Needed when: [ask about session continuity, agent initialization]

### 6. Configure External Tools (Optional)

"**External Integrations (Optional):**

These tools connect your workflow to external systems:"

From CSV (`propose='example'`):

- MCP integrations, database connections, APIs, etc.
- For each relevant tool: present description and ask if needed
- Note any installation requirements

### 7. Installation Requirements Assessment

"**Installation and Dependencies:**

Some tools require additional setup:"

Based on selected tools:

- Identify tools requiring installation
- Assess user's comfort level with installations
- Document installation requirements

### 8. Document Complete Tools Configuration

Append to {workflowPlanFile}:

```markdown
## Tools Configuration

### Core BMAD Tools

- **Party-Mode**: [included/excluded] - Integration points: [specific phases]
- **Advanced Elicitation**: [included/excluded] - Integration points: [specific phases]
- **Brainstorming**: [included/excluded] - Integration points: [specific phases]

### LLM Features

- **Web-Browsing**: [included/excluded] - Use cases: [specific needs]
- **File I/O**: [included/excluded] - Operations: [file management needs]
- **Sub-Agents**: [included/excluded] - Use cases: [delegation needs]
- **Sub-Processes**: [included/excluded] - Use cases: [parallel processing needs]

### Memory Systems

- **Sidecar File**: [included/excluded] - Purpose: [state management needs]

### External Integrations

- [List selected external tools with purposes]

### Installation Requirements

- [List tools requiring installation]
- **User Installation Preference**: [willing/not willing]
- **Alternative Options**: [if not installing certain tools]
```

### 9. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save tools configuration to {workflowPlanFile}, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#9-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and tools configuration is saved will you load {nextStepFile} to review the complete plan.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All tool categories configured based on requirements
- User made informed choices for each tool
- Complete configuration documented in plan
- Installation requirements identified
- Ready to proceed to plan review

### ❌ SYSTEM FAILURE:

- Skipping tool categories
- Hardcoding tool descriptions instead of using CSV
- Not documenting user choices
- Proceeding without user confirmation

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
