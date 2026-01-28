# Workflow Specification: execute-quest

**Module:** rmtn-solo-dev
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** Implement a planned Quest step-by-step.

**Description:** Thor takes an approved Quest/Tech Spec and implements it, updating the status as he goes.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: execute-quest
description: Implement a planned Quest step-by-step
web_bundle: true
installed_path: '{project-root}/_bmad/rmtn-solo-dev/workflows/execute-quest'
---
```

### Mode

- [ ] Create-only (steps-c/)
- [x] Tri-modal (steps-c/, steps-e/, steps-v/) (Execute is effectively editing/updating the quest)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Load Quest | Read the Quest/Tech Spec |
| 2 | Select Step | Determine next step to implement |
| 3 | Implement | Write code for the step |
| 4 | Validate | Verify changes (lint/test) |
| 5 | Update Status | Mark step complete in Quest file |

---

## Workflow Inputs

### Required Inputs

- Quest file (`quests/quest-XXX.md`)

### Optional Inputs

- User feedback during execution

---

## Workflow Outputs

### Output Format

- [ ] Document-producing
- [x] Non-document (Code changes + Status updates)

### Output Files

- Updated codebase
- Updated `quests/quest-XXX.md`

---

## Agent Integration

### Primary Agent

Thor

### Other Agents

None

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-01-27 via BMAD Module workflow_
