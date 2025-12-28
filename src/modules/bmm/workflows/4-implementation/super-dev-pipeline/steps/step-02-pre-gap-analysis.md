---
name: 'step-02-pre-gap-analysis'
description: 'Validate tasks against codebase reality - critical for brownfield development'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-02-pre-gap-analysis.md'
nextStepFile: '{workflow_path}/steps/step-03-implement.md'

# Role Switch
role: dev
agentFile: '{project-root}/_bmad/bmm/agents/dev.md'
---

# Step 2: Pre-Gap Analysis

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

### 6. Handle Approval (Interactive Mode Only)

**Interactive Mode:**

Display gap analysis report and ask:
```
Gap Analysis Complete

Changes proposed:
- {done_count} tasks already complete (will check)
- {unclear_count} tasks refined to {refined_count} specific tasks
- {missing_count} new tasks added
- {needed_count} tasks ready for implementation

Total work: {work_count} tasks

[A] Accept changes and proceed
[E] Edit tasks manually
[H] Halt pipeline
```

**Batch Mode:** Auto-accept changes

### 7. Update Pipeline State

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
  ```

### 8. Present Summary

Display:
```
Pre-Gap Analysis Complete

Development Type: {greenfield|brownfield|hybrid}
Work Remaining: {work_count} tasks

Codebase Status:
- Existing implementations reviewed: {existing_count}
- New implementations needed: {new_count}

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
