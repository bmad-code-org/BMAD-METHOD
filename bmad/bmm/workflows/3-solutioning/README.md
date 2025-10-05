# Solution Architecture Workflow

**Status:** Production-Ready | Scale-Adaptive Architecture Generation

---

## Overview

This workflow generates comprehensive, scale-adaptive solution architecture documentation tailored to your project type, technology stack, and scale level (0-4).

**Unique Features:**

- ✅ **Scale-adaptive**: Level 0 = skip, Levels 1-4 = progressive depth
- ✅ **Pattern-aware**: 171 technology combinations across 12 project types
- ✅ **Template-driven**: 11 complete architecture document templates
- ✅ **Engine-specific guidance**: Unity, Godot, Phaser, and more
- ✅ **GDD/PRD aware**: Uses Game Design Doc for games, PRD for everything else
- ✅ **ADR tracking**: Separate Architecture Decision Records document
- ✅ **Specialist integration**: Pattern-specific specialist recommendations

---

## When to Use

Run this workflow **AFTER** completing:

| Prerequisite               | Required For                  | Location                             |
| -------------------------- | ----------------------------- | ------------------------------------ |
| **plan-project workflow**  | All projects                  | `/docs/project-workflow-analysis.md` |
| **PRD with epics/stories** | Level 1+ projects             | `/docs/PRD.md`                       |
| **GDD (for games)**        | Game projects                 | `/docs/GDD.md` or `/docs/PRD.md`     |
| **UX Specification**       | UI projects (web/mobile/game) | `/docs/ux-specification.md`          |

---

## Quick Start

```bash
workflow solution-architecture
```

**The workflow will:**

1. Load `project-workflow-analysis.md` (from plan-project)
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

### 12 Project Types Supported

| Type          | Examples                     | Template                          | Guide Examples       |
| ------------- | ---------------------------- | --------------------------------- | -------------------- |
| **web**       | Next.js, Rails, Django       | web-fullstack-architecture.md     | (TBD)                |
| **mobile**    | React Native, Flutter, Swift | mobile-app-architecture.md        | (TBD)                |
| **game**      | Unity, Godot, Phaser         | game-engine-architecture.md       | Unity, Godot, Phaser |
| **embedded**  | ESP32, STM32, Raspberry Pi   | embedded-firmware-architecture.md | (TBD)                |
| **backend**   | Express, FastAPI, gRPC       | backend-service-architecture.md   | (TBD)                |
| **data**      | Spark, Airflow, MLflow       | data-pipeline-architecture.md     | (TBD)                |
| **cli**       | Commander, Click, Cobra      | cli-tool-architecture.md          | (TBD)                |
| **desktop**   | Electron, Tauri, Qt          | desktop-app-architecture.md       | (TBD)                |
| **library**   | npm, PyPI, cargo             | library-package-architecture.md   | (TBD)                |
| **infra**     | Terraform, K8s Operator      | infrastructure-architecture.md    | (TBD)                |
| **extension** | Chrome, VS Code plugins      | desktop-app-architecture.md       | (TBD)                |

### 171 Technology Combinations

The workflow maintains a registry (`templates/registry.csv`) with 171 pre-defined technology stack combinations:

**Examples:**

- `web-nextjs-ssr-monorepo` → Next.js SSR, TypeScript, monorepo
- `game-unity-3d` → Unity 3D, C#, monorepo
- `mobile-react-native` → React Native, TypeScript, cross-platform
- `backend-fastapi-rest` → FastAPI, Python, REST API
- `data-ml-training` → PyTorch/TensorFlow, Python, ML pipeline

Each row maps to:

- **template_path**: Architecture document structure (11 templates)
- **guide_path**: Engine/framework-specific guidance (optional)

---

## Architecture Flow

### Step 0: Prerequisites and Scale Check

Load `project-workflow-analysis.md`:

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

### Step 5: Project-Type Questions

Load: `project-types/{project_type}-questions.md`

- Ask project-type-specific questions (not yet engine-specific)

### Step 6: Load Template + Guide

**6.1: Search Registry**

```
Read: templates/registry.csv
Match WHERE:
  - project_types = {determined_type}
  - languages = {preferred_languages}
  - architecture_style = {determined_style}
  - tags overlap with {requirements}

Get: template_path, guide_path
```

