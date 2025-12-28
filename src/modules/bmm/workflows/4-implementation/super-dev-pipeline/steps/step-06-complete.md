---
name: 'step-06-complete'
description: 'Commit and push story changes with targeted file list'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-06-complete.md'
nextStepFile: '{workflow_path}/steps/step-07-summary.md'

# Role Switch
role: sm
---

# Step 6: Complete Story

## ROLE SWITCH

**Switching to SM (Scrum Master) perspective.**

You are now completing the story and preparing changes for git commit.

## STEP GOAL

Complete the story with safety checks:
1. Extract file list from story
2. Stage only story-related files
3. Generate commit message
4. Create commit
5. Push to remote (if configured)
6. Update story status

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

### 6. Create Commit

```bash
git commit -m "$(cat <<'EOF'
{commit_message}
EOF
)"
```

Verify commit created:
```bash
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

### 8. Update Story Status

Update story file frontmatter:
```yaml
status: review  # Ready for human review
```

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

Before proceeding:
- [ ] Targeted files staged (from File List)
- [ ] Commit message generated
- [ ] Commit created successfully
- [ ] Story status updated to "review"

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
