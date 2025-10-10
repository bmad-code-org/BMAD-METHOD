---
last-redoc-date: 2025-10-01
---

# BMM Workflows - The Complete v6 Flow

The BMM (BMAD Method Module) orchestrates software development through four distinct phases, each with specialized workflows that adapt to project scale (Level 0-4) and context (greenfield vs brownfield). This document serves as the master guide for understanding how these workflows interconnect to deliver the revolutionary v6 methodology.

## Core v6 Innovations

**Scale-Adaptive Planning**: Projects automatically route through different workflows based on complexity (Level 0-4), ensuring appropriate documentation and process overhead.

**Just-In-Time Design**: Technical specifications are created one epic at a time during implementation, not all upfront, incorporating learnings as the project evolves.

**Dynamic Expertise Injection**: Story-context workflows provide targeted technical guidance per story, replacing static documentation with contextual expertise.

**Continuous Learning Loop**: Retrospectives feed improvements back into workflows, making each epic smoother than the last.

## The Four Phases

```
┌──────────────────────────────────────────────────────────────┐
│                    PHASE 1: ANALYSIS                         │
│                      (Optional)                              │
├──────────────────────────────────────────────────────────────┤
│  brainstorm-game ──┐                                         │
│  brainstorm-project ├──→ research ──→ product-brief  ──┐     │
│  game-brief ────────┘                                  │     │
└────────────────────────────────────────────────────────┼─────┘
                                                         ↓
┌──────────────────────────────────────────────────────────────┐
│                    PHASE 2: PLANNING                         │
│                  (Scale-Adaptive Router)                     │
├──────────────────────────────────────────────────────────────┤
│                    plan-project                              │
│                         ├──→ Level 0: tech-spec only         │
│                         ├──→ Level 1-2: PRD + tech-spec      │
│                         ├──→ Level 3-4: PRD + Epics ──────┐  │
│                         └──→ Game: GDD                    │  │
└───────────────────────────────────────────────────────────┼──┘
                                                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 3: SOLUTIONING                       │
│                    (Levels 3-4 Only)                         │
├──────────────────────────────────────────────────────────────┤
│  3-solutioning ──→ Architecture.md                           │
│       ↓                                                      │
│  tech-spec (per epic, JIT during implementation)             │
└────────────────────────────────────────────────────────────┬─┘
                                                             ↓
┌──────────────────────────────────────────────────────────────┐
│                  PHASE 4: IMPLEMENTATION                     │
│                    (Iterative Cycle)                         │
├──────────────────────────────────────────────────────────────┤
│  ┌─→ create-story ──→ story-context ──→ dev-story ──┐        │
│  │                                                  ↓        │
│  │   retrospective ←── [epic done] ←────── review-story      │
│  │                                            ↓              │
│  └──────────── correct-course ←──[if issues]──┘              │
└──────────────────────────────────────────────────────────────┘
```

## Phase 1: Analysis (Optional)

Optional workflows for project discovery and requirements gathering. Output feeds into Phase 2 planning.

### Workflows

| Workflow               | Purpose                                     | Output                 | When to Use           |
| ---------------------- | ------------------------------------------- | ---------------------- | --------------------- |
| **brainstorm-game**    | Game concept ideation using 5 methodologies | Concept proposals      | New game projects     |
| **brainstorm-project** | Software solution exploration               | Architecture proposals | New software projects |
| **game-brief**         | Structured game design foundation           | Game brief document    | Before GDD creation   |
| **product-brief**      | Strategic product planning culmination      | Product brief          | End of analysis phase |
| **research**           | Multi-mode research (market/technical/deep) | Research artifacts     | When evidence needed  |

### Flow

```
Brainstorming → Research → Brief → Planning (Phase 2)
```

## Phase 2: Planning (Required)

The central orchestrator that determines project scale and generates appropriate planning artifacts.

### Scale Levels

| Level | Scope                    | Outputs                 | Next Phase       |
| ----- | ------------------------ | ----------------------- | ---------------- |
| **0** | Single atomic change     | tech-spec only          | → Implementation |
| **1** | 1-10 stories, 1 epic     | Minimal PRD + tech-spec | → Implementation |
| **2** | 5-15 stories, 1-2 epics  | Focused PRD + tech-spec | → Implementation |
| **3** | 12-40 stories, 2-5 epics | Full PRD + Epics list   | → Solutioning    |
| **4** | 40+ stories, 5+ epics    | Enterprise PRD + Epics  | → Solutioning    |

