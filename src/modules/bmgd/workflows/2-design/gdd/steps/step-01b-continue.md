---
name: 'step-01b-continue'
description: 'Resume an interrupted GDD workflow from the last completed step'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/gdd'

# File References
thisStepFile: './step-01b-continue.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/gdd.md'
---

# Step 1B: Workflow Continuation

## STEP GOAL:

Resume the GDD workflow from where it was left off, ensuring smooth continuation with full context restoration.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- We engage in collaborative dialogue, not command-response
- Resume workflow from exact point where it was interrupted

### Step-Specific Rules:

- FOCUS on understanding where we left off and continuing appropriately
- FORBIDDEN to modify content completed in previous steps
- Only reload documents that were already tracked in `inputDocuments`

## EXECUTION PROTOCOLS:

- Show your analysis of current state before taking action
- Keep existing frontmatter `stepsCompleted` values
- Only load documents that were already tracked in `inputDocuments`
- FORBIDDEN to discover new input documents during continuation

## CONTEXT BOUNDARIES:

- Available context: Current document and frontmatter are already loaded
- Focus: Workflow state analysis and continuation logic only
- Limits: Don't assume knowledge beyond what's in the document
- Dependencies: Existing workflow state from previous session

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Analyze Current State

**State Assessment:**
Review the frontmatter to understand:

- `stepsCompleted`: Which steps are already done
- `lastStep`: The most recently completed step number
- `inputDocuments`: What context was already loaded
- `documentCounts`: briefs, research, brainstorming, projectDocs counts
- `game_type`: The identified game type (if set)
- `game_name`: The game name (if set)
- All other frontmatter variables

### 2. Restore Context Documents

**Context Reloading:**

- For each document in `inputDocuments`, load the complete file
- This ensures you have full context for continuation
- Don't discover new documents - only reload what was previously processed
- If `game_type` is set, also reload the corresponding game type guide from `{workflow_path}/game-types/{game_type}.md`

### 3. Present Current Progress

**Progress Report to User:**
"Welcome back {{user_name}}! I'm resuming our GDD collaboration for {{game_name or project_name}}.

**Current Progress:**

- Steps completed: {stepsCompleted}
- Last worked on: Step {lastStep}
- Game type: {game_type or 'Not yet determined'}
- Context documents available: {len(inputDocuments)} files

**Document Status:**

- Current GDD document is ready with all completed sections
- Ready to continue from where we left off

Does this look right, or do you want to make any adjustments before we proceed?"

### 4. Determine Continuation Path

**Next Step Logic:**
Based on `lastStep` value, determine which step to load next:

- If `lastStep = 1` -> Load `./step-02-context.md`
- If `lastStep = 2` -> Load `./step-03-platforms.md`
- If `lastStep = 3` -> Load `./step-04-vision.md`
- If `lastStep = 4` -> Load `./step-05-core-gameplay.md`
- If `lastStep = 5` -> Load `./step-06-mechanics.md`
- If `lastStep = 6` -> Load `./step-07-game-type.md`
- If `lastStep = 7` -> Load `./step-08-progression.md`
- If `lastStep = 8` -> Load `./step-09-levels.md`
- If `lastStep = 9` -> Load `./step-10-art-audio.md`
- If `lastStep = 10` -> Load `./step-11-technical.md`
- If `lastStep = 11` -> Load `./step-12-epics.md`
- If `lastStep = 12` -> Load `./step-13-metrics.md`
- If `lastStep = 13` -> Load `./step-14-complete.md`
- If `lastStep = 14` -> Workflow already complete

### 5. Handle Workflow Completion

**If workflow already complete (`lastStep = 14`):**
"Great news! It looks like we've already completed the GDD workflow for {{game_name}}.

The final document is ready at `{outputFile}` with all sections completed through step 14.

Would you like me to:

- Review the completed GDD with you
- Suggest next workflow steps (like architecture or epic creation)
- Start a new GDD revision

What would be most helpful?"

### 6. Present MENU OPTIONS

**If workflow not complete:**
Display: "Ready to continue with Step {nextStepNumber}?

**Select an Option:** [C] Continue to next step"

#### Menu Handling Logic:

- IF C: Load, read entire file, then execute the appropriate next step file based on `lastStep`
- IF Any other comments or queries: respond and redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [current state confirmed], will you then load and read fully the appropriate next step file to resume the workflow.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- All previous input documents successfully reloaded
- Game type guide reloaded if game_type was set
- Current workflow state accurately analyzed and presented
- User confirms understanding of progress before continuation
- Correct next step identified and prepared for loading

### SYSTEM FAILURE:

- Discovering new input documents instead of reloading existing ones
- Modifying content from already completed steps
- Loading wrong next step based on `lastStep` value
- Proceeding without user confirmation of current state

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
