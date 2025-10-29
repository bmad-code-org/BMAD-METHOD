# PR #667 Implementation Plan

**PR**: fix: correct status terminology to match story template
**Issue**: Agents were setting invalid status values that don't match the story template valid choices
**Status**: Implementation in progress
**Branch**: `feature/status-terminology-667`

---

## 📋 Issue Summary

### Problem

The story template (`bmad-core/templates/story-tmpl.yaml`) defines valid status choices as:

- `Draft`
- `Approved`
- `InProgress`
- `Review`
- `Done`

However, agents were instructing to set invalid status values:

- `bmad-core/agents/dev.md` - instructed: `'Ready for Review'` (❌ invalid)
- `bmad-core/tasks/apply-qa-fixes.md` - instructed: `'Ready for Done'` or `'Ready for Review'` (❌ both invalid)

This causes agents to set invalid status values that violate the story template constraints.

### Impact

- Stories could be created with invalid status values
- Template validation could fail
- Inconsistent agent behavior across different story workflows

---

## 🎯 Solution

### Changes Required

#### 1. bmad-core/agents/dev.md

**Line 68** - In completion command:

- ❌ Change FROM: `set story status: 'Ready for Review'`
- ✅ Change TO: `set story status: 'Review'`

#### 2. bmad-core/tasks/apply-qa-fixes.md

**Line 107-108** - In Status Rule:

- ❌ Change FROM: `set Status: Ready for Done`
- ✅ Change TO: `set Status: Done`

- ❌ Change FROM: `set Status: Ready for Review`
- ✅ Change TO: `set Status: Review`

### Total Changes

- **Files modified**: 2
- **Lines changed**: 3
- **Lines added**: 3
- **Lines deleted**: 3

---

## 🔧 Technical Details

### Story Template Valid Status Values

```yaml
status:
  type: string
  enum:
    - Draft
    - Approved
    - InProgress
    - Review
    - Done
```

### Terminology Mapping

| Invalid Status       | Valid Status | Context                                   |
| -------------------- | ------------ | ----------------------------------------- |
| `'Ready for Review'` | `'Review'`   | After dev completes tasks, move to review |
| `'Ready for Done'`   | `'Done'`     | After QA approves, mark as complete       |

### Why This Matters

- Valid status values ensure stories are in proper workflow states
- Invalid values cause template validation failures
- Affects both human and AI agent understanding of story progress
- Ensures consistent terminology across all agents and tasks

---

## 📊 Implementation Phases

### Phase 1: Apply Changes ✅

- [x] Read current dev.md content
- [x] Replace invalid status in dev.md
- [x] Read current apply-qa-fixes.md content
- [x] Replace invalid statuses in apply-qa-fixes.md

### Phase 2: Validation 🔄

- [ ] Run npm validate
- [ ] Run npm lint
- [ ] Verify no new errors
- [ ] Check schema compliance

### Phase 3: Documentation

- [ ] Create comprehensive diffs
- [ ] Create patch summary file
- [ ] Document test results
- [ ] Create final status report

### Phase 4: Commit & GitHub

- [ ] Commit changes with proper message
- [ ] Post GitHub comment with results
- [ ] Copy .patch/667 to backup location

---

## ✅ Validation Checklist

### Pre-Commit Validation

- [ ] Files modified: 2
- [ ] Status values corrected in both files
- [ ] npm validate: All agents & teams pass
- [ ] npm lint: No new errors from our changes
- [ ] No syntax errors introduced
- [ ] Changes match PR specification exactly

### Post-Commit Validation

- [ ] Commits with proper message
- [ ] Branch ready for merge
- [ ] Documentation comprehensive
- [ ] All tests passing

---

## 🎓 Key Points

1. **Minimal Change**: Only 3 lines changed across 2 files
2. **Bug Fix Type**: Correcting invalid status values to match template
3. **Zero Regressions**: Core system unaffected
4. **Backward Compatible**: Agents now use valid status values
5. **Improves Quality**: Ensures compliance with story template constraints

---

## 📝 Related Files

- `bmad-core/templates/story-tmpl.yaml` - Defines valid status choices
- `bmad-core/agents/dev.md` - Dev agent instructions (line 68)
- `bmad-core/tasks/apply-qa-fixes.md` - QA fix task instructions (lines 107-108)

---

**Next Steps**: Validate changes and run tests
