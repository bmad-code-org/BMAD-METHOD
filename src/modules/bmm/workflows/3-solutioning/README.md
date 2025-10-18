# Solution Architecture Workflow

**Status:** Production-Ready | Scale-Adaptive Architecture Generation

---

## Overview

This workflow generates comprehensive, scale-adaptive solution architecture documentation tailored to your project type, technology stack, and scale level (0-4).

**Unique Features:**

- ✅ **Scale-adaptive**: Level 0 = skip, Levels 1-4 = progressive depth
- ✅ **Intent-based**: LLM intelligence over prescriptive lists
- ✅ **Template-driven**: 11 adaptive architecture document templates
- ✅ **Game-aware**: Adapts heavily based on game type (RPG, Puzzle, Shooter, etc.)
- ✅ **GDD/PRD aware**: Uses Game Design Doc for games, PRD for everything else
- ✅ **ADR tracking**: Separate Architecture Decision Records document
- ✅ **Simplified structure**: ~11 core project types with consistent naming

---

## When to Use

Run this workflow **AFTER** completing:

| Prerequisite               | Required For                  | Location                         |
| -------------------------- | ----------------------------- | -------------------------------- |
| **plan-project workflow**  | All projects                  | `/docs/bmm-workflow-status.md`   |
| **PRD with epics/stories** | Level 1+ projects             | `/docs/PRD.md`                   |
| **GDD (for games)**        | Game projects                 | `/docs/GDD.md` or `/docs/PRD.md` |
| **UX Specification**       | UI projects (web/mobile/game) | `/docs/ux-specification.md`      |

---

## Quick Start

```bash
workflow solution-architecture
```

**The workflow will:**

1. Load `bmm-workflow-status.md` (from plan-project)
2. Check prerequisites (PRD/GDD, UX spec if needed)
3. Read requirements (PRD for apps, GDD for games)
4. Ask architecture pattern questions
5. Load appropriate template and guide
6. Generate architecture + ADR documents
7. Run cohesion check validation

---

## Outputs

### Primary Documents

| File                        | Purpose                              | Notes                                               |
| --------------------------- | ------------------------------------ | --------------------------------------------------- |
| `solution-architecture.md`  | Complete architecture document       | Pattern-specific sections                           |
| `architecture-decisions.md` | Architecture Decision Records (ADRs) | Tracks all decisions, options considered, rationale |

### Validation Outputs

| File                       | Purpose                             |
| -------------------------- | ----------------------------------- |
| `cohesion-check-report.md` | Validates 100% FR/NFR/Epic coverage |
| `epic-alignment-matrix.md` | Maps epics → components/tech/APIs   |

---

## Project Types and Templates

### Simplified Project Type System

The workflow uses ~11 core project types that cover 99% of software projects:

| Type               | Name                     | Template                   | Instructions                   |
| ------------------ | ------------------------ | -------------------------- | ------------------------------ |
| **web**            | Web Application          | web-template.md            | web-instructions.md            |
| **mobile**         | Mobile Application       | mobile-template.md         | mobile-instructions.md         |
| **game**           | Game Development         | game-template.md           | game-instructions.md           |
| **backend**        | Backend Service          | backend-template.md        | backend-instructions.md        |
| **data**           | Data Pipeline            | data-template.md           | data-instructions.md           |
| **cli**            | CLI Tool                 | cli-template.md            | cli-instructions.md            |
| **library**        | Library/SDK              | library-template.md        | library-instructions.md        |
| **desktop**        | Desktop Application      | desktop-template.md        | desktop-instructions.md        |
| **embedded**       | Embedded System          | embedded-template.md       | embedded-instructions.md       |
| **extension**      | Browser/Editor Extension | extension-template.md      | extension-instructions.md      |
| **infrastructure** | Infrastructure           | infrastructure-template.md | infrastructure-instructions.md |

### Intent-Based Architecture

Instead of maintaining 171 prescriptive technology combinations, the workflow now:

