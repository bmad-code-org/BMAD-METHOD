---
name: 'step-04-commands'
description: 'Build capabilities through natural progression and refine commands'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/create-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-04-commands.md'
nextStepFile: '{workflow_path}/steps/step-05-name.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/agent-commands-{project_name}.md'
agentMenuPatterns: '{project-root}/.bmad/bmb/docs/agents/agent-menu-patterns.md'
simpleArchitecture: '{project-root}/.bmad/bmb/docs/agents/simple-agent-architecture.md'
expertArchitecture: '{project-root}/.bmad/bmb/docs/agents/expert-agent-architecture.md'
moduleArchitecture: '{project-root}/.bmad/bmb/docs/agents/module-agent-architecture.md'

# Template References
commandsTemplate: '{workflow_path}/templates/agent-commands.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Build Capabilities and Commands

## STEP GOAL:

Transform user's desired capabilities into structured YAML command system with proper workflow references and implementation approaches while maintaining natural conversational flow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a command architect who translates user capabilities into technical implementations
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring technical architecture expertise, user brings their capability vision, together we create implementable command structures
- ✅ Maintain collaborative technical tone throughout

### Step-Specific Rules:

- 🎯 Focus only on translating capabilities to structured command system
- 🚫 FORBIDDEN to add help/exit commands (auto-injected by compiler)
- 💬 Approach: Guide through technical implementation without breaking conversational flow
- 📋 Build commands naturally from capability discussion

## EXECUTION PROTOCOLS:

- 🎯 Natural capability discovery leading to structured command development
- 💾 Document all commands with proper YAML structure and workflow references
- 📖 Load architecture documentation based on agent type for guidance
- 🚫 FORBIDDEN to create technical specifications without user capability input

## CONTEXT BOUNDARIES:

- Available context: Agent purpose, type, and persona from previous steps
- Focus: Capability discovery and command structure development
- Limits: No agent naming, no YAML generation yet, just planning
- Dependencies: Clear understanding of agent purpose and capabilities from user

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Capability Discovery

Guide user to define agent capabilities through natural conversation:

"Let's explore what your agent should be able to do. Start with the core capabilities you mentioned during our purpose discovery, then we'll expand from there."

**Capability Exploration Questions:**

- "What's the first thing users will want this agent to do?"
- "What complex analyses or tasks should it handle?"
- "How should it help users with common problems in its domain?"
- "What unique capabilities make this agent special?"

Continue conversation until comprehensive capability list is developed.

### 2. Architecture-Specific Capability Planning

Load appropriate architecture documentation based on agent type:

**Simple Agent:**

- Load `{simpleArchitecture}`
- Focus on single-execution capabilities
- All logic must fit within YAML structure
- No persistent memory between runs

**Expert Agent:**

- Load `{expertArchitecture}`
- Plan for sidecar file integration
- Persistent memory capabilities
- Domain-restricted knowledge base

**Module Agent:**

- Load `{moduleArchitecture}`
- Workflow orchestration capabilities
- Team integration features
- Cross-agent coordination

### 3. Command Structure Development

Transform natural language capabilities into technical YAML structure:

**Command Transformation Process:**

1. **Natural capability** → **Trigger phrase**
2. **Implementation approach** → **Workflow/action reference**
3. **User description** → **Command description**
4. **Technical needs** → **Parameters and data**

Explain the YAML structure to user:
"Each command needs a trigger (what users say), description (what it does), and either a workflow reference or direct action."

### 4. Workflow Integration Planning

For commands that will invoke workflows:

**Existing Workflows:**

- Verify paths are correct
- Ensure workflow compatibility
- Document integration points

**New Workflows Needed:**

- Note that they'll be created with intent-based + interactive defaults
- Document requirements for future workflow creation
- Specify data flow and expected outcomes

**Workflow Vendoring (Advanced):**
For agents needing workflows from other modules, explain:
"When your agent needs workflows from another module, we use both workflow (source) and workflow-install (destination). During installation, the workflow will be copied and configured for this module."

### 5. Advanced Features Discussion

If user seems engaged, explore special features:

**Complex Analysis Prompts:**
"Should this agent have special prompts for complex analyses or critical decision points?"

**Critical Setup Steps:**
"Are there critical steps the agent should always perform during activation?"

**Error Handling:**
"How should the agent handle unexpected situations or user errors?"

**Learning and Adaptation (Expert Agents):**
"Should this agent learn from user interactions and adapt over time?"

### 6. Document Complete Command Structure

#### Content to Append (if applicable):

```markdown
## Agent Commands and Capabilities

### Core Capabilities Identified

[List of user capabilities discovered through conversation]

### Command Structure

[YAML command structure for each capability]

### Workflow Integration Plan

[Details of workflow references and integration points]

### Advanced Features

[Special capabilities and handling approaches]

### Implementation Notes

[Architecture-specific considerations and technical requirements]
```

Save this content to `{outputFile}` for reference in subsequent steps.

### 7. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#7-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [capabilities transformed into structured command system], will you then load and read fully `{nextStepFile}` to execute and begin agent naming.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- User capabilities discovered and documented naturally
- Capabilities transformed into structured command system
- Proper workflow integration planned and documented
- Architecture-specific capabilities addressed appropriately
- Advanced features identified and documented when relevant
- Menu patterns compliant with BMAD standards
- Content properly saved to output file
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Adding help/exit commands (auto-injected by compiler)
- Creating technical specifications without user input
- Not considering agent type architecture constraints
- Failing to document workflow integration properly
- Breaking conversational flow with excessive technical detail

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
