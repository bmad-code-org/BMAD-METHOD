---
last-redoc-date: 2025-10-12
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
│  game-brief ────────┘                          game-brief ┘  │
└────────────────────────────────────────────────────────┼─────┘
                                                         ↓
┌──────────────────────────────────────────────────────────────┐
│                    PHASE 2: PLANNING                         │
│              (Scale-Adaptive Router - by type)               │
├──────────────────────────────────────────────────────────────┤
│  SOFTWARE: prd          GAMES: gdd            │
│      ├──→ Level 0: tech-spec only      ├──→ GDD (all levels) │
│      ├──→ Level 1: tech-spec only      └──→ Narrative design │
│      ├──→ Level 2: PRD + tech-spec                           │
│      └──→ Level 3-4: PRD + Epics ────────────────────────┐   │
└──────────────────────────────────────────────────────────┼───┘
                                                           ↓
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 3: SOLUTIONING                       │
│              (Software Levels 3-4 / Complex Games)           │
├──────────────────────────────────────────────────────────────┤
│  3-solutioning ──→ architecture.md                  │
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

## Universal Entry Point: workflow-status

**Before starting any workflow, check your status!**

The `workflow-status` workflow is the **universal entry point** for all BMM workflows:

```bash
bmad analyst workflow-status
# or
bmad pm workflow-status
```

**What it does:**

- ✅ Checks for existing workflow status file
- ✅ Displays current phase, progress, and next action
- ✅ Helps new users plan their workflow approach
- ✅ Guides brownfield projects to documentation first
- ✅ Routes to appropriate workflows based on context

**No status file?** It will:

1. Ask about project context (greenfield vs brownfield)
2. Offer analysis options (full analysis, skip to planning, or quick tech spec)
3. Guide you to the right first workflow

**Status file exists?** It will:

1. Display current phase and progress
2. Show Phase 4 implementation state (BACKLOG/TODO/IN PROGRESS/DONE)
3. Recommend exact next action
4. Offer to change workflow or display menu

**All agents (bmad-master, analyst, pm) should check workflow-status on load.**

---

## Phase 1: Analysis (Optional)

Optional workflows for project discovery and requirements gathering. Output feeds into Phase 2 planning.

### Workflows

| Workflow               | Purpose                                     | Output                    | When to Use            |
| ---------------------- | ------------------------------------------- | ------------------------- | ---------------------- |
| **workflow-status**    | Universal entry point and status checker    | Status display + guidance | **Always start here!** |
| **brainstorm-game**    | Game concept ideation using 5 methodologies | Concept proposals         | New game projects      |
| **brainstorm-project** | Software solution exploration               | Architecture proposals    | New software projects  |
| **game-brief**         | Structured game design foundation           | Game brief document       | Before GDD creation    |
| **product-brief**      | Strategic product planning culmination      | Product brief             | End of analysis phase  |
| **research**           | Multi-mode research (market/technical/deep) | Research artifacts        | When evidence needed   |

### Flow

```
workflow-status (check) → Brainstorming → Research → Brief → Planning (Phase 2)
```

## Phase 2: Planning (Required)

The central orchestrator that determines project scale and generates appropriate planning artifacts.

### Scale Levels

| Level | Scope                    | Outputs                        | Next Phase                     |
| ----- | ------------------------ | ------------------------------ | ------------------------------ |
| **0** | Single atomic change     | tech-spec + 1 story            | → Implementation               |
| **1** | 1-10 stories, 1 epic     | tech-spec + epic + 2-3 stories | → Implementation               |
| **2** | 5-15 stories, 1-2 epics  | PRD + epics                    | → Tech-spec → Implementation   |
| **3** | 12-40 stories, 2-5 epics | PRD + epics                    | → Solutioning → Implementation |
| **4** | 40+ stories, 5+ epics    | PRD + epics                    | → Solutioning → Implementation |

**Key Changes (v6a):**

- **Level 0**: Now generates a single user story in addition to tech-spec
- **Level 1**: Now generates 2-3 stories as part of planning (prefer longer stories over more stories)
- Both Level 0/1 skip Phase 3 and populate Phase 4 story backlog automatically

### Routing Logic

**Universal Entry Point** (workflow-status):

```
workflow-status
    ├─→ Check for existing status file
    │   ├─→ If exists: Display status + recommend next action
    │   └─→ If not exists: Guide workflow planning
    ├─→ Determine project context (greenfield/brownfield)
    ├─→ Determine project type (game/web/mobile/backend/etc)
    ├─→ Assess complexity → assign Level 0-4
    ├─→ Map complete workflow journey
    └─→ Generate bmm-workflow-status.md + direct to first workflow
```