- **Leverages LLM intelligence** to understand project requirements
- **Adapts templates dynamically** based on actual needs
- **Uses intent-based instructions** rather than prescriptive checklists
- **Allows for emerging technologies** without constant updates

Each project type has:

- **Instruction file**: Intent-based guidance for architecture decisions
- **Template file**: Adaptive starting point for the architecture document

---

## Architecture Flow

### Step 0: Prerequisites and Scale Check

Load `bmm-workflow-status.md`:

- Extract: `project_level` (0-4), `project_type` (web/game/mobile/etc.), `field_type` (greenfield/brownfield)
- Validate: PRD exists, UX spec exists (if UI project)
- **Skip if Level 0** (single atomic change)

### Step 1: Requirements Analysis

**For Games:**

- Read **GDD** (Game Design Document)
- Extract: gameplay mechanics, engine (Unity/Godot/etc.), platform, multiplayer

**For Everything Else:**

- Read **PRD** (Product Requirements Document)
- Extract: FRs, NFRs, epics, stories, integrations

**For UI Projects:**

- Read **UX Specification**
- Extract: screens, flows, component patterns

### Step 2: User Skill Level

Ask user: Beginner / Intermediate / Expert

- Affects verbosity of generated architecture

### Step 3: Architecture Pattern

Determine:

- Architecture style (monolith, microservices, serverless, etc.)
- Repository strategy (monorepo, polyrepo, hybrid)
- Pattern-specific choices (SSR for web, native vs cross-platform for mobile)

### Step 4: Epic Analysis

Analyze PRD epics:

- Identify component boundaries
- Map domain capabilities
- Determine service boundaries (if microservices)

### Step 5: Intent-Based Technical Decisions

Load: `project-types/{project_type}-instructions.md`

- Use intent-based guidance, not prescriptive lists
- Allow LLM intelligence to identify relevant decisions
- Consider emerging technologies naturally

### Step 6: Adaptive Template Selection

**6.1: Simple Template Selection**

```
Based on project_type from analysis:
  web → web-template.md
  mobile → mobile-template.md
  game → game-template.md (adapts heavily by game type)
  backend → backend-template.md
  ... (consistent naming pattern)
```

**6.2: Load Template**

```
Read: project-types/{type}-template.md
Example: project-types/game-template.md

Templates are adaptive starting points:
- Standard sections (exec summary, tech stack, data arch, etc.)
- Pattern-specific sections conditionally included
- All {{placeholders}} to fill based on requirements
```

**6.3: Dynamic Adaptation**

Templates adapt based on:

- Actual project requirements from PRD/GDD
- User skill level (beginner/intermediate/expert)
- Specific technology choices made
- Game type for game projects (RPG, Puzzle, Shooter, etc.)

**Example Flow for Unity RPG:**

1. GDD says "Unity 2022 LTS" and "RPG"
2. Load game-template.md and game-instructions.md
3. Template adapts to include RPG-specific sections (inventory, quests, dialogue)
4. Instructions guide Unity-specific decisions (MonoBehaviour vs ECS, etc.)
5. LLM intelligence fills gaps not in any list
6. Generate optimized `solution-architecture.md` + `architecture-decisions.md`

### Step 7: Cohesion Check

Validate architecture quality:

- 100% FR/NFR/Epic/Story coverage
- Technology table has specific versions
- No vagueness ("a library", "some framework")
- Design-level only (no implementation code)
- Generate Epic Alignment Matrix

---

## File Structure

