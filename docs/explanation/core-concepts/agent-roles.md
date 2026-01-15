---
title: "Agent Roles in BMad Method"
description: Understanding the different agent roles in BMad Method
---

BMad Method uses specialized AI agents, each with a distinct role, expertise, and personality. Understanding these roles helps you know which agent to use for each task.

## Core Agents Overview

| Agent | Role | Primary Phase |
|-------|------|---------------|
| **Analyst** | Research and discovery | Phase 1 (Analysis) |
| **PM** | Requirements and planning | Phase 2 (Planning) |
| **Architect** | Technical design | Phase 3 (Solutioning) |
| **SM** | Sprint orchestration | Phase 4 (Implementation) |
| **DEV** | Code implementation | Phase 4 (Implementation) |
| **TEA** | Test architecture | Phases 3-4 (Cross-phase) |
| **UX Designer** | User experience | Phase 2-3 |
| **Quick Flow Solo Dev** | Fast solo development | All phases (Quick Flow) |

## Phase 1: Analysis

### Analyst (Mary)

Business analysis and research specialist.

**Responsibilities:**
- Brainstorming and ideation
- Market, domain, and competitive research
- Product brief creation
- Brownfield project documentation

**Key Workflows:**
- `*brainstorm-project`
- `*research`
- `*product-brief`
- `*document-project`

**When to use:** Starting new projects, exploring ideas, validating market fit, documenting existing codebases.

## Phase 2: Planning

### PM (John)

Product requirements and planning expert.

**Responsibilities:**
- Creating Product Requirements Documents
- Defining functional and non-functional requirements
- Breaking requirements into epics and stories
- Validating implementation readiness

**Key Workflows:**
- `*create-prd`
- `*create-epics-and-stories`
- `*implementation-readiness`

**When to use:** Defining what to build, creating PRDs, organizing work into stories.

### UX Designer (Sally)

User experience and UI design specialist.

**Responsibilities:**
- UX specification creation
- User journey mapping
- Wireframe and mockup design
- Design system documentation

**Key Workflows:**
- `*create-ux-design`
- `*validate-design`

**When to use:** When UX is a primary differentiator, complex user workflows, design system creation.

## Phase 3: Solutioning

### Architect (Winston)

System architecture and technical design expert.

**Responsibilities:**
- System architecture design
- Architecture Decision Records (ADRs)
- Technical standards definition
- Implementation readiness validation

**Key Workflows:**
- `*create-architecture`
- `*implementation-readiness`

**When to use:** Multi-epic projects, cross-cutting technical decisions, preventing agent conflicts.

## Phase 4: Implementation

### SM (Bob)

Sprint planning and story preparation orchestrator.

**Responsibilities:**
- Sprint planning and tracking
- Story preparation for development
- Course correction handling
- Epic retrospectives

**Key Workflows:**
- `*sprint-planning`
- `*create-story`
- `*correct-course`
- `*epic-retrospective`

**When to use:** Organizing work, preparing stories, tracking progress.

### DEV (Amelia)

Story implementation and code review specialist.

**Responsibilities:**
- Story implementation with tests
- Code review
- Following architecture patterns
- Quality assurance

**Key Workflows:**
- `*dev-story`
- `*code-review`

**When to use:** Writing code, implementing stories, reviewing quality.

## Cross-Phase Agents

### TEA (Murat)

Test architecture and quality strategy expert.

**Responsibilities:**
- Test framework setup
- Test design and planning
- ATDD and automation
- Quality gate decisions

**Key Workflows:**
- `*framework`, `*ci`
- `*test-design`, `*atdd`, `*automate`
- `*test-review`, `*trace`, `*nfr-assess`

**When to use:** Setting up testing, creating test plans, quality gates.

## Quick Flow

### Quick Flow Solo Dev (Barry)

Fast solo development without handoffs.

**Responsibilities:**
- Technical specification
- End-to-end implementation
- Code review

**Key Workflows:**
- `*quick-spec`
- `*quick-dev`
- `*code-review`

**When to use:** Bug fixes, small features, rapid prototyping.

## Choosing the Right Agent

| Task | Agent |
|------|-------|
| Brainstorming ideas | Analyst |
| Market research | Analyst |
| Creating PRD | PM |
| Designing UX | UX Designer |
| System architecture | Architect |
| Preparing stories | SM |
| Writing code | DEV |
| Setting up tests | TEA |
| Quick bug fix | Quick Flow Solo Dev |
