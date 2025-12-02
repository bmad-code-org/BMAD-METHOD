---
name: 'step-01-init'
description: 'Initialize workflow creation session by detecting continuation state and setting up project'

# Path Definitions
workflow_path: '{project-root}/{bmad_folder}/bmb/workflows/create-workflow'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-gather.md'
workflowFile: '{workflow_path}/workflow.md'
# Output files for workflow creation process
workflowPlanFile: '{output_folder}/workflow-plan-{new_workflow_name}.md'
targetWorkflowPath: '{custom_workflow_location}/{new_workflow_name}'

# Task References
advancedElicitationTask: '{project-root}/{bmad_folder}/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/{bmad_folder}/core/workflows/party-mode/workflow.md'

# Template References
projectInfoTemplate: '{workflow_path}/templates/project-info.md'
workflowPlanTemplate: '{workflow_path}/templates/workflow-plan.md'
---

# Step 1: Workflow Creation Initialization

## STEP GOAL:

To initialize the workflow creation process by detecting continuation state, understanding project context, and preparing for collaborative workflow design.

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
- ✅ You bring workflow design expertise, user brings their specific requirements
- ✅ Together we will create a structured, repeatable workflow

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and project understanding
- 🚫 FORBIDDEN to start designing workflow steps in this step
- 💬 Ask questions conversationally to understand context
- 🚪 DETECT existing workflow state and handle continuation properly

## EXECUTION PROTOCOLS:

- 🎯 Show analysis before taking any action
- 💾 Initialize document and update frontmatter
- 📖 Set up frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until initialization is complete

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- Previous context = what's in output document + frontmatter
- Don't assume knowledge from other steps
- Input discovery happens in this step

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow Creation

First, check if there's already a workflow folder with the proposed name:

- Look for folder at `{custom_workflow_location}/{new_workflow_name}/`
- If exists, check if it contains a workflow.md file
- If not exists, this is a fresh workflow creation session

### 2. Handle Continuation (If Workflow Exists)

If the workflow folder exists and has been worked on:

- **STOP here** and continue with step 4 (Welcome Back)
- Do not proceed with fresh initialization
- Let step 4 handle the continuation logic

### 3. Handle Completed Workflow

If the workflow folder exists AND is complete:

- Ask user: "I found an existing workflow '{new_workflow_name}' from [date]. Would you like to:
  1. Create a new workflow with a different name
  2. Review or modify the existing workflow"
- If option 1: Get a new workflow name
- If option 2: Load step 5 (Review)

### 4. Fresh Workflow Setup (If No Workflow)

#### A. Project Discovery

Welcome the user and understand their needs:
"Welcome! I'm excited to help you create a new workflow. Let's start by understanding what you want to build."

Ask conversationally:

- What type of workflow are you looking to create?
- What problem will this workflow solve?
- Who will use this workflow?
- What module will it belong to (bmb, bmm, cis, custom, stand-alone)?
- What would you like to name this workflow folder? (kebab-case, e.g., "user-story-generator")

#### B. Create Workflow Plan Document

Create the workflow plan document at `{workflowPlanFile}` using the workflow plan template `{workflowPlanTemplate}`.
Initialize frontmatter with:

```yaml
---
workflowName: ''
targetModule: ''
workflowType: ''
flowPattern: ''
date: [current date]
user_name: { user_name }
stepsCompleted: [1]
lastStep: 'init'
---
```

This plan will capture all requirements and design details before building the actual workflow.

### 5. Welcome Message

"Great! I'm ready to help you create a structured workflow using our step-based architecture. We'll work together to design a workflow that's collaborative, maintainable, and follows best practices."

### 6. Present MENU OPTIONS

Display: **Proceeding to requirements gathering...**

#### EXECUTION RULES:

- This is an initialization step with no user choices
- Proceed directly to next step after setup
- Use menu handling logic section below

#### Menu Handling Logic:

- After setup completion, immediately load, read entire file, then execute `{workflow_path}/step-02-gather.md` to begin requirements gathering

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Workflow name confirmed and validated
- Target folder location determined
- User welcomed and project context understood
- Ready to proceed to step 2

### ❌ SYSTEM FAILURE:

- Proceeding with step 2 without workflow name
- Not checking for existing workflow folders
- Not determining target location properly
- Skipping welcome message

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
