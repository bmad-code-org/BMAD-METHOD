# Whiteport Design Studio Method

**A design-first methodology for creating software that people love**

---

## The WDS Philosophy

**Providing a thinking partner to every designer on the planet** - enabling designers everywhere to give more of what is valuable to the world. With deep understanding of users, technology, and what drives people, we provide functionality, beauty, simplicity, and make software endlessly successful by giving people both what they want and what they need.

---

## What is WDS?

Whiteport Design Studio is a **design-focused methodology** that supports designers in their design process and helps create detailed specifications through collaborative workshops, visual thinking, and systematic documentation perfect for development by AI and humans alike.

WDS creates the **design artifacts** that development teams need to build exceptional products - from initial vision through detailed component specifications.

### The Core Idea

```
Vision → Clarity → UX Design → Design System → PRD Complete
   │         │           │             │              │
   │         │           │             │              └── Development
   │         │           │             │                  gets everything
   │         │           │             │
   │         │           │             └── Components,
   │         │           │                 tokens, patterns
   │         │           │                 (optional, parallel)
   │         │           │
   │         │           └── Sketching, specifying,
   │         │               prototyping, PRD grows
   │         │
   │         └── Trigger mapping,
   │             Feature Impact Analysis
   │
   └── Strategic foundation,
       positioning, ICP
```

---

## The Six Phases

WDS follows six phases, each producing artifacts in your project's `docs/` folder:

### Phase 1: Product Exploration (Product Brief)

**Output:** `A-Product-Brief/`  
**Agent:** Saga the Analyst

Establish your strategic foundation through conversational discovery. Instead of filling out questionnaires, you have a conversation that builds understanding organically.

**What you create:**

- Product vision and problem statement
- Market positioning and differentiation
- Success criteria and metrics
- Strategic context for everything that follows

---

### Phase 2: Trigger Mapping (Trigger Map)

**Output:** `B-Trigger-Map/`  
**Agent:** Saga the Analyst

Connect business goals to user psychology through Trigger Mapping. Discover not just WHO your users are, but WHY they act and WHAT triggers their decisions.

**What you create:**

- Business goals (Vision + SMART objectives)
- Target groups connected to business outcomes
- Detailed personas with psychological depth
- Usage goals (positive and negative driving forces)
- Visual trigger map showing strategic connections
- Feature Impact Analysis with priority scoring

---

### Phase 3: PRD Platform (Technical Foundation)

**Output:** `C-Requirements/`  
**Agent:** Freya the PM

Prove your concept works technically - in parallel with design work. Validate platform decisions, create proofs of concept, and set up experimental endpoints.

**What you create:**

- Platform architecture decisions
- Data model and integrations
- Technical proofs of concept
- Experimental endpoints
- Security and performance framework
- Technical constraints document (for UX Design)

---

### Phase 4: UX Design (UX-Sketches & Usage Scenarios)

**Output:** `C-Scenarios/`  
**Agent:** Baldr the UX Expert

Transform ideas into detailed visual specifications. Your agent helps you think out the design, assists in sketching, creates specifications, and builds HTML prototypes. Each page adds functional requirements to the PRD.

**The key insight:** Designs that can be logically explained without gaps are easy to develop. The specification process reveals gaps early - when they're easy to address.

**What you create:**

- Scenario folder structure (numbered hierarchy)
- Page specifications with full detail
- Component definitions with Object IDs
- Interaction behaviors and states
- HTML prototypes for validation
- Functional requirements added to PRD (via step 4E)

---

### Phase 5: Design System (Component Library)

**Output:** `D-Design-System/`  
**Agent:** Baldr the UX Expert

Build your component library following atomic design principles. This phase is **optional** and runs **in parallel** with Phase 4 - as you design pages, you extract reusable components.

**What you create:**

- Design tokens (colors, typography, spacing)
- Atomic components (buttons, inputs, labels)
- Molecular components (form groups, cards)
- Organism components (headers, complex sections)
- Interactive HTML component showcase
- Figma/design tool integration with unified naming

---

### Phase 6: PRD Finalization (Complete PRD)

**Output:** Complete PRD in `C-Requirements/` + `E-UI-Roadmap/`  
**Agent:** Freya the PM

Compile all functional requirements discovered during Phase 4 into a complete, development-ready PRD. This phase runs **continuously** - hand off as soon as you have MVP scope, then update as design progresses.

**What you create:**

- Complete PRD (Platform + Functional requirements)
- Feature organization by epic/area
- Development sequence with priorities
- Handoff package in `E-UI-Roadmap/`
- Scenario-to-epic mapping

---

## Folder Structure

WDS creates an organized folder structure in your project's `docs/` folder. During setup, you make two choices:

### Your 4 Options

| Choice     | Option A             | Option B                |
| ---------- | -------------------- | ----------------------- |
| **Prefix** | Letters (A, B, C...) | Numbers (01, 02, 03...) |
| **Case**   | Title-Case           | lowercase               |

### Examples

**Letters + Title-Case** (default):

