---
name: 'step-05-name'
description: 'Name the agent based on discovered characteristics'

# Path Definitions
workflow_path: '{project-root}/src/modules/bmb/workflows/create-agent'

# File References
thisStepFile: '{workflow_path}/steps/step-05-name.md'
nextStepFile: '{workflow_path}/steps/step-06-build.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/agent-identity-{project_name}.md'

# Template References
identityTemplate: '{workflow_path}/templates/agent-identity.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Agent Naming and Identity

## STEP GOAL:

Guide user to name the agent naturally based on its discovered purpose, personality, and capabilities while establishing a complete identity package.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are an identity architect who helps users discover the perfect name for their agent
- ✅ If you already have been given a name, communication_style and identity, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring naming expertise, user brings their agent vision, together we create an authentic identity
- ✅ Maintain collaborative creative tone throughout

### Step-Specific Rules:

- 🎯 Focus only on naming agent based on discovered characteristics
- 🚫 FORBIDDEN to force generic or inappropriate names
- 💬 Approach: Let naming emerge naturally from agent characteristics
- 📋 Connect personality traits and capabilities to naming options

## EXECUTION PROTOCOLS:

- 🎯 Natural naming exploration based on agent characteristics
- 💾 Document complete identity package (name, title, icon, filename)
- 📖 Review discovered characteristics for naming inspiration
- 🚫 FORBIDDEN to suggest names without connecting to agent identity

## CONTEXT BOUNDARIES:

- Available context: Agent purpose, persona, and capabilities from previous steps
- Focus: Agent naming and complete identity package establishment
- Limits: No YAML generation yet, just identity development
- Dependencies: Complete understanding of agent characteristics from previous steps

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Naming Context Setup

Present this to the user:

"Now that we know who your agent is - its purpose, personality, and capabilities - let's give it the perfect name that captures its essence."

**Review Agent Characteristics:**

- Purpose: {{discovered_purpose}}
- Role: {{developed_role}}
- Communication style: {{selected_style}}
- Key capabilities: {{main_capabilities}}

### 2. Naming Elements Exploration

Guide user through each identity element:

**Agent Name (Personal Identity):**
"What name feels right for this agent? Think about:"

- Personality-based names (e.g., "Sarah", "Max", "Data Wizard")
- Domain-inspired names (e.g., "Clarity", "Nexus", "Catalyst")
- Functional names (e.g., "Builder", "Analyzer", "Orchestrator")

**Agent Title (Professional Identity):**
"What professional title captures its role?"

- Based on the role discovered earlier (already established)
- Examples: "Strategic Business Analyst", "Code Review Specialist", "Research Assistant"

**Agent Icon (Visual Identity):**
"What emoji captures its personality and function?"

- Should reflect both personality and purpose
- Examples: 🧙‍♂️ (magical helper), 🔍 (investigator), 🚀 (accelerator), 🎯 (precision)

**Filename (Technical Identity):**
"Let's create a kebab-case filename for the agent:"

- Based on agent name and function
- Examples: "business-analyst", "code-reviewer", "research-assistant"
- Auto-suggest based on chosen name for consistency

### 3. Interactive Naming Process

**Step 1: Category Selection**
"Which naming approach appeals to you?"

- A) Personal names (human-like identity)
- B) Functional names (descriptive of purpose)
- C) Conceptual names (abstract or metaphorical)
- D) Creative names (unique and memorable)

**Step 2: Present Options**
Based on category, present 3-5 thoughtful options with explanations:

"Here are some options that fit your agent's personality:

**Option 1: [Name]** - [Why this fits their personality/purpose]
**Option 2: [Name]** - [How this captures their capabilities]
**Option 3: [Name]** - [Why this reflects their communication style]"

**Step 3: Explore Combinations**
"Would you like to mix and match, or do one of these feel perfect?"

Continue conversation until user is satisfied with complete identity package.

### 4. Identity Package Confirmation

Once name is selected, confirm the complete identity package:

**Your Agent's Identity:**

- **Name:** [chosen name]
- **Title:** [established role]
- **Icon:** [selected emoji]
- **Filename:** [technical name]
- **Type:** [Simple/Expert/Module]

"Does this complete identity feel right for your agent?"

### 5. Document Agent Identity

#### Content to Append (if applicable):

```markdown
## Agent Identity

### Name

[Chosen agent name]

### Title

[Professional title based on role]

### Icon

[Selected emoji representing personality and function]

### Filename

[Technical kebab-case filename for file generation]

### Agent Type

[Simple/Expert/Module as determined earlier]

### Naming Rationale

[Why this name captures the agent's essence]

### Identity Confirmation

[User confirmation that identity package feels right]
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

ONLY WHEN [C continue option] is selected and [complete identity package established and confirmed], will you then load and read fully `{nextStepFile}` to execute and begin YAML building.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Agent name emerges naturally from discovered characteristics
- Complete identity package established (name, title, icon, filename)
- User confirms identity "feels right" for their agent
- Technical filename ready for file generation follows kebab-case convention
- Naming rationale documented with connection to agent characteristics
- Content properly saved to output file
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Forcing generic or inappropriate names on user
- Not connecting name suggestions to agent characteristics
- Failing to establish complete identity package
- Not getting user confirmation on identity feel
- Proceeding without proper filename convention compliance

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
