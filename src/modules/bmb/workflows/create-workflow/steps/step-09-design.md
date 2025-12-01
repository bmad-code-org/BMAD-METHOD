---
name: 'step-09-design'
description: 'Design the workflow structure and step sequence based on gathered requirements and tools configuration'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-09-design.md'
nextStepFile: '{workflow_path}/steps/step-10-plan-review.md'
workflowFile: '{workflow_path}/workflow.md'
# Output files for workflow creation process
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'
targetWorkflowPath: '{custom_workflow_location}/{new_workflow_name}'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'

# Template References
designTemplate: '{workflow_path}/templates/design-section.md'
---

# Step 3: Workflow Structure Design

## STEP GOAL:

To collaboratively design the workflow structure, step sequence, and interaction patterns based on the requirements gathered in the previous step.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

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
- 📖 Update plan frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' and design is saved

## CONTEXT BOUNDARIES:

- Requirements from step 2 are available and should inform design
- Load architecture documentation when needed for guidance
- Focus ONLY on structure and flow design
- Don't implement actual files in this step
- This is about designing the blueprint, not building

## DESIGN REFERENCE MATERIALS:

When designing, you may load these documents as needed:

- `{project-root}/{bmad_folder}/bmb/docs/workflows/step-template.md` - Step file structure
- `{project-root}/{bmad_folder}/bmb/docs/workflows/workflow-template.md` - Workflow configuration
- `{project-root}/{bmad_folder}/bmb/docs/workflows/architecture.md` - Architecture principles
- `{project-root}/{bmad_folder}/bmb/reference/workflows/meal-prep-nutrition/workflow.md` - Complete example

## WORKFLOW DESIGN PROCESS:

### 1. Step Structure Design

Let's reference our step creation documentation for best practices:

Load and reference step-file architecture guide:

```
Read: {project-root}/{bmad_folder}/bmb/docs/workflows/step-template.md
```

This shows the standard structure for step files. Based on the requirements, collaboratively design:

- How many major steps does this workflow need? (Recommend 3-7)
- What is the goal of each step?
- Which steps are optional vs required?
- Should any steps repeat or loop?
- What are the decision points within steps?

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

### Collaborative Dialogue

- Design for conversation, not command-response
- Include decision points for user input
- Make the workflow adaptable to user context

### Sequential Enforcement

- Design clear step dependencies
- Ensure logical flow between steps
- Include state tracking for progress

### Error Prevention

- Include validation at key points
- Design for common failure scenarios
- Provide clear guidance to users

## CONTENT TO APPEND TO PLAN:

After completing the design, append to {workflowPlanFile}:

Load and append the content from {designTemplate}

### 9. Present MENU OPTIONS

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
- IF C: Save content to {workflowPlanFile}, update frontmatter, then only then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#9-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and content is saved to workflow plan and frontmatter is updated, will you then load, read entire file, then execute {nextStepFile} to execute and begin workflow file generation step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Workflow structure designed collaboratively
- Step sequence mapped and agreed upon
- Interaction patterns designed
- Design documented in {outputFile}
- Frontmatter updated with step completion

### ❌ SYSTEM FAILURE:

- Creating implementation details instead of design
- Skipping design review with user
- Proceeding without complete design
- Not updating document frontmatter

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
