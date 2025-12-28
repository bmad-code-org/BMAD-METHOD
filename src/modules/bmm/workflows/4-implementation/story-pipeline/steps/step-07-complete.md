---
name: 'step-07-complete'
description: 'Update sprint status and create git commit'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-07-complete.md'
nextStepFile: '{workflow_path}/steps/step-08-summary.md'

# Role Switch
role: sm
agentFile: '{project-root}/_bmad/bmm/agents/sm.md'
---

# Step 7: Complete Story

## ROLE SWITCH

**Switching back to SM (Scrum Master) perspective.**

You are completing the story lifecycle:
- Update sprint tracking
- Create git commit
- Finalize documentation

## STEP GOAL

Complete the story development lifecycle:
1. Final verification (tests, lint, build)
2. Update sprint-status.yaml
3. Create git commit with proper message
4. Update story file status

## MANDATORY EXECUTION RULES

### Completion Rules

- **VERIFY** everything passes before committing
- **UPDATE** all tracking files
- **COMMIT** with conventional commit message
- **DOCUMENT** completion metadata

## EXECUTION SEQUENCE

### 1. Final Verification

Run full verification suite:

```bash
npm test -- --run
npm run lint
npm run build
```

All must pass before proceeding.

**If any fail:** HALT and report issues.

### 2. Update Story File Status

Edit story file, update frontmatter:

```yaml
---
status: done
completed_at: {timestamp}
implementation_notes: |
  - Tests created and passing
  - Code reviewed and approved
  - {count} issues found and fixed
---
```

### 3. Update Sprint Status

Edit: `{sprint_artifacts}/sprint-status.yaml`

Find story {story_id} and update:

```yaml
stories:
  - id: "{story_id}"
    status: done
    completed_at: {timestamp}
    metadata:
      tests_passing: true
      code_reviewed: true
      issues_found: {count}
      issues_fixed: {count}
      pipeline_version: "story-pipeline-v2.0"
```

### 4. Stage Git Changes

```bash
git add src/
git add docs/sprint-artifacts/story-{story_id}.md
git add docs/sprint-artifacts/sprint-status.yaml
git add src/supabase/migrations/
```

### 5. Create Git Commit

Check for changes:
```bash
git diff --cached --quiet
```

If changes exist, create commit:

```bash
git commit -m "$(cat <<'EOF'
feat(epic-{epic_num}): complete story {story_id}

- Acceptance tests created for all criteria
- All tests passing (TDD green phase)
- Code reviewed: {issues_found} issues found and fixed

Story: {story_title}
Pipeline: story-pipeline-v2.0

🤖 Generated with BMAD Story Pipeline

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 6. Verify Commit

```bash
git log -1 --oneline
git status
```

Confirm:
- Commit created successfully
- Working directory clean (or only untracked files)

### 7. Update Pipeline State

Update state file:
- Add `7` to `stepsCompleted`
- Set `lastStep: 7`
- Set `steps.step-07-complete.status: completed`
- Set `status: completing`

### 8. Present Summary and Menu

Display:
```
Story {story_id} Completed

Sprint Status: Updated ✓
Story Status: done ✓
Git Commit: Created ✓

Commit: {commit_hash}
Message: feat(epic-{epic_num}): complete story {story_id}

Files Committed:
- {file_count} files

Next: Generate summary and audit trail
```

**Interactive Mode Menu:**
```
[C] Continue to Summary
[L] View git log
[S] View git status
[H] Halt (story is complete, audit pending)
```

**Batch Mode:** Auto-continue to summary

## QUALITY GATE

Before proceeding:
- [ ] All tests pass
- [ ] Lint clean
- [ ] Build succeeds
- [ ] Sprint status updated
- [ ] Git commit created
- [ ] Story status set to done

## CRITICAL STEP COMPLETION

**ONLY WHEN** [verification passes AND commit created AND status updated],
load and execute `{nextStepFile}` for summary generation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- All verification passes
- Sprint status updated correctly
- Conventional commit created
- Story marked as done
- Clean git state

### ❌ FAILURE
- Committing with failing tests
- Missing sprint status update
- Malformed commit message
- Not including all changed files
- Story not marked done