### Routing Logic

```
plan-project
    ├─→ Detect project type (game/web/mobile/backend/etc)
    ├─→ Assess complexity → assign Level 0-4
    ├─→ Check context (greenfield/brownfield)
    │   └─→ If brownfield & undocumented:
    │       └─→ HALT: "Generate brownfield documentation first"
    │           └─→ (TBD workflow for codebase analysis)
    ├─→ Route to appropriate sub-workflow:
    │   ├─→ Game → GDD workflow
    │   ├─→ Level 0 → tech-spec workflow
    │   ├─→ Level 1-2 → PRD + embedded tech-spec
    │   └─→ Level 3-4 → PRD + epics → Solutioning
    └─→ Generate project-workflow-analysis.md (tracking doc)
```

### Key Outputs

- **PRD.md**: Product Requirements Document (Levels 1-4)
- **Epics.md**: Epic breakdown with stories (Levels 2-4)
- **tech-spec.md**: Technical specification (Levels 0-2 only)
- **GDD.md**: Game Design Document (game projects)
- **project-workflow-analysis.md**: Workflow state tracking

## Phase 3: Solutioning (Levels 3-4 Only)

Architecture and technical design phase for complex projects.

### Workflows

| Workflow          | Owner     | Purpose                        | Output                    | Timing            |
| ----------------- | --------- | ------------------------------ | ------------------------- | ----------------- |
| **3-solutioning** | Architect | Create overall architecture    | Architecture.md with ADRs | Once per project  |
| **tech-spec**     | Architect | Create epic-specific tech spec | tech-spec-epic-N.md       | One per epic, JIT |

### Just-In-Time Tech Specs

```
FOR each epic in sequence:
    WHEN ready to implement epic:
        Architect: Run tech-spec workflow for THIS epic only
        → Creates tech-spec-epic-N.md
        → Hands off to implementation
    IMPLEMENT epic completely
    THEN move to next epic
```

**Critical**: Tech specs are created ONE AT A TIME as epics are ready for implementation, not all upfront. This prevents over-engineering and incorporates learning.

## Phase 4: Implementation (Iterative)

The core development cycle that transforms requirements into working software.

### The Implementation Loop

```
┌─────────────────────────────────────────┐
│            SM: create-story             │
│   (Generate next story from epics.md)   │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│           SM: story-context             │
│  (Generate expertise injection XML)     │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│            DEV: dev-story               │
│  (Implement with context injection)     │
└─────────────────────┬───────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│         SR/DEV: review-story            │
│     (Validate against criteria)         │
└─────────────────────┬───────────────────┘
                      ↓
            ┌─────────┴─────────┐
            │    Issues Found?   │
            └─────────┬─────────┘
                ┌─────┴─────┐
                ↓           ↓
        [No: Next Story]  [Yes: correct-course]
                              ↓
                      [Return to appropriate step]
```

### Workflow Responsibilities

| Workflow           | Agent  | Purpose                      | Key Innovation             |
| ------------------ | ------ | ---------------------------- | -------------------------- |
| **create-story**   | SM     | Generate ONE story at a time | Enforces epics.md planning |
| **story-context**  | SM     | Create expertise injection   | JIT technical guidance     |
| **dev-story**      | DEV    | Implement with context       | Resumable after review     |
| **review-story**   | SR/DEV | Comprehensive validation     | Fresh context review       |
| **correct-course** | SM     | Handle issues/changes        | Adaptive response          |
| **retrospective**  | SM     | Capture epic learnings       | Continuous improvement     |

### Story Flow States

```
Draft (create-story)
  → Approved (SM approval)
    → In Progress (dev-story)
      → Ready for Review (dev complete)
        → Done (review passed)
        OR
        → In Progress (review failed, back to dev)
```

## Greenfield vs Brownfield Considerations

### Greenfield Projects

