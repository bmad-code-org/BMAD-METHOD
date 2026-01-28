# Workflow Specification: update-saga

**Module:** rmtn-solo-dev
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** Update Saga based on completed Quests.

**Description:** Mimir analyzes completed Quests and code changes to update the `context.md` and `architecture.md` files, ensuring the Saga remains current.

**Workflow Type:** Feature

---

## Workflow Structure

### Entry Point

```yaml
---
name: update-saga
description: Update Saga based on completed Quests
web_bundle: true
installed_path: '{project-root}/_bmad/rmtn-solo-dev/workflows/update-saga'
---
```

### Mode

- [ ] Create-only (steps-c/)
- [x] Tri-modal (steps-c/, steps-e/, steps-v/) (Updating existing docs)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load Context | Read current Saga and completed Quest(s) |
| 2 | Analyze Changes | Determine impact on PRD/Arch |
| 3 | Draft Updates | Propose changes to Saga files |
| 4 | Review | User confirms updates |
| 5 | Commit | Write updated Saga files |

---

## Workflow Inputs

### Required Inputs

- Completed Quest(s)
- Current Saga

### Optional Inputs

- User notes

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- Updated `_bmad/saga/context.md`
- Updated `_bmad/saga/architecture.md`

---

## Agent Integration

### Primary Agent

Mimir

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-01-27 via BMAD Module workflow_
