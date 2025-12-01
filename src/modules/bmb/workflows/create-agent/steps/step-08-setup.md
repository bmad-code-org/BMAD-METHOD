---
name: 'step-08-setup'
description: 'Set up the agent workspace with sidecar files for expert agents'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/create-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-08-setup.md'
nextStepFile: '{workflow_path}/steps/step-09-customize.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/agent-setup-{project_name}.md'
agentSidecarFolder: '{{standalone_output_folder}}/{{agent_filename}}-sidecar'

# Template References
sidecarTemplate: '{workflow_path}/templates/expert-sidecar-structure.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 8: Expert Agent Workspace Setup

## STEP GOAL:

Guide user through setting up the Expert agent's personal workspace with sidecar files for persistent memory, knowledge, and session management, or skip appropriately for Simple/Module agents.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a workspace architect who helps set up agent environments
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring workspace setup expertise, user brings their agent vision, together we create the optimal agent environment
- ✅ Maintain collaborative supportive tone throughout

### Step-Specific Rules:

- 🎯 Focus only on Expert agent workspace setup (skip for Simple/Module agents)
- 🚫 FORBIDDEN to create sidecar files for Simple or Module agents
- 💬 Approach: Frame setup as preparing an agent's "office" or "workspace"
- 📋 Execute conditional setup based on agent type

## EXECUTION PROTOCOLS:

- 🎯 Only execute sidecar setup for Expert agents (auto-proceed for Simple/Module)
- 💾 Create complete sidecar file structure when needed
- 📖 Use proper templates for Expert agent configuration
- 🚫 FORBIDDEN to create unnecessary files or configurations

## CONTEXT BOUNDARIES:

- Available context: Validated agent configuration from previous step
- Focus: Expert agent workspace setup or appropriate skip for other agent types
- Limits: No modifications to core agent files, only workspace setup
- Dependencies: Agent type determination from earlier steps

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Agent Type Check and Introduction

Check agent type and present appropriate introduction:

**For Expert Agents:**
"Now let's set up {{agent_name}}'s personal workspace! Since this is an Expert agent, it needs a special office with files for memory, knowledge, and learning over time."

**For Simple/Module Agents:**
"Great news! {{agent_name}} doesn't need a separate workspace setup. Simple and Module agents are self-contained and ready to go. Let's continue to the next step."

### 2. Expert Agent Workspace Setup (only for Expert agents)

**Workspace Preparation:**
"I'm now creating {{agent_name}}'s personal workspace with everything it needs to remember conversations, build knowledge, and grow more helpful over time."

**Sidecar Structure Creation:**

- Create main sidecar folder: `{agentSidecarFolder}`
- Set up knowledge base files
- Create session management files
- Establish learning and memory structures

**Workspace Elements Explained:**
"Here's what I'm setting up for {{agent_name}}:

- **Memory files** - To remember important conversations and user preferences
- **Knowledge base** - To build expertise in its domain
- **Session logs** - To track progress and maintain continuity
- **Personal workflows** - For specialized capabilities unique to this agent"

### 3. User Confirmation and Questions

**Workspace Confirmation:**
"{{agent_name}}'s workspace is now ready! This personal office will help it become even more helpful as it works with you over time."

**Answer Questions:**
"Is there anything specific you'd like to know about how {{agent_name}} will use its workspace to remember and learn?"

### 4. Document Workspace Setup

#### Content to Append (if applicable):

```markdown
## Agent Workspace Setup

### Agent Type

[Expert/Simple/Module]

### Workspace Configuration

[For Expert agents: Complete sidecar structure created]

### Setup Elements

- Memory and session management files
- Knowledge base structure
- Personal workflow capabilities
- Learning and adaptation framework

### Location

[Path to agent workspace or note of self-contained nature]
```

Save this content to `{outputFile}` for reference.

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#5-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [workspace setup completed for Expert agents or appropriately skipped for Simple/Module agents], will you then load and read fully `{nextStepFile}` to execute and begin customization phase.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Expert agents receive complete sidecar workspace setup
- Simple/Module agents appropriately skip workspace setup
- User understands agent workspace requirements
- All necessary files and structures created for Expert agents
- User questions answered and workspace confirmed ready
- Content properly saved to output file
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Creating sidecar files for Simple or Module agents
- Not creating complete workspace for Expert agents
- Failing to explain workspace purpose and value
- Creating unnecessary files or configurations

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
