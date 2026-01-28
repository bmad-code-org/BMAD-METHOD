# Workflow Specification: new-quest

**Module:** rmtn-solo-dev
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** Plan a new feature (Approach scoring + Tech Spec).

**Description:** Thor reads the Saga and user request, brainstorms 3 approaches, scores them (Risk/Impact/Ease), selects the best one, and drafts a detailed Tech Spec.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: new-quest
description: Plan a new feature (Approach scoring + Tech Spec)
web_bundle: true
installed_path: '{project-root}/_bmad/rmtn-solo-dev/workflows/new-quest'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Briefing | Get user request and read Saga |
| 2 | Strategize | Brainstorm 3 approaches and score them |
| 3 | Select & Plan | Select best approach and draft Tech Spec |
| 4 | Review | User reviews Tech Spec |
| 5 | Create Quest | Write Quest file to quests/ folder |

---

## Workflow Inputs

### Required Inputs

- User Request
- Saga (`context.md`, `architecture.md`)

### Optional Inputs

- Specific file references

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `quests/quest-{id}-{name}.md`

---

## Agent Integration

### Primary Agent

Thor

### Other Agents

Mimir (Context provider via Saga)

---

## Implementation Notes

**Use the create-workflow workflow to build this workflow.**

---

_Spec created on 2026-01-27 via BMAD Module workflow_
