---
title: "How to Run Sprint Planning"
description: How to initialize sprint tracking for implementation
---


Use the `sprint-planning` workflow to initialize the sprint tracking file and organize work for implementation.

---

## When to Use This

- Once at the start of Phase 4 (Implementation)
- After implementation-readiness gate passes
- When starting a new sprint cycle

---

## Prerequisites

- BMad Method installed
- SM (Scrum Master) agent available
- Epic files created from `create-epics-and-stories`
- Implementation-readiness passed (for BMad Method/Enterprise)

---

## Steps

### 1. Load the SM Agent

Start a fresh chat and load the SM (Scrum Master) agent.

### 2. Run the Workflow

```
*sprint-planning
```

### 3. Provide Context

Point the agent to your epic files created during Phase 3.

### 4. Review Sprint Organization

The agent organizes stories into the sprint tracking file.

---

## What You Get

A `sprint-status.yaml` file containing:

- All epics with their stories
- Story status tracking (TODO, IN PROGRESS, READY FOR REVIEW, DONE)
- Dependencies between stories
- Priority ordering

---

## Story Lifecycle States

Stories move through these states in the sprint status file:

| State | Description |
|-------|-------------|
| **TODO** | Story identified but not started |
| **IN PROGRESS** | Story being implemented |
| **READY FOR REVIEW** | Implementation complete, awaiting code review |
| **DONE** | Accepted and complete |

---

## Typical Sprint Flow

### Sprint 0 (Planning Phase)
- Complete Phases 1-3
- PRD/GDD + Architecture complete
- Epics+Stories created via create-epics-and-stories

### Sprint 1+ (Implementation Phase)

**Start of Phase 4:**
1. SM runs `sprint-planning` (once)

**Per Story (repeat until epic complete):**
1. SM runs `create-story`
2. DEV runs `dev-story`
3. DEV runs `code-review`
4. Update sprint-status.yaml

**After Epic Complete:**
- SM runs `retrospective`
- Move to next epic

---

## Tips

- Run sprint-planning only once at Phase 4 start
- Use `sprint-status` during Phase 4 to check current state
- Keep the sprint-status.yaml file as single source of truth
- Update story status after each stage

---

## Related

- [Create Story](/docs/how-to/workflows/create-story.md) - Prepare stories for implementation
- [Implement Story](/docs/how-to/workflows/implement-story.md) - Dev workflow
- [Run Code Review](/docs/how-to/workflows/run-code-review.md) - Quality assurance
