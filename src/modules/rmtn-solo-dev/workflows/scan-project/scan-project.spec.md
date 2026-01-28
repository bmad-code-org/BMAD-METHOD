# Workflow Specification: scan-project

**Module:** rmtn-solo-dev
**Status:** Placeholder — To be created via create-workflow workflow
**Created:** 2026-01-27

---

## Workflow Overview

**Goal:** Scan codebase to generate Saga (PRD/Arch).

**Description:** Mimir analyzes the codebase and user description to generate the `context.md` (PRD) and `architecture.md` files, establishing the source of truth for the project.

**Workflow Type:** Core

---

## Workflow Structure

### Entry Point

```yaml
---
name: scan-project
description: Scan codebase to generate Saga (PRD/Arch)
web_bundle: true
installed_path: '{project-root}/_bmad/rmtn-solo-dev/workflows/scan-project'
---
```

### Mode

- [x] Create-only (steps-c/)
- [ ] Tri-modal (steps-c/, steps-e/, steps-v/)

---

## Planned Steps

| Step | Name | Goal |
|------|------|------|
| 1 | Welcome & Input | Get user description of the project |
| 2 | Scan Codebase | Use tools to list files and read key files |
| 3 | Analyze & Draft | Draft context.md and architecture.md |
| 4 | Review | Present drafts to user for approval |
| 5 | Finalize | Write files to Saga folder |

---

## Workflow Inputs

### Required Inputs

- Codebase (file system access)
- User description/intent

### Optional Inputs

- Existing documentation

---

## Workflow Outputs

### Output Format

- [x] Document-producing
- [ ] Non-document

### Output Files

- `_bmad/saga/context.md`
- `_bmad/saga/architecture.md`

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
