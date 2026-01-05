---
name: 'step-01-load-story'
description: 'Load story file, discover git changes, establish review context'

thisStepFile: '{installed_path}/steps/step-01-load-story.md'
nextStepFile: '{installed_path}/steps/step-02-build-attack-plan.md'
---

# Step 1: Load Story and Discover Changes

**Goal:** Load story file, extract all sections, discover actual git changes for comparison.

---

## STATE VARIABLES (capture now, persist throughout)

These variables MUST be set in this step and available to all subsequent steps:

- `{story_path}` - Path to the story file being reviewed
- `{story_key}` - Story identifier (e.g., "1-2-user-authentication")
- `{story_file_list}` - Files claimed in story's Dev Agent Record → File List
- `{git_changed_files}` - Files actually changed according to git
- `{git_discrepancies}` - Differences between story claims and git reality

---

## EXECUTION SEQUENCE

### 1. Identify Story

**If `{story_path}` provided by user:**

- Use the provided path directly

**If NOT provided:**

- Ask user which story file to review
- Wait for response before proceeding

### 2. Load Story File

- Read COMPLETE story file from `{story_path}`
- Extract `{story_key}` from filename (e.g., "1-2-user-authentication.md" → "1-2-user-authentication") or story metadata

### 3. Parse Story Sections

Extract and store:

- **Story**: Title, description, status
- **Acceptance Criteria**: All ACs with their requirements
- **Tasks/Subtasks**: All tasks with completion status ([x] vs [ ])
- **Dev Agent Record → File List**: Claimed file changes
- **Change Log**: History of modifications

Set `{story_file_list}` = list of files from Dev Agent Record → File List

### 4. Discover Git Changes

Check if git repository exists:

**If Git repo detected:**

```bash
git status --porcelain
git diff --name-only
git diff --cached --name-only
```

Compile `{git_changed_files}` = union of modified, staged, and new files

**If NOT a Git repo:**

Set `{git_changed_files}` = "NO_GIT"

### 5. Cross-Reference Story vs Git

Compare `{story_file_list}` with `{git_changed_files}`:

Set `{git_discrepancies}` with categories:

- **files_in_git_not_story**: Files changed in git but not in story File List
- **files_in_story_not_git**: Files in story File List but no git changes
- **uncommitted_undocumented**: Uncommitted changes not tracked in story

### 6. Load Project Context

- Load `{project_context}` if exists (`**/project-context.md`) for coding standards

---

## NEXT STEP DIRECTIVE

**CRITICAL:** When this step completes, explicitly state:

"**NEXT:** Loading `step-02-build-attack-plan.md`"

---

## SUCCESS METRICS

- `{story_path}` identified and loaded
- `{story_key}` extracted
- All story sections parsed
- `{story_file_list}` compiled from Dev Agent Record
- `{git_changed_files}` discovered via git commands
- `{git_discrepancies}` calculated
- `{project_context}` loaded if exists
- Explicit NEXT directive provided

## FAILURE MODES

- Proceeding without story file loaded
- Missing `{story_key}` extraction
- Not parsing all story sections
- Skipping git change discovery
- Not calculating discrepancies
- No explicit NEXT directive at step completion
