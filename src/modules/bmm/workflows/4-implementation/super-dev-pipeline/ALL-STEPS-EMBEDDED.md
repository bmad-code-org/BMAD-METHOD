---
name: 'step-01-init'
description: 'Initialize pipeline, load story (auto-create if needed), detect development mode'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'
create_story_workflow: '{project-root}/_bmad/bmm/workflows/4-implementation/create-story-with-gap-analysis'

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

- **AUTO-CREATE IF NEEDED** - If story is missing or incomplete, auto-invoke /create-story-with-gap-analysis (NEW v1.4.0)
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

### 3. Verify Story Exists (Auto-Create if Missing - NEW v1.4.0)

```bash
# Check if story file exists
test -f "{story_file}"
```

**If story does NOT exist:**
```
⚠️ Story file not found at {story_file}

🔄 AUTO-CREATING: Invoking /create-story-with-gap-analysis...
```

<invoke-workflow path="{create_story_workflow}/workflow.yaml">
  <input name="story_id">{story_id}</input>
  <input name="epic_num">{epic_num}</input>
  <input name="story_num">{story_num}</input>
</invoke-workflow>

After workflow completes, verify story was created:
```bash
test -f "{story_file}" && echo "✅ Story created successfully" || echo "❌ Story creation failed - HALT"
```

**If story was created, set flag for smart gap analysis:**
```yaml
# Set state flag to skip redundant gap analysis in step 2
story_just_created: true
gap_analysis_completed: true # Already done in create-story-with-gap-analysis
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

### 4.5 Pre-Flight Check & Auto-Regenerate (UPDATED v1.4.0)

**Check story quality and auto-regenerate if insufficient:**

```
If total_task_count == 0:
  Display:
  ⚠️ Story has no tasks - needs gap analysis

  🔄 AUTO-REGENERATING: Invoking /create-story-with-gap-analysis...
```
  <invoke-workflow path="{create_story_workflow}/workflow.yaml">
    <input name="story_id">{story_id}</input>
    <input name="story_file">{story_file}</input>
    <input name="regenerate">true</input>
  </invoke-workflow>

  # Story created - skip redundant gap analysis
  story_just_created: true
  gap_analysis_completed: true

  Then re-load story and continue.

```
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
  ⚠️ Story missing required sections: {missing_sections}

  🔄 AUTO-REGENERATING: Invoking /create-story-with-gap-analysis...
```
  <invoke-workflow path="{create_story_workflow}/workflow.yaml">
    <input name="story_id">{story_id}</input>
    <input name="story_file">{story_file}</input>
    <input name="regenerate">true</input>
  </invoke-workflow>

  # Story regenerated - mark flags to skip duplicate gap analysis
  story_just_created: true
  gap_analysis_completed: true

  Then re-load story and continue.

**If all checks pass:**
```
✅ Pre-flight checks passed
   - Story valid: {total_task_count} tasks
   - Work remaining: {unchecked_task_count} unchecked
   - Ready for implementation
```

## 5. Load Project Context

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
---
name: 'step-02-smart-gap-analysis'
description: 'Smart gap analysis - skip if story just created with gap analysis in step 1'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-02-smart-gap-analysis.md'
stateFile: '{state_file}'
nextStepFile: '{workflow_path}/steps/step-03-write-tests.md'

# Role Switch
role: dev
agentFile: '{project-root}/_bmad/bmm/agents/dev.md'
---

# Step 2: Smart Gap Analysis

## ROLE SWITCH

**Switching to DEV (Developer) perspective.**

You are now analyzing the story tasks against codebase reality.

## STEP GOAL

Validate all story tasks against the actual codebase:
1. Scan codebase for existing implementations
2. Identify which tasks are truly needed vs already done
3. Refine vague tasks to be specific and actionable
4. Add missing tasks that were overlooked
5. Uncheck any tasks that claim completion incorrectly
6. Ensure tasks align with existing code patterns

## MANDATORY EXECUTION RULES

### Gap Analysis Principles

- **TRUST NOTHING** - Verify every task against codebase
- **SCAN THOROUGHLY** - Use Glob, Grep, Read to understand existing code
- **BE SPECIFIC** - Vague tasks like "Add feature X" need breakdown
- **ADD MISSING** - If something is needed but not tasked, add it
- **BROWNFIELD AWARE** - Check for existing implementations

## EXECUTION SEQUENCE

### 0. Smart Gap Analysis Check (NEW v1.5.0)

**Check if gap analysis already performed in step 1:**

```yaml
# Read state from step 1
Read {stateFile}

If story_just_created == true:
  Display:
  ✅ GAP ANALYSIS SKIPPED

  Story was just created via /create-story-with-gap-analysis in step 1.
  Gap analysis already performed as part of story creation.

  Skipping redundant gap analysis.
  Proceeding directly to test writing (step 3).

  Exit step 2
```

**If story was NOT just created, proceed with gap analysis below.**

### 1. Load Story Tasks

Read story file and extract all tasks (checked and unchecked):

```regex
- \[ \] (.+)   # Unchecked
- \[x\] (.+)   # Checked
```

Build list of all tasks to analyze.

### 2. Scan Existing Codebase

**For development_type = "brownfield" or "hybrid":**

Scan all files mentioned in File List:

```bash
# For each file in File List
for file in {file_list}; do
  if test -f "$file"; then
    # Read file to understand current implementation
    read "$file"

    # Check what's already implemented
    grep -E "function|class|interface|export" "$file"
  fi
done
```

Document existing implementations.

### 3. Analyze Each Task

For EACH task in story:

**A. Determine Task Type:**
- Component creation
- Function/method addition
- Database migration
- API endpoint
- UI element
- Test creation
- Refactoring
- Bug fix

**B. Check Against Codebase:**

```typescript
interface TaskAnalysis {
  task: string;
  type: string;
  status: "needed" | "partially_done" | "already_done" | "unclear";
  reasoning: string;
  existing_code?: string;
  refinement?: string;
}
```

**For each task, ask:**
1. Does related code already exist?
2. If yes, what needs to change?
3. If no, what needs to be created?
4. Is the task specific enough to implement?

**C. Categorize Task:**

**NEEDED** - Task is clear and required:
```yaml
- task: "Add deleteUser server action"
  status: needed
  reasoning: "No deleteUser function found in codebase"
  action: "Implement as specified"
```

**PARTIALLY_DONE** - Some work exists, needs completion:
```yaml
- task: "Add error handling to createUser"
  status: partially_done
  reasoning: "createUser exists but only handles success case"
  existing_code: "src/actions/createUser.ts"
  action: "Add error handling for DB failures, validation errors"
```

**ALREADY_DONE** - Task is complete:
```yaml
- task: "Create users table"
  status: already_done
  reasoning: "users table exists with correct schema"
  existing_code: "migrations/20250101_create_users.sql"
  action: "Check this task, no work needed"
```

**UNCLEAR** - Task is too vague:
```yaml
- task: "Improve user flow"
  status: unclear
  reasoning: "Ambiguous - what specifically needs improvement?"
  action: "Refine to specific sub-tasks"
  refinement:
    - "Add loading states to user forms"
    - "Add error toast on user creation failure"
    - "Add success confirmation modal"
```

### 4. Generate Gap Analysis Report

Create report showing findings:

```markdown
## Pre-Gap Analysis Results

**Development Mode:** {greenfield|brownfield|hybrid}

**Task Analysis:**

### ✅ Tasks Ready for Implementation ({needed_count})
1. {task_1} - {reasoning}
2. {task_2} - {reasoning}

### ⚠️ Tasks Partially Implemented ({partial_count})
1. {task_1}
   - Current: {existing_implementation}
   - Needed: {what_to_add}
   - File: {file_path}

### ✓ Tasks Already Complete ({done_count})
1. {task_1}
   - Evidence: {existing_code_location}
   - Action: Will check this task

### 🔍 Tasks Need Refinement ({unclear_count})
1. {original_vague_task}
   - Issue: {why_unclear}
   - Refined to:
     - [ ] {specific_sub_task_1}
     - [ ] {specific_sub_task_2}

### ➕ Missing Tasks Discovered ({missing_count})
1. {missing_task_1} - {why_needed}
2. {missing_task_2} - {why_needed}

**Summary:**
- Ready to implement: {needed_count}
- Need completion: {partial_count}
- Already done: {done_count}
- Need refinement: {unclear_count}
- Missing tasks: {missing_count}

**Total work remaining:** {work_count} tasks
```

### 5. Update Story File

**A. Check already-done tasks:**
```markdown
- [x] Create users table (verified in gap analysis)
```

**B. Refine unclear tasks:**
```markdown
~~- [ ] Improve user flow~~ (too vague)

Refined to:
- [ ] Add loading states to user forms
- [ ] Add error toast on user creation failure
- [ ] Add success confirmation modal
```

**C. Add missing tasks:**
```markdown
## Tasks (Updated after Pre-Gap Analysis)

{existing_tasks}

### Added from Gap Analysis
- [ ] {missing_task_1}
- [ ] {missing_task_2}
```

**D. Add Gap Analysis section:**
```markdown
## Gap Analysis

### Pre-Development Analysis
- **Date:** {timestamp}
- **Development Type:** {greenfield|brownfield|hybrid}
- **Existing Files:** {count}
- **New Files:** {count}

**Findings:**
- Tasks ready: {needed_count}
- Tasks partially done: {partial_count}
- Tasks already complete: {done_count}
- Tasks refined: {unclear_count}
- Tasks added: {missing_count}

**Codebase Scan:**
{list existing implementations found}

**Status:** Ready for implementation
```

### 6. Pattern Detection for Smart Batching (NEW!)

After validating tasks, detect repeating patterns that can be batched:

```typescript
interface TaskPattern {
  pattern_name: string;
  pattern_type: "package_install" | "module_registration" | "code_deletion" | "import_update" | "custom";
  tasks: Task[];
  batchable: boolean;
  risk_level: "low" | "medium" | "high";
  validation_strategy: string;
  estimated_time_individual: number;  // minutes if done one-by-one
  estimated_time_batched: number;     // minutes if batched
}
```

**Common Batchable Patterns:**

**Pattern: Package Installation**
```
Tasks like:
- [ ] Add @company/shared-utils to package.json
- [ ] Add @company/validation to package.json
- [ ] Add @company/http-client to package.json

Batchable: YES
Risk: LOW
Validation: npm install && npm run build
Time: 5 min batch vs 15 min individual (3x faster!)
```

**Pattern: Module Registration**
```
Tasks like:
- [ ] Import SharedUtilsModule in app.module.ts
- [ ] Import ValidationModule in app.module.ts
- [ ] Import HttpClientModule in app.module.ts

Batchable: YES
Risk: LOW
Validation: TypeScript compile
Time: 10 min batch vs 20 min individual (2x faster!)
```

**Pattern: Code Deletion**
```
Tasks like:
- [ ] Delete src/old-audit.service.ts
- [ ] Remove OldAuditModule from imports
- [ ] Delete src/old-cache.service.ts

Batchable: YES
Risk: LOW (tests will catch issues)
Validation: Build + test suite
Time: 15 min batch vs 30 min individual (2x faster!)
```

**Pattern: Business Logic (NOT batchable)**
```
Tasks like:
- [ ] Add circuit breaker fallback for WIS API
- [ ] Implement 3-tier caching for user data
- [ ] Add audit logging for theme updates

