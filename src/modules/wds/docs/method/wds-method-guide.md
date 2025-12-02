# Whiteport Design Studio Method

**A design-first methodology for creating software that people love**

---

## The WDS Philosophy

**Providing a thinking partner to every designer on the planet** - enabling designers everywhere to give more of what is valuable to the world. With deep understanding of users, technology, and what drives people, we provide functionality, beauty, simplicity, and make software endlessly successful by giving people both what they want and what they need.

---

## What is WDS?

Whiteport Design Studio is a **design-focused methodology** that supports designers in their design process and help create detailed specifications through collaborative workshops, visual thinking, and systematic documentation perfect for development by AI and humans alike.

WDS creates the **design artifacts** that development teams need to build exceptional products - from initial vision through detailed component specifications.

### The Core Idea

```
Vision → Clarity → UX Design →      Design System →      Handoff
   │         │             │                 │              │
   │         │             │                 │              └── Dev teams get
   │         │             │                 │                  everything
   │         │             │                 │
   │         │             │                 └── Components,
   │         │             │                     tokens, patterns
   │         │             │
   │         │             └── Conceptualizing, Sketching,
   │         │                 create specifications
   │         │
   │         └── User research,
   │             trigger mapping
   │
   └── Strategic foundation,
       positioning, ICP
```

---

## The Six Phases

WDS follows six phases, each producing artifacts in your project's `docs/` folder:

### Phase 1: Product Exploration
**Output:** `A-Product-Brief/`  
**Agent:** Saga-Analyst

Establish your strategic foundation through conversational discovery. Instead of filling out questionnaires, you have a conversation that builds understanding organically.

**What you create:**
- Product vision and problem statement
- Market positioning and differentiation
- Success criteria and metrics
- Strategic context for everything that follows

---

### Phase 2: User Research
**Output:** `B-Trigger-Map/`  
**Agent:** Saga-Analyst

Connect business goals to user psychology through Effect Mapping. Discover not just WHO your users are, but WHY they act and WHAT triggers their decisions.

**What you create:**
- Business goals with clear priorities
- Target groups connected to business outcomes
- Detailed personas with psychological depth
- Usage goals (what users want vs what they fear)
- Visual trigger map showing the strategic connections

---

### Phase 3: Requirements
**Output:** `D-PRD/`  
**Agent:** Freyja-PM

Define the technical foundation and functional requirements. Bridge the gap between strategic vision and implementation details.

**What you create:**
- Platform architecture decisions
- Infrastructure specifications
- Integration requirements
- Security and performance needs
- Functional feature specifications

---

### Phase 4: Conceptual Design
**Output:** `C-Scenarios/`  
**Agent:** Baldr-UX

Transform ideas into detailed visual specifications. Your agent helps you think out the design, assists in sketching, then specifies and pressure-tests every detail.

**The key insight:** Designs that can be logically explained without gaps are easy to develop. The specification process reveals holes in your thinking before they become expensive development problems.

**What you create:**
- Scenario folder structure (numbered hierarchy)
- Page specifications with full detail
- Component definitions with Object IDs
- Interaction behaviors and states
- Multilingual content
- HTML previews for validation

---

### Phase 5: Component Design
**Output:** `D-Design-System/`  
**Agent:** Baldr-UX

Build your component library following atomic design principles. Create reusable patterns that serve user psychology.

**What you create:**
- Design tokens (colors, typography, spacing)
- Atomic components (buttons, inputs, labels)
- Molecular components (form groups, cards)
- Organism components (headers, complex sections)
- Usage guidelines and variants

---

### Phase 6: Dev Integration
**Output:** `E-UI-Roadmap/`  
**Agent:** Freyja-PM

Prepare everything development teams need. Create the bridge between design and implementation.

**What you create:**
- Priority sequence (what to build first)
- Scenario-to-development mapping
- Component inventory
- Technical notes and constraints
- Object ID inventory for testing
- Handoff checklist

---

## Folder Structure

WDS creates an organized folder structure in your project's `docs/` folder. During setup, you make two choices:

### Your 4 Options

| Choice | Option A | Option B |
|--------|----------|----------|
| **Prefix** | Letters (A, B, C...) | Numbers (01, 02, 03...) |
| **Case** | Title-Case | lowercase |

### Examples

**Letters + Title-Case** (default):
```
docs/
├── A-Product-Brief/
├── B-Trigger-Map/
├── C-Scenarios/
├── D-PRD/
├── D-Design-System/
└── E-UI-Roadmap/
```

**Letters + lowercase**:
```
docs/
├── A-product-brief/
├── B-trigger-map/
├── C-scenarios/
├── D-prd/
├── D-design-system/
└── E-ui-roadmap/
```

**Numbers + Title-Case**:
```
docs/
├── 01-Product-Brief/
├── 02-Trigger-Map/
├── 03-Scenarios/
├── 04-PRD/
├── 05-Design-System/
└── 06-UI-Roadmap/
```

**Numbers + lowercase**:
```
docs/
├── 01-product-brief/
├── 02-trigger-map/
├── 03-scenarios/
├── 04-prd/
├── 05-design-system/
└── 06-ui-roadmap/
```

**Default (Letters + Title-Case) is recommended because:**
- Title-Case is easier for non-technical people to read
- Letters create distinctive WDS branding
- Distinguishes WDS folders from other docs

---

## Phase-Selectable Workflow

Not every project needs all six phases. Select what you need based on your situation:

| Project Type | Recommended Phases |
|--------------|-------------------|
| **Landing page** | 1, 4, 5 |
| **Full product (greenfield)** | All six |
| **Feature enhancement** | 2, 4, 5, 6 |
| **Design system only** | 4, 5 |
| **Strategic planning** | 1, 2 |

Your agents will help you identify which phases fit your project.

---

## Your Agents

Three specialized agents guide you through WDS:

### Saga-Analyst 📚
*"The one who tells your business story"*

Saga guides you through discovery and research. She's curious, patient, and helps you uncover insights you might not have seen yourself.

**Works with you on:**
- Phase 1: Product Exploration
- Phase 2: User Research (Trigger Mapping)

### Freyja-PM ⚔️
*"The strategic leader who sees what must be done"*

Freyja helps you define requirements and prepare for development. She balances passion with strategy, knowing when to be fierce and when to be patient.

**Works with you on:**
- Phase 3: Requirements
- Phase 6: Dev Integration

### Baldr-UX ✨
*"The one who brings light and beauty"*

Baldr transforms your ideas into beautiful, detailed specifications. He cares deeply about craft and ensures every detail serves the user experience.

**Works with you on:**
- Phase 4: Conceptual Design
- Phase 5: Component Design

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

```
WDS Design Phases              Handoff              Development
─────────────────              ──────               ───────────
A-Product-Brief   ────┐
B-Trigger-Map     ────┼────► E-UI-Roadmap ────────► BMM or your
D-PRD             ────┤         (bridge)            development
C-Scenarios       ────┤                             process
D-Design-System   ────┘
```

The `E-UI-Roadmap/` folder contains everything development teams need to begin implementation without additional discovery work.

---

## Learn More

- **Phase guides:** Detailed documentation for each phase
- **Examples:** Dog Week patterns showing real artifacts
- **Conversation examples:** See how agent sessions flow

---

*Whiteport Design Studio - Part of the BMad ecosystem*

