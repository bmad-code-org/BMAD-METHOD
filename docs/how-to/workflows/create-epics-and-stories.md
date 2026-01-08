---
title: "How to Create Epics and Stories"
description: How to break PRD requirements into epics and stories using BMad Method
---


Use the `create-epics-and-stories` workflow to transform PRD requirements into bite-sized stories organized into deliverable epics.

---

## When to Use This

- After architecture workflow completes
- When PRD contains FRs/NFRs ready for implementation breakdown
- Before implementation-readiness gate check

---

## Prerequisites

- BMad Method installed
- PM agent available
- PRD completed
- Architecture completed

---

## Why After Architecture?

This workflow runs AFTER architecture because:

1. **Informed Story Sizing** - Architecture decisions affect story complexity
2. **Dependency Awareness** - Architecture reveals technical dependencies
3. **Technical Feasibility** - Stories can be properly scoped knowing the tech stack
4. **Consistency** - All stories align with documented architectural patterns

---

## Steps

### 1. Load the PM Agent

Start a fresh chat and load the PM agent.

### 2. Run the Workflow

```
*create-epics-and-stories
```

### 3. Provide Context

Point the agent to:
- Your PRD (FRs/NFRs)
- Your architecture document
- Optional: UX design artifacts

### 4. Review Epic Breakdown

The agent organizes requirements into logical epics with user stories.

### 5. Validate Story Quality

Ensure each story has:
- Clear acceptance criteria
- Appropriate priority
- Identified dependencies
- Technical notes from architecture

---

## What You Get

Epic files (one per epic) containing:

1. **Epic objective and scope**
2. **User stories with acceptance criteria**
3. **Story priorities** (P0/P1/P2/P3)
4. **Dependencies between stories**
5. **Technical notes** referencing architecture decisions

---

## Example

E-commerce PRD with FR-001 (User Registration), FR-002 (Product Catalog) produces:

- **Epic 1: User Management** (3 stories)
  - Story 1.1: User registration form
  - Story 1.2: Email verification
  - Story 1.3: Login/logout

- **Epic 2: Product Display** (4 stories)
  - Story 2.1: Product listing page
  - Story 2.2: Product detail page
  - Story 2.3: Search functionality
  - Story 2.4: Category filtering

Each story references relevant ADRs from architecture.

---

## Story Priority Levels

| Priority | Meaning |
|----------|---------|
| **P0** | Critical - Must have for MVP |
| **P1** | High - Important for release |
| **P2** | Medium - Nice to have |
| **P3** | Low - Future consideration |

---

## Tips

- Keep stories small enough to complete in a session
- Ensure acceptance criteria are testable
- Document dependencies clearly
- Reference architecture decisions in technical notes

---

## Next Steps

After creating epics and stories:

1. **Implementation Readiness** - Validate alignment before Phase 4
2. **Sprint Planning** - Organize work for implementation

---

## Related

- [Create Architecture](/docs/how-to/workflows/create-architecture.md) - Do this first
- [Run Implementation Readiness](/docs/how-to/workflows/run-implementation-readiness.md) - Gate check
- [Run Sprint Planning](/docs/how-to/workflows/run-sprint-planning.md) - Start implementation