```
docs/
├── A-Product-Brief/
├── B-Trigger-Map/
├── C-Platform-Requirements/
├── C-Scenarios/
├── D-Design-System/
└── E-PRD-Finalization/
```

**Numbers + Title-Case**:

```
docs/
├── 01-Product-Brief/
├── 02-Trigger-Map/
├── 03-Platform-Requirements/
├── 03-Scenarios/
├── 04-Design-System/
└── 05-PRD-Finalization/
```

**Default (Letters + Title-Case) is recommended because:**

- Title-Case is easier for non-technical people to read
- Letters create distinctive WDS branding
- Distinguishes WDS folders from other docs

---

## Phase-Selectable Workflow

Not every project needs all six phases. Select what you need based on your situation:

| Project Type                  | Recommended Phases |
| ----------------------------- | ------------------ |
| **Landing page**              | 1, 4               |
| **Full product (greenfield)** | All six            |
| **Feature enhancement**       | 2, 4, 6            |
| **Design system only**        | 4, 5               |
| **Strategic planning**        | 1, 2               |
| **Quick prototype**           | 4 only             |

Your agents will help you identify which phases fit your project.

---

## Your Agents

Three specialized agents guide you through WDS:

### Saga the Analyst 📚

_"The one who tells your business story"_

Saga guides you through discovery and research. She's curious, patient, and helps you uncover insights you might not have seen yourself.

**Works with you on:**

- Phase 1: Product Exploration
- Phase 2: Trigger Mapping

### Freya the PM ⚔️

_"The strategic leader who sees what must be done"_

Freya helps you define technical requirements and finalize the PRD for development. She balances passion with strategy, knowing when to be fierce and when to be patient.

**Works with you on:**

- Phase 3: PRD Platform
- Phase 6: PRD Finalization

### Baldr the UX Expert ✨

_"The one who brings light and beauty"_

Baldr transforms your ideas into beautiful, detailed specifications. He cares deeply about craft and ensures every detail serves the user experience.

**Works with you on:**

- Phase 4: UX Design
- Phase 5: Design System

---

## How Sessions Work

WDS sessions are **conversations, not interrogations**.

### The Rhythm

A good WDS session feels like coffee with a wise mentor:

- They ask something interesting
- You share your thinking
- They reflect it back, maybe adding a new angle
- Together you discover something neither saw alone

It never feels like filling out a form.

### What to Expect

**Your agent will:**

- Ask one question at a time, then listen
- Reflect back what they heard before moving on
- Build documents together with you, piece by piece
- Check in to make sure they understood correctly

**You'll leave with:**

- Clear documentation you helped create
- Deeper understanding of your own product
- Ready-to-use artifacts for the next phase

---

## Getting Started

### Prerequisites

1. BMad Method installed with WDS module
2. Project workspace ready
3. Stakeholders available for workshop phases

### Quick Start

```
# Install BMad with WDS
npx bmad-method@alpha install

# Activate any WDS agent
# They'll guide you from there

# Or run workflow-init for phase selection
*workflow-init
```

### First Steps

1. **Start with Phase 1** if you're building something new
2. **Start with Phase 2** if you have existing vision but need user clarity
3. **Start with Phase 4** if you have sketches ready to specify
4. **Ask your agent** if you're not sure where to begin

---

## The WDS Difference

### Traditional Approach

- 47-question requirements spreadsheet
- Generic persona templates
- Designers work alone, then throw specs "over the wall"
- Developers interpret and guess
- Everyone argues about what was meant

### WDS Approach

- Conversations that build understanding
- Personas with psychological depth connected to business goals
- Collaborative workshops building shared understanding
- Specifications so clear they eliminate guesswork
- Everyone aligned because they built it together

---

## Integration with Development

WDS focuses on **design** - creating the artifacts that guide development. The actual development process is handled by BMad Method (BMM) or your preferred development workflow.

### The PRD Journey

```
Phase 3: PRD starts              Phase 4: PRD grows           Phase 6: PRD completes
(Technical Foundation)           (Each page adds features)    (Organized for dev)
        │                                │                            │
        ▼                                ▼                            ▼
C-Requirements/           ────►   C-Requirements/      ────►   E-UI-Roadmap/
├── Platform arch                 ├── Platform arch            ├── Priority sequence
├── Data model                    ├── Data model               ├── Epic mapping
├── Integrations                  ├── Integrations             ├── Component inventory
└── Security                      └── Functional reqs ◄──┐     └── Handoff checklist
                                      (from each page)  │
                                                        │
                                  C-Scenarios/ ─────────┘
                                  (Page specs add features via 4E)
```

### Parallel Streams

Design and development can work in parallel:

- Phase 3 complete → Backend/platform development can start
- Phase 4 MVP scenarios complete → Phase 6 first handoff → Sprint 1 begins
- Design continues → Regular Phase 6 updates → More sprints

---

## Learn More

- **Phase guides:** Detailed documentation for each phase
- **Examples:** Dog Week patterns showing real artifacts
- **Templates:** Ready-to-use templates for all deliverables
- **Conversation examples:** See how agent sessions flow

---

_Whiteport Design Studio - Part of the BMad ecosystem_
