---
title: "The Four Phases of BMad Method"
description: Understanding the four phases of the BMad Method
---


BMad Method uses a four-phase approach that adapts to project complexity while ensuring consistent quality.

## Phase Overview

| Phase | Name | Purpose | Required? |
|-------|------|---------|-----------|
| **Phase 1** | Analysis | Exploration and discovery | Optional |
| **Phase 2** | Planning | Requirements definition | Required |
| **Phase 3** | Solutioning | Technical design | Track-dependent |
| **Phase 4** | Implementation | Building the software | Required |

## Phase 1: Analysis (Optional)

Exploration and discovery workflows that help validate ideas and understand markets before planning.

**Workflows:**
- `brainstorm-project` - Solution exploration
- `research` - Market/technical/competitive research
- `product-brief` - Strategic vision capture

**When to use:**
- Starting new projects
- Exploring opportunities
- Validating market fit

**When to skip:**
- Clear requirements
- Well-defined features
- Continuing existing work

## Phase 2: Planning (Required)

Requirements definition using the scale-adaptive system to match planning depth to project complexity.

**Workflows:**
- `prd` - Product Requirements Document (BMad Method/Enterprise)
- `tech-spec` - Technical specification (Quick Flow)
- `create-ux-design` - Optional UX specification

**Key principle:**
Define **what** to build and **why**. Leave **how** to Phase 3.

## Phase 3: Solutioning (Track-Dependent)

Technical architecture and design decisions that prevent agent conflicts during implementation.

**Workflows:**
- `architecture` - System design with ADRs
- `create-epics-and-stories` - Work breakdown (after architecture)
- `implementation-readiness` - Gate check

**Required for:**
- BMad Method (complex projects)
- Enterprise Method

**Skip for:**
- Quick Flow (simple changes)

**Key principle:**
Make technical decisions explicit so all agents implement consistently.

## Phase 4: Implementation (Required)

Iterative sprint-based development with story-centric workflow.

**Workflows:**
- `sprint-planning` - Initialize tracking
- `create-story` - Prepare stories
- `dev-story` - Implement with tests
- `code-review` - Quality assurance
- `retrospective` - Continuous improvement

:::tip[Key Principle]
One story at a time — complete each story's full lifecycle before starting the next.
:::

## Phase Flow by Track

### Quick Flow

```
Phase 2 (tech-spec) → Phase 4 (implement)
```

Skip Phases 1 and 3 for simple changes.

### BMad Method

```
Phase 1 (optional) → Phase 2 (PRD) → Phase 3 (architecture) → Phase 4 (implement)
```

Full methodology for complex projects.

### Enterprise

```
Phase 1 → Phase 2 (PRD) → Phase 3 (architecture + extended) → Phase 4 (implement)
```

Same as BMad Method with optional extended workflows.
