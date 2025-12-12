# BMM Implementation Workflows (Phase 4)

## Overview

Phase 4 (Implementation) workflows manage the iterative sprint-based development cycle using a **story-centric workflow** where each story moves through a defined lifecycle from creation to completion.

**Key principle:** One story at a time, move it through the entire lifecycle before starting the next.

---

## Complete Workflow Context

Phase 4 is the final phase of the BMad Method workflow. To see how implementation fits into the complete methodology:

The BMad Method consists of four phases working in sequence:

1. **Phase 1 (Analysis)** - Optional exploration and discovery workflows
2. **Phase 2 (Planning)** - Required requirements definition using scale-adaptive system
3. **Phase 3 (Solutioning)** - Technical architecture and design decisions
4. **Phase 4 (Implementation)** - Iterative sprint-based development with story-centric workflow

Phase 4 focuses on the iterative epic and story cycles where stories are implemented, reviewed, and completed one at a time.

For a visual representation of the complete workflow, see: [workflow-method-greenfield.excalidraw](./images/workflow-method-greenfield.excalidraw)

---

## Quick Reference

| Workflow            | Agent | When                  | Purpose                               |
| ------------------- | ----- | --------------------- | ------------------------------------- |
| **sprint-planning** | SM    | Once at Phase 4 start | Initialize sprint tracking file       |
| **create-story**    | SM    | Per story             | Create next story from epic backlog   |
| **dev-story**       | DEV   | Per story             | Implement story with tests            |
| **code-review**     | DEV   | Per story             | Senior dev quality review             |
| **retrospective**   | SM    | After epic complete   | Review lessons and extract insights   |
| **correct-course**  | SM    | When issues arise     | Handle significant mid-sprint changes |

---

## Agent Roles

### SM (Scrum Master) - Primary Implementation Orchestrator

**Workflows:** sprint-planning, create-story, retrospective, correct-course

**Responsibilities:**

- Initialize and maintain sprint tracking
- Create stories from epic backlog
- Handle course corrections when issues arise
- Facilitate retrospectives after epic completion
- Orchestrate overall implementation flow

### DEV (Developer) - Implementation and Quality

**Workflows:** dev-story, code-review

**Responsibilities:**

- Implement stories with tests
- Perform senior developer code reviews
- Ensure quality and adherence to standards
- Complete story implementation lifecycle

---

## Story Lifecycle States

Stories move through these states in the sprint status file:

1. **TODO** - Story identified but not started
2. **IN PROGRESS** - Story being implemented (create-story → dev-story)
3. **READY FOR REVIEW** - Implementation complete, awaiting code review
4. **DONE** - Accepted and complete

---

## Typical Sprint Flow

### Sprint 0 (Planning Phase)

- Complete Phases 1-3 (Analysis, Planning, Solutioning)
- PRD/GDD + Architecture complete
- **V6: Epics+Stories created via create-epics-and-stories workflow (runs AFTER architecture)**

### Sprint 1+ (Implementation Phase)

**Start of Phase 4:**

1. SM runs `sprint-planning` (once)

**Per Epic:**

- Epic context and stories are already prepared from Phase 3

**Per Story (repeat until epic complete):**

1. SM runs `create-story`
2. DEV runs `dev-story`
3. DEV runs `code-review`
4. If code review fails: DEV fixes issues in `dev-story`, then re-runs `code-review`

**After Epic Complete:**

- SM runs `retrospective`
- Move to next epic

**As Needed:**

- Run `sprint-status` anytime in Phase 4 to inspect sprint-status.yaml and get the next implementation command
- Run `workflow-status` for cross-phase routing and project-level paths
- Run `correct-course` if significant changes needed

---

## Key Principles

### One Story at a Time

Complete each story's full lifecycle before starting the next. This prevents context switching and ensures quality.

### Quality Gates

Every story goes through `code-review` before being marked done. No exceptions.

### Continuous Tracking

The `sprint-status.yaml` file is the single source of truth for all implementation progress.

---

### (BMad Method / Enterprise)

```
PRD (PM) → Architecture (Architect)
  → create-epics-and-stories (PM)  ← V6: After architecture!
  → implementation-readiness (Architect)
  → sprint-planning (SM, once)
  → [Per Epic]:
      → story loop (SM/DEV)
      → retrospective (SM)
  → [Next Epic]
Current Phase: 4 (Implementation)
Current Epic: Epic 1 (Authentication)
Current Sprint: Sprint 1

Next Story: Story 1.3 (Email Verification)
Status: TODO
Dependencies: Story 1.2 (DONE) ✅

**Recommendation:** Run `create-story` to generate Story 1.3

After create-story:
1. Run dev-story
2. Run code-review
3. Update sprint-status.yaml to mark story done
```

See: [workflow-status instructions](../workflows/workflow-status/instructions.md)

---

### document-project

**Purpose:** Analyze and document brownfield projects by scanning codebase, architecture, and patterns.

**Agent:** Analyst
**Duration:** 1-3 hours
**When to Use:** Brownfield projects without documentation

**How It Works:**

1. Scans codebase structure
2. Identifies architecture patterns
3. Documents technology stack
4. Creates reference documentation
5. Generates PRD-like document from existing code

**Output:** `project-documentation-{date}.md`

**When to Run:**

- Before starting work on legacy project
- When inheriting undocumented codebase
- Creating onboarding documentation

See: [document-project reference](./workflow-document-project-reference.md)

## Related Documentation

- [Phase 1: Analysis Workflows](./workflows-analysis.md)
- [Phase 2: Planning Workflows](./workflows-planning.md)
- [Phase 3: Solutioning Workflows](./workflows-solutioning.md)

## Troubleshooting

**Q: Which workflow should I run next?**
A: Run `workflow-status` - it reads the sprint status file and tells you exactly what to do. During implementation (Phase 4) run `sprint-status` (fast check against sprint-status.yaml).

**Q: Story needs significant changes mid-implementation?**
A: Run `correct-course` to analyze impact and route appropriately.

**Q: Can I work on multiple stories in parallel?**
A: Not recommended. Complete one story's full lifecycle before starting the next. Prevents context switching and ensures quality.

**Q: What if code review finds issues?**
A: DEV runs `dev-story` to make fixes, re-runs tests, then runs `code-review` again until it passes.

_Phase 4 Implementation - One story at a time, done right._