**6.2: Load Template**

```
Read: templates/{template_path}
Example: templates/game-engine-architecture.md

This is a COMPLETE document structure with:
- Standard sections (exec summary, tech stack, data arch, etc.)
- Pattern-specific sections (Gameplay Systems for games, SSR Strategy for web)
- All {{placeholders}} to fill
```

**6.3: Load Guide (if available)**

```
IF guide_path not empty:
  Read: templates/{guide_path}
  Example: templates/game-engine-unity-guide.md

Guide contains:
- Engine/framework-specific questions
- Architecture patterns for this tech
- Common pitfalls
- Specialist recommendations
- ADR templates
```

**Example Flow for Unity Game:**

1. GDD says "Unity 2022 LTS"
2. Registry match: `game-unity-3d` → `game-engine-architecture.md` + `game-engine-unity-guide.md`
3. Load complete game architecture template
4. Load Unity-specific guide
5. Ask Unity-specific questions (MonoBehaviour vs ECS, ScriptableObjects, etc.)
6. Fill template placeholders
7. Generate `solution-architecture.md` + `architecture-decisions.md`

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
├── templates/                       # Architecture templates and guides
│   ├── registry.csv                 # 171 tech combinations → templates
│   ├── game-engine-architecture.md  # Complete game architecture doc
│   ├── game-engine-unity-guide.md   # Unity-specific guidance
│   ├── game-engine-godot-guide.md   # Godot-specific guidance
│   ├── game-engine-web-guide.md     # Phaser/PixiJS/Three.js guidance
│   ├── web-fullstack-architecture.md
│   ├── web-api-architecture.md
│   ├── mobile-app-architecture.md
│   ├── embedded-firmware-architecture.md
│   ├── backend-service-architecture.md
│   ├── data-pipeline-architecture.md
│   ├── cli-tool-architecture.md
│   ├── desktop-app-architecture.md
│   ├── library-package-architecture.md
│   └── infrastructure-architecture.md
└── project-types/                   # Project type detection and questions
    ├── project-types.csv            # 12 project types + detection keywords
    ├── game-questions.md
    ├── web-questions.md
    ├── mobile-questions.md
    └── ... (12 question files)
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

## Guide System

### Engine/Framework-Specific Guides

Guides are **workflow instruction documents** that:

- Ask engine-specific questions
- Provide architecture pattern recommendations
- Suggest what sections to emphasize
- Define ADRs to create

**Guides are NOT:**

- ❌ Reference documentation (use official docs)
- ❌ Tutorials (how to code)
- ❌ API references

**Guides ARE:**

- ✅ Question flows for architecture decisions
- ✅ Pattern recommendations specific to the tech
- ✅ Common pitfalls to avoid
- ✅ Specialist recommendations

**Example: game-engine-unity-guide.md**

```markdown
## Unity Architecture Questions

- MonoBehaviour or ECS?
- ScriptableObjects for game data?
- Addressables or Resources?

## Unity Patterns

- Singleton GameManager (when to use)
- Event-driven communication
- Object pooling strategy

## Unity-Specific Sections to Include

- Unity Project Configuration
- Scene Architecture
- Component Organization
- Package Dependencies

## Common Pitfalls

- Caching GetComponent calls
- Avoiding empty Update methods
```

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

### Adding a New Template

1. Create `templates/new-pattern-architecture.md`
2. Include all standard sections + pattern-specific sections
3. Add rows to `templates/registry.csv` pointing to new template

### Adding a New Guide

1. Create `templates/new-tech-guide.md`
2. Include: questions, patterns, pitfalls, specialist recommendations
3. Update `templates/registry.csv` with `guide_path` column

### Adding a New Project Type

1. Add row to `project-types/project-types.csv`
2. Create `project-types/new-type-questions.md`
3. Ensure templates exist for this type
4. Update instructions.md if special handling needed (like GDD for games)

---

## Questions?

- **Validation:** See `checklist.md`
- **Workflow Logic:** See `instructions.md`
- **Configuration:** See `workflow.yaml`
- **Registry Format:** See `templates/registry.csv`
- **Example Guide:** See `templates/game-engine-unity-guide.md`

---

_This workflow replaces the legacy HLA workflow with a modern, scale-adaptive, pattern-aware architecture generation system._
