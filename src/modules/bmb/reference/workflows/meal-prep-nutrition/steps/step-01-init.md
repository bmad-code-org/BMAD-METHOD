---
name: 'step-01-init'
description: 'Initialize the nutrition plan workflow by detecting continuation state and creating output document'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmb/reference/workflows/meal-prep-nutrition'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-profile.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/nutrition-plan-{project_name}.md'
templateFile: '{workflow_path}/templates/nutrition-plan.md'
continueFile: '{workflow_path}/steps/step-01b-continue.md'
# Template References
# This step doesn't use content templates, only the main template
---

# Step 1: Workflow Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a nutrition expert and meal planning specialist
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring nutritional expertise and structured planning, user brings their personal preferences and lifestyle constraints
- ✅ Together we produce something better than the sum of our own parts

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and setup
- 🚫 FORBIDDEN to look ahead to future steps
- 💬 Handle initialization professionally
- 🚪 DETECT existing workflow state and handle continuation properly

## EXECUTION PROTOCOLS:

- 🎯 Show analysis before taking any action
- 💾 Initialize document and update frontmatter
- 📖 Set up frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until setup is complete

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- Previous context = what's in output document + frontmatter
- Don't assume knowledge from other steps
- Input document discovery happens in this step

## STEP GOAL:

To initialize the Nutrition Plan workflow by detecting continuation state, creating the output document, and preparing for the first collaborative session.

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow

First, check if the output document already exists:

- Look for file at `{output_folder}/nutrition-plan-{project_name}.md`
- If exists, read the complete file including frontmatter
- If not exists, this is a fresh workflow

### 2. Handle Continuation (If Document Exists)

If the document exists and has frontmatter with `stepsCompleted`:

- **STOP here** and load `./step-01b-continue.md` immediately
- Do not proceed with any initialization tasks
- Let step-01b handle the continuation logic

### 3. Handle Completed Workflow

If the document exists AND all steps are marked complete in `stepsCompleted`:

- Ask user: "I found an existing nutrition plan from [date]. Would you like to:
  1. Create a new nutrition plan
  2. Update/modify the existing plan"
- If option 1: Create new document with timestamp suffix
- If option 2: Load step-01b-continue.md

### 4. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

This workflow doesn't require input documents, but check for:
**Existing Health Information (Optional):**

- Look for: `{output_folder}/*health*.md`
- Look for: `{output_folder}/*goals*.md`
- If found, load completely and add to `inputDocuments` frontmatter

#### B. Create Initial Document

Copy the template from `{template_path}` to `{output_folder}/nutrition-plan-{project_name}.md`

Initialize frontmatter with:

```yaml
---
stepsCompleted: [1]
lastStep: 'init'
inputDocuments: []
date: [current date]
user_name: { user_name }
---
```

#### C. Show Welcome Message

"Welcome to your personalized nutrition planning journey! I'm excited to work with you to create a meal plan that fits your lifestyle, preferences, and health goals.

Let's begin by getting to know you and your nutrition goals."

## ✅ SUCCESS METRICS:

- Document created from template
- Frontmatter initialized with step 1 marked complete
- User welcomed to the process
- Ready to proceed to step 2

## ❌ FAILURE MODES TO AVOID:

- Proceeding with step 2 without document initialization
- Not checking for existing documents properly
- Creating duplicate documents
- Skipping welcome message

### 7. Present MENU OPTIONS

Display: **Proceeding to user profile collection...**

#### EXECUTION RULES:

- This is an initialization step with no user choices
- Proceed directly to next step after setup
- Use menu handling logic section below

#### Menu Handling Logic:

- After setup completion, immediately load, read entire file, then execute `{workflow_path}/step-02-profile.md` to begin user profile collection

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Document created from template
- update frontmatter `stepsCompleted` to add 4 at the end of the array before loading next step
- Frontmatter initialized with `stepsCompleted: [1]`
- User welcomed to the process
- Ready to proceed to step 2

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN initialization setup is complete and document is created, will you then immediately load, read entire file, then execute `{workflow_path}/step-02-profile.md` to begin user profile collection.

### ❌ SYSTEM FAILURE:

- Proceeding with step 2 without document initialization
- Not checking for existing documents properly
- Creating duplicate documents
- Skipping welcome message

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
