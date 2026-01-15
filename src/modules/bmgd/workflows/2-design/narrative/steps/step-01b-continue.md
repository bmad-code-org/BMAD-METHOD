---
name: 'step-01b-continue'
description: 'Continue an existing narrative workflow from where it left off'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-01b-continue.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'

# Step Files (for routing)
step02: './step-02-foundation.md'
step03: './step-03-story.md'
step04: './step-04-characters.md'
step05: './step-05-world.md'
step06: './step-06-dialogue.md'
step07: './step-07-environmental.md'
step08: './step-08-delivery.md'
step09: './step-09-integration.md'
step10: './step-10-production.md'
step11: './step-11-complete.md'
---

# Step 1b: Continue Existing Narrative

**Resuming Narrative Workflow**

## STEP GOAL:

Load the existing narrative document, determine progress, and route to the appropriate next step.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- Parse frontmatter to determine completed steps
- Present summary of current progress
- Route to correct next step based on state

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Load Existing Narrative

**Read the existing narrative document:**

Load `{outputFile}` and parse the frontmatter to extract:

- `stepsCompleted` array
- `status`
- `project` name
- `narrativeComplexity`
- GDD reference

### 2. Analyze Progress

**Determine workflow state:**

Map completed steps to workflow progress:

- Step 1: Initialize
- Step 2: Foundation (premise, themes, structure)
- Step 3: Story (beats and pacing)
- Step 4: Characters (all characters and arcs)
- Step 5: World (world, history, locations)
- Step 6: Dialogue (dialogue systems)
- Step 7: Environmental (environmental storytelling)
- Step 8: Delivery (narrative delivery methods)
- Step 9: Integration (gameplay integration)
- Step 10: Production (scope and planning)
- Step 11: Complete

**Calculate next step:**

Find the highest completed step and determine the next step file to load.

### 3. Present Continuation Summary

"**Resuming Narrative Workflow**

{{user_name}}, I found your existing narrative for **{{game_name}}**.

**Progress:** Steps completed: {{stepsCompleted}}

**Narrative Complexity:** {{narrativeComplexity}}

**Sections Completed:**
{{list_of_completed_sections}}

**Current Status:**

- Last completed: {{last_step_name}}
- Next step: {{next_step_name}} (Step {{next_step_number}} of 11)

Would you like to:

1. **Continue** - Resume from {{next_step_name}}
2. **Review** - Show me what we've written so far
3. **Restart Step** - Redo the last completed step

Select an option:"

### 4. Handle User Selection

**If Continue:**

- Load the next step file based on `stepsCompleted`

**If Review:**

- Present summary of all completed sections
- Show key narrative elements (premise, characters, etc.)
- Return to continuation options

**If Restart Step:**

- Decrement stepsCompleted to remove last step
- Load the step file for the step being restarted

### 5. Route to Next Step

Based on next step number, load the appropriate step file:

| Next Step | File     |
| --------- | -------- |
| 2         | {step02} |
| 3         | {step03} |
| 4         | {step04} |
| 5         | {step05} |
| 6         | {step06} |
| 7         | {step07} |
| 8         | {step08} |
| 9         | {step09} |
| 10        | {step10} |
| 11        | {step11} |

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Existing document loaded and parsed
- Progress accurately determined
- User presented with clear options
- Correct step file loaded based on state

### SYSTEM FAILURE:

- Failing to parse frontmatter correctly
- Loading wrong step file
- Not presenting continuation options
- Overwriting existing progress without confirmation

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
