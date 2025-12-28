---
name: 'step-01-init'
description: 'Initialize story pipeline: load context, detect mode, cache documents'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-create-story.md'
resumeStepFile: '{workflow_path}/steps/step-01b-resume.md'
workflowFile: '{workflow_path}/workflow.md'

# State Management
stateFile: '{sprint_artifacts}/pipeline-state-{story_id}.yaml'
auditFile: '{sprint_artifacts}/audit-{story_id}-{date}.yaml'
---

# Step 1: Pipeline Initialization

## STEP GOAL

Initialize the story pipeline by:
1. Resolving story parameters (epic_num, story_num)
2. Detecting execution mode (interactive vs batch)
3. Checking for existing pipeline state (resume scenario)
4. Pre-loading and caching documents for token efficiency
5. Creating initial state file

## MANDATORY EXECUTION RULES (READ FIRST)

### Universal Rules

- **NEVER** proceed without all required parameters resolved
- **READ** the complete step file before taking any action
- **CACHE** documents once, use across all steps
- **UPDATE** state file after completing initialization

### Role for This Step

- You are the **Pipeline Orchestrator** (no specific agent role yet)
- Agent roles (SM, TEA, DEV) will be adopted in subsequent steps
- Focus on setup and context loading

### Step-Specific Rules

- **Focus only on initialization** - no story content generation yet
- **FORBIDDEN** to load future step files or look ahead
- **Check for resume state first** - if exists, hand off to step-01b
- **Validate all inputs** before proceeding

## EXECUTION SEQUENCE (Do not deviate, skip, or optimize)

### 1. Resolve Pipeline Parameters

First, resolve these required parameters:

**From invocation or context:**
- `story_id`: Full story identifier (e.g., "1-4")
- `epic_num`: Epic number (e.g., 1)
- `story_num`: Story number within epic (e.g., 4)
- `mode`: Execution mode - "interactive" (default) or "batch"

**If parameters missing:**
- Ask user: "Please provide story ID (e.g., '1-4') and epic number"
- Parse story_id to extract epic_num and story_num if format is "X-Y"

### 2. Check for Existing Pipeline State (Resume Detection)

Check if state file exists: `{sprint_artifacts}/pipeline-state-{story_id}.yaml`

**If state file exists and has `stepsCompleted` array with entries:**
- **STOP immediately**
- Load and execute `{resumeStepFile}` (step-01b-resume.md)
- Do not proceed with fresh initialization
- This is auto-proceed - no user choice needed

**If no state file or empty `stepsCompleted`:**
- Continue with fresh pipeline initialization

### 3. Locate Story File

Search for existing story file with pattern:
- Primary: `{sprint_artifacts}/story-{story_id}.md`
- Alternative: `{sprint_artifacts}/{story_id}*.md`

**Record finding:**
- `story_file_exists`: true/false
- `story_file_path`: path if exists, null otherwise

### 4. Pre-Load and Cache Documents

Load these documents ONCE for use across all steps:

#### A. Project Context (REQUIRED)
```
Pattern: **/project-context.md
Strategy: FULL_LOAD
Cache: true
```
- Load complete project-context.md
- This contains critical rules and patterns

#### B. Epic File (REQUIRED)
```
Pattern: {output_folder}/epic-{epic_num}.md OR {output_folder}/epics.md
Strategy: SELECTIVE_LOAD (just current epic section)
Cache: true
```
- Find and load epic definition for current story
- Extract story description, BDD scenarios

#### C. Architecture (SELECTIVE)
```
Pattern: {output_folder}/architecture.md
Strategy: INDEX_GUIDED
Sections: tech_stack, data_model, api_patterns
Cache: true
```
- Load only relevant architecture sections
- Skip detailed implementation that's not needed

#### D. Story File (IF EXISTS)
```
Pattern: {sprint_artifacts}/story-{story_id}.md
Strategy: FULL_LOAD (if exists)
Cache: true
```
- If story exists, load for validation/continuation
- Will be created in step 2 if not exists

### 5. Create Initial State File

Create state file at `{stateFile}`:

```yaml
---
story_id: "{story_id}"
epic_num: {epic_num}
story_num: {story_num}
mode: "{mode}"
stepsCompleted: []
lastStep: 0
currentStep: 1
status: "initializing"
started_at: "{timestamp}"
updated_at: "{timestamp}"
cached_context:
  project_context_loaded: true
  epic_loaded: true
  architecture_sections: ["tech_stack", "data_model", "api_patterns"]
  story_file_exists: {story_file_exists}
  story_file_path: "{story_file_path}"
steps:
  step-01-init: { status: in_progress }
  step-02-create-story: { status: pending }
  step-03-validate-story: { status: pending }
  step-04-atdd: { status: pending }
  step-05-implement: { status: pending }
  step-06-code-review: { status: pending }
  step-07-complete: { status: pending }
  step-08-summary: { status: pending }
---
```

### 6. Present Initialization Summary

Report to user:

```
Pipeline Initialized for Story {story_id}

Mode: {mode}
Epic: {epic_num}
Story: {story_num}

Documents Cached:
- Project Context: [loaded from path]
- Epic {epic_num}: [loaded sections]
- Architecture: [loaded sections]
- Story File: [exists/will be created]

Pipeline State: {stateFile}

Ready to proceed to story creation.
```

### 7. Update State and Proceed

Update state file:
- Set `stepsCompleted: [1]`
- Set `lastStep: 1`
- Set `steps.step-01-init.status: completed`
- Set `status: "in_progress"`

### 8. Present Menu (Interactive Mode Only)

**If mode == "interactive":**

Display menu and wait for user input:
```
[C] Continue to Story Creation
[H] Halt pipeline
```

**Menu Handling:**
- **C (Continue)**: Load and execute `{nextStepFile}`
- **H (Halt)**: Save checkpoint, exit gracefully

**If mode == "batch":**
- Auto-proceed to next step
- Load and execute `{nextStepFile}` immediately

## QUALITY GATE

Before proceeding, verify:
- [ ] All parameters resolved (story_id, epic_num, story_num, mode)
- [ ] State file created and valid
- [ ] Project context loaded
- [ ] Epic definition loaded
- [ ] Architecture sections loaded (at least tech_stack)

## CRITICAL STEP COMPLETION

**ONLY WHEN** [initialization complete AND state file updated AND quality gate passed],
load and execute `{nextStepFile}` to begin story creation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- All parameters resolved
- Resume state detected and handed off correctly
- Documents cached efficiently (not reloaded)
- State file created with proper structure
- Menu presented and user input handled

### ❌ FAILURE
- Proceeding without resolved parameters
- Not checking for resume state first
- Loading documents redundantly across steps
- Not creating state file before proceeding
- Skipping directly to implementation
