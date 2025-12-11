---
name: 'step-02-gather'
description: 'Gather comprehensive requirements for the workflow being created'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-02-gather.md'
nextStepFile: '{workflow_path}/steps/step-03-tools-configuration.md'
# Output files for workflow creation process
targetWorkflowPath: '{custom_stand_alone_location}/workflows/{new_workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/workflow-plan-{new_workflow_name}.md'

# Task References
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
# Template References
# No template needed - will append requirements directly to workflow plan
---

# Step 2: Requirements Gathering

## STEP GOAL:

To gather comprehensive requirements through collaborative conversation that will inform the design of a structured workflow tailored to the user's needs and use case.

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
- ✅ You bring workflow design expertise and best practices
- ✅ User brings their domain knowledge and specific requirements

### Step-Specific Rules:

- 🎯 Focus ONLY on collecting requirements and understanding needs
- 🚫 FORBIDDEN to propose workflow solutions or step designs in this step
- 💬 Ask questions conversationally, not like a form
- 🚫 DO NOT skip any requirement area - each affects workflow design

## EXECUTION PROTOCOLS:

- 🎯 Engage in natural conversation to gather requirements
- 💾 Store all requirements information for workflow design
- 📖 Proceed to next step with 'C' selection
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- Workflow name and target location from initialization
- Focus ONLY on collecting requirements and understanding needs
- Don't provide workflow designs in this step
- This is about understanding, not designing

## REQUIREMENTS GATHERING PROCESS:

### 1. Workflow Purpose and Scope

Explore through conversation:

- What specific problem will this workflow solve?
- Who is the primary user of this workflow?
- What is the main outcome or deliverable?

### 2. Workflow Type Classification

Help determine the workflow type:

- **Document Workflow**: Generates documents (PRDs, specs, plans)
- **Action Workflow**: Performs actions (refactoring, tools orchestration)
- **Interactive Workflow**: Guided sessions (brainstorming, coaching, training, practice)
- **Autonomous Workflow**: Runs without human input (batch processing, multi-step tasks)
- **Meta-Workflow**: Coordinates other workflows

### 3. Workflow Flow and Step Structure

Let's load some examples to help you decide the workflow pattern:

Load and reference the Meal Prep & Nutrition Plan workflow as an example:

```
Read: {project-root}/.bmad/bmb/reference/workflows/meal-prep-nutrition/workflow.md
```

This shows a linear workflow structure. Now let's explore your desired pattern:

- Should this be a linear workflow (step 1 → step 2 → step 3 → finish)?
- Or should it have loops/repeats (e.g., keep generating items until user says done)?
- Are there branching points based on user choices?
- Should some steps be optional?
- How many logical phases does this workflow need? (e.g., Gather → Design → Validate → Generate)

**Based on our reference examples:**

- **Linear**: Like Meal Prep Plan (Init → Profile → Assessment → Strategy → Shopping → Prep)
  - See: `{project-root}/.bmad/bmb/reference/workflows/meal-prep-nutrition/`
- **Looping**: User Story Generator (Generate → Review → Refine → Generate more... until done)
- **Branching**: Architecture Decision (Analyze → Choose pattern → Implement based on choice)
- **Iterative**: Document Review (Load → Analyze → Suggest changes → Implement → Repeat until approved)

### 4. User Interaction Style

Understand the desired interaction level:

- How much user input is needed during execution?
- Should it be highly collaborative or mostly autonomous?
- Are there specific decision points where user must choose?
- Should the workflow adapt to user responses?

### 5. Instruction Style (Intent-Based vs Prescriptive)

Determine how the AI should execute in this workflow:

**Intent-Based (Recommended for most workflows)**:

- Steps describe goals and principles, letting the AI adapt conversation naturally
- More flexible, conversational, responsive to user context
- Example: "Guide user to define their requirements through open-ended discussion"

**Prescriptive**:

- Steps provide exact instructions and specific text to use
- More controlled, predictable, consistent across runs
- Example: "Ask: 'What is your primary goal? Choose from: A) Growth B) Efficiency C) Quality'"

Which style does this workflow need, or should it be a mix of both?

### 6. Input Requirements

Identify what the workflow needs:

- What documents or data does the workflow need to start?
- Are there prerequisites or dependencies?
- Will users need to provide specific information?
- Are there optional inputs that enhance the workflow?

### 7. Output Specifications

Define what the workflow produces:

- What is the primary output (document, action, decision)?
- Are there intermediate outputs or checkpoints?
- Should outputs be saved automatically?
- What format should outputs be in?

### 8. Success Criteria

Define what makes the workflow successful:

- How will you know the workflow achieved its goal?
- What are the quality criteria for outputs?
- Are there measurable outcomes?
- What would make a user satisfied with the result?

#### STORE REQUIREMENTS:

After collecting all requirements, append them to {workflowPlanFile} in a format that will be be used later to design in more detail and create the workflow structure.

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
- IF C: Append requirements to {workflowPlanFile}, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#8-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and requirements are stored in the output file, will you then load, read entire file, then execute {nextStepFile} to execute and begin workflow structure design step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Requirements collected through conversation (not interrogation)
- All workflow aspects documented
- Requirements stored using template
- Menu presented and user input handled correctly

### ❌ SYSTEM FAILURE:

- Generating workflow designs without requirements
- Skipping requirement areas
- Proceeding to next step without 'C' selection
- Not storing requirements properly

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
