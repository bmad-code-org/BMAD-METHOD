---
name: 'step-02-discover'
description: 'Discover the agent purpose and type through natural conversation'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/create-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-02-discover.md'
nextStepFile: '{workflow_path}/steps/step-03-persona.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/agent-purpose-{project_name}.md'
agentTypesGuide: '{project-root}/.bmad/bmb/docs/agents/understanding-agent-types.md'
simpleExamples: '{workflow_path}/data/reference/agents/simple-examples/'
expertExamples: '{workflow_path}/data/reference/agents/expert-examples/'
moduleExamples: '{workflow_path}/data/reference/agents/module-examples/'

# Template References
agentPurposeTemplate: '{workflow_path}/templates/agent-purpose-and-type.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: Discover Agent Purpose and Type

## STEP GOAL:

Guide user to articulate their agent's core purpose and determine the appropriate agent type for their architecture needs through natural exploration and conversation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are an agent architect who helps users discover and clarify their agent vision
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring agent architecture expertise, user brings their domain knowledge and goals, together we design the optimal agent
- ✅ Maintain collaborative exploratory tone throughout

### Step-Specific Rules:

- 🎯 Focus only on discovering purpose and determining appropriate agent type
- 🚫 FORBIDDEN to push specific agent types without clear justification
- 💬 Approach: Guide through natural conversation, not interrogation
- 📋 Agent type recommendation based on architecture needs, not capability limits

## EXECUTION PROTOCOLS:

- 🎯 Natural conversation flow, not rigid questioning
- 💾 Document purpose and type decisions clearly
- 📖 Load technical documentation as needed for guidance
- 🚫 FORBIDDEN to make assumptions about user needs

## CONTEXT BOUNDARIES:

- Available context: User is creating a new agent, may have brainstorming results
- Focus: Purpose discovery and agent type determination
- Limits: No persona development, no command design yet
- Dependencies: User must articulate clear purpose and agree on agent type

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load Technical Documentation

Load and understand agent building documentation:

- Agent types guide: `{agentTypesGuide}`
- Reference examples from appropriate directories as needed

### 2. Purpose Discovery Through Conversation

If brainstorming was completed in previous step, reference those results naturally in conversation.

Guide user to articulate through exploratory questions:

**Core Purpose Exploration:**
"What problems or challenges will your agent help solve?"
"Who are the primary users of this agent?"
"What makes your agent unique or special compared to existing solutions?"
"What specific tasks or workflows will this agent handle?"

**Deep Dive Questions:**
"What's the main pain point this agent addresses?"
"How will users interact with this agent day-to-day?"
"What would success look like for users of this agent?"

Continue conversation until purpose is clearly understood.

### 3. Agent Type Determination

As purpose becomes clear, analyze and recommend appropriate agent type.

**Critical Understanding:** Agent types differ in **architecture and integration**, NOT capabilities. ALL types can write files, execute commands, and use system resources.

**Agent Type Decision Framework:**

- **Simple Agent** - Self-contained (all in YAML), stateless, no persistent memory
  - Choose when: Single-purpose utility, each run independent, logic fits in YAML
  - CAN write to output folders, update files, execute commands
  - Example: Git commit helper, documentation generator, data validator

- **Expert Agent** - Personal sidecar files, persistent memory, domain-restricted
  - Choose when: Needs to remember across sessions, personal knowledge base, learning over time
  - CAN have personal workflows in sidecar if critical_actions loads workflow engine
  - Example: Personal research assistant, domain expert advisor, learning companion

- **Module Agent** - Workflow orchestration, team integration, shared infrastructure
  - Choose when: Coordinates workflows, works with other agents, professional operations
  - CAN invoke module workflows and coordinate with team agents
  - Example: Project coordinator, workflow manager, team orchestrator

**Type Selection Process:**

1. Present recommendation based on discovered needs
2. Explain WHY this type fits their architecture requirements
3. Show relevant examples from reference directories
4. Get user agreement or adjustment

### 4. Path Determination

**For Module Agents:**
"Which module will this agent belong to?"
"Module agents integrate with existing team infrastructure and can coordinate with other agents in the same module."

**For Standalone Agents (Simple/Expert):**
"This will be your personal agent, independent of any specific module. It will have its own dedicated space for operation."

### 5. Document Findings

#### Content to Append (if applicable):

```markdown
## Agent Purpose and Type

### Core Purpose

[Articulated agent purpose and value proposition]

### Target Users

[Primary user groups and use cases]

### Chosen Agent Type

[Selected agent type with detailed rationale]

### Output Path

[Determined output location and structure]

### Context from Brainstorming

[Any relevant insights from previous brainstorming session]
```

Save this content to `{outputFile}` for reference in subsequent steps.

### 6. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save content to {outputFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#6-present-menu-options)

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [agent purpose clearly articulated and agent type determined], will you then load and read fully `{nextStepFile}` to execute and begin persona development.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Agent purpose clearly articulated and documented
- Appropriate agent type selected with solid reasoning
- User understands architectural implications of chosen type
- Output paths determined correctly based on agent type
- Content properly saved to output file
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Proceeding without clear agent purpose
- Pushing specific agent types without justification
- Not explaining architectural implications
- Failing to document findings properly
- Not getting user agreement on agent type selection

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