Batchable: NO
Risk: MEDIUM-HIGH (logic varies per case)
Validation: Per-task testing
Time: Execute individually with full rigor
```

**Detection Algorithm:**

```bash
# For each task, check if it matches a known pattern
for task in tasks; do
  case "$task" in
    *"Add @"*"to package.json"*)
      pattern="package_install"
      batchable=true
      ;;
    *"Import"*"Module in app.module"*)
      pattern="module_registration"
      batchable=true
      ;;
    *"Delete"*|*"Remove"*)
      pattern="code_deletion"
      batchable=true
      ;;
    *"circuit breaker"*|*"fallback"*|*"caching for"*)
      pattern="business_logic"
      batchable=false
      ;;
    *)
      pattern="custom"
      batchable=false  # Default to safe
      ;;
  esac
done
```

**Generate Batching Plan:**

```markdown
## Smart Batching Analysis

**Detected Patterns:**

### ✅ Batchable Patterns (Execute Together)
1. **Package Installation** (5 tasks)
   - Add @dealer/audit-logging
   - Add @dealer/http-client
   - Add @dealer/caching
   - Add @dealer/circuit-breaker
   - Run pnpm install

   Validation: Build succeeds
   Time: 5 min (vs 10 min individual)
   Risk: LOW

2. **Module Registration** (5 tasks)
   - Import 5 modules
   - Register in app.module
   - Configure each

   Validation: TypeScript compile
   Time: 10 min (vs 20 min individual)
   Risk: LOW

### ⚠️ Individual Execution Required
3. **Circuit Breaker Logic** (3 tasks)
   - WIS API fallback strategy
   - i18n client fallback
   - Cache fallback

   Reason: Fallback logic varies per API
   Time: 60 min (cannot batch)
   Risk: MEDIUM

**Total Estimated Time:**
- With smart batching: ~2.5 hours
- Without batching: ~5.5 hours
- Savings: 3 hours (54% faster!)

**Safety:**
- Batchable tasks: Validated as a group
- Individual tasks: Full rigor maintained
- No vibe coding: All validation gates enforced
```

### 7. Handle Approval (Interactive Mode Only)

**Interactive Mode:**

Display gap analysis report with conditional batching menu.

**CRITICAL DECISION LOGIC:**
- If `batchable_count > 0 AND time_saved > 0`: Show batching options
- If `batchable_count = 0 OR time_saved = 0`: Skip batching options (no benefit)

**When Batching Has Benefit (time_saved > 0):**

```
Gap Analysis Complete + Smart Batching Plan

Task Analysis:
- {done_count} tasks already complete (will check)
- {unclear_count} tasks refined to {refined_count} specific tasks
- {missing_count} new tasks added
- {needed_count} tasks ready for implementation

Smart Batching Detected:
- {batchable_count} tasks can be batched into {batch_count} pattern groups
- {individual_count} tasks require individual execution
- Estimated time savings: {time_saved} hours

Total work: {work_count} tasks
Estimated time: {estimated_hours} hours (with batching)

[A] Accept changes and batching plan
[B] Accept but disable batching (slower, safer)
[E] Edit tasks manually
[H] Halt pipeline
```

**When Batching Has NO Benefit (time_saved = 0):**

```
Gap Analysis Complete

Task Analysis:
- {done_count} tasks already complete (will check)
- {unclear_count} tasks refined to {refined_count} specific tasks
- {missing_count} new tasks added
- {needed_count} tasks ready for implementation

Smart Batching Analysis:
- Batchable patterns detected: 0
- Tasks requiring individual execution: {work_count}
- Estimated time savings: none (tasks require individual attention)

Total work: {work_count} tasks
Estimated time: {estimated_hours} hours

[A] Accept changes
[E] Edit tasks manually
[H] Halt pipeline
```

**Why Skip Batching Option When Benefit = 0:**
- Reduces decision fatigue
- Prevents pointless "batch vs no-batch" choice when outcome is identical
- Cleaner UX when batching isn't applicable

**Batch Mode:** Auto-accept changes (batching plan applied only if benefit > 0)

### 8. Update Story File with Batching Plan (Conditional)

**ONLY add batching plan if `time_saved > 0`.**

If batching has benefit (time_saved > 0), add batching plan to story file:

```markdown
## Smart Batching Plan

**Pattern Groups Detected:**

### Batch 1: Package Installation (5 tasks, 5 min)
- [ ] Add @company/shared-utils to package.json
- [ ] Add @company/validation to package.json
- [ ] Add @company/http-client to package.json
- [ ] Add @company/database-client to package.json
- [ ] Run npm install

**Validation:** Build succeeds

### Batch 2: Module Registration (5 tasks, 10 min)
{list tasks}

