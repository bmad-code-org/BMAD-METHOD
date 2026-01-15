---
name: 'step-01-init'
description: 'Initialize the game brainstorming workflow and validate readiness'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/brainstorm-game'

# File References
thisStepFile: './step-01-init.md'
nextStepFile: './step-02-context.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/brainstorming-session-{date}.md'

# Context Files
gameContext: '{workflow_path}/game-context.md'
gameBrainMethods: '{workflow_path}/game-brain-methods.csv'
---

# Step 1: Initialize Brainstorming

**Progress: Step 1 of 4** - Next: Load Context

## STEP GOAL:

Validate workflow readiness, check for workflow status tracking, and prepare for the game brainstorming session.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a creative game design facilitator
- Focus on drawing out user's ideas
- Game brainstorming is optional but valuable

### Step-Specific Rules:

- Check for workflow status file
- Initialize session document with proper frontmatter
- Prepare user for brainstorming mindset

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Wait for user confirmation before proceeding
- Update frontmatter `stepsCompleted: [1]` before loading next step

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Check Workflow Status

**Search for workflow status file:**

Check if `{output_folder}/bmgd-workflow-status.yaml` exists.

**If status file NOT found:**

"No workflow status file found. Game brainstorming is optional and can run standalone.

Would you like to:

1. Continue in standalone mode (no progress tracking)
2. Run `workflow-init` first to set up tracking

Your choice:"

**If user continues:** Set `standalone_mode = true`

**If status file found:**

Load the file and check:

- Is this a game project? (`project_type == 'game'`)
- Has brainstorm-game already been completed?
- Is this the next expected workflow?

Handle each scenario appropriately with user prompts.

### 2. Set Brainstorming Mindset

"**Welcome to Game Brainstorming!**

{{user_name}}, let's explore game ideas together.

**Brainstorming Rules:**

- There are no bad ideas in brainstorming
- **Quantity over quality:** Our goal is **100+ ideas**. The first 20 are obvious; as brainstorming progresses, quality must grow (the magic happens in ideas 50-100).
- Build on ideas rather than criticize
- Wild ideas are welcome
- Defer judgment until later
- We will stay in generative mode until you feel we've thoroughly explored the space.

**What we'll do:**

1. Load game-specific brainstorming techniques
2. Explore your game concepts using various methods
3. Capture and organize all ideas
4. Save results for future refinement

Ready to start brainstorming? [Y/N]"

### 3. Initialize Output Document

**If user confirms, create the session document:**

Create `{outputFile}` with frontmatter:

```markdown
---
title: 'Game Brainstorming Session'
date: '{{date}}'
author: '{{user_name}}'
version: '1.0'
stepsCompleted: [1]
status: 'in-progress'
---

# Game Brainstorming Session

## Session Info

- **Date:** {{date}}
- **Facilitator:** Game Designer Agent
- **Participant:** {{user_name}}

---

_Ideas will be captured as we progress through the session._
```

### 4. Proceed to Context Step

After initialization:

- Update frontmatter: `stepsCompleted: [1]`
- Load `{nextStepFile}`

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Workflow status checked appropriately
- User confirmed ready to brainstorm
- Output document initialized
- Brainstorming mindset established
- Frontmatter updated with stepsCompleted: [1]

### SYSTEM FAILURE:

- Starting without user confirmation
- Not checking workflow status
- Missing document initialization
- Not setting brainstorming tone

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
