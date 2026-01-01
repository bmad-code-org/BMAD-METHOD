---
installed_path: '{project-root}/_bmad/bmb/workflows/create-module'
nextStepFile: '{installed_path}/steps/step-03-components.md'
modulePlanFile: '{bmb_creations_output_folder}/{module_name}/module-plan-{module_name}.md'
moduleStructureGuide: '{project-root}/bmb/workflows/create-agent-legacy/create-module/module-structure.md'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: Define Module Concept and Scope

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a Module Architect and Business Analyst
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in module design and BMAD patterns, user brings their domain knowledge
- ✅ Maintain collaborative, educational tone

### Step-Specific Rules:

- 🎯 Focus ONLY on defining the module concept and scope
- 🚫 FORBIDDEN to start designing components in this step
- 💬 Ask questions conversationally to understand vision
- 🚫 FORBIDDEN to proceed without clear module identity

## EXECUTION PROTOCOLS:

- 🎯 Load and study module structure guide for context
- 💾 Document all module identity details in plan
- 📖 Add "step-02-concept" to stepsCompleted array` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- Module name and location from step 1
- Input documents (brief/brainstorming) if any
- Focus ONLY on concept and scope definition
- Don't assume module details beyond what user provides

## STEP GOAL:

To articulate the module's vision, define its identity, and establish clear boundaries for what it will and won't do.

## MODULE CONCEPT DEFINITION PROCESS:

### 1. Load Context and Briefs

"Let's define your module's concept and identity. This will guide all the decisions we make about agents, workflows, and features."

Load module-plan.md and check inputDocuments field

Read the module brief completely
"I see you have a module brief. Let me review that to understand your vision..."
Use brief content to inform concept development questions

Load and study the module structure guide for context

### 2. Guide Concept Development

Ask conversationally:

"**Understanding Your Vision:**

1. **What problem will this module solve?** - What pain point or need are you addressing?

2. **Who is the primary user?** - Who will benefit most from this module?

3. **What's the main outcome?** - What will users be able to do after using your module?

4. **Why is this important?** - What makes this module valuable or unique?"

### 3. Module Identity Development

Based on their responses, collaboratively develop:

**Module Name:**

- Start with their module code: {module_name}
- Suggest a display name in Title Case
- Get user confirmation or refinement

**Module Purpose:**

- Distill their problem statement into 1-2 clear sentences
- Focus on value and outcomes
- Get user validation

**Target Audience:**

- Identify primary user persona
- Consider skill level (beginner/intermediate/advanced)
- Note any secondary audiences

**Module Scope:**

- What's IN scope (core features)
- What's OUT of scope (explicitly state what it won't do)
- Success criteria (how will we know it works?)

### 4. Module Theme and Category

"**Module Classification:**

Based on your description, this seems to fit in the [Domain-Specific/Creative/Technical/Business/Personal] category.

Does this sound right? Or would you categorize it differently?

**Example Categories:**

- **Domain-Specific**: Legal, Medical, Finance, Education
- **Creative**: RPG/Gaming, Story Writing, Music Production
- **Technical**: DevOps, Testing, Architecture, Security
- **Business**: Project Management, Marketing, Sales
- **Personal**: Journaling, Learning, Productivity"

### 5. Module Type Estimation

"Based on what you've described, I'm thinking this might be a:

- **Simple Module** (1-2 agents, 2-3 workflows) - Focused, single-purpose
- **Standard Module** (3-5 agents, 5-10 workflows) - Comprehensive solution
- **Complex Module** (5+ agents, 10+ workflows) - Full platform/framework

Which feels right for your vision? We'll confirm this after planning components."

### 6. Document Module Concept

Update module-plan.md with concept section:

```markdown
## Module Concept

**Module Name:** {module_display_name}
**Module Code:** {module_name}
**Category:** [category]
**Type:** [estimated type]

**Purpose Statement:**
[1-2 sentence clear purpose]

**Target Audience:**

- Primary: [description]
- Secondary: [if any]

**Scope Definition:**

**In Scope:**

- [core feature 1]
- [core feature 2]
- [core feature 3]

**Out of Scope:**

- [explicitly excluded item 1]
- [explicitly excluded item 2]

**Success Criteria:**

- [measurable outcome 1]
- [measurable outcome 2]
- [user satisfaction indicator]
```

### 7. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask} to explore alternative concept approaches
- IF P: Execute {partyModeWorkflow} to get creative input on module identity
- IF C: Save concept to module-plan.md, add step-02-concept to the end of the stepsCompleted array in frontmatter, then load nextStepFile
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond then end with display again of the menu options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Module purpose clearly articulated
- Module identity established (name, audience, scope)
- Category and type determined
- Concept documented in module plan
- User feels the concept matches their vision

### ❌ SYSTEM FAILURE:

- Proceeding without clear module purpose
- Not defining scope boundaries
- Skipping user validation of concept
- Not documenting concept details

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and module concept is saved to module-plan.md with stepsCompleted updated to [1, 2], will you then load, read entire file, then execute `{nextStepFile}` to begin component planning.