### Individual Tasks: Business Logic (15 tasks, 90 min)
{list tasks that can't be batched}

**Time Estimate:**
- With batching: {batched_time} hours
- Without batching: {individual_time} hours
- Savings: {savings} hours
```

If batching has NO benefit (time_saved = 0), **skip this section entirely** and just add gap analysis results.

### 9. Update Pipeline State

Update state file:
- Add `2` to `stepsCompleted`
- Set `lastStep: 2`
- Set `steps.step-02-pre-gap-analysis.status: completed`
- Record gap analysis results:
  ```yaml
  gap_analysis:
    development_type: "{mode}"
    tasks_ready: {count}
    tasks_partial: {count}
    tasks_done: {count}
    tasks_refined: {count}
    tasks_added: {count}

  smart_batching:
    enabled: {true if time_saved > 0, false otherwise}
    patterns_detected: {count}
    batchable_tasks: {count}
    individual_tasks: {count}
    estimated_time_with_batching: {hours}
    estimated_time_without_batching: {hours}
    estimated_savings: {hours}
  ```

**Note:** `smart_batching.enabled` is set to `false` when batching has no benefit, preventing unnecessary batching plan generation.

### 10. Present Summary (Conditional Format)

**When Batching Has Benefit (time_saved > 0):**

```
Pre-Gap Analysis Complete + Smart Batching Plan

Development Type: {greenfield|brownfield|hybrid}
Work Remaining: {work_count} tasks

Codebase Status:
- Existing implementations reviewed: {existing_count}
- New implementations needed: {new_count}

Smart Batching Analysis:
- Batchable patterns detected: {batch_count}
- Tasks that can be batched: {batchable_count} ({percent}%)
- Tasks requiring individual execution: {individual_count}

Time Estimate:
- With smart batching: {batched_time} hours ⚡
- Without batching: {individual_time} hours
- Time savings: {savings} hours ({savings_percent}% faster!)

Ready for Implementation
```

**When Batching Has NO Benefit (time_saved = 0):**

```
Pre-Gap Analysis Complete

Development Type: {greenfield|brownfield|hybrid}
Work Remaining: {work_count} tasks

Codebase Status:
- Existing implementations reviewed: {existing_count}
- New implementations needed: {new_count}

Smart Batching Analysis:
- Batchable patterns detected: 0
- Tasks requiring individual execution: {work_count}
- Estimated time: {estimated_hours} hours

Ready for Implementation
```

**Interactive Mode Menu:**
```
[C] Continue to Implementation
[R] Re-run gap analysis
[H] Halt pipeline
```

**Batch Mode:** Auto-continue

## QUALITY GATE

Before proceeding:
- [ ] All tasks analyzed against codebase
- [ ] Vague tasks refined to specific actions
- [ ] Already-done tasks checked
- [ ] Missing tasks added
- [ ] Gap analysis section added to story
- [ ] Story file updated with refinements

## CRITICAL STEP COMPLETION

**ONLY WHEN** [all tasks analyzed AND story file updated],
load and execute `{nextStepFile}` for implementation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Every task analyzed against codebase
- Vague tasks made specific
- Missing work identified and added
- Already-done work verified
- Gap analysis documented

### ❌ FAILURE
- Skipping codebase scan
- Accepting vague tasks ("Add feature X")
- Not checking for existing implementations
- Missing obvious gaps
- No refinement of unclear tasks

## WHY THIS STEP PREVENTS VIBE CODING

Pre-gap analysis forces Claude to:
1. **Understand existing code** before implementing
2. **Be specific** about what to build
3. **Verify assumptions** against reality
4. **Plan work properly** instead of guessing

This is especially critical for **brownfield** where vibe coding causes:
- Breaking existing functionality
- Duplicating existing code
- Missing integration points
- Ignoring established patterns
---
name: 'step-03-write-tests'
description: 'Write comprehensive tests BEFORE implementation (TDD approach)'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-03-write-tests.md'
stateFile: '{state_file}'
storyFile: '{story_file}'

# Next step
nextStep: '{workflow_path}/steps/step-04-implement.md'
---

# Step 3: Write Tests (TDD Approach)

**Goal:** Write comprehensive tests that validate story acceptance criteria BEFORE writing implementation code.

## Why Test-First?

1. **Clear requirements**: Writing tests forces clarity about what "done" means
2. **Better design**: TDD leads to more testable, modular code
3. **Confidence**: Know immediately when implementation is complete
4. **Regression safety**: Tests catch future breakage

## Principles

- **Test acceptance criteria**: Each AC should have corresponding tests
- **Test behavior, not implementation**: Focus on what, not how
- **Red-Green-Refactor**: Tests should fail initially (red), then pass when implemented (green)
- **Comprehensive coverage**: Unit tests, integration tests, and E2E tests as needed

---

## Process

### 1. Analyze Story Requirements

```
Read {storyFile} completely.

Extract:
- All Acceptance Criteria
- All Tasks and Subtasks
- All Files in File List
- Definition of Done requirements
```

### 2. Determine Test Strategy

For each acceptance criterion, determine:
```
Testing Level:
- Unit tests: For individual functions/components
- Integration tests: For component interactions
- E2E tests: For full user workflows

Test Framework:
- Jest (JavaScript/TypeScript)
- PyTest (Python)
- xUnit (C#/.NET)
- JUnit (Java)
- Etc. based on project stack
```

### 3. Write Test Stubs

Create test files FIRST (before implementation):

```bash
Example for React component:
__tests__/components/UserDashboard.test.tsx

Example for API endpoint:
__tests__/api/users.test.ts

Example for service:
__tests__/services/auth.test.ts
```

### 4. Write Test Cases

For each acceptance criterion:

```typescript
// Example: React component test
describe('UserDashboard', () => {
  describe('AC1: Display user profile information', () => {
    it('should render user name', () => {
      render(<UserDashboard user={mockUser} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user email', () => {
      render(<UserDashboard user={mockUser} />);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should render user avatar', () => {
      render(<UserDashboard user={mockUser} />);
      expect(screen.getByAltText('User avatar')).toBeInTheDocument();
    });
  });

  describe('AC2: Allow user to edit profile', () => {
    it('should show edit button when not in edit mode', () => {
      render(<UserDashboard user={mockUser} />);
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('should enable edit mode when edit button clicked', () => {
      render(<UserDashboard user={mockUser} />);
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    });

    it('should save changes when save button clicked', async () => {
      const onSave = vi.fn();
      render(<UserDashboard user={mockUser} onSave={onSave} />);

      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
      fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
        target: { value: 'Jane Doe' }
      });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith({ ...mockUser, name: 'Jane Doe' });
      });
    });
  });
});
```

### 5. Verify Tests Fail (Red Phase)

```bash
# Run tests - they SHOULD fail because implementation doesn't exist yet
npm test

# Expected output:
# ❌ FAIL  __tests__/components/UserDashboard.test.tsx
#   UserDashboard
#     AC1: Display user profile information
#       ✕ should render user name (5ms)
#       ✕ should render user email (3ms)
#       ✕ should render user avatar (2ms)
#
# This is GOOD! Tests failing = requirements are clear
```

**If tests pass unexpectedly:**
```
⚠️ WARNING: Some tests are passing before implementation!

This means either:
1. Functionality already exists (brownfield - verify and document)
2. Tests are not actually testing the new requirements
3. Tests have mocking issues (testing mocks instead of real code)

Review and fix before proceeding.
```

### 6. Document Test Coverage

Create test coverage report:
```yaml
Test Coverage Summary:
  Acceptance Criteria: {total_ac_count}
  Acceptance Criteria with Tests: {tested_ac_count}
  Coverage: {coverage_percentage}%

  Tasks: {total_task_count}
  Tasks with Tests: {tested_task_count}
  Coverage: {task_coverage_percentage}%

Test Files Created:
  - {test_file_1}
  - {test_file_2}
  - {test_file_3}

Total Test Cases: {test_case_count}
```

### 7. Commit Tests

```bash
git add {test_files}
git commit -m "test(story-{story_id}): add tests for {story_title}

Write comprehensive tests for all acceptance criteria:
{list_of_acs}

Test coverage:
- {tested_ac_count}/{total_ac_count} ACs covered
- {test_case_count} test cases
- Unit tests: {unit_test_count}
- Integration tests: {integration_test_count}
- E2E tests: {e2e_test_count}

Tests currently failing (red phase) - expected behavior.
Will implement functionality in next step."
```

### 8. Update State

```yaml
# Update {stateFile}
current_step: 3
tests_written: true
test_files: [{test_file_list}]
test_coverage: {coverage_percentage}%
tests_status: "failing (red phase - expected)"
ready_for_implementation: true
```

---

## Quality Checks

Before proceeding to implementation:

✅ **All acceptance criteria have corresponding tests**
✅ **Tests are comprehensive (happy path + edge cases + error cases)**
✅ **Tests follow project testing conventions**
✅ **Tests are isolated and don't depend on each other**
✅ **Tests have clear, descriptive names**
✅ **Mock data is realistic and well-organized**
✅ **Tests are failing for the right reasons (not implemented yet)**

---

## Skip Conditions

This step can be skipped if:
- Complexity level = "micro" AND tasks ≤ 2
- Story is documentation-only (no code changes)
- Story is pure refactoring with existing comprehensive tests

---

## Next Step

Proceed to **Step 4: Implement** ({nextStep})

Now that tests are written and failing (red phase), implement the functionality to make them pass (green phase).
---
name: 'step-04-implement'
description: 'HOSPITAL-GRADE implementation - safety-critical code with comprehensive testing'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-04-implement.md'
nextStepFile: '{workflow_path}/steps/step-05-post-validation.md'

# Role Continue
role: dev
---

# Step 4: Implement Story (Hospital-Grade Quality)

## ROLE CONTINUATION

**Continuing as DEV (Developer) perspective.**

You are now implementing the story tasks with adaptive methodology based on development type.

## STEP GOAL

Implement all unchecked tasks using appropriate methodology:
1. **Greenfield**: TDD approach (write tests first, then implement)
2. **Brownfield**: Refactor approach (understand existing, modify carefully)
3. **Hybrid**: Mix both approaches as appropriate per task

## ⚕️ HOSPITAL-GRADE CODE STANDARDS ⚕️

**CRITICAL: Lives May Depend on This Code**

This code may be used in healthcare/safety-critical environments.
Every line must meet hospital-grade reliability standards.

### Safety-Critical Quality Requirements:

✅ **CORRECTNESS OVER SPEED**
   - Take 5 hours to do it right, not 1 hour to do it poorly
   - Double-check ALL logic, especially edge cases
   - ZERO tolerance for shortcuts or "good enough"

✅ **DEFENSIVE PROGRAMMING**
   - Validate ALL inputs (never trust external data)
   - Handle ALL error cases explicitly
   - Fail safely (graceful degradation, never silent failures)

✅ **COMPREHENSIVE TESTING**
   - Test happy path AND all edge cases
   - Test error handling (what happens when things fail?)
   - Test boundary conditions (min/max values, empty/null)

✅ **CODE CLARITY**
   - Prefer readability over cleverness
   - Comment WHY, not what (code shows what, comments explain why)
   - No magic numbers (use named constants)

✅ **ROBUST ERROR HANDLING**
   - Never swallow errors silently
   - Log errors with context (what, when, why)
   - Provide actionable error messages

⚠️ **WHEN IN DOUBT: ASK, DON'T GUESS**
   If you're uncertain about a requirement, HALT and ask for clarification.
   Guessing in safety-critical code is UNACCEPTABLE.

---

## MANDATORY EXECUTION RULES

### Implementation Principles

- **DEFAULT: ONE TASK AT A TIME** - Execute tasks individually unless smart batching applies
- **SMART BATCHING EXCEPTION** - Low-risk patterns (package installs, imports) may batch
- **RUN TESTS FREQUENTLY** - After each task or batch completion
- **FOLLOW PROJECT PATTERNS** - Never invent new patterns
- **NO VIBE CODING** - Follow the sequence exactly
- **VERIFY BEFORE PROCEEDING** - Confirm success before next task/batch

### Adaptive Methodology

**For Greenfield tasks (new files):**
1. Write test first (if applicable)
2. Implement minimal code to pass
3. Verify test passes
4. Move to next task

**For Brownfield tasks (existing files):**
1. Read and understand existing code
2. Write test for new behavior (if applicable)
3. Modify existing code carefully
4. Verify all tests pass (old and new)
5. Move to next task

## EXECUTION SEQUENCE

### 1. Review Refined Tasks

Load story file and get all unchecked tasks (from pre-gap analysis).

Display:
```
Implementation Plan

Total tasks: {unchecked_count}

Development breakdown:
- Greenfield tasks: {new_file_tasks}
- Brownfield tasks: {existing_file_tasks}
- Test tasks: {test_tasks}
- Database tasks: {db_tasks}

Starting implementation loop...
```

### 2. Load Smart Batching Plan

Load batching plan from story file (created in Step 2):

Extract:
- Pattern batches (groups of similar tasks)
- Individual tasks (require one-by-one execution)
- Validation strategy per batch
- Time estimates

### 3. Implementation Strategy Selection

**If smart batching plan exists:**
```
Smart Batching Enabled

Execution Plan:
- {batch_count} pattern batches (execute together)
- {individual_count} individual tasks (execute separately)

Proceeding with pattern-based execution...
```

**If no batching plan:**
```
Standard Execution (One-at-a-Time)

All tasks will be executed individually with full rigor.
```

### 4. Pattern Batch Execution (NEW!)

**For EACH pattern batch (if batching enabled):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Batch {n}/{total_batches}: {pattern_name}
Tasks in batch: {task_count}
Type: {pattern_type}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**A. Display Batch Tasks:**
```
Executing together:
1. {task_1}
2. {task_2}
3. {task_3}
...

Validation strategy: {validation_strategy}
Estimated time: {estimated_minutes} minutes
```

**B. Execute All Tasks in Batch:**

**Example: Package Installation Batch**
```bash
# Execute all package installations together
npm pkg set dependencies.@company/shared-utils="^1.0.0"
npm pkg set dependencies.@company/validation="^2.0.0"
npm pkg set dependencies.@company/http-client="^1.5.0"
npm pkg set dependencies.@company/database-client="^3.0.0"

# Single install command
npm install
```

**Example: Module Registration Batch**
```typescript
// Add all imports at once
import { SharedUtilsModule } from '@company/shared-utils';
import { ValidationModule } from '@company/validation';
import { HttpClientModule } from '@company/http-client';
import { DatabaseModule } from '@company/database-client';

// Register all modules together
@Module({
  imports: [
    SharedUtilsModule.forRoot(),
    ValidationModule.forRoot(validationConfig),
    HttpClientModule.forRoot(httpConfig),
    DatabaseModule.forRoot(dbConfig),
    // ... existing imports
  ]
})
```

**C. Validate Entire Batch:**

Run validation strategy for this pattern:
```bash
# For package installs
npm run build

# For module registrations
tsc --noEmit

# For code deletions
npm test -- --run && npm run lint
```

**D. If Validation Succeeds:**
```
✅ Batch Complete

All {task_count} tasks in batch executed successfully!

Marking all tasks complete:
- [x] {task_1}
- [x] {task_2}
- [x] {task_3}
...

Time: {actual_time} minutes
```

**E. If Validation Fails:**
```
❌ Batch Validation Failed

Error: {error_message}

Falling back to one-at-a-time execution for this batch...
```

**Fallback to individual execution:**
- Execute each task in the failed batch one-by-one
- Identify which task caused the failure
- Fix and continue

### 5. Individual Task Execution

**For EACH individual task (non-batchable):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task {n}/{total}: {task_description}
Type: {greenfield|brownfield}
Reason: {why_not_batchable}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**A. Identify File(s) Affected:**
- New file to create?
- Existing file to modify?
- Test file to add/update?
- Migration file to create?

**B. For NEW FILES (Greenfield):**

```
1. Determine file path and structure
2. Identify dependencies needed
3. Write test first (if applicable):
   - Create test file
   - Write failing test
   - Run test, confirm RED

4. Implement code:
   - Create file
   - Add minimal implementation
   - Follow project patterns from project-context.md

5. Run test:
   npm test -- --run
   Confirm GREEN

6. Verify:
   - File created
   - Exports correct
   - Test passes
```

**C. For EXISTING FILES (Brownfield):**

```
1. Read existing file completely
2. Understand current implementation
3. Identify where to make changes
4. Check if tests exist for this file

5. Add test for new behavior (if applicable):
   - Find or create test file
   - Add test for new/changed behavior
   - Run test, may fail or pass depending on change

6. Modify existing code:
   - Make minimal changes
   - Preserve existing functionality
   - Follow established patterns in the file
   - Don't refactor unrelated code

7. Run ALL tests (not just new ones):
   npm test -- --run
   Confirm all tests pass

8. Verify:
   - Changes made as planned
   - No regressions (all old tests pass)
   - New behavior works (new tests pass)
```

**D. For DATABASE TASKS:**

```
1. Create migration file:
   npx supabase migration new {description}

2. Write migration SQL:
   - Create/alter tables
   - Add RLS policies
   - Add indexes

3. Apply migration:
   npx supabase db push

4. Verify schema:
   mcp__supabase__list_tables
   Confirm changes applied

5. Generate types:
   npx supabase gen types typescript --local
```

**E. For TEST TASKS:**

```
1. Identify what to test
2. Find or create test file
3. Write test with clear assertions
4. Run test:
   npm test -- --run --grep "{test_name}"

5. Verify test is meaningful (not placeholder)
```

**F. Check Task Complete:**

After implementing task, verify:
- [ ] Code exists where expected
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] Follows project patterns

**Mark task complete in story file:**
```markdown
- [x] {task_description}
```

**Update state file with progress.**

### 3. Handle Errors Gracefully

**If implementation fails:**

```
⚠️ Task failed: {task_description}

Error: {error_message}

Options:
1. Debug and retry
2. Skip and document blocker
3. Simplify approach

DO NOT vibe code or guess!
Follow error systematically.
```

### 4. Run Full Test Suite

After ALL tasks completed:

```bash
npm test -- --run
npm run lint
npm run build
```

**All must pass before proceeding.**

### 5. Verify Task Completion

Re-read story file and count:
- Tasks completed this session: {count}
- Tasks remaining: {should be 0}
- All checked: {should be true}

### 6. Update Pipeline State

Update state file:
- Add `3` to `stepsCompleted`
- Set `lastStep: 3`
- Set `steps.step-03-implement.status: completed`
- Record:
  ```yaml
  implementation:
    files_created: {count}
    files_modified: {count}
    migrations_applied: {count}
    tests_added: {count}
    tasks_completed: {count}
  ```

### 7. Display Summary

```
Implementation Complete

Tasks Completed: {completed_count}

Files:
- Created: {created_files}
- Modified: {modified_files}

Migrations:
- {migration_1}
- {migration_2}

Tests:
- All passing: {pass_count}/{total_count}
- New tests added: {new_test_count}

Build Status:
- Lint: ✓ Clean
- TypeScript: ✓ No errors
- Build: ✓ Success

Ready for Post-Validation
```

**Interactive Mode Menu:**
```
[C] Continue to Post-Validation
[T] Run tests again
[B] Run build again
[H] Halt pipeline
```

**Batch Mode:** Auto-continue

## QUALITY GATE

Before proceeding:
- [ ] All unchecked tasks completed
- [ ] All tests pass
- [ ] Lint clean
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Followed project patterns
- [ ] **No vibe coding occurred**

## CRITICAL STEP COMPLETION

**ONLY WHEN** [all tasks complete AND all tests pass AND lint clean AND build succeeds],
load and execute `{nextStepFile}` for post-validation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- All tasks implemented one at a time
- Tests pass for each task
- Brownfield code modified carefully
- No regressions introduced
- Project patterns followed
- Build and lint clean
- **Disciplined execution maintained**

### ❌ FAILURE
- Vibe coding (guessing implementation)
- Batching multiple tasks
- Not running tests per task
- Breaking existing functionality
- Inventing new patterns
- Skipping verification
- **Deviating from step sequence**

## ANTI-VIBE-CODING ENFORCEMENT

This step enforces discipline by:

1. **One task at a time** - Can't batch or optimize
2. **Test after each task** - Immediate verification
3. **Follow existing patterns** - No invention
4. **Brownfield awareness** - Read existing code first
5. **Frequent verification** - Run tests, lint, build

**Even at 200K tokens, you MUST:**
- ✅ Implement ONE task
- ✅ Run tests
- ✅ Verify it works
- ✅ Mark task complete
- ✅ Move to next task

**NO shortcuts. NO optimization. NO vibe coding.**
---
name: 'step-04-post-validation'
description: 'Verify completed tasks against codebase reality (catch false positives)'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-04-post-validation.md'
nextStepFile: '{workflow_path}/steps/step-05-code-review.md'
prevStepFile: '{workflow_path}/steps/step-03-implement.md'

# Role Switch
role: dev
requires_fresh_context: false  # Continue from implementation context
---

# Step 5b: Post-Implementation Validation

## ROLE CONTINUATION - VERIFICATION MODE

**Continuing as DEV but switching to VERIFICATION mindset.**

You are now verifying that completed work actually exists in the codebase.
This catches the common problem of tasks marked [x] but implementation is incomplete.

## STEP GOAL

Verify all completed tasks against codebase reality:
1. Re-read story file and extract completed tasks
2. For each completed task, identify what should exist
3. Use codebase search tools to verify existence
4. Run tests to verify they actually pass
5. Identify false positives (marked done but not actually done)
6. If gaps found, uncheck tasks and add missing work
7. Re-run implementation if needed

## MANDATORY EXECUTION RULES

### Verification Principles

- **TRUST NOTHING** - Verify every completed task
- **CHECK EXISTENCE** - Files, functions, components must exist
- **CHECK COMPLETENESS** - Not just existence, but full implementation
- **TEST VERIFICATION** - Claimed test coverage must be real
- **NO ASSUMPTIONS** - Re-scan the codebase with fresh eyes

### What to Verify

For each task marked [x]:
- Files mentioned exist at correct paths
- Functions/components declared and exported
- Tests exist and actually pass
- Database migrations applied
- API endpoints respond correctly

## EXECUTION SEQUENCE

### 1. Load Story and Extract Completed Tasks

Load story file: `{story_file}`

Extract all tasks from story that are marked [x]:
```regex
- \[x\] (.+)
```

Build list of `completed_tasks` to verify.

### 2. Categorize Tasks by Type

For each completed task, determine what needs verification:

**File Creation Tasks:**
- Pattern: "Create {file_path}"
- Verify: File exists at path

**Component/Function Tasks:**
- Pattern: "Add {name} function/component"
- Verify: Symbol exists and is exported

**Test Tasks:**
- Pattern: "Add test for {feature}"
- Verify: Test file exists and test passes

**Database Tasks:**
- Pattern: "Add {table} table", "Create migration"
- Verify: Migration file exists, schema matches

**API Tasks:**
- Pattern: "Create {endpoint} endpoint"
- Verify: Route file exists, handler implemented

**UI Tasks:**
- Pattern: "Add {element} to UI"
- Verify: Component has data-testid attribute

### 3. Verify File Existence

For all file-related tasks:

```bash
# Use Glob to find files
glob: "**/{mentioned_filename}"
```

**Check:**
- [ ] File exists
- [ ] File is not empty
- [ ] File has expected exports

**False Positive Indicators:**
- File doesn't exist
- File exists but is empty
- File exists but missing expected symbols

### 4. Verify Function/Component Implementation

For code implementation tasks:

```bash
# Use Grep to find symbols
grep: "{function_name|component_name}"
  glob: "**/*.{ts,tsx}"
  output_mode: "content"
```

**Check:**
- [ ] Symbol is declared
- [ ] Symbol is exported
- [ ] Implementation is not a stub/placeholder
- [ ] Required logic is present

**False Positive Indicators:**
- Symbol not found
- Symbol exists but marked TODO
- Symbol exists but throws "Not implemented"
- Symbol exists but returns empty/null

### 5. Verify Test Coverage

For all test-related tasks:

```bash
# Find test files
glob: "**/*.test.{ts,tsx}"
glob: "**/*.spec.{ts,tsx}"

# Run specific tests
npm test -- --run --grep "{feature_name}"
```

**Check:**
- [ ] Test file exists
- [ ] Test describes the feature
- [ ] Test actually runs (not skipped)
- [ ] Test passes (GREEN)

**False Positive Indicators:**
- No test file found
- Test exists but skipped (it.skip)
- Test exists but fails
- Test exists but doesn't test the feature (placeholder)

### 6. Verify Database Changes

For database migration tasks:

```bash
# Find migration files
glob: "**/migrations/*.sql"

# Check Supabase schema
mcp__supabase__list_tables
```

**Check:**
- [ ] Migration file exists
- [ ] Migration has been applied
- [ ] Table/column exists in schema
- [ ] RLS policies are present

**False Positive Indicators:**
- Migration file missing
- Migration not applied to database
- Table/column doesn't exist
- RLS policies missing

### 7. Verify API Endpoints

For API endpoint tasks:

```bash
# Find route files
glob: "**/app/api/**/{endpoint}/route.ts"
grep: "export async function {METHOD}"
```

**Check:**
- [ ] Route file exists
- [ ] Handler function implemented
- [ ] Returns proper Response type
- [ ] Error handling present

**False Positive Indicators:**
- Route file doesn't exist
- Handler throws "Not implemented"
- Handler returns stub response

### 8. Run Full Verification

Execute verification for ALL completed tasks:

```typescript
interface VerificationResult {
  task: string;
  status: "verified" | "false_positive";
  evidence: string;
  missing?: string;
}

const results: VerificationResult[] = [];

for (const task of completed_tasks) {
  const result = await verifyTask(task);
  results.push(result);
}
```

### 9. Analyze Verification Results

Count results:
```
Total Verified: {verified_count}
False Positives: {false_positive_count}
```

### 10. Handle False Positives

**IF false positives found (count > 0):**

Display:
```
⚠️ POST-IMPLEMENTATION GAPS DETECTED

Tasks marked complete but implementation incomplete:

{for each false_positive}
- [ ] {task_description}
  Missing: {what_is_missing}
  Evidence: {grep/glob results}

{add new tasks for missing work}
- [ ] Actually implement {missing_part}
```

**Actions:**
1. Uncheck false positive tasks in story file
2. Add new tasks for the missing work
3. Update "Gap Analysis" section in story
4. Set state to re-run implementation

**Re-run implementation:**
```
Detected {false_positive_count} incomplete tasks.
Re-running Step 5: Implementation to complete missing work...

{load and execute step-05-implement.md}
```

After re-implementation, **RE-RUN THIS STEP** (step-05b-post-validation.md)

### 11. Handle Verified Success

**IF no false positives (all verified):**

Display:
```
✅ POST-IMPLEMENTATION VALIDATION PASSED

All {verified_count} completed tasks verified against codebase:
- Files exist and are complete
- Functions/components implemented
- Tests exist and pass
- Database changes applied
- API endpoints functional

Ready for Code Review
```

Update story file "Gap Analysis" section:
```markdown
## Gap Analysis

### Post-Implementation Validation
- **Date:** {timestamp}
- **Tasks Verified:** {verified_count}
- **False Positives:** 0
- **Status:** ✅ All work verified complete

**Verification Evidence:**
{for each verified task}
- ✅ {task}: {evidence}
```

### 12. Update Pipeline State

Update state file:
- Add `5b` to `stepsCompleted`
- Set `lastStep: 5b`
- Set `steps.step-05b-post-validation.status: completed`
- Record verification results:
  ```yaml
  verification:
    tasks_verified: {count}
    false_positives: {count}
    re_implementation_required: {true|false}
  ```

### 13. Present Summary and Menu

Display:
```
Post-Implementation Validation Complete

Verification Summary:
- Tasks Checked: {total_count}
- Verified Complete: {verified_count}
- False Positives: {false_positive_count}
- Re-implementations: {retry_count}

{if false_positives}
Re-running implementation to complete missing work...
{else}
All work verified. Proceeding to Code Review...
{endif}
```

**Interactive Mode Menu (only if no false positives):**
```
[C] Continue to {next step based on complexity: Code Review | Complete}
[V] Run verification again
[T] Run tests again
[H] Halt pipeline
```

{if micro complexity: "⏭️ Code Review will be skipped (lightweight path)"}

**Batch Mode:**
- Auto re-run implementation if false positives
- Auto-continue if all verified

## QUALITY GATE

Before proceeding to code review:
- [ ] All completed tasks verified against codebase
- [ ] Zero false positives remaining
- [ ] All tests still passing
- [ ] Build still succeeds
- [ ] Gap analysis updated with verification results

## VERIFICATION TOOLS

Use these tools for verification:

```typescript
// File existence
glob("{pattern}")

// Symbol search
grep("{symbol_name}", { glob: "**/*.{ts,tsx}", output_mode: "content" })

// Test execution
bash("npm test -- --run --grep '{test_name}'")

// Database check
mcp__supabase__list_tables()

// Read file contents
read("{file_path}")
```

## CRITICAL STEP COMPLETION

**IF** [false positives detected],
load and execute `{prevStepFile}` to complete missing work,
then RE-RUN this step.

**ONLY WHEN** [all tasks verified AND zero false positives]:

**Determine next step based on complexity routing:**

```
If 5 in skip_steps (micro complexity):
  nextStepFile = '{workflow_path}/steps/step-06-complete.md'
  Display: "⏭️ Skipping Code Review (micro complexity) → Proceeding to Complete"
Else:
  nextStepFile = '{workflow_path}/steps/step-05-code-review.md'
```

Load and execute `{nextStepFile}`.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- All completed tasks verified against codebase
- No false positives (or all re-implemented)
- Tests still passing
- Evidence documented for each task
- Gap analysis updated

### ❌ FAILURE
- Skipping verification ("trust the marks")
- Not checking actual code existence
- Not running tests to verify claims
- Allowing false positives to proceed
- Not documenting verification evidence

## COMMON FALSE POSITIVE PATTERNS

Watch for these common issues:

1. **Stub Implementations**
   - Function exists but returns `null`
   - Function throws "Not implemented"
   - Component returns empty div

2. **Placeholder Tests**
   - Test exists but skipped (it.skip)
   - Test doesn't actually test the feature
   - Test always passes (no assertions)

3. **Incomplete Files**
   - File created but empty
   - Missing required exports
   - TODO comments everywhere

4. **Database Drift**
   - Migration file exists but not applied
   - Schema doesn't match migration
   - RLS policies missing

5. **API Stubs**
   - Route exists but returns 501
   - Handler not implemented
   - No error handling

This step is the **safety net** that catches incomplete work before code review.
---
name: 'step-06-run-quality-checks'
description: 'Run tests, type checks, and linter - fix all problems before code review'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-06-run-quality-checks.md'
stateFile: '{state_file}'
storyFile: '{story_file}'

# Next step
nextStep: '{workflow_path}/steps/step-07-code-review.md'
---

# Step 6: Run Quality Checks

**Goal:** Verify implementation quality through automated checks: tests, type checking, and linting. Fix ALL problems before proceeding to human/AI code review.

## Why Automate First?

1. **Fast feedback**: Automated checks run in seconds
2. **Catch obvious issues**: Type errors, lint violations, failing tests
3. **Save review time**: Don't waste code review time on mechanical issues
4. **Enforce standards**: Consistent code style and quality

## Principles

- **Zero tolerance**: ALL checks must pass
- **Fix, don't skip**: If a check fails, fix it - don't disable the check
- **Iterate quickly**: Run-fix-run loop until all green
- **Document workarounds**: If you must suppress a check, document why

---

## Process

### 1. Run Test Suite

```bash
echo "📋 Running test suite..."

# Run all tests
npm test

# Or for other stacks:
# pytest
# dotnet test
# mvn test
# cargo test
```

**Expected output:**
```
✅ PASS  __tests__/components/UserDashboard.test.tsx
  UserDashboard
    AC1: Display user profile information
      ✓ should render user name (12ms)
      ✓ should render user email (8ms)
      ✓ should render user avatar (6ms)
    AC2: Allow user to edit profile
      ✓ should show edit button when not in edit mode (10ms)
      ✓ should enable edit mode when edit button clicked (15ms)
      ✓ should save changes when save button clicked (22ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Time:        2.134s
```

**If tests fail:**
```
❌ Test failures detected!

Failed tests:
  - UserDashboard › AC2 › should save changes when save button clicked
    Expected: { name: 'Jane Doe', email: 'john@example.com' }
    Received: undefined

Action required:
1. Analyze the failure
2. Fix the implementation
3. Re-run tests
4. Repeat until all tests pass

DO NOT PROCEED until all tests pass.
```

### 2. Check Test Coverage

```bash
echo "📊 Checking test coverage..."

# Generate coverage report
npm run test:coverage

# Or for other stacks:
# pytest --cov
# dotnet test /p:CollectCoverage=true
# cargo tarpaulin
```

**Minimum coverage thresholds:**
```yaml
Line Coverage: ≥80%
Branch Coverage: ≥75%
Function Coverage: ≥80%
Statement Coverage: ≥80%
```

**If coverage is low:**
```
⚠️ Test coverage below threshold!

Current coverage:
  Lines: 72% (threshold: 80%)
  Branches: 68% (threshold: 75%)
  Functions: 85% (threshold: 80%)

Uncovered areas:
  - src/components/UserDashboard.tsx: lines 45-52 (error handling)
  - src/services/userService.ts: lines 23-28 (edge case)

Action required:
1. Add tests for uncovered code paths
2. Re-run coverage check
3. Achieve ≥80% coverage before proceeding
```

### 3. Run Type Checker

```bash
echo "🔍 Running type checker..."

# For TypeScript
npx tsc --noEmit

# For Python
# mypy src/

# For C#
# dotnet build

# For Java
# mvn compile
```

**Expected output:**
```
✅ No type errors found
```

**If type errors found:**
```
❌ Type errors detected!

src/components/UserDashboard.tsx:45:12 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.

45     onSave(user.name);
              ~~~~~~~~~

src/services/userService.ts:23:18 - error TS2339: Property 'id' does not exist on type 'User'.

23     return user.id;
                   ~~

Found 2 errors in 2 files.

Action required:
1. Fix type errors
2. Re-run type checker
3. Repeat until zero errors

DO NOT PROCEED with type errors.
```

### 4. Run Linter

```bash
echo "✨ Running linter..."

# For JavaScript/TypeScript
npm run lint

# For Python
# pylint src/

# For C#
# dotnet format --verify-no-changes

# For Java
# mvn checkstyle:check
```

**Expected output:**
```
✅ No linting errors found
```

**If lint errors found:**
```
❌ Lint errors detected!

src/components/UserDashboard.tsx
  45:1   error  'useState' is not defined  no-undef
  52:12  error  Unexpected console statement  no-console
  67:5   warning  Unexpected var, use let or const instead  no-var

src/services/userService.ts
  23:1   error  Missing return type on function  @typescript-eslint/explicit-function-return-type

✖ 4 problems (3 errors, 1 warning)

Action required:
1. Run auto-fix if available: npm run lint:fix
2. Manually fix remaining errors
3. Re-run linter
4. Repeat until zero errors and zero warnings

DO NOT PROCEED with lint errors.
```

### 5. Auto-Fix What's Possible

```bash
echo "🔧 Attempting auto-fixes..."

# Run formatters and auto-fixable linters
npm run lint:fix
npm run format

# Stage the auto-fixes
git add .
```

### 6. Manual Fixes

For issues that can't be auto-fixed:

```typescript
// Example: Fix type error
// Before:
const userName = user.name; // Type error if name is optional
onSave(userName);

// After:
const userName = user.name ?? ''; // Handle undefined case
onSave(userName);
```

```typescript
// Example: Fix lint error
// Before:
var count = 0; // ESLint: no-var

// After:
let count = 0; // Use let instead of var
```

### 7. Verify All Checks Pass

Run everything again to confirm:

```bash
echo "✅ Final verification..."

# Run all checks
npm test && \
  npx tsc --noEmit && \
  npm run lint

echo "✅ ALL QUALITY CHECKS PASSED!"
```

### 8. Commit Quality Fixes

```bash
# Only if fixes were needed
if git diff --cached --quiet; then
  echo "No fixes needed - all checks passed first time!"
else
  git commit -m "fix(story-{story_id}): address quality check issues

- Fix type errors
- Resolve lint violations
- Improve test coverage to {coverage}%

All automated checks now passing:
✅ Tests: {test_count} passed
✅ Type check: No errors
✅ Linter: No violations
✅ Coverage: {coverage}%"
fi
```

### 9. Update State

```yaml
# Update {stateFile}
current_step: 6
quality_checks:
  tests_passed: true
  test_count: {test_count}
  coverage: {coverage}%
  type_check_passed: true
  lint_passed: true
  all_checks_passed: true
ready_for_code_review: true
```

---

## Quality Gate

**CRITICAL:** This is a **BLOCKING STEP**. You **MUST NOT** proceed to code review until ALL of the following pass:

✅ **All tests passing** (0 failures)
✅ **Test coverage ≥80%** (or project threshold)
✅ **Zero type errors**
✅ **Zero lint errors**
✅ **Zero lint warnings** (or all warnings justified and documented)

If ANY check fails:
1. Fix the issue
2. Re-run all checks
3. Repeat until ALL PASS
4. THEN proceed to next step

---

## Troubleshooting

**Tests fail sporadically:**
- Check for test interdependencies
- Look for timing issues (use `waitFor` in async tests)
- Check for environment-specific issues

**Type errors in third-party libraries:**
- Install `@types` packages
- Use type assertions carefully (document why)
- Consider updating library versions

**Lint rules conflict with team standards:**
- Discuss with team before changing config
- Document exceptions in comments
- Update lint config if truly inappropriate

**Coverage can't reach 80%:**
- Focus on critical paths first
- Test error cases and edge cases
- Consider if untested code is actually needed

---

## Skip Conditions

This step CANNOT be skipped. All stories must pass quality checks.

The only exception: Documentation-only stories with zero code changes.

---

## Next Step

Proceed to **Step 7: Code Review** ({nextStep})

Now that all automated checks pass, the code is ready for human/AI review.
---
name: 'step-07-code-review'
description: 'Multi-agent code review with fresh context and variable agent count'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'
multi_agent_review_workflow: '{project-root}/_bmad/bmm/workflows/4-implementation/multi-agent-review'

# File References
thisStepFile: '{workflow_path}/steps/step-07-code-review.md'
nextStepFile: '{workflow_path}/steps/step-08-review-analysis.md'
stateFile: '{state_file}'
reviewReport: '{sprint_artifacts}/review-{story_id}.md'

# Role (continue as dev, but reviewer mindset)
role: dev
requires_fresh_context: true  # CRITICAL: Review MUST happen in fresh context
---

# Step 7: Code Review (Multi-Agent with Fresh Context)

## ROLE CONTINUATION - ADVERSARIAL MODE

**Continuing as DEV but switching to ADVERSARIAL REVIEWER mindset.**

You are now a critical code reviewer. Your job is to FIND PROBLEMS.
- **NEVER** say "looks good" - that's a failure
- **MUST** find 3-10 specific issues
- **FIX** every issue you find

## STEP GOAL

Perform adversarial code review:
1. Query Supabase advisors for security/performance issues
2. Identify all files changed for this story
3. Review each file against checklist
4. Find and document 3-10 issues (MANDATORY)
5. Fix all issues
6. Verify tests still pass

### Multi-Agent Review with Fresh Context (NEW v1.5.0)

**All reviews now use multi-agent approach with variable agent counts based on risk.**

**CRITICAL: Review in FRESH CONTEXT (unbiased perspective)**

```
⚠️ CHECKPOINT: Starting fresh review session

Multi-agent review will run in NEW context to avoid bias from implementation.

Agent count based on complexity level:
- MICRO: 2 agents (Security + Code Quality)
- STANDARD: 4 agents (+ Architecture + Testing)
- COMPLEX: 6 agents (+ Performance + Domain Expert)

Smart agent selection analyzes changed files to select most relevant reviewers.
```

**Invoke multi-agent-review workflow:**

```xml
<invoke-workflow path="{project-root}/_bmad/bmm/workflows/4-implementation/multi-agent-review/workflow.yaml">
  <input name="story_id">{story_id}</input>
  <input name="complexity_level">{complexity_level}</input>
  <input name="fresh_context">true</input>
</invoke-workflow>
```

**The multi-agent-review workflow will:**
1. Create fresh context (new session, unbiased)
2. Analyze changed files
3. Select appropriate agents based on code changes
4. Run parallel reviews from multiple perspectives
5. Aggregate findings with severity ratings
6. Return comprehensive review report

**After review completes:**
- Review report saved to: `{sprint_artifacts}/review-{story_id}.md`
- Proceed to step 8 (Review Analysis) to categorize findings

## MANDATORY EXECUTION RULES

### Adversarial Requirements

- **MINIMUM 3 ISSUES** - If you found fewer, look harder
- **MAXIMUM 10 ISSUES** - Prioritize if more found
- **NO "LOOKS GOOD"** - This is FORBIDDEN
- **FIX EVERYTHING** - Don't just report, fix

### Review Categories (find issues in EACH)

1. Security
2. Performance
3. Error Handling
4. Test Coverage
5. Code Quality
6. Architecture

## EXECUTION SEQUENCE

### 1. Query Supabase Advisors

Use MCP tools:

```
mcp__supabase__get_advisors:
  type: "security"

mcp__supabase__get_advisors:
  type: "performance"
```

Document any issues found.

### 2. Identify Changed Files

```bash
git status
git diff --name-only HEAD~1
```

List all files changed for story {story_id}.

### 3. Review Each Category

#### SECURITY REVIEW

For each file, check:
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Auth checks on all protected routes
- [ ] RLS policies exist and are correct
- [ ] No credential exposure (API keys, secrets)
- [ ] Input validation present
- [ ] Rate limiting considered

#### PERFORMANCE REVIEW

- [ ] No N+1 query patterns
- [ ] Indexes exist for query patterns
- [ ] No unnecessary re-renders
- [ ] Proper caching strategy
- [ ] Efficient data fetching
- [ ] Bundle size impact considered

#### ERROR HANDLING REVIEW

- [ ] Result type used consistently
- [ ] Error messages are user-friendly
- [ ] Edge cases handled
- [ ] Null/undefined checked
- [ ] Network errors handled gracefully

#### TEST COVERAGE REVIEW

- [ ] All AC have tests
- [ ] Edge cases tested
- [ ] Error paths tested
- [ ] Mocking is appropriate (not excessive)
- [ ] Tests are deterministic

#### CODE QUALITY REVIEW

- [ ] DRY - no duplicate code
- [ ] SOLID principles followed
- [ ] TypeScript strict mode compliant
- [ ] No any types
- [ ] Functions are focused (single responsibility)
- [ ] Naming is clear and consistent

#### ARCHITECTURE REVIEW

- [ ] Module boundaries respected
- [ ] Imports from index.ts only
- [ ] Server/client separation correct
- [ ] Data flow is clear
- [ ] No circular dependencies

### 4. Document All Issues

For each issue found:

```yaml
issue_{n}:
  severity: critical|high|medium|low
  category: security|performance|error-handling|testing|quality|architecture
  file: "{file_path}"
  line: {line_number}
  problem: |
    {Clear description of the issue}
  risk: |
    {What could go wrong if not fixed}
  fix: |
    {How to fix it}
```

### 5. Fix All Issues

For EACH issue documented:

1. Edit the file to fix the issue
2. Add test if issue wasn't covered
3. Verify the fix is correct
4. Mark as fixed

### 6. Run Verification

After all fixes:

```bash
npm run lint
npm run build
npm test -- --run
```

All must pass.

### 7. Create Review Report

Append to story file or create `{sprint_artifacts}/review-{story_id}.md`:

```markdown
# Code Review Report - Story {story_id}

## Summary
- Issues Found: {count}
- Issues Fixed: {count}
- Categories Reviewed: {list}

## Issues Detail

### Issue 1: {title}
- **Severity:** {severity}
- **Category:** {category}
- **File:** {file}:{line}
- **Problem:** {description}
- **Fix Applied:** {fix_description}

### Issue 2: {title}
...

## Security Checklist
- [x] RLS policies verified
- [x] No credential exposure
- [x] Input validation present

## Performance Checklist
- [x] No N+1 queries
- [x] Indexes verified

## Final Status
All issues resolved. Tests passing.

Reviewed by: DEV (adversarial)
Reviewed at: {timestamp}
```

### 8. Update Pipeline State

Update state file:
- Add `6` to `stepsCompleted`
- Set `lastStep: 6`
- Set `steps.step-06-code-review.status: completed`
- Record `issues_found` and `issues_fixed`

### 9. Present Summary and Menu

Display:
```
Code Review Complete

Issues Found: {count} (minimum 3 required)
Issues Fixed: {count}

By Category:
- Security: {count}
- Performance: {count}
- Error Handling: {count}
- Test Coverage: {count}
- Code Quality: {count}
- Architecture: {count}

All Tests: PASSING
Lint: CLEAN
Build: SUCCESS

Review Report: {report_path}
```

**Interactive Mode Menu:**
```
[C] Continue to Completion
[R] Run another review pass
[T] Run tests again
[H] Halt pipeline
```

**Batch Mode:** Auto-continue if minimum issues found and fixed

## QUALITY GATE

Before proceeding:
- [ ] Minimum 3 issues found and fixed
- [ ] All categories reviewed
- [ ] All tests still passing
- [ ] Lint clean
- [ ] Build succeeds
- [ ] Review report created

## MCP TOOLS AVAILABLE

- `mcp__supabase__get_advisors` - Security/performance checks
- `mcp__supabase__execute_sql` - Query verification

## CRITICAL STEP COMPLETION

**ONLY WHEN** [minimum 3 issues found AND all fixed AND tests pass],
load and execute `{nextStepFile}` for story completion.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Found and fixed 3-10 issues
- All categories reviewed
- Tests still passing after fixes
- Review report complete
- No "looks good" shortcuts

### ❌ FAILURE
- Saying "looks good" or "no issues found"
- Finding fewer than 3 issues
- Not fixing issues found
- Tests failing after fixes
- Skipping review categories
---
name: 'step-08-review-analysis'
description: 'Intelligently analyze code review findings - distinguish real issues from gold plating'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-08-review-analysis.md'
stateFile: '{state_file}'
storyFile: '{story_file}'
reviewReport: '{sprint_artifacts}/review-{story_id}.md'

# Next step
nextStep: '{workflow_path}/steps/step-09-fix-issues.md'
---

# Step 8: Review Analysis

**Goal:** Critically analyze code review findings to distinguish **real problems** from **gold plating**, **false positives**, and **overzealous suggestions**.

## The Problem

AI code reviewers (and human reviewers) sometimes:
- 🎨 **Gold plate**: Suggest unnecessary perfectionism
- 🔍 **Overreact**: Flag non-issues to appear thorough
- 📚 **Over-engineer**: Suggest abstractions for simple cases
- ⚖️ **Misjudge context**: Apply rules without understanding tradeoffs

## The Solution

**Critical thinking filter**: Evaluate each finding objectively.

---

## Process

### 1. Load Review Report

```bash
# Read the code review report
review_report="{reviewReport}"
test -f "$review_report" || (echo "⚠️ No review report found" && exit 0)
```

Parse findings by severity:
- 🔴 CRITICAL
- 🟠 HIGH
- 🟡 MEDIUM
- 🔵 LOW
- ℹ️ INFO

### 2. Categorize Each Finding

For EACH finding, ask these questions:

#### Question 1: Is this a REAL problem?

```
Real Problem Indicators:
✅ Would cause bugs or incorrect behavior
✅ Would cause security vulnerabilities
✅ Would cause performance issues in production
✅ Would make future maintenance significantly harder
✅ Violates team/project standards documented in codebase

NOT Real Problems:
❌ "Could be more elegant" (subjective style preference)
❌ "Consider adding abstraction" (YAGNI - you aren't gonna need it)
❌ "This pattern is not ideal" (works fine, alternative is marginal)
❌ "Add comprehensive error handling" (for impossible error cases)
❌ "Add logging everywhere" (log signal, not noise)
```

#### Question 2: Does this finding understand CONTEXT?

```
Context Considerations:
📋 Story scope: Does fixing this exceed story requirements?
🎯 Project maturity: Is this MVP, beta, or production-hardened?
⚡ Performance criticality: Is this a hot path or cold path?
👥 Team standards: Does team actually follow this pattern?
📊 Data scale: Does this handle actual expected volume?

Example of MISSING context:
Finding: "Add database indexing for better performance"
Reality: Table has 100 rows total, query runs once per day
Verdict: ❌ REJECT - Premature optimization
```

#### Question 3: Is this ACTIONABLE?

```
Actionable Findings:
✅ Specific file, line number, exact issue
✅ Clear explanation of problem
✅ Concrete recommendation for fix
✅ Can be fixed in reasonable time

NOT Actionable:
❌ Vague: "Code quality could be improved"
❌ No location: "Some error handling is missing"
❌ No recommendation: "This might cause issues"
❌ Massive scope: "Refactor entire architecture"
```

### 3. Classification Decision Tree

For each finding, classify as:

```
┌─────────────────────────────────────────┐
│ Finding Classification Decision Tree    │
└─────────────────────────────────────────┘

Is it a CRITICAL security/correctness issue?
├─ YES → 🔴 MUST FIX
└─ NO ↓

Does it violate documented project standards?
├─ YES → 🟠 SHOULD FIX
└─ NO ↓

Would it prevent future maintenance?
├─ YES → 🟡 CONSIDER FIX (if in scope)
└─ NO ↓

Is it gold plating / over-engineering?
├─ YES → ⚪ REJECT (document why)
└─ NO ↓

Is it a style/opinion without real impact?
├─ YES → ⚪ REJECT (document why)
└─ NO → 🔵 OPTIONAL (tech debt backlog)
```

### 4. Create Classification Report

```markdown
# Code Review Analysis: Story {story_id}

## Review Metadata
- Reviewer: {reviewer_type} (Adversarial / Multi-Agent)
- Total Findings: {total_findings}
- Review Date: {date}

## Classification Results

### 🔴 MUST FIX (Critical - Blocking)
Total: {must_fix_count}

1. **[SECURITY] Unvalidated user input in API endpoint**
   - File: `src/api/users.ts:45`
   - Issue: POST /api/users accepts unvalidated input, SQL injection risk
   - Why this is real: Security vulnerability, could lead to data breach
   - Action: Add input validation with Zod schema
   - Estimated effort: 30 min

2. **[CORRECTNESS] Race condition in state update**
   - File: `src/components/UserForm.tsx:67`
   - Issue: Multiple async setState calls without proper sequencing
   - Why this is real: Causes intermittent bugs in production
   - Action: Use functional setState or useReducer
   - Estimated effort: 20 min

### 🟠 SHOULD FIX (High Priority)
Total: {should_fix_count}

3. **[STANDARDS] Missing error handling per team convention**
   - File: `src/services/userService.ts:34`
   - Issue: API calls lack try-catch per documented standards
   - Why this matters: Team standard in CONTRIBUTING.md section 3.2
   - Action: Wrap in try-catch, log errors
   - Estimated effort: 15 min

### 🟡 CONSIDER FIX (Medium - If in scope)
Total: {consider_count}

4. **[MAINTAINABILITY] Complex nested conditional**
   - File: `src/utils/validation.ts:23`
   - Issue: 4-level nested if-else hard to read
   - Why this matters: Could confuse future maintainers
   - Action: Extract to guard clauses or lookup table
   - Estimated effort: 45 min
   - **Scope consideration**: Nice to have, but not blocking

### ⚪ REJECTED (Gold Plating / False Positives)
Total: {rejected_count}

5. **[REJECTED] "Add comprehensive logging to all functions"**
   - Reason: Gold plating - logging should be signal, not noise
   - Context: These are simple utility functions, no debugging issues
   - Verdict: REJECT - Would create log spam

6. **[REJECTED] "Extract component for reusability"**
   - Reason: YAGNI - component used only once, no reuse planned
   - Context: Story scope is single-use dashboard widget
   - Verdict: REJECT - Premature abstraction

7. **[REJECTED] "Add database connection pooling"**
   - Reason: Premature optimization - current load is minimal
   - Context: App has 10 concurrent users max, no performance issues
   - Verdict: REJECT - Optimize when needed, not speculatively

8. **[REJECTED] "Consider microservices architecture"**
   - Reason: Out of scope - architectural decision beyond story
   - Context: Story is adding a single API endpoint
   - Verdict: REJECT - Massive overreach

### 🔵 OPTIONAL (Tech Debt Backlog)
Total: {optional_count}

9. **[STYLE] Inconsistent naming convention**
   - File: `src/utils/helpers.ts:12`
   - Issue: camelCase vs snake_case mixing
   - Why low priority: Works fine, linter doesn't flag it
   - Action: Standardize to camelCase when touching this file later
   - Create tech debt ticket: TD-{number}

## Summary

**Action Plan:**
- 🔴 MUST FIX: {must_fix_count} issues (blocking)
- 🟠 SHOULD FIX: {should_fix_count} issues (high priority)
- 🟡 CONSIDER: {consider_count} issues (if time permits)
- ⚪ REJECTED: {rejected_count} findings (documented why)
- 🔵 OPTIONAL: {optional_count} items (tech debt backlog)

**Estimated fix time:** {total_fix_time_hours} hours

**Proceed to:** Step 9 - Fix Issues (implement MUST FIX + SHOULD FIX items)
```

### 5. Document Rejections

**CRITICAL:** When rejecting findings, ALWAYS document WHY:

```markdown
## Rejected Findings - Rationale

### Finding: "Add caching layer for all API calls"
**Rejected because:**
- ⚡ Premature optimization - no performance issues detected
- 📊 Traffic analysis shows <100 requests/day
- 🎯 Story scope is feature addition, not optimization
- 💰 Cost: 2 days implementation, 0 proven benefit
- 📝 Decision: Monitor first, optimize if needed

### Finding: "Refactor to use dependency injection"
**Rejected because:**
- 🏗️ Over-engineering - current approach works fine
- 📏 Codebase size doesn't justify DI complexity
- 👥 Team unfamiliar with DI patterns
- 🎯 Story scope: simple feature, not architecture overhaul
- 📝 Decision: Keep it simple, revisit if codebase grows

### Finding: "Add comprehensive JSDoc to all functions"
**Rejected because:**
- 📚 Gold plating - TypeScript types provide documentation
- ⏱️ Time sink - 4+ hours for marginal benefit
- 🎯 Team standard: JSDoc only for public APIs
- 📝 Decision: Follow team convention, not reviewer preference
```

### 6. Update State

```yaml
# Update {stateFile}
current_step: 8
review_analysis:
  must_fix: {must_fix_count}
  should_fix: {should_fix_count}
  consider: {consider_count}
  rejected: {rejected_count}
  optional: {optional_count}
  estimated_fix_time: "{total_fix_time_hours}h"
  rejections_documented: true
  analysis_complete: true
```

---

## Critical Thinking Framework

Use this framework to evaluate EVERY finding:

### The "So What?" Test
- **Ask:** "So what if we don't fix this?"
- **If answer is:** "Nothing bad happens" → REJECT
- **If answer is:** "Production breaks" → MUST FIX

### The "YAGNI" Test (You Aren't Gonna Need It)
- **Ask:** "Do we need this NOW for current requirements?"
- **If answer is:** "Maybe someday" → REJECT
- **If answer is:** "Yes, breaks without it" → FIX

### The "Scope" Test
- **Ask:** "Is this within the story's scope?"
- **If answer is:** "No, requires new story" → REJECT (or create new story)
- **If answer is:** "Yes, part of ACs" → FIX

### The "Team Standard" Test
- **Ask:** "Does our team actually do this?"
- **If answer is:** "No, reviewer's opinion" → REJECT
- **If answer is:** "Yes, in CONTRIBUTING.md" → FIX

---

## Common Rejection Patterns

Learn to recognize these patterns:

1. **"Consider adding..."** - Usually gold plating unless critical
2. **"It would be better if..."** - Subjective opinion, often rejectable
3. **"For maximum performance..."** - Premature optimization
4. **"To follow best practices..."** - Check if team actually follows it
5. **"This could be refactored..."** - Does it need refactoring NOW?
6. **"Add comprehensive..."** - Comprehensive = overkill most of the time
7. **"Future-proof by..."** - Can't predict future, solve current problems

---

## Next Step

Proceed to **Step 9: Fix Issues** ({nextStep})

Implement MUST FIX and SHOULD FIX items. Skip rejected items (already documented why).
---
name: 'step-09-fix-issues'
description: 'Fix MUST FIX and SHOULD FIX issues from review analysis'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-09-fix-issues.md'
stateFile: '{state_file}'
storyFile: '{story_file}'
reviewAnalysis: '{sprint_artifacts}/review-analysis-{story_id}.md'

# Next step
nextStep: '{workflow_path}/steps/step-10-complete.md'
---

# Step 9: Fix Issues

**Goal:** Implement fixes for MUST FIX and SHOULD FIX items identified in review analysis. Skip rejected items (gold plating already documented).

## Principles

- **Fix real problems only**: MUST FIX and SHOULD FIX categories
- **Skip rejected items**: Already documented why in step 8
- **Verify each fix**: Run tests after each fix
- **Commit incrementally**: One fix per commit for traceability

---

## Process

### 1. Load Review Analysis

```bash
# Read review analysis from step 8
review_analysis="{reviewAnalysis}"
test -f "$review_analysis" || (echo "⚠️ No review analysis found - skipping fix step" && exit 0)
```

Parse the analysis report to extract:
- MUST FIX items (count: {must_fix_count})
- SHOULD FIX items (count: {should_fix_count})
- Rejected items (for reference - DO NOT fix these)

### 2. Fix MUST FIX Items (Critical - Blocking)

**These are MANDATORY fixes - cannot proceed without fixing.**

For each MUST FIX issue:

```
🔴 Issue #{number}: {title}
   File: {file}:{line}
   Severity: CRITICAL
   Category: {category} (SECURITY | CORRECTNESS | etc.)

   Problem:
   {description}

   Fix Required:
   {recommendation}

   Estimated Time: {estimate}
```

**Fix Process:**
1. Read the file at the specified location
2. Understand the issue context
3. Implement the recommended fix
4. Add test if issue was caught by testing gap
5. Run tests to verify fix works
6. Commit the fix

```bash
# Example fix commit
git add {file}
git commit -m "fix(story-{story_id}): {issue_title}

{category}: {brief_description}

- Issue: {problem_summary}
- Fix: {fix_summary}
- Testing: {test_verification}

Addresses review finding #{number} (MUST FIX)
Related to story {story_id}"
```

**Quality Check After Each Fix:**
```bash
# Verify fix doesn't break anything
npm test

# If tests fail:
# 1. Fix the test or the code
# 2. Re-run tests
# 3. Only commit when tests pass
```

### 3. Fix SHOULD FIX Items (High Priority)

**These are important for code quality and team standards.**

For each SHOULD FIX issue:

```
🟠 Issue #{number}: {title}
   File: {file}:{line}
   Severity: HIGH
   Category: {category} (STANDARDS | MAINTAINABILITY | etc.)

   Problem:
   {description}

   Fix Required:
   {recommendation}

   Estimated Time: {estimate}
```

Same fix process as MUST FIX items, but with SHOULD FIX label in commit.

### 4. Consider CONSIDER Items (If Time/Scope Permits)

For CONSIDER items, evaluate:

```
🟡 Issue #{number}: {title}
   File: {file}:{line}
   Severity: MEDIUM

   Scope Check:
   - Is this within story scope? {yes/no}
   - Time remaining in story? {estimate}
   - Would this improve maintainability? {yes/no}

   Decision:
   [ ] FIX NOW - In scope and quick
   [ ] CREATE TECH DEBT TICKET - Out of scope
   [ ] SKIP - Not worth the effort
```

If fixing:
- Same process as SHOULD FIX
- Label as "refactor" or "improve" instead of "fix"

If creating tech debt ticket:
```markdown
# Tech Debt: {title}

**Source:** Code review finding from story {story_id}
**Priority:** Medium
**Estimated Effort:** {estimate}

**Description:**
{issue_description}

**Recommendation:**
{recommendation}

**Why Deferred:**
{reason} (e.g., out of scope, time constraints, etc.)
```

### 5. Skip REJECTED Items

**DO NOT fix rejected items.**

Display confirmation:
```
⚪ REJECTED ITEMS (Skipped):
   Total: {rejected_count}

   These findings were analyzed and rejected in step 8:
   - #{number}: {title} - {rejection_reason}
   - #{number}: {title} - {rejection_reason}

   ✅ Correctly skipped (documented as gold plating/false positives)
```

### 6. Skip OPTIONAL Items (Tech Debt Backlog)

For OPTIONAL items:
- Create tech debt tickets (if not already created)
- Do NOT implement now
- Add to project backlog

### 7. Verify All Fixes Work Together

After all fixes applied, run complete quality check:

```bash
echo "🔍 Verifying all fixes together..."

# Run full test suite
npm test

# Run type checker
npx tsc --noEmit

# Run linter
npm run lint

# Check test coverage
npm run test:coverage
```

**If any check fails:**
```
❌ Quality checks failed after fixes!

This means fixes introduced new issues.

Action required:
1. Identify which fix broke which test
2. Fix the issue
3. Re-run quality checks
4. Repeat until all checks pass

DO NOT PROCEED until all quality checks pass.
```

### 8. Summary Report

```markdown
# Fix Summary: Story {story_id}

## Issues Addressed

### 🔴 MUST FIX: {must_fix_count} issues
- [x] Issue #1: {title} - FIXED ✅
- [x] Issue #2: {title} - FIXED ✅

### 🟠 SHOULD FIX: {should_fix_count} issues
- [x] Issue #3: {title} - FIXED ✅
- [x] Issue #4: {title} - FIXED ✅

### 🟡 CONSIDER: {consider_fixed_count}/{consider_count} issues
- [x] Issue #5: {title} - FIXED ✅
- [ ] Issue #6: {title} - Tech debt ticket created

### ⚪ REJECTED: {rejected_count} items
- Correctly skipped (documented in review analysis)

### 🔵 OPTIONAL: {optional_count} items
- Tech debt tickets created
- Added to backlog

## Commits Made

Total commits: {commit_count}
- MUST FIX commits: {must_fix_commits}
- SHOULD FIX commits: {should_fix_commits}
- Other commits: {other_commits}

## Final Quality Check

✅ All tests passing: {test_count} tests
✅ Type check: No errors
✅ Linter: No violations
✅ Coverage: {coverage}%

## Time Spent

Estimated: {estimated_time}
Actual: {actual_time}
Efficiency: {efficiency_percentage}%
```

### 9. Update State

```yaml
# Update {stateFile}
current_step: 9
issues_fixed:
  must_fix: {must_fix_count}
  should_fix: {should_fix_count}
  consider: {consider_fixed_count}
  rejected: {rejected_count} (skipped - documented)
  optional: {optional_count} (tech debt created)
fixes_verified: true
all_quality_checks_passed: true
ready_for_completion: true
```

---

## Quality Gates

**BLOCKING:** Cannot proceed to step 10 until:

✅ **All MUST FIX issues resolved**
✅ **All SHOULD FIX issues resolved**
✅ **All tests passing**
✅ **Type check passing**
✅ **Linter passing**
✅ **Coverage maintained or improved**

If any gate fails:
1. Fix the issue
2. Re-run quality checks
3. Repeat until ALL PASS
4. THEN proceed to next step

---

## Skip Conditions

This step can be skipped only if:
- Review analysis (step 8) found zero issues requiring fixes
- All findings were REJECTED or OPTIONAL

Display when skipping:
```
✅ No fixes required!

Review analysis found no critical or high-priority issues.
All findings were either rejected as gold plating or marked as optional tech debt.

Proceeding to completion...
```

---

## Error Handling

**If a fix causes test failures:**
```
⚠️ Fix introduced regression!

Test failures after applying fix for: {issue_title}

Failed tests:
- {test_name_1}
- {test_name_2}

Action:
1. Review the fix - did it break existing functionality?
2. Either fix the implementation or update the tests
3. Re-run tests
4. Only proceed when tests pass
```

**If stuck on a fix:**
```
⚠️ Fix is more complex than estimated

Issue: {issue_title}
Estimated: {estimate}
Actual time spent: {actual} (exceeded estimate)

Options:
[C] Continue - Keep working on this fix
[D] Defer - Create tech debt ticket and continue
[H] Help - Request human intervention

If deferring:
- Document current progress
- Create detailed tech debt ticket
- Note blocking issues
- Continue with other fixes
```

---

## Next Step

Proceed to **Step 10: Complete + Update Status** ({nextStep})

All issues fixed, all quality checks passed. Ready to mark story as done!
---
name: 'step-10-complete'
description: 'Complete story with MANDATORY sprint-status.yaml update and verification'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-10-complete.md'
nextStepFile: '{workflow_path}/steps/step-11-summary.md'
stateFile: '{state_file}'
sprint_status: '{sprint_artifacts}/sprint-status.yaml'

# Role Switch
role: sm
---

# Step 10: Complete Story (v1.5.0: Mandatory Status Update)

## ROLE SWITCH

**Switching to SM (Scrum Master) perspective.**

You are now completing the story and preparing changes for git commit.

## STEP GOAL

Complete the story with safety checks and MANDATORY status updates:
1. Extract file list from story
2. Stage only story-related files
3. Generate commit message
4. Create commit
5. Push to remote (if configured)
6. Update story file status to "done"
7. **UPDATE sprint-status.yaml (MANDATORY - NO EXCEPTIONS)**
8. **VERIFY sprint-status.yaml update persisted (CRITICAL)**

## MANDATORY EXECUTION RULES

### Completion Principles

- **TARGETED COMMIT** - Only files from this story's File List
- **SAFETY CHECKS** - Verify no secrets, proper commit message
- **STATUS UPDATE** - Mark story as "review" (ready for human review)
- **NO FORCE PUSH** - Normal push only

## EXECUTION SEQUENCE

### 1. Extract File List from Story

Read story file and find "File List" section:

```markdown
## File List
- src/components/UserProfile.tsx
- src/actions/updateUser.ts
- tests/user.test.ts
```

Extract all file paths.
Add story file itself to the list.

Store as `{story_files}` (space-separated list).

### 2. Verify Files Exist

For each file in list:
```bash
test -f "{file}" && echo "✓ {file}" || echo "⚠️  {file} not found"
```

### 3. Check Git Status

```bash
git status --short
```

Display files changed.

### 4. Stage Story Files Only

```bash
git add {story_files}
```

**This ensures parallel-safe commits** (other agents won't conflict).

### 5. Generate Commit Message

Based on story title and changes:

```
feat(story-{story_id}): {story_title}

Implemented:
{list acceptance criteria or key changes}

Files changed:
- {file_1}
- {file_2}

Story: {story_file}
```

### 6. Create Commit (With Queue for Parallel Mode)

**Check execution mode:**
```
If mode == "batch" AND parallel execution:
  use_commit_queue = true
Else:
  use_commit_queue = false
```

**If use_commit_queue == true:**

```bash
# Commit queue with file-based locking
lock_file=".git/bmad-commit.lock"
max_wait=300  # 5 minutes
wait_time=0
retry_delay=1

while [ $wait_time -lt $max_wait ]; do
  if [ ! -f "$lock_file" ]; then
    # Acquire lock
    echo "locked_by: {{story_key}}
locked_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
worker_id: {{worker_id}}
pid: $$" > "$lock_file"

    echo "🔒 Commit lock acquired for {{story_key}}"

    # Execute commit
    git commit -m "$(cat <<'EOF'
{commit_message}
EOF
)"

    commit_result=$?

    # Release lock
    rm -f "$lock_file"
    echo "🔓 Lock released"

    if [ $commit_result -eq 0 ]; then
      git log -1 --oneline
      break
    else
      echo "❌ Commit failed"
      exit $commit_result
    fi
  else
    # Lock exists, check if stale
    lock_age=$(( $(date +%s) - $(date -r "$lock_file" +%s) ))
    if [ $lock_age -gt 300 ]; then
      echo "⚠️  Stale lock detected (${lock_age}s old) - removing"
      rm -f "$lock_file"
      continue
    fi

    locked_by=$(grep "locked_by:" "$lock_file" | cut -d' ' -f2-)
    echo "⏳ Waiting for commit lock... (held by $locked_by, ${wait_time}s elapsed)"
    sleep $retry_delay
    wait_time=$(( wait_time + retry_delay ))
    retry_delay=$(( retry_delay < 30 ? retry_delay * 3 / 2 : 30 ))  # Exponential backoff, max 30s
  fi
done

if [ $wait_time -ge $max_wait ]; then
  echo "❌ TIMEOUT: Could not acquire commit lock after 5 minutes"
  echo "Lock holder: $(cat $lock_file)"
  exit 1
fi
```

**If use_commit_queue == false (sequential mode):**

```bash
# Direct commit (no queue needed)
git commit -m "$(cat <<'EOF'
{commit_message}
EOF
)"

git log -1 --oneline
```

### 7. Push to Remote (Optional)

**If configured to push:**
```bash
git push
```

**If push succeeds:**
```
✅ Changes pushed to remote
```

**If push fails (e.g., need to pull first):**
```
⚠️  Push failed - changes committed locally
You can push manually when ready
```

### 8. Update Story Status (File + Sprint-Status)

**CRITICAL: Two-location update with verification**

#### 8.1: Update Story File

Update story file frontmatter:
```yaml
status: done  # Story completed (v1.5.0: changed from "review" to "done")
completed_date: {date}
```

#### 8.2: Update sprint-status.yaml (MANDATORY - NO EXCEPTIONS)

**This is CRITICAL and CANNOT be skipped.**

```bash
# Read current sprint-status.yaml
sprint_status_file="{sprint_artifacts}/sprint-status.yaml"
story_key="{story_id}"

# Update development_status section
# Change status from whatever it was to "done"

development_status:
  {story_id}: done  # ✅ COMPLETED: {story_title}
```

**Implementation:**
```bash
# Read current status
current_status=$(grep "^\s*{story_id}:" "$sprint_status_file" | awk '{print $2}')

# Update to done
sed -i'' "s/^\s*{story_id}:.*/  {story_id}: done  # ✅ COMPLETED: {story_title}/" "$sprint_status_file"

echo "✅ Updated sprint-status.yaml: {story_id} → done"
```

#### 8.3: Verify Update Persisted (CRITICAL)

```bash
# Re-read sprint-status.yaml to verify change
verification=$(grep "^\s*{story_id}:" "$sprint_status_file" | awk '{print $2}')

if [ "$verification" != "done" ]; then
  echo "❌ CRITICAL: sprint-status.yaml update FAILED!"
  echo "Expected: done"
  echo "Got: $verification"
  echo ""
  echo "HALTING pipeline - status update is MANDATORY"
  exit 1
fi

echo "✅ Verified: sprint-status.yaml correctly updated"
```

**NO EXCEPTIONS:** If verification fails, pipeline MUST HALT.

### 9. Update Pipeline State

Update state file:
- Add `6` to `stepsCompleted`
- Set `lastStep: 6`
- Set `steps.step-06-complete.status: completed`
- Record commit hash

### 10. Display Summary

```
Story Completion

✅ Files staged: {file_count}
✅ Commit created: {commit_hash}
✅ Status updated: review
{if pushed}✅ Pushed to remote{endif}

Commit: {commit_hash_short}
Message: {commit_title}

Ready for Summary Generation
```

**Interactive Mode Menu:**
```
[C] Continue to Summary
[P] Push to remote (if not done)
[H] Halt pipeline
```

**Batch Mode:** Auto-continue

## QUALITY GATE

Before proceeding (BLOCKING - ALL must pass):
- [ ] Targeted files staged (from File List)
- [ ] Commit message generated
- [ ] Commit created successfully
- [ ] Story file status updated to "done"
- [ ] **sprint-status.yaml updated to "done" (MANDATORY)**
- [ ] **sprint-status.yaml update VERIFIED (CRITICAL)**

**If ANY check fails, pipeline MUST HALT.**

## CRITICAL STEP COMPLETION

**ONLY WHEN** [commit created],
load and execute `{nextStepFile}` for summary generation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Only story files committed
- Commit message is clear
- Status updated properly
- No secrets committed
- Push succeeded or skipped safely

### ❌ FAILURE
- Committing unrelated files
- Generic commit message
- Not updating story status
- Pushing secrets
- Force pushing
---
name: 'step-11-summary'
description: 'Generate comprehensive audit trail and pipeline summary'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-11-summary.md'
stateFile: '{state_file}'
storyFile: '{story_file}'
auditTrail: '{audit_trail}'

# Role
role: null
---

# Step 11: Pipeline Summary

## STEP GOAL

Generate comprehensive audit trail and summary:
1. Calculate total duration
2. Summarize work completed
3. Generate audit trail file
4. Display final summary
5. Clean up state file

## EXECUTION SEQUENCE

### 1. Calculate Metrics

From state file, calculate:
- Total duration: `{completed_at} - {started_at}`
- Step durations
- Files modified count
- Issues found and fixed
- Tasks completed

### 2. Generate Audit Trail

Create file: `{sprint_artifacts}/audit-super-dev-{story_id}-{date}.yaml`

```yaml
---
audit_version: "1.0"
workflow: "super-dev-pipeline"
workflow_version: "1.0.0"

# Story identification
story_id: "{story_id}"
story_file: "{story_file}"
story_title: "{story_title}"

# Execution summary
execution:
  started_at: "{started_at}"
  completed_at: "{completed_at}"
  total_duration: "{duration}"
  mode: "{mode}"
  status: "completed"

# Development analysis
development:
  type: "{greenfield|brownfield|hybrid}"
  existing_files_modified: {count}
  new_files_created: {count}
  migrations_applied: {count}

# Step results
steps:
  step-01-init:
    duration: "{duration}"
    status: "completed"

  step-02-pre-gap-analysis:
    duration: "{duration}"
    tasks_analyzed: {count}
    tasks_refined: {count}
    tasks_added: {count}
    status: "completed"

  step-03-implement:
    duration: "{duration}"
    tasks_completed: {count}
    files_created: {list}
    files_modified: {list}
    migrations: {list}
    tests_added: {count}
    status: "completed"

  step-04-post-validation:
    duration: "{duration}"
    tasks_verified: {count}
    false_positives: {count}
    re_implementations: {count}
    status: "completed"

  step-05-code-review:
    duration: "{duration}"
    issues_found: {count}
    issues_fixed: {count}
    categories: {list}
    status: "completed"

  step-06-complete:
    duration: "{duration}"
    commit_hash: "{hash}"
    files_committed: {count}
    pushed: {true|false}
    status: "completed"

# Quality metrics
quality:
  all_tests_passing: true
  lint_clean: true
  build_success: true
  no_vibe_coding: true
  followed_step_sequence: true

# Files affected
files:
  created: {list}
  modified: {list}
  deleted: {list}

# Commit information
commit:
  hash: "{hash}"
  message: "{message}"
  files_committed: {count}
  pushed_to_remote: {true|false}
```

### 3. Display Final Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SUPER-DEV PIPELINE COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: {story_title}
Duration: {total_duration}

Development Type: {greenfield|brownfield|hybrid}

Results:
✅ Tasks Completed: {completed_count}
✅ Files Created: {created_count}
✅ Files Modified: {modified_count}
✅ Tests Added: {test_count}
✅ Issues Found & Fixed: {issue_count}

Quality Gates Passed:
✅ Pre-Gap Analysis
✅ Implementation
✅ Post-Validation (no false positives)
✅ Code Review (3-10 issues)
✅ All tests passing
✅ Lint clean
✅ Build success

Git:
✅ Commit: {commit_hash}
{if pushed}✅ Pushed to remote{endif}

Story Status: review (ready for human review)

Audit Trail: {audit_file}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ No vibe coding occurred! Disciplined execution maintained.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Clean Up State File

```bash
rm {sprint_artifacts}/super-dev-state-{story_id}.yaml
```

State is no longer needed - audit trail is the permanent record.

### 5. Final Message

```
Super-Dev Pipeline Complete!

This story was developed with disciplined step-file execution.
All quality gates passed. Ready for human review.

Next Steps:
1. Review the commit: git show {commit_hash}
2. Test manually if needed
3. Merge when approved
```

## PIPELINE COMPLETE

Pipeline execution is finished. No further steps.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Audit trail generated
- Summary accurate
- State file cleaned up
- Story marked "review"
- All metrics captured

### ❌ FAILURE
- Missing audit trail
- Incomplete summary
- State file not cleaned
- Metrics inaccurate
