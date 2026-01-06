---
installed_path: '{project-root}/_bmad/bmb/workflows/create-module'
nextStepFile: '{installed_path}/steps/step-07-workflows.md'
modulePlanFile: '{bmb_creations_output_folder}/{module_name}/module-plan-{module_name}.md'
agentTemplate: '{installed_path}/templates/agent.template.md'
agent_examples_path: '{project-root}/bmb/reference/agents/module-examples'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Create Module Agents

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a Module Architect and Agent Designer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD agent patterns, user brings their domain requirements
- ✅ Maintain collaborative, creative tone

### Step-Specific Rules:

- 🎯 Focus on creating proper YAML agent files following the template
- 🚫 FORBIDDEN to use create-agent workflow (it's problematic)
- 💬 Create placeholder workflow folders with README.md for each agent
- 🚫 FORBIDDEN to create full workflows in this step

## EXECUTION PROTOCOLS:

- 🎯 Follow agent.template.md exactly for structure
- 💾 Save agents as .yaml files to module's agents folder
- 📖 Create workflow folders with README.md plans
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- Component plan from step 3 defines which agents to create
- Agent template provides the required YAML structure
- Module structure already created
- Focus on agent creation and workflow placeholders

## STEP GOAL:

To create the primary agent(s) for the module using the proper agent template and create placeholder workflow folders for each agent.

## AGENT CREATION PROCESS:

### 1. Review Agent Plan

"Let's create the agents for your {module_display_name} module.

From your component plan, you have:

- [agent_count] agents planned
- [list of agent types from plan]

I'll create each agent following the proper BMAD template and set up placeholder workflow folders for them."

### 2. Load Agent Template

Load and study the agent template from {agentTemplate}
Reference agent examples from {agent_examples_path} for patterns

### 3. Create Each Agent

For each agent in the component plan:

#### 3.1 Determine Agent Characteristics

"**Agent: [Agent Name]**

Let's design this agent by understanding what it needs:

**Memory & Learning:**

1. Does this agent need to remember things across sessions? (conversations, preferences, patterns)
   - If yes: We'll add sidecar folder structure for memory
   - If no: No persistent memory needed

**Interaction Types:** 2. What does this agent DO?

- Conversational interactions? → Use embedded prompts
- Quick single actions? → Use inline actions
- Complex multi-step processes? → Consider workflows
- Document generation? → Likely need workflows

**Multiple Agent Usage:** 3. Will other agents in this module need the same workflows?

- If yes: Definitely create separate workflow files
- If no: Could embed in agent file

**Based on this, what combination does [Agent Name] need?**

- Memory/Persistence: [Yes/No]
- Embedded prompts: [List main interactions]
- Workflows needed: [Which processes need separate files?]"

#### 3.2 Present Agent Design

"**Agent Design: [Agent Name]**

**Core Identity:**

- Name: [Suggested name]
- Title: [Brief description]
- Icon: [Appropriate emoji]

**Persona:**

- Role: [What the agent does]
- Identity: [Personality/background]
- Communication Style: [How they communicate]
- Principles: [3-5 core principles]

**Structure:**

- Memory needed: [Yes/No - sidecar folder]
- Embedded prompts: [List main interaction prompts]
- Workflow processes: [Which need separate files]

**Menu Items Planned:**

- [List with trigger codes and types]

**Quick actions vs Workflows:**

- Quick prompts: [single-step interactions]
- Workflows: [multi-step, shared processes]

Does this design match what you envisioned? What should we adjust?"

#### 3.3 Create Agent File and Structure

After user confirmation:

Create hybrid agent file with only needed sections:

```yaml
agent:
  metadata:
    name: '[Agent Name]'
    title: '[Agent Title]'
    icon: '[Icon]'
    module: '{module_code}'
  persona:
    role: '[Agent Role]'
    identity: |
      [Multi-line identity description]
    communication_style: |
      [Multi-line communication style]
    principles:
      - '[Principle 1]'
      - '[Principle 2]'
      - '[Principle 3]'

  # Only include if agent needs memory/persistence
  critical_actions:
    - 'Load COMPLETE file ./[agent-name]-sidecar/memories.md and integrate all past interactions'
    - 'ONLY read/write files in ./[agent-name]-sidecar/ - this is our private workspace'

  # Only include if agent has embedded prompts
  prompts:
    - id: '[prompt-name]'
      content: |
        <instructions>
        [How to use this prompt]
        </instructions>

        [Detailed prompt content]

  menu:
    # Always include
    - multi: '[CH] Chat with agent or [SPM] Start Party Mode'
      triggers:
        - party-mode:
          input: SPM
          route: '{project-root}/_bmad/core/workflows/edit-agent/workflow.md'
          type: exec
        - expert-chat:
          input: CH
          action: agent responds as expert
          type: action

    # Group related functions
    - multi: '[PF] Primary Function [QF] Quick Task'
      triggers:
        - primary-function:
          input: PF
          action: '#[prompt-id]'
          type: action
        - quick-task:
          input: QF
          route: '#[prompt-id]'
          type: exec

    # Workflow only for complex processes
    - trigger: 'complex-process'
      route: '{project-root}/_bmad/{custom_module}/workflows/[workflow]/workflow.md'
      description: 'Complex process [icon]'

    # Quick inline actions
    - trigger: 'save-item'
      action: 'Save to ./[agent-name]-sidecar/file.md'
      description: 'Save item 💾'
```

#### 3.4 Create Supporting Structure

**If agent needs memory:**

1. Create folder: {bmb_creations_output_folder}/{module_name}/agents/[agent-name]-sidecar/
2. Create files:
   - memories.md (empty, for persistent memory)
   - instructions.md (empty, for agent protocols)
   - insights.md (empty, for breakthrough moments)
   - sessions/ (subfolder for session records)
   - patterns.md (empty, for tracking patterns)

**If agent has workflows:**
For each workflow that needs separate file:

1. Create folder: {bmb_creations_output_folder}/{module_name}/workflows/[workflow-name]/
2. Create README.md with workflow plan

### 4. Repeat for All Agents

Go through each agent from the component plan, presenting drafts and creating files with user confirmation.

### 5. Document Agent Creation

Update module-plan.md with agents section:

```markdown
## Agents Created

1. **[Agent Name]** - [Agent Title]
   - File: [agent-filename].yaml
   - Features: [Memory/Sidecar, Embedded prompts, Workflows]
   - Structure:
     - Sidecar: [Yes/No]
     - Prompts: [number embedded]
     - Workflows: [list of workflow folders]
   - Status: Created with [combination of features]
```

### 6. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask} to refine agent designs
- IF P: Execute {partyModeWorkflow} to get creative input on agent personas
- IF C: Save agent creation status to module-plan.md, add step-06-agents to the end of the stepsCompleted array in frontmatter, then load nextStepFile
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond then end with display again of the menu options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All planned agents created with proper YAML structure
- Each agent follows agent.template.md format exactly
- Workflow placeholder folders created with README.md plans
- Agent menu items properly reference workflow paths
- Users confirmed each agent draft before creation

### ❌ SYSTEM FAILURE:

- Using create-agent workflow instead of template
- Creating XML agents instead of YAML
- Not creating workflow placeholder folders
- Skipping user confirmation on agent drafts

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all agents are created with placeholder workflows and stepsCompleted updated, will you then load, read entire file, then execute `{nextStepFile}` to begin workflow plan review.