- Start with Phase 1 (Analysis) or Phase 2 (Planning)
- Clean architecture decisions in Phase 3
- Straightforward implementation in Phase 4

### Brownfield Projects

```
plan-project (Phase 2)
    ├─→ Check: Is existing codebase documented?
    │   ├─→ YES: Proceed with planning
    │   └─→ NO: HALT with message:
    │       "Brownfield project requires documentation.
    │        Please run codebase-analysis workflow first."
    │        └─→ [TBD: brownfield-analysis workflow]
    │            ├─→ Analyzes existing code
    │            ├─→ Documents current architecture
    │            ├─→ Identifies technical debt
    │            └─→ Creates baseline documentation
    └─→ Continue with scale-adaptive planning
```

**Critical for Brownfield**: Without adequate documentation of the existing system, the planning phase cannot accurately assess scope or create meaningful requirements. The brownfield-analysis workflow (coming soon) will:

- Map existing architecture
- Document current patterns
- Identify integration points
- Assess technical debt
- Create the baseline needed for planning

## Agent Participation by Phase

| Phase              | Primary Agents      | Supporting Agents           |
| ------------------ | ------------------- | --------------------------- |
| **Analysis**       | Analyst, Researcher | PM, PO                      |
| **Planning**       | PM                  | Analyst, UX Expert          |
| **Solutioning**    | Architect           | PM, Tech Lead               |
| **Implementation** | SM, DEV             | SR, PM (for correct-course) |

## Key Files and Artifacts

### Tracking Documents

- **project-workflow-analysis.md**: Maintains workflow state, level, and progress
- **Epics.md**: Master list of epics and stories (source of truth for planning)

### Phase Outputs

- **Phase 1**: Briefs and research documents
- **Phase 2**: PRD, Epics, or tech-spec based on level
- **Phase 3**: Architecture.md, epic-specific tech specs
- **Phase 4**: Story files, context XMLs, implemented code

## Best Practices

### 1. Respect the Scale

- Don't create PRDs for Level 0 changes
- Don't skip architecture for Level 3-4 projects
- Let the workflow determine appropriate artifacts

### 2. Embrace Just-In-Time

- Create tech specs one epic at a time
- Generate stories as needed, not in batches
- Build context injections per story

### 3. Maintain Flow Integrity

- Stories must be enumerated in Epics.md
- Each phase completes before the next begins
- Use fresh context windows for reviews

### 4. Document Brownfield First

- Never plan without understanding existing code
- Technical debt must be visible in planning
- Integration points need documentation

### 5. Learn Continuously

- Run retrospectives after each epic
- Update workflows based on learnings
- Share patterns across teams

## Common Pitfalls and Solutions

| Pitfall                           | Solution                              |
| --------------------------------- | ------------------------------------- |
| Creating all tech specs upfront   | Use JIT approach - one epic at a time |
| Skipping story-context generation | Always run after create-story         |
| Batching story creation           | Create one story at a time            |
| Ignoring scale levels             | Let plan-project determine level      |
| Planning brownfield without docs  | Run brownfield-analysis first         |
| Not running retrospectives        | Schedule after every epic             |

## Quick Reference Commands

```bash
# Phase 1: Analysis (Optional)
bmad analyst brainstorm-project
bmad analyst research
bmad analyst product-brief

# Phase 2: Planning
bmad pm plan-project

# Phase 3: Solutioning (L3-4)
bmad architect solution-architecture
bmad architect tech-spec  # Per epic, JIT

# Phase 4: Implementation
bmad sm create-story      # One at a time
bmad sm story-context     # After each story
bmad dev develop          # With context loaded
bmad dev review-story     # Or SR agent
bmad sm correct-course    # If issues
bmad sm retrospective     # After epic
```

## Future Enhancements

### Coming Soon

- **brownfield-analysis**: Automated codebase documentation generator
- **Workflow orchestration**: Automatic phase transitions
- **Progress dashboards**: Real-time workflow status
- **Team synchronization**: Multi-developer story coordination

### Under Consideration

- AI-assisted retrospectives
- Automated story sizing
- Predictive epic planning
- Cross-project learning transfer

---

This document serves as the authoritative guide to BMM v6a workflow execution. For detailed information about individual workflows, see their respective README files in the workflow folders.
