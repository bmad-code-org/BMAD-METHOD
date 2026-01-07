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
- Batch mode: Invoked from batch-super-dev
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

### 4.5 Pre-Flight Bailout Check (NEW v1.3.0)

**Check for early bailout conditions before investing more tokens:**

```
If total_task_count == 0:
  Display:
  ⚠️ EARLY BAILOUT: No Tasks Found

  Story file exists but has no tasks in Tasks/Subtasks section.
  - Story may be incomplete or malformed
  - Run create-story or validate-create-story first

  HALT - Nothing to implement

If unchecked_task_count == 0:
  Display:
  ✅ EARLY BAILOUT: Story Already Complete

  All {checked_task_count} tasks are already marked complete.
  - No implementation work required
  - Story may need status update to "review" or "done"

  {if batch mode: Continue to next story}
  {if interactive mode: HALT - Story complete}

If story file missing required sections (Tasks, Acceptance Criteria):
  Display:
  ⚠️ EARLY BAILOUT: Invalid Story Format

  Story file is missing required sections:
  - Missing: {missing_sections}

  Run validate-create-story to fix the story format.

  HALT - Cannot proceed with invalid story
```

**If all bailout checks pass:**
```
✅ Pre-flight checks passed
   - Story valid: {total_task_count} tasks
   - Work remaining: {unchecked_task_count} unchecked
   - Ready for implementation
```

### 5. Load Project Context

Read `**/project-context.md`:
- Tech stack
- Coding patterns
- Database conventions
- Testing requirements

Cache in memory for use across steps.

### 6. Apply Complexity Routing (NEW v1.2.0)

**Check complexity_level parameter:**
- `micro`: Lightweight path - skip pre-gap analysis (step 2) and code review (step 5)
- `standard`: Full pipeline - all steps
- `complex`: Full pipeline with warnings

**Determine skip_steps based on complexity:**
```
If complexity_level == "micro":
  skip_steps = [2, 5]
  pipeline_mode = "lightweight"

  Display:
  🚀 MICRO COMPLEXITY DETECTED

  Lightweight path enabled:
  - ⏭️ Skipping Pre-Gap Analysis (low risk)
  - ⏭️ Skipping Code Review (simple changes)
  - Estimated token savings: 50-70%

If complexity_level == "complex":
  skip_steps = []
  pipeline_mode = "enhanced"

  Display:
  🔒 COMPLEX STORY DETECTED

  Enhanced validation enabled:
  - Full pipeline with all quality gates
  - Consider splitting if story fails

  ⚠️ Warning: This story has high-risk elements.
  Proceeding with extra attention.

If complexity_level == "standard":
  skip_steps = []
  pipeline_mode = "standard"
```

Store `skip_steps` and `pipeline_mode` in state file.

### 7. Detect Development Mode

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

### 8. Display Initialization Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 SUPER-DEV PIPELINE - Disciplined Execution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: {story_title}
File: {story_file}
Mode: {mode} (interactive|batch)
Complexity: {complexity_level} → {pipeline_mode} path

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
2. {⏭️ SKIP|⏳} Pre-Gap Analysis - Validate tasks {if micro: "(skipped - low risk)"}
3. ⏳ Implement - {TDD|Refactor|Hybrid}
4. ⏳ Post-Validation - Verify completion
5. {⏭️ SKIP|⏳} Code Review - Find issues {if micro: "(skipped - simple changes)"}
6. ⏳ Complete - Commit + push
7. ⏳ Summary - Audit trail

{if pipeline_mode == "lightweight":
  🚀 LIGHTWEIGHT PATH: Steps 2 and 5 will be skipped (50-70% token savings)
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  ANTI-VIBE-CODING ENFORCEMENT ACTIVE

This workflow uses step-file architecture to ensure:
- ✅ No skipping steps (except complexity-based routing)
- ✅ No optimizing sequences
- ✅ No looking ahead
- ✅ No vibe coding even at 200K tokens

You will follow each step file PRECISELY.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 9. Initialize State File

Create state file at `{sprint_artifacts}/super-dev-state-{story_id}.yaml`:

```yaml
---
story_id: "{story_id}"
story_file: "{story_file}"
mode: "{mode}"
development_type: "{greenfield|brownfield|hybrid}"

# Complexity routing (NEW v1.2.0)
complexity:
  level: "{complexity_level}"  # micro | standard | complex
  pipeline_mode: "{pipeline_mode}"  # lightweight | standard | enhanced
  skip_steps: {skip_steps}  # e.g., [2, 5] for micro

stepsCompleted: [1]
lastStep: 1
currentStep: 2  # Or 3 if step 2 is skipped
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
    status: {pending|skipped}  # skipped if complexity == micro
  step-03-implement:
    status: pending
  step-04-post-validation:
    status: pending
  step-05-code-review:
    status: {pending|skipped}  # skipped if complexity == micro
  step-06-complete:
    status: pending
  step-07-summary:
    status: pending
```

### 10. Display Menu (Interactive) or Proceed (Batch)

**Interactive Mode Menu:**
```
[C] Continue to {next step name}
[H] Halt pipeline
```

**Batch Mode:** Auto-continue to next step

## CRITICAL STEP COMPLETION

**Determine next step based on complexity routing:**

```
If 2 in skip_steps (micro complexity):
  nextStepFile = '{workflow_path}/steps/step-03-implement.md'
  Display: "⏭️ Skipping Pre-Gap Analysis (micro complexity) → Proceeding to Implementation"
Else:
  nextStepFile = '{workflow_path}/steps/step-02-pre-gap-analysis.md'
```

**ONLY WHEN** initialization is complete,
load and execute `{nextStepFile}`.

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
