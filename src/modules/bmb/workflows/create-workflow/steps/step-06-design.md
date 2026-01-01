---
name: 'step-06-design'
description: 'Design the workflow structure and step sequence based on gathered requirements, tools configuration, and output format'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-06-design.md'
nextStepFile: '{workflow_path}/steps/step-07-build.md'
workflowFile: '{workflow_path}/workflow.md'
# Output files for workflow creation process
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{new_workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
# Template References
# No template needed - will append design details directly to workflow plan
---

# Step 6: Workflow Structure Design

## STEP GOAL:

To collaboratively design the workflow structure, step sequence, and interaction patterns based on the approved plan and output format requirements.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a workflow architect and systems designer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring workflow design patterns and architectural expertise
- ✅ User brings their domain requirements and workflow preferences

### Step-Specific Rules:

- 🎯 Focus ONLY on designing structure, not implementation details
- 🚫 FORBIDDEN to write actual step content or code in this step
- 💬 Collaboratively design the flow and sequence
- 🚫 DO NOT finalize design without user agreement

## EXECUTION PROTOCOLS:

- 🎯 Guide collaborative design process
- 💾 After completing design, append to {workflowPlanFile}
- 📖 Update plan frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' and design is saved

## CONTEXT BOUNDARIES:

- Approved plan from step 4 is available and should inform design
- Output format design from step 5 (if completed) guides structure
- Load architecture documentation when needed for guidance
- Focus ONLY on structure and flow design
- Don't implement actual files in this step
- This is about designing the blueprint, not building

## DESIGN REFERENCE MATERIALS:

When designing, you may load these documents as needed:

- `{project-root}/_bmad/bmb/docs/workflows/templates/step-template.md` - Step file structure
- `{project-root}/_bmad/bmb/docs/workflows/templates/step-01-init-continuable-template.md` - Continuable init step template
- `{project-root}/_bmad/bmb/docs/workflows/templates/step-1b-template.md` - Continuation step template
- `{project-root}/_bmad/bmb/docs/workflows/templates/workflow-template.md` - Workflow configuration
- `{project-root}/_bmad/bmb/reference/workflows/meal-prep-nutrition/workflow.md` - Complete example

## WORKFLOW DESIGN PROCESS:

### 1. Step Structure Design

Let's reference our step creation documentation for best practices:

Load and reference step-file architecture guide:

```
Read: {project-root}/_bmad/bmb/docs/workflows/templates/step-template.md
```

This shows the standard structure for step files. Also reference:

```
Read: {project-root}/_bmad/bmb/docs/workflows/templates/step-1b-template.md
```

This shows the continuation step pattern for workflows that might take multiple sessions.

Based on the approved plan, collaboratively design the info to answer the following for the build plan:

- How many major steps does this workflow need?
- What is the goal of each step?
- Which steps are optional vs required?
- Should any steps repeat or loop?
- What are the decision points within steps?

### 1a. Continuation Support Assessment

**Ask the user:**
"Will this workflow potentially take multiple sessions to complete? Consider:

- Does this workflow generate a document/output file?
- Might users need to pause and resume the workflow?
- Does the workflow involve extensive data collection or analysis?
- Are there complex decisions that might require multiple sessions?

If **YES** to any of these, we should include continuation support using step-01b-continue.md."

**If continuation support is needed:**

- Include step-01-init.md (with continuation detection logic)
- Include step-01b-continue.md (for resuming workflows)
- Ensure every step updates `stepsCompleted` in output frontmatter
- Design the workflow to persist state between sessions

### 2. Interaction Pattern Design

Design how users will interact with the workflow:

- Where should users provide input vs where the AI works autonomously?
- What type of menu options are needed at each step?
- Should there be Advanced Elicitation or Party Mode options?
- How will users know their progress?
- What confirmation points are needed?

### 3. Data Flow Design

Map how information flows through the workflow:

- What data is needed at each step?
- What outputs does each step produce?
- How is state tracked between steps?
- Where are checkpoints and saves needed?
- How are errors or exceptions handled?

### 4. File Structure Design

Plan the workflow's file organization:

- Will this workflow need templates?
- Are there data files required?
- Is a validation checklist needed?
- What supporting files will be useful?
- How will variables be managed?

### 5. Role and Persona Definition

Define the AI's role for this workflow:

- What expertise should the AI embody?
- How should the AI communicate with users?
- What tone and style is appropriate?
- How collaborative vs prescriptive should the AI be?

### 6. Validation and Error Handling

Design quality assurance:

- How will the workflow validate its outputs?
- What happens if a user provides invalid input?
- Are there checkpoints for review?
- How can users recover from errors?
- What constitutes successful completion?

### 7. Special Features Design

Identify unique requirements:

- Does this workflow need conditional logic?
- Are there branch points based on user choices?
- Should it integrate with other workflows?
- Does it need to handle multiple scenarios?

### 8. Design Review and Refinement

Present the design for review:

- Walk through the complete flow
- Identify potential issues or improvements
- Ensure all requirements are addressed
- Get user agreement on the design

## DESIGN PRINCIPLES TO APPLY:

### Micro-File Architecture

- Keep each step focused and self-contained
- Ensure steps can be loaded independently
- Design for Just-In-Time loading

### Sequential Flow with Clear Progression

- Each step should build on previous work
- Include clear decision points
- Maintain logical progression toward goal

### Menu-Based Interactions

- Include consistent menu patterns
- Provide clear options at decision points
- Allow for conversation within steps

### State Management

- Track progress using `stepsCompleted` array
- Persist state in output file frontmatter
- Support continuation where appropriate

### 9. Document Design in Plan

Append to {workflowPlanFile}:

- Complete step outline with names and purposes
- Flow diagram or sequence description
- Interaction patterns
- File structure requirements
- Special features and handling

### 10. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond and then end with display again of the menu options
- Use menu handling logic section below

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}
- IF P: Execute {partyModeWorkflow}
- IF C: Save design to {workflowPlanFile}, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#10-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and design is saved will you load {nextStepFile} to begin implementation.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Workflow structure designed collaboratively
- All steps clearly defined and sequenced
- Interaction patterns established
- File structure planned
- User agreement on design

### ❌ SYSTEM FAILURE:

- Designing without user collaboration
- Skipping design principles
- Not documenting design in plan
- Proceeding without user agreement

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