**Direct Routing** (no intermediate routers):

```
workflow-status determines routing:

    SOFTWARE PROJECTS:
    ├─→ Level 0-1 → bmad architect tech-spec
    │   └─→ Validates status file + level
    │   └─→ Generates tech-spec.md + stories
    │   └─→ Direct to Phase 4 (implementation)
    │
    ├─→ Level 2 → bmad pm prd
    │   └─→ Validates status file + level
    │   └─→ Generates PRD.md + epics.md
    │   └─→ Then: bmad architect tech-spec (lightweight solutioning)
    │   └─→ Then: Phase 4 (implementation)
    │
    └─→ Level 3-4 → bmad pm prd
        └─→ Validates status file + level
        └─→ Generates PRD.md + epics.md
        └─→ Then: Phase 3 (architecture)
        └─→ Then: Phase 4 (implementation)

    GAME PROJECTS:
    └─→ All Levels → bmad pm gdd
        └─→ Validates status file + project type
        └─→ Generates GDD.md + epics.md
        └─→ Optional: narrative design
        └─→ Then: Phase 3 or 4 (based on complexity)
```

### Key Outputs

- **PRD.md**: Product Requirements Document (Levels 2-4)
- **Epics.md**: Epic breakdown with stories (Levels 2-4)
- **epic-stories.md**: Epic summary with story links (Level 1)
- **tech-spec.md**: Technical specification (Levels 0-2 only)
- **story-{slug}.md**: Single user story (Level 0)
- **story-{slug}-1.md, story-{slug}-2.md, story-{slug}-3.md**: User stories (Level 1)
- **GDD.md**: Game Design Document (game projects)
- **bmm-workflow-status.md**: Versioned workflow state tracking with story backlog

## Phase 3: Solutioning (Levels 3-4 Only)

Architecture and technical design phase for complex projects.

### Workflows

| Workflow          | Owner     | Purpose                        | Output                    | Timing            |
| ----------------- | --------- | ------------------------------ | ------------------------- | ----------------- |
| **3-solutioning** | Architect | Create overall architecture    | architecture.md with ADRs | Once per project  |
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

### The Story State Machine

Phase 4 uses a 4-state lifecycle to manage story progression, tracked in `bmm-workflow-status.md`:

```
BACKLOG → TODO → IN PROGRESS → DONE
```

#### State Definitions

- **BACKLOG**: Ordered list of stories to be drafted (populated at phase transition)
  - Contains all stories with IDs, titles, and file names
  - Order is sequential (Epic 1 stories first, then Epic 2, etc.)

- **TODO**: Single story that needs drafting (or drafted, awaiting approval)
  - SM drafts story here using `create-story` workflow
  - Story status is "Draft" until user approves
  - User runs `story-ready` workflow to approve

- **IN PROGRESS**: Single story approved for development
  - Moved here by `story-ready` workflow
  - DEV implements using `dev-story` workflow
  - Story status is "Ready" or "In Review"

- **DONE**: Completed stories with dates and points
  - Moved here by `story-done` workflow after DoD complete
  - Immutable record of completed work

**Key Innovation**: Agents never search for "next story" - they always read the exact story from the status file.

### The Implementation Loop

```
Phase Transition (Phase 2 or 3 → Phase 4)
  ↓
┌─────────────────────────────────────────────────┐
│  BACKLOG populated with all stories              │
│  TODO initialized with first story               │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  SM: create-story (drafts story in TODO)        │
│  Reads: status file TODO section                │
│  Output: Story file with Status="Draft"         │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  User reviews story                              │
│  ↓                                               │
│  SM: story-ready (approves story)                │
│  Actions: TODO → IN PROGRESS                     │
│           BACKLOG → TODO (next story)            │
│           Story Status = "Ready"                 │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  SM: story-context (optional but recommended)   │
│  Generates expertise injection XML               │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  DEV: dev-story (implements story)               │
│  Reads: status file IN PROGRESS section         │
│  Implements with context injection               │
└───────────────────┬─────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  User reviews implementation (DoD check)         │
│  ↓                                               │
│  DEV: story-done (marks story done)          │
│  Actions: IN PROGRESS → DONE                     │
│           TODO → IN PROGRESS (if exists)         │
│           BACKLOG → TODO (if exists)             │
│           Story Status = "Done"                  │
└───────────────────┬─────────────────────────────┘
                    ↓
            ┌───────┴────────┐
            │  More stories?  │
            └───────┬─────────┘
                ┌───┴───┐
                ↓       ↓
          [Yes: Loop]  [No: Epic/Project Complete]
                         ↓
                   [retrospective]
```

### Workflow Responsibilities