```
/solution-architecture/
├── README.md                        # This file
├── workflow.yaml                    # Workflow configuration
├── instructions.md                  # Main workflow logic
├── checklist.md                     # Validation checklist
├── ADR-template.md                  # ADR document template
└── project-types/                   # All project type files in one folder
    ├── project-types.csv            # Simple 2-column mapping (type, name)
    ├── web-instructions.md          # Intent-based guidance for web projects
    ├── web-template.md              # Adaptive web architecture template
    ├── mobile-instructions.md       # Intent-based guidance for mobile
    ├── mobile-template.md           # Adaptive mobile architecture template
    ├── game-instructions.md         # Intent-based guidance (adapts by game type)
    ├── game-template.md             # Highly adaptive game architecture template
    ├── backend-instructions.md      # Intent-based guidance for backend services
    ├── backend-template.md          # Adaptive backend architecture template
    ├── data-instructions.md         # Intent-based guidance for data pipelines
    ├── data-template.md             # Adaptive data pipeline template
    ├── cli-instructions.md          # Intent-based guidance for CLI tools
    ├── cli-template.md              # Adaptive CLI architecture template
    ├── library-instructions.md      # Intent-based guidance for libraries/SDKs
    ├── library-template.md          # Adaptive library architecture template
    ├── desktop-instructions.md      # Intent-based guidance for desktop apps
    ├── desktop-template.md          # Adaptive desktop architecture template
    ├── embedded-instructions.md     # Intent-based guidance for embedded systems
    ├── embedded-template.md         # Adaptive embedded architecture template
    ├── extension-instructions.md    # Intent-based guidance for extensions
    ├── extension-template.md        # Adaptive extension architecture template
    ├── infrastructure-instructions.md  # Intent-based guidance for infra
    └── infrastructure-template.md   # Adaptive infrastructure template
```

---

## Template System

### Complete, Standalone Templates

Each template in `templates/` is a **complete** architecture document structure:

**Standard Sections (all templates):**

1. Executive Summary
2. Technology Stack and Decisions (required table)
3. Architecture Overview
4. Repository and Service Strategy
5. Data Architecture
6. Component and Integration Overview
   7-N. **Pattern-Specific Sections** (varies by template)
   N+1. Proposed Source Tree
   N+2. Getting Started (Human Setup)
   N+3. Implementation Patterns and Conventions (Agent Guidance)
   N+4. Testing Strategy
   N+5. Deployment and Operations
   N+6. Security
   N+7. Specialist Sections

**Pattern-Specific Sections Examples:**

**Game Engine Template:**

- Gameplay Systems (player controller, game state)
- Scene Architecture
- Asset Pipeline
- Audio Architecture
- Save System
- Multiplayer Architecture (if applicable)

**Web Fullstack Template:**

- Frontend Architecture
- Backend Architecture
- API Design (REST/GraphQL/tRPC)
- State Management
- SSR/Caching Strategy
- Performance Optimization

**Embedded Firmware Template:**

- Hardware Architecture
- Communication Protocols
- Power Management
- Sensor/Actuator Integration
- OTA Update Strategy

---

## ADR Tracking

Architecture Decision Records are maintained separately in `architecture-decisions.md`.

**ADR Format:**

```markdown
### ADR-001: [Decision Title]

**Date:** YYYY-MM-DD
**Status:** Accepted | Rejected | Superseded
**Decider:** User | Agent | Collaborative

**Context:**
What problem are we solving?

**Options Considered:**

1. Option A - pros/cons
2. Option B - pros/cons
3. Option C - pros/cons

**Decision:**
We chose Option X

**Rationale:**
Why we chose this over others

**Consequences:**

- Positive: ...
- Negative: ...

**Rejected Options:**

- Option A rejected because: ...
```

**ADRs are populated throughout the workflow** as decisions are made:

- Step 3: Architecture pattern ADR
- Step 5: Technology selection ADRs
- Step 6: Engine-specific ADRs (from guide)

---

## Scale-Adaptive Behavior

| Level | Project Size                     | Architecture Depth          | Specialist Sections        |
| ----- | -------------------------------- | --------------------------- | -------------------------- |
| **0** | Single task                      | Skip architecture           | N/A                        |
| **1** | Small feature (1-10 stories)     | Lightweight, essential only | Inline guidance            |
| **2** | Small project (5-15 stories)     | Standard depth              | Inline guidance            |
| **3** | Standard project (12-40 stories) | Comprehensive               | Specialist placeholders    |
| **4** | Ambitious product (40+ stories)  | Comprehensive + specialists | Specialist recommendations |

---

