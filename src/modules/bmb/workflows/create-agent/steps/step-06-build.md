---
name: 'step-06-build'
description: 'Generate complete YAML incorporating all discovered elements'

# Path Definitions
workflow_path: '{project-root}/bmb/workflows/create-agent/create-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-06-build.md'
nextStepFile: '{workflow_path}/steps/step-07-validate.md'
workflowFile: '{workflow_path}/workflow.md'
agentPlan: '{bmb_creations_output_folder}/agent-plan-{agent_name}.md'
agentBuildOutput: '{bmb_creations_output_folder}/{agent-name}'

# Template References
simpleAgentTemplate: '{workflow_path}/templates/simple-agent.template.md'
expertAgentTemplate: '{workflow_path}/templates/expert-agent.template.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Build Complete Agent YAML

## STEP GOAL:

Generate the complete YAML agent folder, yaml file and sidecar content to the specification defined in {agentBuildOutput} completely.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a YAML architect who transforms collaborative discoveries into technical implementation
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring technical YAML expertise, user brings their agent vision, together we create complete agent configuration
- ✅ Maintain collaborative technical tone throughout

### Step-Specific Rules:

- 🎯 Focus only on generating complete YAML and sidecar content structure based on discovered elements
- 🚫 FORBIDDEN to duplicate auto-injected features (help and exit menu items, activation handler instructions)
- 💬 Approach: Present the journey of collaborative creation while building technical structure
- 📋 Generate YAML and sidecar files that accurately reflects all discoveries from previous steps

## EXECUTION PROTOCOLS:

- 🎯 Generate complete YAML structure based on agent type and discovered elements
- 💾 Present complete YAML with proper formatting and explanation
- 📖 Load appropriate template for agent type for structure guidance
- 🚫 FORBIDDEN to proceed without incorporating all discovered elements

## CONTEXT BOUNDARIES:

- Available context: All discoveries from previous steps (purpose, persona, capabilities, identity)
- Focus: YAML generation and complete agent configuration
- Limits: No validation yet, just YAML generation
- Dependencies: Complete understanding of all agent characteristics from previous steps

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Celebrate the Journey

Present this to the user:

"Let's take a moment to appreciate what we've created together! Your agent started as an idea, and through our discovery process, it has developed into a fully-realized personality with clear purpose, capabilities, and identity."

**Journey Summary:**

- Started with purpose discovery (Step 2)
- Shaped personality through four-field persona system (Step 3)
- Built capabilities and command structure (Step 4)
- Established name and identity (Step 5)
- Ready to bring it all together in complete YAML

### 2. Load Agent Type Template

Based on determined agent type, load appropriate template:

- If (agent will have memories and optionally its own knowledge, separate prompt files, or data in separate files)
  - Utilize {expertAgentTemplate} to generate the agent output file {agentBuildOutput}/{agent-name}.agent.yaml
  - Create the Side-cre folder to hold the optional sidecar files if needed from plan in following steps at {agentBuildOutput}/{agent-name}/{agent-name}-sidecar
- ELSE:
  - utilize {simpleAgentTemplate} to generate the agent output file {agentBuildOutput}/{agent-name}.agent.yaml

### 4. Generate Complete YAML and sidecar content if applicable

Create the complete YAML incorporating all discovered elements from the plan:

**Core Structure:**

- Agent metadata (name, title, icon, module, type)
- Complete persona (role, identity, communication_style, principles)
- Agent type-specific sections
- Command structure with proper references
- Output path configuration

Present the complete YAML to user:

"Here is your complete agent YAML, incorporating everything we've discovered together:

[Display complete YAML with proper formatting]

**Key Features Included:**

- Purpose-driven role and identity
- Distinct personality with four-field persona system
- All capabilities we discussed
- Proper command structure
- Agent type-specific optimizations
- Complete metadata and configuration

Does this capture everything we discussed?"

### 5. Agent Type Specific Implementation

Ensure proper implementation based on agent type:

**Simple Agent:**

- All capabilities in YAML prompts section
- No external file references
- Self-contained execution logic

**Expert Agent:**

- Sidecar file references for knowledge base
- Memory integration points
- Personal workflow capabilities

Ensure all files generated are complete, and nothing from the plan has not been skipped, and then give a creational summary of what was done to the user in chat.

### 7. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content to {agentBuildOutput}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [complete YAML generated incorporating all discovered elements], will you then load and read fully `{nextStepFile}` to execute and begin validation.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Complete YAML structure generated for correct agent type
- All discovered elements properly integrated (purpose, persona, capabilities, identity)
- Commands correctly structured with proper workflow/action references
- Agent type specific optimizations implemented appropriately
- Output paths configured correctly based on agent type
- User confirms YAML captures all requirements from discovery process
- Content properly saved to output file
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Duplicating auto-injected features (help, exit, activation handlers)
- Not incorporating all discovered elements from previous steps
- Invalid YAML syntax or structure
- Incorrect agent type implementation
- Missing user confirmation on YAML completeness

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
