---
name: 'step-01-load-story'
description: "Compare story's file list against git changes"
---

# Step 1: Load Story and Discover Changes

---

## STATE VARIABLES (capture now, persist throughout)

These variables MUST be set in this step and available to all subsequent steps:

- `story_path` - Path to the story file being reviewed
- `story_key` - Story identifier (e.g., "1-2-user-authentication")
- `story_content` - Complete, unmodified file content from story_path (loaded in substep 2)
- `story_file_list` - Files claimed in story's Dev Agent Record → File List
- `git_changed_files` - Files actually changed according to git
- `git_discrepancies` - Mismatches between `story_file_list` and `git_changed_files`

---

## EXECUTION SEQUENCE

### 1. Identify Story

Ask user: "Which story would you like to review?"

**Try input as direct file path first:**
If input resolves to an existing file:
  - Verify it's in `sprint_status` with status `review` or `done`
  - If verified → set `story_path` to that file path
  - If NOT verified → Warn user the file is not in sprint_status (or wrong status). Ask: "Continue anyway?"
    - If yes → set `story_path`
    - If no → return to user prompt (ask "Which story would you like to review?" again)

**Search sprint_status** (if input is not a direct file):
Search for stories with status `review` or `done`. Match by priority:
1. Story number resembles input closely enough (e.g., "1-2" matches "1 2", "1.2", "one dash two", "one two"; "1-32" matches "one thirty two"). Do NOT match if numbers differ (e.g., "1-33" does not match "1-32")
2. Exact story name/key (e.g., "1-2-user-auth-api")
3. Story name/title resembles input closely enough
4. Story description resembles input closely enough

**Resolution:**
- **Single match**: Confident. Set `story_path`, proceed to substep 2
- **Multiple matches**: Uncertain. Present all candidates to user. Wait for selection. Set `story_path`, proceed to substep 2
- **No match**: Ask user to clarify or provide the full story path. Return to user prompt (ask "Which story would you like to review?" again)

### 2. Load Story File

**Load file content:**
Read the complete contents of {story_path} and assign to `story_content` WITHOUT filtering, truncating or summarizing. If {story_path} cannot be read: report the error to the user and HALT the workflow.

**Extract story identifier:**
Verify the filename ends with `.md` extension. Remove `.md` to get `story_key` (e.g., "1-2-user-authentication.md" → "1-2-user-authentication"). If filename doesn't end with `.md` or the result is empty: report the error to the user and HALT the workflow.

### 3. Extract File List from Story

Extract `story_file_list` from the Dev Agent Record → File List section of {story_content}.

**If Dev Agent Record or File List section not found:** Report to user and set `story_file_list` = NO_FILE_LIST.

### 4. Discover Git Changes

Check if git repository exists.

**If NOT a git repo:** Set `git_changed_files` = NO_GIT, `git_discrepancies` = NO_GIT. Skip to substep 6.

**If git repo detected:**

```bash
git status --porcelain
git diff -M --name-only
git diff -M --cached --name-only
```

Compile `git_changed_files` = union of modified, staged, new, deleted, and renamed files.

### 5. Cross-Reference Story vs Git

Compare {story_file_list} with {git_changed_files}:

Set `git_discrepancies` with categories:

- **files_in_git_not_story**: Files changed in git but not in story File List
- **files_in_story_not_git**: Files in story File List but no git changes
- **uncommitted_undocumented**: Uncommitted changes not tracked in story

### 6. Load Project Context

- Load {project_context} if exists (**/project-context.md) for coding standards

---

## NEXT STEP DIRECTIVE

**CRITICAL:** When this step completes, explicitly state:

"**NEXT:** Loading `step-02-build-attack-plan.md`"

---

## SUCCESS METRICS

- `story_path` identified and loaded
- `story_key` extracted
- `story_content` captured completely and unmodified
- `story_file_list` compiled from Dev Agent Record
- `git_changed_files` discovered via git commands
- `git_discrepancies` calculated
- `project_context` loaded if exists
- Explicit NEXT directive provided

## FAILURE MODES

- Proceeding without story file loaded
- Missing `story_key` extraction
- `story_content` incomplete or modified (breaks later steps)
- Skipping git change discovery
- Not calculating discrepancies
- No explicit NEXT directive at step completion

