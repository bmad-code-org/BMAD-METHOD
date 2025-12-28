---
name: 'step-01-init'
description: 'Initialize pipeline, load story, detect development mode'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-pre-gap-analysis.md'

# Role
role: null  # No agent role yet
---

# Step 1: Initialize Pipeline

## STEP GOAL

Initialize the super-dev-pipeline:
1. Load story file (must exist!)
2. Cache project context
3. Detect development mode (greenfield vs brownfield)
4. Initialize state tracking
5. Display execution plan

## MANDATORY EXECUTION RULES

### Initialization Principles

- **STORY MUST EXIST** - This workflow does NOT create stories
- **READ COMPLETELY** - Load all context before proceeding
- **DETECT MODE** - Determine if greenfield or brownfield
- **NO ASSUMPTIONS** - Verify all files and paths

## EXECUTION SEQUENCE

### 1. Detect Execution Mode

Check if running in batch or interactive mode:
- Batch mode: Invoked from autonomous-epic
- Interactive mode: User-initiated

Set `{mode}` variable.

### 2. Resolve Story File Path

**From input parameters:**
- `story_id`: e.g., "1-4"
- `story_file`: Full path to story file

**If story_file not provided:**
```
story_file = {sprint_artifacts}/story-{story_id}.md
```

### 3. Verify Story Exists

```bash
# Check if story file exists
test -f "{story_file}"
```

**If story does NOT exist:**
```
❌ ERROR: Story file not found at {story_file}

super-dev-pipeline requires an existing story file.
Use create-story or story-pipeline to create new stories.

HALT
```

**If story exists:**
```
✅ Story file found: {story_file}
```

### 4. Load Story File

Read story file and extract:
- Story title
- Epic number
- Story number
- Acceptance criteria
- Current tasks (checked and unchecked)
- File List section (if exists)

Count:
- Total tasks: `{total_task_count}`
- Unchecked tasks: `{unchecked_task_count}`
- Checked tasks: `{checked_task_count}`

### 5. Load Project Context

Read `**/project-context.md`:
- Tech stack
- Coding patterns
- Database conventions
- Testing requirements

Cache in memory for use across steps.

### 6. Detect Development Mode

**Check File List section in story:**

```typescript
interface DetectionResult {
  mode: "greenfield" | "brownfield" | "hybrid";
  reasoning: string;
  existing_files: string[];
  new_files: string[];
}
```

**Detection logic:**

```bash
# Extract files from File List section
files_in_story=()

# For each file, check if it exists
existing_count=0
new_count=0

for file in files_in_story; do
  if test -f "$file"; then
    existing_count++
    existing_files+=("$file")
  else
    new_count++
    new_files+=("$file")
  fi
done
```

**Mode determination:**
- `existing_count == 0` → **greenfield** (all new files)
- `new_count == 0` → **brownfield** (all existing files)
- Both > 0 → **hybrid** (mix of new and existing)

### 7. Display Initialization Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 SUPER-DEV PIPELINE - Disciplined Execution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: {story_title}
File: {story_file}
Mode: {mode} (interactive|batch)

Development Type: {greenfield|brownfield|hybrid}
- Existing files: {existing_count}
- New files: {new_count}

Tasks:
- Total: {total_task_count}
- Completed: {checked_task_count} ✅
- Remaining: {unchecked_task_count} ⏳

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pipeline Steps:
1. ✅ Initialize (current)
2. ⏳ Pre-Gap Analysis - Validate tasks
3. ⏳ Implement - {TDD|Refactor|Hybrid}
4. ⏳ Post-Validation - Verify completion
5. ⏳ Code Review - Find 3-10 issues
6. ⏳ Complete - Commit + push
7. ⏳ Summary - Audit trail

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  ANTI-VIBE-CODING ENFORCEMENT ACTIVE

This workflow uses step-file architecture to ensure:
- ✅ No skipping steps
- ✅ No optimizing sequences
- ✅ No looking ahead
- ✅ No vibe coding even at 200K tokens

You will follow each step file PRECISELY.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Initialize State File

Create state file at `{sprint_artifacts}/super-dev-state-{story_id}.yaml`:

```yaml
---
story_id: "{story_id}"
story_file: "{story_file}"
mode: "{mode}"
development_type: "{greenfield|brownfield|hybrid}"

stepsCompleted: [1]
lastStep: 1
currentStep: 2
status: "in_progress"

started_at: "{timestamp}"
updated_at: "{timestamp}"

cached_context:
  story_loaded: true
  project_context_loaded: true

development_analysis:
  existing_files: {existing_count}
  new_files: {new_count}
  total_tasks: {total_task_count}
  unchecked_tasks: {unchecked_task_count}

steps:
  step-01-init:
    status: completed
    completed_at: "{timestamp}"
  step-02-pre-gap-analysis:
    status: pending
  step-03-implement:
    status: pending
  step-04-post-validation:
    status: pending
  step-05-code-review:
    status: pending
  step-06-complete:
    status: pending
  step-07-summary:
    status: pending
```

### 9. Display Menu (Interactive) or Proceed (Batch)

**Interactive Mode Menu:**
```
[C] Continue to Pre-Gap Analysis
[H] Halt pipeline
```

**Batch Mode:** Auto-continue to next step

## CRITICAL STEP COMPLETION

**ONLY WHEN** initialization is complete,
load and execute `{nextStepFile}` for pre-gap analysis.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Story file loaded successfully
- Development mode detected accurately
- State file initialized
- Context cached in memory
- Ready for pre-gap analysis

### ❌ FAILURE
- Story file not found
- Invalid story file format
- Missing project context
- State file creation failed
