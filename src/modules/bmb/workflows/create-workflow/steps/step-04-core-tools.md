---
name: 'step-04-core-tools'
description: 'Configure always-available core tools and their integration points'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-04-core-tools.md'
nextStepFile: '{workflow_path}/steps/step-05-memory-requirements.md'
workflowFile: '{workflow_path}/workflow.md'
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'

# Documentation References
commonToolsCsv: '{project-root}/{bmad_folder}/bmb/docs/workflows/common-workflow-tools.csv'
---

# Step 4: Core Tools Configuration

## STEP GOAL:

Configure always-available core tools (party-mode, advanced-elicitation, brainstorming, and LLM features) with specific integration points in the workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workflow architect and integration specialist
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD tools and integration patterns

## EXECUTION PROTOCOLS:

- 🎯 Load core tools from CSV and configure integration points
- 💾 Confirm user choices for each core tool
- 📖 Document configuration in workflow plan
- 🚫 FORBIDDEN to proceed without user confirmation

## SEQUENCE OF INSTRUCTIONS:

### 1. Initialize Core Tools Configuration

"Configuring **Core BMAD Tools and Features**

These core tools significantly enhance workflow quality. Let's configure each one for optimal integration into your workflow."

### 2. Present Core Tools from CSV

Load `{commonToolsCsv}` and filter for `propose='always'`:

"**Core Tools (Always Available):**

**Workflows & Tasks:**

- **Party-Mode:** [description from CSV]
- **Advanced Elicitation:** [description from CSV]
- **Brainstorming:** [description from CSV]

**LLM Tool Features:**

- **Web-Browsing:** [description from CSV]
- **File I/O:** [description from CSV]
- **Sub-Agents:** [description from CSV]
- **Sub-Processes:** [description from CSV]

**Tool-Memory:**

- **Sidecar File:** [description from CSV]"

### 3. Configure Integration Points

For each tool, ask about integration:

"**Core Tools Integration:**

**Workflows & Tasks:**

1. **Party-Mode** - Where should collaborative AI sessions be offered? [decision points, creative phases]
2. **Advanced Elicitation** - Where should critical evaluation checkpoints be placed? [after content creation, quality gates]
3. **Brainstorming** - Where should creative ideation be integrated? [idea generation phases, innovation points]

**LLM Features:** 4. **Web-Browsing** - When is current information needed? [real-time data, current events] 5. **File I/O** - What document operations are required? [file creation, data management] 6. **Sub-Agents** - Where would specialized delegation help? [complex tasks, parallel processing] 7. **Sub-Processes** - Where would parallel processing improve performance? [long operations, resource optimization]

**Tool-Memory:** 8. **Sidecar File** - Does your workflow need persistent state? [session continuity, agent initialization]"

### 4. Document Core Tools Configuration

Append to {workflowPlanFile}:

```markdown
## Core Tools Configuration

### Workflows & Tasks

**Party-Mode:** [included/excluded] - Integration points: [specific phases]
**Advanced Elicitation:** [included/excluded] - Integration points: [specific phases]
**Brainstorming:** [included/excluded] - Integration points: [specific phases]

### LLM Tool Features

**Web-Browsing:** [included/excluded] - Integration points: [specific phases]
**File I/O:** [included/excluded] - Integration points: [specific phases]
**Sub-Agents:** [included/excluded] - Integration points: [specific phases]
**Sub-Processes:** [included/excluded] - Integration points: [specific phases]

### Tool-Memory

**Sidecar File:** [included/excluded] - Use case: [history tracking, agent initialization]
```

### 5. Menu Options

Display: **Select an Option:** [C] Continue to Memory Configuration [M] Modify Core Tools

#### Menu Handling Logic:

- IF C: Append core tools configuration to {workflowPlanFile}, update frontmatter, then load {nextStepFile}
- IF M: Return to tool configuration

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and core tools are documented will you load {nextStepFile} to configure memory requirements.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Core tools presented using CSV descriptions
- Integration points configured for each selected tool
- Configuration documented in workflow plan
- User understands how tools enhance workflow

### ❌ SYSTEM FAILURE:

- Duplicating CSV content instead of referencing it
- Not confirming integration points with user
- Proceeding without user confirmation of configuration
