---
name: 'step-02-analyze-agent'
description: 'Load agent and relevant documentation for analysis'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/edit-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-02-analyze-agent.md'
nextStepFile: '{workflow_path}/steps/step-03-propose-changes.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'

# Documentation References (load JIT based on user goals)
understanding_agent_types: '{project-root}/.bmad/bmb/docs/agents/understanding-agent-types.md'
agent_compilation: '{project-root}/.bmad/bmb/docs/agents/agent-compilation.md'
simple_architecture: '{project-root}/.bmad/bmb/docs/agents/simple-agent-architecture.md'
expert_architecture: '{project-root}/.bmad/bmb/docs/agents/expert-agent-architecture.md'
module_architecture: '{project-root}/.bmad/bmb/docs/agents/module-agent-architecture.md'
menu_patterns: '{project-root}/.bmad/bmb/docs/agents/agent-menu-patterns.md'
communication_presets: '{project-root}/.bmad/bmb/workflows/create-agent/data/communication-presets.csv'
reference_simple_agent: '{project-root}/.bmad/bmb/reference/agents/simple-examples/commit-poet.agent.yaml'
reference_expert_agent: '{project-root}/.bmad/bmb/reference/agents/expert-examples/journal-keeper/journal-keeper.agent.yaml'
validation: '{project-root}/.bmad/bmb/workflows/create-agent/data/agent-validation-checklist.md'
---

# Step 2: Analyze Agent

## STEP GOAL:

Load the agent and relevant documentation, then analyze with focus on the user's stated goals to identify specific issues that need fixing.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are an agent editor with deep knowledge of BMAD agent architecture
- ✅ If you already have a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring agent architecture expertise, user brings their agent and goals, together we identify specific improvements
- ✅ Maintain analytical yet supportive tone throughout

### Step-Specific Rules:

- 🎯 Focus analysis ONLY on user's stated goals from step 1
- 🚫 FORBIDDEN to load documentation not relevant to user goals
- 💬 Approach: Load documentation JIT when needed for specific analysis
- 🚫 FORBIDDEN to propose solutions yet (analysis only)

## EXECUTION PROTOCOLS:

- 🎯 Load agent file from path provided in step 1
- 💾 Load documentation JIT based on user goals
- 📖 Always "Load and read fully" when accessing documentation
- 🚫 FORBIDDEN to make changes in this step (analysis only)

## CONTEXT BOUNDARIES:

- Available context: Agent path and user goals from step 1
- Focus: Analyze agent in context of user goals
- Limits: Only load documentation relevant to stated goals
- Dependencies: Must have agent path and clear user goals

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load Agent File

Load the agent file from the path provided in step 1:

**If path is to a .agent.yaml file (Simple Agent):**

- Load and read the entire YAML file
- Note: Simple agent, all content in one file

**If path is to a folder (Expert Agent with sidecar files):**

- Load and read the .agent.yaml file from inside the folder
- Inventory all sidecar files in the folder:
  - Templates (_.md, _.txt)
  - Documentation files
  - Knowledge base files (_.csv, _.json, \*.yaml)
  - Any other resources referenced by the agent
- Note: Expert agent with sidecar structure

Present what was loaded:

- "Loaded [agent-name].agent.yaml"
- If Expert: "Plus X sidecar files: [list them]"

### 2. Load Relevant Documentation Based on User Goals

**CRITICAL: Load documentation JIT based ONLY on user's stated goals:**

**If user mentioned persona/communication issues:**

- Load and read fully: `{agent_compilation}` - understand how LLM interprets persona fields
- Load and read fully: `{communication_presets}` - reference for pure communication styles

**If user mentioned functional/broken reference issues:**

- Load and read fully: `{menu_patterns}` - proper menu structure
- Load and read fully: `{agent_compilation}` - compilation requirements

**If user mentioned sidecar/structure issues (Expert agents):**

- Load and read fully: `{expert_architecture}` - sidecar best practices

**If user mentioned agent type confusion:**

- Load and read fully: `{understanding_agent_types}`
- Load and read fully appropriate architecture guide based on agent type

### 3. Focused Analysis Based on User Goals

Analyze only what's relevant to user goals:

**For persona/communication issues:**

- Check communication_style field for mixed behaviors/identity/principles
- Look for red flag words that indicate improper mixing:
  - "ensures", "makes sure", "always", "never" → Behaviors (belongs in principles)
  - "experienced", "expert who", "senior", "seasoned" → Identity descriptors (belongs in role/identity)
  - "believes in", "focused on", "committed to" → Philosophy (belongs in principles)
- Compare current communication_style against examples in `{communication_presets}`

**For functional issues:**

- Verify all workflow references exist and are valid
- Check menu handler patterns against `{menu_patterns}`
- Validate YAML syntax and structure

**For sidecar issues:**

- Map each menu item reference to actual sidecar files
- Identify orphaned files (not referenced in YAML)
- Check if all referenced files actually exist

### 4. Report Findings

Present focused analysis findings:
"Based on your goal to {{user_goal}}, I found the following issues:"

For each issue found:

- Describe the specific problem
- Show the relevant section of the agent
- Reference the loaded documentation that explains the standard
- Explain why this is an issue

### 5. Present MENU OPTIONS

Display: "**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then redisplay menu options

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [analysis complete with specific issues identified], will you then load and read fully `{nextStepFile}` to execute and begin proposing specific changes.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Agent file loaded completely with proper type detection
- Relevant documentation loaded JIT based on user goals
- Analysis focused only on user's stated issues
- Specific problems identified with documentation references
- User understands what needs fixing and why
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Loading documentation not relevant to user goals
- Proposing solutions instead of analyzing
- Missing critical issues related to user goals
- Not following "load and read fully" instruction
- Making changes to agent files

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
