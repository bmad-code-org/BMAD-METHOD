---
name: 'step-01-init'
description: 'Initialize the Game Brief workflow by detecting continuation state and setting up the document'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/1-preproduction/game-brief'

# File References
thisStepFile: './step-01-init.md'
nextStepFile: './step-02-vision.md'
continueStepFile: './step-01b-continue.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-brief.md'

# Template References
briefTemplate: '{workflow_path}/templates/game-brief-template.md'
---

# Step 1: Workflow Initialization

**Progress: Step 1 of 8** - Next: Game Vision

## STEP GOAL:

Initialize the Game Brief workflow by detecting continuation state, discovering any input documents (brainstorming, research), and setting up the document structure.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game designer facilitator collaborating with a creative peer
- If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- We engage in collaborative dialogue, not command-response
- You bring structured game design thinking and facilitation skills

### Step-Specific Rules:

- Focus only on initialization and setup - no content generation yet
- FORBIDDEN to look ahead to future steps or assume knowledge from them
- Approach: Systematic setup with clear reporting to user
- Detect existing workflow state and handle continuation properly

## EXECUTION PROTOCOLS:

- Show your analysis of current state before taking any action
- Initialize document structure and update frontmatter appropriately
- Set up frontmatter `stepsCompleted: [1]` before loading next step
- FORBIDDEN to load next step until user selects 'C' (Continue)

## CONTEXT BOUNDARIES:

- Available context: Variables from workflow.md are available in memory
- Focus: Workflow initialization and document setup only
- Limits: Don't assume knowledge from other steps or create content yet
- Dependencies: Configuration loaded from workflow.md initialization

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Check for Existing Workflow State

First, check if the output document already exists:

**Workflow State Detection:**

- Look for file at `{outputFile}`
- If exists, read the complete file including frontmatter
- If not exists, this is a fresh workflow

### 2. Handle Continuation (If Document Exists)

If the document exists and has frontmatter with `stepsCompleted`:

**Continuation Protocol:**

- **STOP immediately** and load `{continueStepFile}`
- Do not proceed with any initialization tasks
- Let step-01b handle all continuation logic
- This is an auto-proceed situation - no user choice needed

### 3. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

Discover and load context documents using smart discovery.

**IMPORTANT: Track document counts as you discover files.**

Initialize counters:

```
brainstormingCount = 0
researchCount = 0
notesCount = 0
```

**Brainstorming Documents:**

1. Check: `{output_folder}/*brainstorm*.md`
2. Check: `{output_folder}/analysis/*brainstorm*.md`
3. Load completely and extract key ideas
4. **Update brainstormingCount with number of files found**

**Research Documents:**

1. Check: `{output_folder}/*research*.md`
2. Check: `{output_folder}/analysis/*research*.md`
3. Load useful research files completely
4. **Update researchCount with number of files found**

**Design Notes:**

1. Check: `{output_folder}/*notes*.md` or `{output_folder}/*design*.md`
2. Load any relevant design notes
3. **Update notesCount with number of files found**

**Loading Rules:**

- Load ALL discovered files completely (no offset/limit)
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Create Initial Document

**Document Setup:**

- Copy the template from `{briefTemplate}` to `{outputFile}`
- Initialize frontmatter with proper structure:

```yaml
---
stepsCompleted: []
inputDocuments: []
documentCounts:
  brainstorming: { { brainstormingCount } }
  research: { { researchCount } }
  notes: { { notesCount } }
workflowType: 'game-brief'
lastStep: 0
project_name: '{{project_name}}'
user_name: '{{user_name}}'
date: '{{date}}'
game_name: ''
---
```

#### C. Present Initialization Results

**Setup Report to User:**

"Welcome {{user_name}}! I've set up your Game Brief workspace.

**Document Setup:**

- Created: `{outputFile}` from template
- Initialized frontmatter with workflow state

**Input Documents Discovered:**

- Brainstorming: {{brainstormingCount}} files {if brainstormingCount > 0}loaded{else}(none found){/if}
- Research: {{researchCount}} files {if researchCount > 0}loaded{else}(none found){/if}
- Design notes: {{notesCount}} files {if notesCount > 0}loaded{else}(none found){/if}

{if any_documents_found}
I'll use these documents to give us a head start on your game brief.
{else}
We'll start fresh and build your game vision together through conversation.
{/if}

Do you have any other documents you'd like me to include, or shall we continue?"

### 4. Present MENU OPTIONS

Display menu after setup report:

"[C] Continue - Save this and move to Game Vision (Step 2 of 8)"

#### Menu Handling Logic:

- IF C: Update frontmatter with `stepsCompleted: [1]`, then load, read entire file, then execute {nextStepFile}
- IF user provides additional files: Load them, update inputDocuments and documentCounts, redisplay report
- IF user asks questions: Answer and redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [frontmatter properly updated with stepsCompleted: [1] and documentCounts], will you then load and read fully `{nextStepFile}` to execute and begin game vision discovery.

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Existing workflow detected and properly handed off to step-01b
- Fresh workflow initialized with template and proper frontmatter
- Input documents discovered and loaded
- All discovered files tracked in frontmatter `inputDocuments`
- **Document counts stored in frontmatter `documentCounts`**
- Menu presented and user input handled correctly
- Frontmatter updated with `stepsCompleted: [1]` before proceeding

### SYSTEM FAILURE:

- Proceeding with fresh initialization when existing workflow exists
- Not updating frontmatter with discovered input documents
- **Not storing document counts in frontmatter**
- Creating document without proper template structure
- Proceeding without user selecting 'C' (Continue)

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
