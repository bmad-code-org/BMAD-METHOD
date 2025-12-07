# WDS v6 Conversion Roadmap

**Document Purpose:** Complete record of all decisions, context, and progress for converting Whiteport Design Studio to BMad Method v6 format. This document allows continuation of work if the conversation is lost.

**Created:** December 2, 2025  
**Last Updated:** December 5, 2025  
**Status:** In Progress - Workflows Phase (Phase 4 Complete + Dog Week Pattern)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Decisions Made](#2-key-decisions-made)
3. [Repository Setup](#3-repository-setup)
4. [Module Architecture](#4-module-architecture)
5. [Output Folder Structure](#5-output-folder-structure)
6. [Design Philosophy](#6-design-philosophy)
7. [Development Order](#7-development-order)
8. [Files Created So Far](#8-files-created-so-far)
9. [Next Steps](#9-next-steps)
10. [Reference Information](#10-reference-information)

---

## 1. Project Overview

### What is WDS?

**Whiteport Design Studio (WDS)** is a design-focused methodology module for the BMad Method ecosystem. It provides a complete UX/UI design workflow from product exploration through detailed component specifications.

### Origin

WDS evolves from **Whiteport Sketch-to-Code (WPS2C)**, a BMad v4 "expansion pack." The v6 conversion transforms it into a proper BMad module following v6 architecture.

### Core Purpose

WDS focuses **exclusively on design** - it creates the design artifacts that feed into development modules like BMad Method (BMM). WDS does NOT include development/backlog functionality.

### Integration Model

```
WDS (Design) ────────► E-UI-Roadmap/ ────────► BMM (Development)
    │                       │                       │
    │ Creates:              │ Bridge:               │ Consumes:
    │ • Product Brief       │ • Priority mapping    │ • Architecture
    │ • Trigger Map         │ • Technical notes     │ • Stories
    │ • Scenarios           │ • Handoff checklist   │ • Implementation
    │ • PRD                 │                       │
    │ • Design System       │                       │
```

---

## 2. Key Decisions Made

### 2.1 Module Name

**Decision:** Whiteport Design Studio (WDS)

**Alternatives Considered:**
- BMad Design Studio
- BMad UX

**Reasoning:** Preserve brand identity, acknowledge contribution origin, maintain "Whiteport" recognition.

### 2.2 Repository Approach

**Decision:** Fork BMad-METHOD repository

**Alternatives Considered:**
- Standalone repository
- Rename existing WPS2C repo

**Reasoning:**
- Maximum adoption through BMad ecosystem
- Path to official module status via PR
- Shared core infrastructure
- Automatic ecosystem integration

**Fork Details:**
- Origin: `https://github.com/whiteport-collective/whiteport-design-studio.git`
- Upstream: `https://github.com/bmad-code-org/BMAD-METHOD.git`

### 2.3 Working Branch

**Decision:** Work directly on `main` branch

**Reasoning:**
- Simpler workflow during development
- WDS is substantial addition, not small tweak
- Fork effectively becomes WDS home
- Will switch to feature branches after official adoption

### 2.4 Workflow Approach

**Decision:** Phase-selectable (not rigid tracks)

**Description:** Users select individual phases based on project needs rather than choosing from predefined tracks.

**Examples:**
- Landing page → Phases 1, 4, 5
- Full product → All 6 phases
- Design system only → Phases 4, 5

### 2.5 Development Handoff

**Decision:** No development artifacts in WDS

**Description:** WDS creates design artifacts only. Development (backlog, stories, architecture) handled by BMM. `E-UI-Roadmap/` serves as the integration bridge.

### 2.6 README Convention

**Decision:** One README.md per repository

**Convention:** Only `README.md` at module root; all other documentation uses `xxx-guide.md` naming pattern.

**Examples:**
- ✅ `wds/README.md` (only one)
- ✅ `wds/docs/method/wds-method-guide.md`
- ✅ `wds/docs/quick-start-guide.md`
- ❌ `wds/docs/README.md` (not allowed)
- ❌ `wds/examples/README.md` (not allowed)

---

## 3. Repository Setup

### 3.1 Local Path

```
C:\dev\WDS\whiteport-design-studio
```

### 3.2 Git Remotes

```
origin   → https://github.com/whiteport-collective/whiteport-design-studio.git
upstream → https://github.com/bmad-code-org/BMAD-METHOD.git
```

### 3.3 Syncing with Upstream

```bash
git fetch upstream
git merge upstream/main
git push origin main
```

---

## 4. Module Architecture

### 4.1 Module Location

```
src/modules/wds/
```

### 4.2 Folder Structure

```
src/modules/wds/
├── _module-installer/          # Installation configuration
│   └── install-config.yaml     # TO CREATE
│
├── agents/                     # WDS agents (v6 YAML format) - Norse Pantheon
│   ├── saga-analyst.agent.yaml    # Saga-Analyst - TO CREATE
│   ├── freyja-pm.agent.yaml       # Freyja-PM - TO CREATE
│   └── baldr-ux.agent.yaml        # Baldr-UX - TO CREATE
│
├── workflows/                  # Phase workflows
│   ├── 0-init/                 # Entry point - TO CREATE
│   ├── 1-product-exploration/  # Phase 1 - TO CREATE
│   ├── 2-user-research/        # Phase 2 - TO CREATE
│   ├── 3-requirements/         # Phase 3 - TO CREATE
│   ├── 4-conceptual-design/    # Phase 4 - TO CREATE
│   ├── 5-component-design/     # Phase 5 - TO CREATE
│   └── 6-dev-integration/      # Phase 6 - TO CREATE
│
├── data/                       # Standards, frameworks
│   ├── presentations/          # Agent intro presentations
│   ├── positioning-framework.md # ICP framework - TO CREATE
│   └── ...
│
├── docs/                       # Documentation (xxx-guide.md)
│   ├── method/                 # Methodology guides
│   │   ├── wds-method-guide.md # Main overview - TO CREATE
│   │   └── phase-guides/       # Per-phase guides - TO CREATE
│   └── images/                 # Diagrams, visuals
│
├── examples/                   # Example projects
│   ├── dog-week-patterns/      # Full reference implementation
│   ├── conversation-examples/  # Dialog flow examples
│   └── starter-project/        # Try-it-yourself project
│
├── reference/                  # Templates, checklists
│   ├── templates/              # Document templates
│   └── checklists/             # Phase completion checklists
│
├── teams/                      # Team configurations
│
└── README.md                   # Module entry point ✅ CREATED
```

### 4.3 Agents - The Norse Pantheon 🏔️

| Agent | File | Role | Norse Meaning | Status |
|-------|------|------|---------------|--------|
| **Saga the Analyst** | `saga-analyst.agent.yaml` | Business & Product Analyst | Goddess of stories & wisdom | TO CREATE |
| **Freyja the PM** | `freyja-pm.agent.yaml` | Product Manager | Goddess of love, war & strategy | TO CREATE |
| **Baldr the UX Expert** | `baldr-ux.agent.yaml` | UX/UI Designer | God of light & beauty | TO CREATE |

**Why "Name the Function" format?**
- Reads naturally: "Saga the Analyst"
- Distinctive Norse mythology names
- Function is immediately clear
- Creates unique WDS brand identity

---

## 5. Output Folder Structure

### 5.1 The A-B-C-D-E Convention

WDS creates an alphabetized folder structure in the user's project `docs/` folder:

```
docs/
├── A-Product-Brief/            # Phase 1 outputs
├── B-Trigger-Map/              # Phase 2 outputs
├── C-Scenarios/                # Phase 4 outputs
├── D-PRD/                      # Phase 3 outputs
├── D-Design-System/            # Phase 5 outputs
└── E-UI-Roadmap/               # Phase 6 outputs (dev bridge)
```

### 5.2 Why Alphabetical Prefix?

| Reason | Benefit |
|--------|---------|
| Visual namespace | Clearly grouped in file explorers |
| Brand signature | "A-B-C-D-E = WDS" recognition |
| Non-conflicting | Won't clash with other docs folders |
| Natural sort | Always grouped together |
| Professional | Enterprise documentation feel |

### 5.3 Phase-to-Folder Mapping

| Phase | # | Name | Output Folder |
|-------|---|------|---------------|
| 1 | Product Exploration | Strategic foundation | `A-Product-Brief/` |
| 2 | User Research | Personas, business goals | `B-Trigger-Map/` |
| 3 | Requirements | Functional & technical | `D-PRD/` |
| 4 | Conceptual Design | Scenarios, sketches | `C-Scenarios/` |
| 5 | Component Design | Design system | `D-Design-System/` |
| 6 | Dev Integration | Handoff bridge | `E-UI-Roadmap/` |

### 5.4 E-UI-Roadmap Contents

The integration bridge folder contains:

```
E-UI-Roadmap/
├── ui-roadmap-guide.md             # Overview
├── priority-sequence.md            # What to build first
├── scenario-mapping.md             # Scenarios → Dev order
├── component-inventory.md          # All components needed
├── technical-notes.md              # Design constraints
└── open-questions.md               # For dev team to decide
```

---

## 6. Design Philosophy

### 6.1 Core Principles

#### Principle 1: Soft Language

**Instead of:** "MUST", "FORBIDDEN", "NEVER", "SYSTEM FAILURE"

**Use:** Collaborative, identity-based guidance

**Reasoning:** User experience shows that harsh enforcement language makes agents MORE likely to ignore instructions, not less.

**Example - Before:**
```markdown
## MANDATORY RULES
- 🛑 NEVER generate without input
- 🚫 FORBIDDEN: Multiple questions
- ❌ SYSTEM FAILURE if you skip
```

**Example - After:**
```markdown
## How We Work Together

You're a thoughtful guide who helps designers create great products.

Your rhythm:
- Ask one question, then listen
- Reflect back what you heard
- Build the document together
```

#### Principle 2: Show, Don't Tell

**Instead of:** Explaining rules

**Use:** Concrete examples

**Reasoning:** People (and LLMs) learn better from examples than abstract rules.

**Implementation:**
- Complete artifacts as examples (not rule descriptions)
- Conversation flow examples
- Dog Week as reference implementation

#### Principle 3: Example Projects for Adoption

**Purpose:**
- Let people try before adopting
- Show what success looks like
- Lower barrier to entry
- Build credibility

**Implementation:**
- Dog Week patterns as full reference
- Starter project for practice
- Conversation examples showing dialog flow

### 6.2 Known Problems to Mitigate

| Problem | Observed Behavior | WDS Solution |
|---------|-------------------|--------------|
| Agents ignore instructions | Generate without thinking | Identity-based personas + examples |
| Inconsistent output formats | Specs look different each time | Complete template examples |
| Question dumping | 20 questions at once | Conversation examples showing one-at-a-time |

### 6.3 Positive Language Guidelines

**Principle:** Frame everything in terms of benefits and opportunities, not problems and costs.

**Patterns to Avoid:**

| Negative Pattern | Positive Alternative |
|------------------|---------------------|
| "Nothing kills a project faster than..." | "It's valuable to discover early..." |
| "expensive development problems" | "easy to address while solutions are flexible" |
| "Finding them later is expensive" | "Finding them now means more options" |
| "Don't do X" | "What works well is Y" |
| "Avoid these mistakes" | "Successful patterns include..." |
| "This prevents failure" | "This enables success" |
| "You'll waste time if..." | "You'll save time by..." |

**The Reframe Test:**

When writing guidance, ask: *"Am I describing what TO DO or what NOT to do?"*

Good WDS documentation:
- Celebrates early discovery (not fears late discovery)
- Describes successful patterns (not failure modes)
- Frames constraints as opportunities (not limitations)
- Uses "enables" not "prevents"

**Example Transformation:**

Before:
> "Nothing kills a project faster than discovering in development that a core feature is technically impossible."

After:
> "It's a great morale boost when you've proven your core features will work. And if you discover limitations, it's valuable to know them early so design can account for them from the start."

### 6.4 Instruction Style

**Identity-First:**
```markdown
## Who You Are

You're Saga, a thoughtful analyst who genuinely cares 
about understanding the product before documenting it.

You prefer deep conversations over quick surveys. You ask one 
thing at a time because you're actually listening.
```

**Experience-Focused:**
```markdown
## The Conversation Style

A good session feels like coffee with a wise mentor:
- They ask something interesting
- You share your thinking
- They reflect it back
- Together you discover something new
```

**Gentle Reminders:**
```markdown
## Helpful Patterns

What works well:
- One question at a time keeps things focused
- Reflecting back shows you're listening

What tends to feel less collaborative:
- Listing many questions (feels like a survey)
- Generating without checking in
```

---

## 6.5 Key Methodology Refinements (Dec 3, 2025)

### Phase Naming Convention
Each phase title now includes the artifact in parentheses:
- Phase 1: Product Exploration (Product Brief)
- Phase 2: Trigger Mapping (Trigger Map)
- Phase 3: PRD Platform (Technical Foundation)
- Phase 4: UX Design (UX-Sketches & Usage Scenarios)
- Phase 5: Design System (Component Library)
- Phase 6: PRD Finalization (Complete PRD)

### Phase 2: Feature Impact Analysis
Added a scoring system (Beta) for prioritizing features:
- Positive drivers: +3/+2/+1 by priority
- Negative drivers: +4/+3/+2 (higher due to loss aversion)
- Bonuses for multi-group and multi-driver features
- Outputs ranked feature list for MVP planning

### Phase 3: PRD Platform
Renamed from "Requirements" to emphasize:
- Technical foundation work (platform, infrastructure)
- Proofs of concept for risky features
- Experimental endpoints that can start before design
- Parallel with design work, not sequential

### Phase 4: Step 4E - PRD Update
Added step 4E after each page design:
- Extract functional requirements discovered during design
- Add to PRD with page references
- PRD grows incrementally throughout Phase 4
- Creates traceability: page → feature → epic

### Phase 5: Optional & Parallel
Clarified that Design System is:
- **Optional** - chosen during project setup
- **Parallel** - builds alongside Phase 4, not after
- Includes unified naming for Figma/Code integration
- Component library selection guidance added

### Phase 6: PRD Finalization
Renamed from "Dev Integration" to emphasize:
- Compiling all functional requirements from Phase 4
- Organizing by epic/feature area
- Continuous handoff model (not single event)
- First handoff at MVP, then ongoing updates

### Removed from Guides
- Duration estimates (project-dependent)
- Inline code examples (belong in templates/examples)
- Negative language ("expensive problems", "kills projects")

---

### 7.1 Chosen Approach: Methodology-First

**Order:**
1. Define the methodology (phases, outputs, connections)
2. Create workflows that implement the methodology
3. Create agents that guide users through workflows
4. Create examples that demonstrate the methodology

**Reasoning:**
- The methodology IS the product
- Agents serve the methodology, not vice versa
- User is crystal clear on the workflow (already proven in WPS2C v4)
- Not inventing new process, porting existing one

### 7.2 Detailed Order

#### Phase 1: Define the Methodology
| Order | Component | File | Status |
|-------|-----------|------|--------|
| 1 | Method Overview | `docs/method/wds-method-guide.md` | ✅ COMPLETE |
| 2 | Phase 1 Guide | `docs/method/phase-1-Product-exploration-guide.md` | ✅ COMPLETE |
| 3 | Phase 2 Guide | `docs/method/phase-2-trigger-mapping-guide.md` | ✅ COMPLETE |
| 4 | Phase 3 Guide | `docs/method/phase-3-PRD-Platform-guide.md` | ✅ COMPLETE |
| 5 | Phase 4 Guide | `docs/method/phase-4-ux-design-guide.md` | ✅ COMPLETE |
| 6 | Phase 5 Guide | `docs/method/phase-5-design-system-guide.md` | ✅ COMPLETE |
| 7 | Phase 6 Guide | `docs/method/phase-6-PRD-Finalization-guide.md` | ✅ COMPLETE |

**Methodology Phase Complete!** All phase guides refined with:
- Positive language throughout (no "expensive problems", "kills projects", etc.)
- Phase titles with artifacts in parentheses
- Removed duration estimates (project-dependent)
- Feature Impact Analysis with scoring system (Phase 2)
- Step 4E: PRD Update during design (Phase 4)
- Design System as optional parallel workflow (Phase 5)
- PRD Finalization with continuous handoff model (Phase 6)
- Unified naming conventions for Figma/Code integration
- Code examples moved to templates/examples (not in guides)

#### Phase 2: Create Examples
| Order | Component | Location | Status |
|-------|-----------|----------|--------|
| 8 | Dog Week Examples | `examples/dog-week-patterns/` | TO CREATE |
| 9 | Conversation Examples | `examples/conversation-examples/` | TO CREATE |
| 10 | Starter Project | `examples/starter-project/` | TO CREATE |
| 10b | **WDS Trigger Map** | `examples/wds-trigger-map/` | TO CREATE |
| 10c | **Trigger Mapping Workshop** | `workflows/trigger-mapping-workshop/` | TO CREATE |

**WDS Trigger Map Example:**
Create a Trigger Map for WDS itself as a meta-example - shows the methodology applied to the methodology. Includes:
- WDS Vision & SMART Objectives
- Target Groups (designers, teams, agencies)
- Personas with alliterative names
- Usage goals (positive & negative)
- Visual trigger map diagram

This serves as both documentation and inspiration for users.

**Trigger Mapping Workshop (Standalone):**
Create a standalone Trigger Mapping workshop that can be used:
- In WDS as part of Phase 2
- In BMM as a brainstorming/strategic alignment session
- In any project needing user-business alignment

This makes the Trigger Mapping methodology available even in projects not driven by designers. Could be contributed to BMM's brainstorming workflows or CIS (Creative Intelligence Suite).

Includes:
- Workshop facilitation workflow
- Agent instructions for running the workshop
- Template for Trigger Map output
- Integration points with BMM workflows

#### Phase 3: Create Workflows
| Order | Component | Location | Status |
|-------|-----------|----------|--------|
| 11 | workflow-init | `workflows/workflow-init/` | ✅ COMPLETE |
| 12a | Phase 1 Workflow | `workflows/1-project-brief/` | ✅ COMPLETE |
| 12b | Phase 2 Workflow | `workflows/2-trigger-mapping/` | ✅ COMPLETE |
| 12c | Phase 3 Workflow | `workflows/3-prd-platform/` | ✅ COMPLETE |
| 12d | **Phase 4 Workflow** | `workflows/4-ux-design/` | ✅ **COMPLETE (Dec 4)** |
| 12e | Phase 5 Workflow | `workflows/5-design-system/` | TO CREATE |
| 12f | Phase 6 Workflow | `workflows/6-integration/` | TO CREATE |

#### Phase 4: Create Agents (The Norse Pantheon)
| Order | Component | File | Status |
|-------|-----------|------|--------|
| 13 | Saga-Analyst | `agents/saga-analyst.agent.yaml` | TO CREATE |
| 14 | Freyja-PM | `agents/freyja-pm.agent.yaml` | TO CREATE |
| 15 | Baldr-UX | `agents/baldr-ux.agent.yaml` | TO CREATE |

#### Phase 5: Finalize
| Order | Component | File | Status |
|-------|-----------|------|--------|
| 16 | Install Config | `_module-installer/install-config.yaml` | TO CREATE |
| 17 | Teams | `teams/` | TO CREATE |

---

## 8. Files Created So Far

### 8.1 Repository Root

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Fork overview, WDS contribution explanation | ✅ CREATED |
| `WDS-V6-CONVERSION-ROADMAP.md` | This document | ✅ CREATED |

### 8.2 Methodology Documentation

| Path | Purpose | Status |
|------|---------|--------|
| `src/modules/wds/docs/method/wds-method-guide.md` | Main methodology overview | ✅ COMPLETE |
| `src/modules/wds/docs/method/phase-1-Product-exploration-guide.md` | Phase 1 guide | ✅ COMPLETE |
| `src/modules/wds/docs/method/phase-2-trigger-mapping-guide.md` | Phase 2 guide | ✅ COMPLETE |
| `src/modules/wds/docs/method/phase-3-PRD-Platform-guide.md` | Phase 3 guide | ✅ COMPLETE |
| `src/modules/wds/docs/method/phase-4-ux-design-guide.md` | Phase 4 guide | ✅ COMPLETE |
| `src/modules/wds/docs/method/phase-5-design-system-guide.md` | Phase 5 guide | ✅ COMPLETE |
| `src/modules/wds/docs/method/phase-6-PRD-Finalization-guide.md` | Phase 6 guide | ✅ COMPLETE |

### 8.3 Module Structure (Folders Created, Content Pending)

| Path | Purpose | Status |
|------|---------|--------|
| `src/modules/wds/` | Module root | ✅ CREATED |
| `src/modules/wds/README.md` | Module entry point | ✅ CREATED |
| `src/modules/wds/_module-installer/` | Install config folder | EMPTY |
| `src/modules/wds/agents/` | Agents folder | PARTIAL (saga skeleton) |
| `src/modules/wds/workflows/` | Workflows folder | ✅ **PHASE 4 COMPLETE** |
| `src/modules/wds/workflows/workflow-init/` | Workflow initialization | ✅ COMPLETE |
| `src/modules/wds/workflows/1-project-brief/` | Phase 1 workflow | ✅ COMPLETE |
| `src/modules/wds/workflows/2-trigger-mapping/` | Phase 2 workflow | ✅ COMPLETE |
| `src/modules/wds/workflows/3-prd-platform/` | Phase 3 workflow | ✅ COMPLETE |
| `src/modules/wds/workflows/4-ux-design/` | **Phase 4 workflow** | ✅ **COMPLETE (Dec 4)** |
| `src/modules/wds/workflows/4-ux-design/substeps/` | **Phase 4 substeps (4A-4E)** | ✅ **COMPLETE (Dec 4)** |
| `src/modules/wds/workflows/4-ux-design/templates/` | **Phase 4 templates** | ✅ **COMPLETE (Dec 4)** |
| `src/modules/wds/workflows/5-design-system/` | Phase 5 workflow | TO CREATE |
| `src/modules/wds/workflows/6-integration/` | Phase 6 workflow | TO CREATE |
| `src/modules/wds/data/` | Data folder | EMPTY |
| `src/modules/wds/data/presentations/` | Agent presentations | TO CREATE |
| `src/modules/wds/docs/method/` | Methodology guides | ✅ COMPLETE |
| `src/modules/wds/docs/images/` | Images folder | EMPTY |
| `src/modules/wds/examples/` | Examples folder | EMPTY |
| `src/modules/wds/examples/dog-week-patterns/` | Dog Week examples | TO CREATE |
| `src/modules/wds/reference/` | Reference materials | EMPTY |
| `src/modules/wds/reference/templates/` | Templates | TO CREATE |
| `src/modules/wds/reference/checklists/` | Checklists | TO CREATE |
| `src/modules/wds/teams/` | Team configs | EMPTY |

---

## 9. Next Steps

### Immediate Next Action

**Create Examples** - Port Dog Week patterns and create conversation examples

### Short-term Roadmap

1. [x] Create `wds-method-guide.md`
2. [x] Create phase guide for each phase (6 files)
3. [x] Refine all phase guides with positive language, proper naming
4. [x] Create workflow-init workflow ✅
5. [x] Create Phase 1-3 workflows ✅
6. [x] **Create Phase 4 workflow (UX Design)** ✅ **COMPLETE Dec 4, 2025**
7. [ ] Create Phase 5-6 workflows
8. [ ] Create WDS Trigger Map (meta-example for WDS itself)
9. [ ] Create conversation examples
10. [ ] Create agents (Saga, Freyja, Baldr)
11. [ ] Create templates for component showcase, PRD, etc.
12. [ ] Port Dog Week examples to `examples/dog-week-patterns/` (last - project in active development)

### Commit Checkpoint

**Ready to commit Phase 4 workflow:**
```
feat(wds): Complete Phase 4 UX Design workflow with v6 best practices

Phase 4 Workflow Complete:
- Main workflow with goal-based instructions
- Substeps 4A-4E following v6 patterns (exploration, analysis, specification, prototype, PRD update)
- Complete page specification template with Object IDs
- Scenario overview template
- Concise, trust-the-agent instruction style
- Optional steps where appropriate

Conversion Progress:
- Merged WDS-CONVERSION-ANALYSIS.md into roadmap
- Updated roadmap with Phase 4 completion status
- Added section 11: WPS2C → WDS Conversion Reference
- Added section 12: Latest Updates (Dec 4, 2025)

Templates Created:
- page-specification.template.md (complete spec format)
- scenario-overview.template.md (scenario structure)

Next: Phase 5 (Design System) and Phase 6 (PRD Finalization) workflows
```

---

## 10. Reference Information

### 10.1 Open Design Decisions

**To resolve during porting Phase 1 & 2:**

| Decision | Options | Resolve When |
|----------|---------|--------------|
| **ICP/Positioning placement** | Phase 1 as hypothesis → Phase 2 validates, OR fully in Phase 2 | Porting Phase 1-2 |
| **Prioritization Reasoning** | Formal step with output, OR internal thinking process | Porting Phase 2 |
| **Business Goals flow** | Initial in Brief → Refined in Trigger Map, OR single location | Porting Phase 1-2 |

**Context:** The Trigger Mapping (Effect Mapping) methodology is very strong. The prioritization reasoning step (column-by-column) is specifically valuable for generating product ideas but may not need formal documentation.

---

### 10.2 Product Positioning Framework

To be included in WDS workflows (stored in memory, ID: 11785915):

**Positioning Statement Format:**
```
For (target customer)
Who (statement of need or opportunity)
And want (statement of experience expectations)
The (product/service name)
Is (product category)
That (statement of key benefits)
Unlike (primary competitive alternative)
Our product (statement of primary differentiators)
```

**ICP Framework (8 Components):**
1. My ICP (Who I Serve Best)
2. My Positioning (How I'm Different)
3. The Outcomes I Drive
4. My Offerings (What I Sell)
5. Social Proof (Who Can Vouch)
6. My Frameworks/Models/Tools (How I Work)
7. The Pains My ICP Articulates (Triggers/Frustrations)
8. Pricing Anchoring (Cost of Inaction, Bad Hire, % Revenue, Speed)

**CTA Elements:**
- Website link
- Discovery call link
- Newsletter subscription
- Social follows
- Events attending

### 10.2 BMad v6 Resources

| Resource | Location |
|----------|----------|
| BMM Module | `src/modules/bmm/` |
| BMB Builder | `src/modules/bmb/` |
| CIS Module | `src/modules/cis/` |
| Agent Schema | `src/modules/bmb/docs/agents/` |
| Workflow Docs | `src/modules/bmb/docs/workflows/` |

### 10.3 Original WPS2C

| Resource | Location |
|----------|----------|
| WPS2C Repo | `C:\dev\whiteport-sketch-to-code-bmad-expansion` |
| Method Overview | `Method/00-Whiteport-Method.md` |
| Agents (v4 format) | `bmad-whiteport-sketch/agents/` |

### 10.4 Dog Week Project

| Resource | Location |
|----------|----------|
| Project Root | `C:\dev\dogweek\dogweek-dev` |
| Product Brief | `docs/A-Product-Brief/` |
| Trigger Map | `docs/B-Trigger-Map/` |
| Scenarios | `docs/C-Scenarios/` |
| PRD | `docs/D-PRD/` |

---

## Conversation Summary

### Key Discussion Points

1. **Fork vs Standalone:** Decided on fork for maximum adoption
2. **Module Name:** Whiteport Design Studio (WDS) to preserve brand
3. **Branch Strategy:** Work on main, switch to feature branches after adoption
4. **Folder Structure:** A-B-C-D-E alphabetical prefix for visual namespace
5. **Phase Approach:** Phase-selectable (not rigid tracks)
6. **Scope:** Design only, no development/backlog (handled by BMM)
7. **E-UI-Roadmap:** Integration bridge to development modules
8. **Development Order:** Methodology-first approach
9. **Language Style:** Soft, collaborative (not MUST/FORBIDDEN)
10. **Teaching Style:** Show, don't tell (examples over rules)

### User's Stated Experience

- WPS2C v4 works well, proven methodology
- Strong language (MUST/FORBIDDEN) makes agents ignore instructions
- Softer language gets better compliance
- Examples work better than rules
- Agents tend to question-dump (20 questions at once)
- Output format inconsistency is a problem

### Design Philosophy Established

1. Soft language by design
2. Show, don't tell (examples over explanations)
3. Example projects for adoption/training
4. Identity-based agent personas
5. Conversation examples showing dialog flow

---

## 11. WPS2C → WDS Conversion Reference

### 11.1 Agent Mapping

| WPS2C v4 | WDS v6 | Status |
|----------|--------|--------|
| Mary (whiteport-analyst.md) | Saga-Analyst (saga-analyst.agent.yaml) | 🔄 Skeleton exists |
| Sarah (whiteport-pm.md) | Freyja-PM (freyja-pm.agent.yaml) | ⏳ To create |
| Sally (whiteport-ux-expert.md) | Baldr-UX (baldr-ux.agent.yaml) | ⏳ To create |
| James (whiteport-dev.md) | N/A - moved to BMM | ✅ Complete |
| Alex (whiteport-orchestrator.md) | N/A - workflow-status replaces | ✅ Complete |

**Key Changes:**
- Mary → **Saga** (Goddess of stories & wisdom)
- Sarah → **Freyja** (Goddess of love, war & strategy)  
- Sally → **Baldr** (God of light & beauty)
- Norse Pantheon theme for unique WDS identity

### 11.2 File Format Changes

**WPS2C v4:** Markdown files (.md) with embedded YAML blocks
```markdown
# agent-name.md
```yaml
agent:
  name: Mary
  commands:
    - help: Show help
```
```

**WDS v6:** Pure YAML files (.agent.yaml) following v6 schema
```yaml
# agent-name.agent.yaml
agent:
  metadata:
    id: "{bmad_folder}/wds/agents/saga-analyst.agent.yaml"
    name: Saga
    module: wds
  persona:
    role: ...
    identity: ...
  menu:
    - trigger: command-name
      workflow: path/to/workflow.yaml
```

### 11.3 Terminology Changes

| WPS2C v4 | WDS v6 |
|----------|--------|
| Whiteport Sketch-to-Code | Whiteport Design Studio |
| WPS2C | WDS |
| Commands | Menu Triggers |
| Tasks | Workflows |
| `*command-name` | Workflow triggers |

### 11.4 Presentation Files Mapping

| WPS2C v4 File | WDS v6 Location | Purpose |
|---------------|-----------------|---------|
| mary-analyst-personal-presentation.md | data/presentations/saga-intro.md | Saga activation speech |
| sarah-pm-personal-presentation.md | data/presentations/freyja-intro.md | Freyja activation speech |
| sally-ux-expert-personal-presentation.md | data/presentations/baldr-intro.md | Baldr activation speech |
| wps2c-analyst-business-presentation.md | examples/conversation-examples/analyst-session.md | Example session |
| wps2c-pm-product-presentation.md | examples/conversation-examples/pm-session.md | Example session |
| wps2c-ux-design-system-presentation.md | examples/conversation-examples/ux-session.md | Example session |

### 11.5 Templates Mapping

| WPS2C v4 Template | WDS v6 Location | Status |
|-------------------|-----------------|--------|
| product-brief-tmpl.yaml | workflows/1-project-brief/complete/project-brief.template.md | ✅ Created |
| trigger-map-tmpl.yaml | workflows/2-trigger-mapping/templates/trigger-map.template.md | ✅ Created |
| persona-tmpl.yaml | workflows/2-trigger-mapping/templates/persona.template.md | ⏳ To create |
| scenarios-tmpl.yaml | workflows/4-ux-design/templates/scenario-overview.template.md | ✅ **Created Dec 4** |
| page-spec-tmpl.yaml | workflows/4-ux-design/templates/page-specification.template.md | ✅ **Created Dec 4** |
| design-system-structure-tmpl.yaml | workflows/5-design-system/templates/component.template.md | ⏳ To create |
| component-tmpl.yaml | reference/templates/component.template.md | ⏳ To create |
| sketch-review-tmpl.yaml | workflows/4-ux-design/templates/review.template.md | ⏳ To create |

### 11.6 Standards/Data Files Mapping

| WPS2C v4 File | WDS v6 Location | Purpose |
|---------------|-----------------|---------|
| wps2c-compliance-standards.md | data/wds-standards.md | Core methodology standards |
| analyst-documentation-standards.md | data/documentation-standards.md | Documentation conventions |
| sketch-documentation-standards.md | workflows/4-ux-design/sketch-standards.md | Sketch specification standards |
| pm-documentation-standards.md | workflows/3-prd-platform/prd-standards.md | PRD writing standards |
| mermaid-github-standards.md | data/mermaid-standards.md | Diagram standards |
| technical-documentation-patterns.md | data/technical-patterns.md | Technical writing patterns |

### 11.7 Content to Preserve from WPS2C

**Core Methodology Elements:** ✅
- Product Brief structure and process
- Trigger Mapping (Effect Mapping) methodology
- Feature Impact Analysis with scoring
- Scenario-driven design approach  
- Design System integration patterns

**Agent Personalities:** 🔄
- Mary's analytical, thoughtful approach → Saga
- Sarah's strategic PM mindset → Freyja
- Sally's design expertise and creativity → Baldr

**Quality Patterns:** ✅
- One question at a time (not survey-style)
- Collaborative document building
- Evidence-based analysis
- Soft, encouraging language

**Technical Patterns:** ✅
- A-B-C-D-E folder structure
- Title-Case-With-Dashes naming
- Professional markdown formatting
- Mermaid diagram standards

### 11.8 Key Improvements in WDS v6

**1. Soft Language Design Philosophy**
- Removed MUST/FORBIDDEN/NEVER language
- Identity-based persona definitions
- Collaborative, not interrogative approach
- Positive framing (enables vs prevents)

**2. Example-Driven Learning**
- Complete reference implementations
- Conversation flow examples
- Real project patterns (Dog Week)
- Starter projects for practice

**3. Phase Flexibility**
- Phase-selectable (not rigid tracks)
- Path presets for common scenarios
- Optional phases (Design System)
- Parallel workflows supported

**4. Better Integration**
- Clean handoff to BMM via E-UI-Roadmap
- No development artifacts in design module
- Clear separation of concerns
- Continuous handoff model

**5. Professional Tooling**
- Proper v6 YAML schema compliance
- Workflow validation support
- Installation via BMad CLI
- Module ecosystem integration

### 11.9 Migration Notes

**Breaking Changes:**
- Agent activation syntax changes (*command → workflow trigger)
- File format changes (.md → .agent.yaml)
- Folder structure reorganization
- Terminology updates throughout

**Backward Compatibility:**
- WPS2C v4 users must migrate to WDS v6
- No automatic migration path
- Dog Week project uses mixed terminology (in transition)
- Old repo remains for reference

**User Communication:**
- WDS is evolution, not replacement
- Same methodology, better implementation
- Migration guide needed for v4 users
- Clear benefits explanation

---

## 12. Latest Updates (December 5, 2025)

### Phase 4 Workflow - Dog Week Pattern Implementation ✅

#### Phase 4 Architecture (December 4)

**Step-File Architecture:**
- `workflows/4-ux-design/workflow.yaml` - Main workflow configuration
- `workflows/4-ux-design/workflow.md` - Workflow orchestrator
- `workflows/4-ux-design/steps/step-01-init.md` - Workflow initialization
- `workflows/4-ux-design/steps/step-02-define-scenario.md` - Scenario structure
- `workflows/4-ux-design/steps/step-03-design-page.md` - Page design orchestration
- `workflows/4-ux-design/steps/step-04-complete-scenario.md` - Scenario completion
- `workflows/4-ux-design/steps/step-05-next-steps.md` - Next actions

**4C Micro-Steps (Specification Breakdown):**
- `substeps/4c-01-page-basics.md` - Page basic information
- `substeps/4c-02-layout-sections.md` - Layout sections definition
- `substeps/4c-03-components-objects.md` - Components & objects identification
- `substeps/4c-04-content-languages.md` - Content & language specs
- `substeps/4c-05-interactions.md` - Interaction definitions
- `substeps/4c-06-states.md` - Object states
- `substeps/4c-07-validation.md` - Validation rules
- `substeps/4c-08-generate-spec.md` - Final spec generation

#### Dog Week Pattern Implementation (December 5)

**Purpose-Based Text Organization:**
- `object-types/heading-text.md` - Updated with purpose-based naming
- `object-types/object-router.md` - Enhanced with intelligent interpretation
- Text objects named by FUNCTION, not content (e.g., `start-hero-headline` not `welcome-text`)
- Structure (position/style) separated from content
- Translations grouped so each language reads coherently

**Sketch Text Analysis:**
- Horizontal line detection → text placeholders
- Line thickness → font size estimation
- Line spacing → line-height calculation
- Character capacity estimation for content validation
- `SKETCH-TEXT-ANALYSIS-GUIDE.md` - Complete analysis methodology

**Translation Grouping:**
- Text groups keep languages together
- Each language reads as complete, coherent message
- Dog Week format standardized across all projects
- `TRANSLATION-ORGANIZATION-GUIDE.md` - Complete translation pattern
- `DOG-WEEK-SPECIFICATION-PATTERN.md` - Full workflow integration example

**Object Type Instructions:**
- `object-types/button.md` - Button documentation
- `object-types/text-input.md` - Text input fields
- `object-types/link.md` - Link elements
- `object-types/heading-text.md` - Headings & text with placeholder analysis
- `object-types/image.md` - Image elements
- `object-types/object-router.md` - Intelligent object detection & routing

**Design Principles Applied:**
- ✅ Goal-based trust-the-agent approach
- ✅ Concise instructions (vs. long procedural lists)
- ✅ Soft, collaborative language throughout
- ✅ Clear step separation with micro-steps
- ✅ Optional steps where appropriate
- ✅ v6 best practices for instruction file sizing
- ✅ Purpose-based naming (stable Object IDs)
- ✅ Grouped translations (coherent reading)
- ✅ Character capacity validation from sketches

**Key Innovations:**
1. **Purpose-Based Object IDs** - IDs reflect function, remain stable when content changes
2. **Grouped Translations** - Each language reads coherently as a group
3. **Sketch Text Analysis** - Automatic capacity estimation from visual markers
4. **Intelligent Routing** - Agent suggests object types rather than asking lists

**Architecture Documentation:**
- `workflows/4-ux-design/ARCHITECTURE.md` - Complete Phase 4 architecture
- `workflows/4-ux-design/SKETCH-TEXT-ANALYSIS-GUIDE.md` - Text analysis methodology
- `workflows/4-ux-design/TRANSLATION-ORGANIZATION-GUIDE.md` - Translation patterns
- `workflows/4-ux-design/DOG-WEEK-SPECIFICATION-PATTERN.md` - Complete workflow example

**Next Actions:**
- Create Phase 5 workflow (Design System)
- Create Phase 6 workflow (PRD Finalization / Dev Integration)
- Complete agent definitions (Freyja, Baldr)
- Port agent presentations
- Create remaining object-type instruction files (~15 more types)

#### Language Configuration (December 5 - Later)

**Multi-Language Support:**
- `workflows/workflow-init/instructions.md` - Updated with language configuration (Step 4)
- `workflows/wds-workflow-status-template.yaml` - Added language fields to config
- `workflows/LANGUAGE-CONFIGURATION-GUIDE.md` - Complete multi-language guide
- `workflows/LANGUAGE-FLOW-DIAGRAM.md` - Step-by-step language flow

**Configuration Settings:**
1. **Specification Language** - Language to write design specs in (EN, SE, etc.)
2. **Product Languages** - Array of languages the product supports

**Storage:**
```yaml
config:
  specification_language: "EN"
  product_languages:
    - EN
    - SE
    - NO
```

**Impact on Workflows:**
- Specs written in `specification_language`
- All text objects include translations for ALL `product_languages`
- Agents automatically request content for each configured language
- Complete translation coverage from day one

**Example (Dog Week):**
- Specification Language: EN (specs written in English)
- Product Languages: [EN, SE] (product supports English & Swedish)
- Result: All text objects have both EN and SE content

**Benefits:**
- ✅ Flexible spec language separate from product languages
- ✅ All translations grouped and coherent
- ✅ No missing translations
- ✅ Developer-friendly config
- ✅ Easy to add languages mid-project

#### Sketch Text Analysis Corrections (December 5 - Final)

**Corrected Understanding:**
- **Line thickness** → **font weight** (bold/regular), NOT font size!
- **Distance between lines** → **font size**
- **Confusion risk:** Large spacing (>60px) might be image/colored box, not text

**Updated Files:**
- `4-ux-design/object-types/heading-text.md` - Corrected analysis logic
- `4-ux-design/SKETCH-TEXT-ANALYSIS-GUIDE.md` - Updated with correct interpretation
- `4-ux-design/SKETCH-TEXT-QUICK-REFERENCE.md` - Quick reference card
- `4-ux-design/SKETCH-TEXT-STRATEGY.md` - When to use text vs. markers

**Best Practice - Actual Text vs. Markers:**

**Use ACTUAL TEXT for:**
- Headlines (provides content guidance)
- Button labels (shows intended action)
- Navigation items (clarifies structure)
- Short, important text

**Use LINE MARKERS for:**
- Body paragraphs (content TBD)
- Long descriptions (sizing only)
- Placeholder content

**Agent Behavior:**
- Reads actual text from sketch as starting suggestion
- **Proactively suggests translations for all configured languages**
- Allows refinement during specification
- Sketch text isn't final, just guidance
- Analyzes markers for font size, weight, capacity

**Example:**
```
Every walk. on time.  ← Agent reads this
Every time.           ← Translates to all languages

EN: Every walk. on time. Every time.
SE: Varje promenad. i tid. Varje gång.  ← Agent suggests!

Do these work? [1] Use [2] Adjust [3] Manual
```

**User can:**
- Accept suggestions (fast!)
- Refine specific translations
- Provide manual input if preferred

---

---

**End of Roadmap Document**

*To continue: Open this document, review "Next Steps" section for current priorities*

