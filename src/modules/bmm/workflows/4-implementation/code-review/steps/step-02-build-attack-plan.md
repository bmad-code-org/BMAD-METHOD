---
name: 'step-02-build-attack-plan'
description: 'Extract ACs and tasks, create comprehensive review plan for both phases'
---

# Step 2: Build Review Attack Plan

**Goal:** Extract all reviewable items from story and create attack plan for both review phases.

---

## AVAILABLE STATE

From previous step:

- `{story_path}` - Path to the story file
- `{story_key}` - Story identifier
- `{story_file_list}` - Files claimed in story
- `{git_changed_files}` - Files actually changed (git)
- `{git_discrepancies}` - Differences between claims and reality

---

## STATE VARIABLES (capture now)

- `{acceptance_criteria}` - All ACs extracted from story
- `{tasks_with_status}` - All tasks with their [x] or [ ] status
- `{comprehensive_file_list}` - Union of story files + git files
- `{review_attack_plan}` - Structured plan for both phases

---

## EXECUTION SEQUENCE

### 1. Extract Acceptance Criteria

Parse all Acceptance Criteria from story:

```
{acceptance_criteria} = [
  { id: "AC1", requirement: "...", testable: true/false },
  { id: "AC2", requirement: "...", testable: true/false },
  ...
]
```

Note any ACs that are vague or untestable.

### 2. Extract Tasks with Status

Parse all Tasks/Subtasks with completion markers:

```
{tasks_with_status} = [
  { id: "T1", description: "...", status: "complete" ([x]) or "incomplete" ([ ]) },
  { id: "T1.1", description: "...", status: "complete" or "incomplete" },
  ...
]
```

Flag any tasks marked complete [x] for verification.

### 3. Build Comprehensive File List

Merge `{story_file_list}` and `{git_changed_files}`:

```
{comprehensive_file_list} = union of:
  - Files in story Dev Agent Record
  - Files changed according to git
  - Deduped and sorted
```

Exclude from review:

- `_bmad/`, `_bmad-output/`
- `.cursor/`, `.windsurf/`, `.claude/`
- IDE/editor config files

### 4. Create Review Attack Plan

Structure the `{review_attack_plan}`:

```
PHASE 1: Context-Aware Review (Step 3)
├── Git vs Story Discrepancies
│   └── {git_discrepancies} items
├── AC Validation
│   └── {acceptance_criteria} items to verify
├── Task Completion Audit
│   └── {tasks_with_status} marked [x] to verify
└── Code Quality Review
    └── {comprehensive_file_list} files to review

PHASE 2: Adversarial Asymmetric Review (Step 4)
└── Context-independent diff review
    └── Diff constructed from git changes
    └── Story file EXCLUDED from reviewer context
    └── Pure code quality assessment
```

### 5. Preview Attack Plan

Present to user (brief summary):

```
**Review Attack Plan**

**Story:** {story_key}
**ACs to verify:** {count}
**Tasks marked complete:** {count}
**Files to review:** {count}
**Git discrepancies detected:** {count}

Proceeding with dual-phase review...
```

---

## NEXT STEP DIRECTIVE

**CRITICAL:** When this step completes, explicitly state:

"**NEXT:** Loading `step-03-adversarial-review.md`"

---

## SUCCESS METRICS

- All ACs extracted with testability assessment
- All tasks extracted with completion status
- Comprehensive file list built (story + git)
- Exclusions applied correctly
- Attack plan structured for both phases
- Summary presented to user
- Explicit NEXT directive provided

## FAILURE MODES

- Missing AC extraction
- Not capturing task completion status
- Forgetting to merge story + git files
- Not excluding IDE/config directories
- Skipping attack plan structure
- No explicit NEXT directive at step completion