## Specialist Integration

Pattern-specific specialists are recommended based on project characteristics:

**Game Projects:**

- Audio Designer (music, SFX, adaptive audio)
- Performance Optimizer (profiling, optimization)
- Multiplayer Architect (netcode, state sync)
- Monetization Specialist (IAP, ads, economy)

**Web Projects:**

- Frontend Architect (component design, state management)
- Backend Architect (API design, microservices)
- DevOps Specialist (CI/CD, deployment)
- Security Specialist (auth, authorization, secrets)

**Embedded Projects:**

- Hardware Integration (sensors, actuators, protocols)
- Power Management (battery, sleep modes)
- RF/Wireless (WiFi, BLE, LoRa)
- Safety Certification (if required)

Specialists are documented with:

- When they're needed
- What they're responsible for
- How they integrate with the workflow

---

## Key Differences from Legacy HLA Workflow

| Aspect              | Legacy HLA      | New Solution Architecture                 |
| ------------------- | --------------- | ----------------------------------------- |
| **Templates**       | Fixed structure | 11 complete templates, pattern-specific   |
| **Tech Selection**  | Manual          | 171 pre-defined combinations              |
| **Engine Guidance** | Generic         | Engine-specific guides (Unity/Godot/etc.) |
| **ADRs**            | Inline          | Separate document                         |
| **GDD Support**     | No              | Yes, for game projects                    |
| **Guides**          | None            | Pattern-specific workflow guidance        |
| **Scale**           | One size        | Adaptive Levels 0-4                       |

---

## Validation and Quality Gates

### Cohesion Check (Step 7)

**Validates:**

- ✅ 100% FR coverage (or gaps documented)
- ✅ 100% NFR coverage (or gaps documented)
- ✅ Every epic has technical foundation
- ✅ Every story can be implemented with current architecture
- ✅ Technology table complete with specific versions
- ✅ No vagueness detected
- ✅ Design-level only (no over-implementation)

**Outputs:**

- `cohesion-check-report.md` - Pass/fail with detailed gaps
- `epic-alignment-matrix.md` - Mapping validation

**If cohesion check fails:**

- Document gaps
- Update architecture
- Re-run check

---

## Getting Started for Implementers

### For Games:

1. Run `workflow plan-project` → Create GDD
2. Specify engine in GDD (Unity/Godot/Phaser/etc.)
3. Run `workflow solution-architecture`
4. System detects engine from GDD
5. Loads game-engine template + engine-specific guide
6. Generates Unity/Godot/Phaser-specific architecture

### For Web Apps:

1. Run `workflow plan-project` → Create PRD
2. Run `workflow ux-spec` → Create UX spec
3. Run `workflow solution-architecture`
4. Answer: SSR or SPA? Monolith or microservices?
5. System loads web-fullstack template
6. Generates framework-specific architecture

### For Other Projects:

1. Run `workflow plan-project` → Create PRD
2. Run `workflow solution-architecture`
3. Answer project-type questions
4. System loads appropriate template
5. Generates pattern-specific architecture

---

## Extending the System

### Adding a New Project Type

1. Add row to `project-types/project-types.csv` (just type and name)
2. Create `project-types/{type}-instructions.md` with intent-based guidance
3. Create `project-types/{type}-template.md` with adaptive template
4. Update instructions.md if special handling needed (like GDD for games)

### Key Principles

- **Intent over prescription**: Guide decisions, don't list every option
- **Leverage LLM intelligence**: Trust the model to know technologies
- **Adaptive templates**: Templates should adapt to project needs
- **Consistent naming**: Always use {type}-instructions.md and {type}-template.md

---

## Questions?

- **Validation:** See `checklist.md`
- **Workflow Logic:** See `instructions.md`
- **Configuration:** See `workflow.yaml`
- **Project Types:** See `project-types/project-types.csv`
- **Example Template:** See `project-types/game-template.md`

---

_This workflow replaces the legacy HLA workflow with a modern, scale-adaptive, pattern-aware architecture generation system._
