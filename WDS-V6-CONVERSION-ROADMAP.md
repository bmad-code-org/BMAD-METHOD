# WDS v6 Conversion Roadmap

**Document Purpose:** Complete record of all decisions, context, and progress for converting Whiteport Design Studio to BMad Method v6 format. This document allows continuation of work if the conversation is lost.

**Created:** December 2, 2025  
**Last Updated:** December 2, 2025  
**Status:** In Progress - Foundation Phase

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

## 7. Development Order

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
| 1 | Method Overview | `docs/method/wds-method-guide.md` | ✅ CREATED |
| 2 | Phase 1 Guide | `docs/method/phase-1-exploration-guide.md` | ✅ CREATED |
| 3 | Phase 2 Guide | `docs/method/phase-2-research-guide.md` | ✅ CREATED |
| 4 | Phase 3 Guide | `docs/method/phase-3-requirements-guide.md` | ✅ CREATED |
| 5 | Phase 4 Guide | `docs/method/phase-4-ux-design-guide.md` | ✅ CREATED |
| 6 | Phase 5 Guide | `docs/method/phase-5-design-system-guide.md` | ✅ CREATED |
| 7 | Phase 6 Guide | `docs/method/phase-6-integration-guide.md` | ✅ CREATED |

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
| 11 | workflow-init | `workflows/0-init/` | TO CREATE |
| 12 | Phase Workflows | `workflows/1-6/` | TO CREATE |

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

### 8.2 Module Structure

| Path | Purpose | Status |
|------|---------|--------|
| `src/modules/wds/` | Module root | ✅ CREATED |
| `src/modules/wds/README.md` | Module entry point | ✅ CREATED |
| `src/modules/wds/_module-installer/` | Install config folder | ✅ CREATED (empty) |
| `src/modules/wds/agents/` | Agents folder | ✅ CREATED (empty) |
| `src/modules/wds/workflows/` | Workflows folder | ✅ CREATED (empty) |
| `src/modules/wds/data/` | Data folder | ✅ CREATED (empty) |
| `src/modules/wds/data/presentations/` | Agent presentations | ✅ CREATED (empty) |
| `src/modules/wds/docs/` | Documentation folder | ✅ CREATED (empty) |
| `src/modules/wds/docs/method/` | Methodology guides | ✅ CREATED (empty) |
| `src/modules/wds/docs/images/` | Images folder | ✅ CREATED (empty) |
| `src/modules/wds/examples/` | Examples folder | ✅ CREATED (empty) |
| `src/modules/wds/examples/dog-week-patterns/` | Dog Week examples | ✅ CREATED (empty) |
| `src/modules/wds/reference/` | Reference materials | ✅ CREATED (empty) |
| `src/modules/wds/reference/templates/` | Templates | ✅ CREATED (empty) |
| `src/modules/wds/reference/checklists/` | Checklists | ✅ CREATED (empty) |
| `src/modules/wds/teams/` | Team configs | ✅ CREATED (empty) |

---

## 9. Next Steps

### Immediate Next Action

**Create `wds-method-guide.md`** - The methodology overview document

This will include:
- Overview of the 6 phases
- What each phase produces
- When to use each phase
- How phases connect
- The A-B-C-D-E folder structure
- Links to examples (not rules)

### Short-term Roadmap

1. [x] Create `wds-method-guide.md`
2. [x] Create phase guide for each phase (6 files)
3. [ ] Port Dog Week examples to `examples/dog-week-patterns/`
4. [ ] Create conversation examples
5. [ ] Create workflow-init workflow
6. [ ] Create first phase workflow (Phase 1)
7. [ ] Create first agent (Saga-Analyst)

### Commit Checkpoint

After creating methodology docs, commit with message:
```
feat(wds): Add WDS methodology documentation

- Add wds-method-guide.md with 6-phase overview
- Add phase-specific guides
- Establish show-don't-tell documentation approach
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

**End of Roadmap Document**

*To continue: Open this document, review "Next Steps" section, and proceed with creating `wds-method-guide.md`*