| Workflow           | Agent  | Purpose                               | State Transition      | No Search Required       |
| ------------------ | ------ | ------------------------------------- | --------------------- | ------------------------ |
| **create-story**   | SM     | Draft story from TODO section         | (Story stays in TODO) | Reads TODO section       |
| **story-ready**    | SM     | Approve drafted story for development | TODO → IN PROGRESS    | Reads TODO section       |
| **story-context**  | SM     | Generate expertise injection XML      | (No state change)     | Reads IN PROGRESS        |
| **dev-story**      | DEV    | Implement story                       | (No state change)     | Reads IN PROGRESS        |
| **story-done**     | DEV    | Mark story done after DoD complete    | IN PROGRESS → DONE    | Reads IN PROGRESS        |
| **review-story**   | SR/DEV | Quality validation (optional)         | (No state change)     | Manual story selection   |
| **correct-course** | SM     | Handle issues/changes                 | (Adaptive)            | Manual story selection   |
| **retrospective**  | SM     | Capture epic learnings                | (No state change)     | Manual or epic-triggered |

### Story File Status Values

Stories have a `Status:` field in their markdown file that reflects their position in the state machine:

```
Status: Draft       (Story created by create-story, awaiting user review)
  ↓
Status: Ready       (User approved via story-ready, ready for implementation)
  ↓
Status: In Review   (Implementation complete, awaiting final approval)
  ↓
Status: Done        (User approved via story-done, DoD complete)
```

**Status File Position vs Story File Status:**

| Status File State | Story File Status    | Meaning                               |
| ----------------- | -------------------- | ------------------------------------- |
| BACKLOG           | (file doesn't exist) | Story not yet drafted                 |
| TODO              | Draft                | Story drafted, awaiting user approval |
| IN PROGRESS       | Ready or In Review   | Story approved for development        |
| DONE              | Done                 | Story complete, DoD met               |

## Greenfield vs Brownfield Considerations

### Greenfield Projects

- Start with Phase 1 (Analysis) or Phase 2 (Planning)
- Clean architecture decisions in Phase 3
- Straightforward implementation in Phase 4

### Brownfield Projects

```
workflow-init (Phase 2)
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
| **Planning**       | PM                  | Analyst, UX Designer        |
| **Solutioning**    | Architect           | PM, Tech Lead               |
| **Implementation** | SM, DEV             | SR, PM (for correct-course) |

## Key Files and Artifacts

### Tracking Documents

- **bmm-workflow-status.md**: Versioned workflow state tracking with 4-section story backlog
  - **BACKLOG**: Ordered list of stories to be drafted
  - **TODO**: Single story ready for drafting (or drafted, awaiting approval)
  - **IN PROGRESS**: Single story approved for development
  - **DONE**: Completed stories with dates and points
  - Populated automatically at phase transitions
  - Single source of truth for story progression
  - Agents read (never search) to know what to work on next

- **Epics.md**: Master list of epics and stories (source of truth for planning, Level 2-4)

### Phase Outputs

- **Phase 1**: Briefs and research documents
- **Phase 2**:
  - Level 0: tech-spec.md + story-{slug}.md
  - Level 1: tech-spec.md + epic-stories.md + story-{slug}-N.md files
  - Level 2: PRD.md + epics.md (then tech-spec.md in Phase 3)
  - Level 3-4: PRD.md + epics.md (then architecture.md in Phase 3)
- **Phase 3**: architecture.md, epic-specific tech specs
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
| Ignoring scale levels             | Let workflow init determine level     |
| Planning brownfield without docs  | Run brownfield-analysis first         |
| Not running retrospectives        | Schedule after every epic             |

## Quick Reference Commands

```bash
# Universal Entry Point (Start Here!)
bmad analyst workflow-status  # Check status and get recommendations

# Phase 1: Analysis (Optional)
bmad analyst brainstorm-project
bmad analyst research
bmad analyst product-brief

# Phase 2: Planning
bmad pm prd             # Level 2-4 software projects
bmad architect tech-spec # Level 0-1 software projects
bmad pm gdd             # Game projects

# Phase 3: Solutioning (L3-4)
bmad architect architecture
bmad architect tech-spec  # Per epic, JIT

# Phase 4: Implementation
bmad sm create-story      # Draft story from TODO section
bmad sm story-ready       # Approve story for development (after user review)
bmad sm story-context     # Generate context XML (optional but recommended)
bmad dev dev-story        # Implement story from IN PROGRESS section
bmad dev story-done   # Mark story done (after user confirms DoD)
bmad dev review-story     # Quality validation (optional)
bmad sm correct-course    # If issues arise
bmad sm retrospective     # After epic complete
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
