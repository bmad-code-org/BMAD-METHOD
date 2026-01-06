---
installed_path: '{project-root}/_bmad/bmb/workflows/create-module'
nextStepFile: '{installed_path}/steps/step-04-structure.md'
modulePlanFile: '{bmb_creations_output_folder}/{module_name}/module-plan-{module_name}.md'
agent_examples_path: '{project-root}/bmb/reference/agents/module-examples'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Plan Module Components

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a Module Architect and Systems Designer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD component design patterns, user brings their domain requirements
- ✅ Maintain collaborative, design-focused tone

### Step-Specific Rules:

- 🎯 Focus ONLY on planning component architecture
- 🚫 FORBIDDEN to create actual components in this step
- 💬 Present component options with reasoning
- 🚫 FORBIDDEN to finalize component list without user agreement

## EXECUTION PROTOCOLS:

- 🎯 Reference agent examples for patterns
- 💾 Document component plan in detail
- 📖 Add "step-03-components" to stepsCompleted array` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- Module concept from step 2 is available
- Focus on planning, not implementation
- Consider BMAD patterns and best practices
- Reference examples but don't copy exactly

## STEP GOAL:

To design the component architecture for the module, determining what agents, workflows, and tasks are needed to fulfill the module's purpose.

## COMPONENT PLANNING PROCESS:

### 1. Initialize Component Planning

"Now that we have a clear module concept, let's plan the components that will bring it to life.

Based on your module's purpose and scope, we'll design:

- **Agents** - The AI personas that will help users
- **Workflows** - The step-by-step processes for accomplishing tasks
- **Tasks** - Quick utilities and supporting functions"

### 2. Agent Planning

"**Agent Architecture:**

Think about the different roles or perspectives needed to accomplish your module's goals. Each agent should have a clear, distinct purpose."

Reference agent examples for patterns
Load and browse agent examples: {agent_examples_path}

"**Common Agent Patterns:**

- **Primary Agent** - The main interface/orchestrator
- **Specialist Agents** - Domain-specific experts
- **Utility Agents** - Helper/support functions

**Example by Module Type:**

**Technical Modules (e.g., DevOps, Testing):**

- Implementation Specialist
- Reviewer/Auditor
- Documentation Expert

**Creative Modules (e.g., Story Writing, Game Design):**

- Creative Director
- World Builder
- Content Generator

**Business Modules (e.g., Project Management):**

- Project Coordinator
- Facilitator
- Analyst"

"**For your {module_category} module, I suggest considering:**

[Suggest 2-4 specific agent types based on module concept]

**What resonates with your vision?** Which of these agents would be most valuable, and are there any others you'd like to add?"

### 3. Workflow Planning

"**Workflow Design:**

Workflows are the step-by-step processes that users will follow to accomplish specific tasks. Each workflow should solve a specific problem or achieve a particular outcome."

**Types of Workflows:**

- **Document Workflows** - Generate reports, plans, specifications
- **Action Workflows** - Perform operations, create structures
- **Interactive Workflows** - Guided sessions, coaching, training

**Example Workflow Patterns:**

"For your module's purpose, consider these potential workflows:

1. **[Primary Workflow Name]** - Main workflow for core functionality
2. **[Supporting Workflow 1]** - For specific use case
3. **[Supporting Workflow 2]** - For another use case

Remember: We'll create workflow PLANS first, not full implementations. These plans can be used later with the create-workflow workflow."

### 4. Task Planning (Optional)

"**Task Planning (if needed):**

Tasks are single-operation utilities that don't need full workflows. They're good for:

- Quick actions
- Shared subroutines
- Helper functions

Does your module need any tasks? For example:

- Status checking
- Quick formatting
- Validation utilities"

### 5. Component Integration Planning

"**How Components Work Together:**

Let's think about how your components will interact:

- **Agent Collaboration**: Will agents work together or independently?
- **Workflow Dependencies**: Do workflows need to call each other?
- **Task Usage**: Which workflows will use which tasks?"

### 6. Component Priority and MVP

"**Starting Point (MVP):**

To ensure success, let's identify the minimum viable set:

**Must Have (Phase 1):**

- [List essential agents]
- [List essential workflows]

**Nice to Have (Phase 2):**

- [Additional agents]
- [Additional workflows]
- [Tasks if any]

This approach lets you launch with core functionality and expand later."

### 7. Document Component Plan

Update module-plan.md with component section:

```markdown
## Component Architecture

### Agents (N planned)

1. **[Agent Name]** - [Brief purpose]
   - Type: [Primary/Specialist/Utility]
   - Role: [Specific role description]

2. **[Agent Name]** - [Brief purpose]
   - Type: [Primary/Specialist/Utility]
   - Role: [Specific role description]

### Workflows (N planned)

1. **[Workflow Name]** - [Purpose]
   - Type: [Document/Action/Interactive]
   - Primary user: [Who uses this]
   - Key output: [What it produces]

2. **[Workflow Name]** - [Purpose]
   - Type: [Document/Action/Interactive]
   - Primary user: [Who uses this]
   - Key output: [What it produces]

### Tasks (N planned)

1. **[Task Name]** - [Single-purpose function]
   - Used by: [Which workflows/agents]

### Component Integration

- Agents collaborate via: [description]
- Workflow dependencies: [description]
- Task usage patterns: [description]

### Development Priority

**Phase 1 (MVP):**

- [List of components to create first]

**Phase 2 (Enhancement):**

- [List of components for later]
```

### 8. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask} to explore alternative component architectures
- IF P: Execute {partyModeWorkflow} to get creative input on component design
- IF C: Save component plan to module-plan.md, add step-03-components to the end of the stepsCompleted array in frontmatter, then load nextStepFile
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond then end with display again of the menu options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Component architecture planned and documented
- Agent types and purposes clearly defined
- Workflow requirements identified
- Integration patterns established
- Development priority set (MVP vs enhancements)

### ❌ SYSTEM FAILURE:

- Planning components without module purpose context
- Not considering BMAD patterns and examples
- Over-engineering (too many components)
- Under-planning (missing essential components)
- Not establishing development priorities

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and component plan is saved to module-plan.md with stepsCompleted updated to [1, 2, 3], will you then load, read entire file, then execute `{nextStepFile}` to begin creating the module structure.
