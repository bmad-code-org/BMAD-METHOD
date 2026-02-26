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
Vision → Clarity → Scenarios → UX Design → Development Ready
   │         │          │           │              │
   │         │          │           │              └── AI or human
   │         │          │           │                  development
   │         │          │           │
   │         │          │           └── Sketching, specifying,
   │         │          │               prototyping, specs grow
   │         │          │
   │         │          └── 8-question scenario dialog,
   │         │              user journeys, page outlines
   │         │
   │         └── Trigger mapping,
   │             Feature Impact Analysis
   │
   └── Strategic foundation,
       positioning, ICP
```

---

## The Nine Phases

WDS follows nine phases (0-8), each producing artifacts in your project's design artifacts folder:

### Phase 0: Alignment & Signoff

**Output:** `_alignment/`
**Agent:** Saga the Analyst

Generate alignment presentations and signoff documents. Used when you need stakeholder buy-in before proceeding.

---

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

### Phase 3: UX Scenarios (Scenario Outlines)

**Output:** `C-UX-Scenarios/`
**Agent:** Saga the Analyst

Transform your Trigger Map into concrete user journeys through the **8-question scenario dialog**. Define each meaningful transaction a user performs on your site — starting with the most important one.

**What you create:**

- Scenario outlines grounded in Trigger Map personas and business goals
- Page folders with boilerplate specs ready for Phase 4 design
- Scenario overview summarizing all scenarios with page assignments

**The 8-Question Dialog:**

| # | Question | What it establishes |
|---|----------|-------------------|
| Q1 | "What transaction do we need to get really right?" | The key user journey |
| Q2 | "Which business goal does it serve?" | Trigger Map connection |
| Q3 | "Which user, and in what real-life situation?" | Persona + context |
| Q4 | "What do they want and fear going into this?" | Driving forces |
| Q5 | "What device are they on?" | Platform |
| Q6 | "What's the natural starting point?" | Entry point + discovery |
| Q7 | "What's the best possible outcome — for both sides?" | Mutual success |
| Q8 | "What's the shortest path through the site?" | Linear sunshine path |

See: [Phase 3: UX Scenarios Guide](./phase-3-ux-scenarios-guide.md)

---

### Phase 4: UX Design (Page Specifications)

**Output:** `D-UX-Design/`
**Agent:** Freya the Designer

Transform scenarios into detailed visual specifications. Freya helps you conceptualize, sketch, specify, and prototype every interaction until your design can be logically explained without gaps.

**What you create:**

- Page specifications with full detail
- Component definitions with Object IDs
- Interaction behaviors and states
- HTML prototypes for validation

**Activities:** Conceptualize, Analyse Sketches, Suggest Interface, Dream Up Interface, Write Specifications, Visual Design, Manage Design System, Validate, Design Delivery

See: [Phase 4: UX Design Guide](./phase-4-ux-design-guide.md)

---

### Phase 5: Agentic Development

**Output:** Development artifacts
**Agent:** Idunn the PM

Bridge from design to development. Manage the development process with AI-assisted implementation, testing, and deployment.

**What you create:**

- Development tasks from design specifications
- Implementation with AI assistance
- Testing and validation
- Deployment packages

---

### Phase 6: Asset Generation

**Output:** Generated assets
**Agent:** Freya the Designer

Generate visual assets, icons, illustrations, and other design deliverables needed for the project.

---

### Phase 7: Design System (Component Library)

**Output:** `D-Design-System/`
**Agent:** Freya the Designer

Build your component library following atomic design principles. This phase runs **in parallel** with Phase 4 — as you design pages, you extract reusable components.

**What you create:**

- Design tokens (colors, typography, spacing)
- Atomic components (buttons, inputs, labels)
- Molecular components (form groups, cards)
- Organism components (headers, complex sections)
- Interactive HTML component showcase

---

### Phase 8: Product Evolution

**Output:** Evolution artifacts
**Agent:** Idunn the PM

Iterate on existing products. Analyze usage, scope changes, design updates, implement, test, and deploy improvements.

---

## Folder Structure

WDS creates an organized folder structure in your project's design artifacts folder. During setup, you make two choices:

### Your 4 Options

| Choice     | Option A             | Option B                |
| ---------- | -------------------- | ----------------------- |
| **Prefix** | Letters (A, B, C...) | Numbers (01, 02, 03...) |
| **Case**   | Title-Case           | lowercase               |

### Examples

**Letters + Title-Case** (default):

```
design-artifacts/
├── A-Product-Brief/
├── B-Trigger-Map/
├── C-UX-Scenarios/
│   └── 01-hasses-emergency-search/
│       ├── 01-hasses-emergency-search.md
│       └── pages/
│           ├── 01.1-start-page/
│           │   ├── 01.1-start-page.md
│           │   └── Sketches/
│           └── 01.2-services/
│               ├── 01.2-services.md
│               └── Sketches/
├── D-UX-Design/
└── D-Design-System/
```

**Default (Letters + Title-Case) is recommended because:**

- Title-Case is easier for non-technical people to read
- Letters create distinctive WDS branding
- Distinguishes WDS folders from other docs

---

## Phase-Selectable Workflow

Not every project needs all nine phases. Select what you need based on your situation:

| Project Type                  | Recommended Phases |
| ----------------------------- | ------------------ |
| **Landing page**              | 1, 3, 4            |
| **Full product (greenfield)** | All phases          |
| **Feature enhancement**       | 2, 3, 4            |
| **Design system only**        | 4, 7               |
| **Strategic planning**        | 1, 2               |
| **Quick prototype**           | 3, 4               |

Your agents will help you identify which phases fit your project.

---

## Your Agents

Three specialized agents guide you through WDS:

### Saga the Analyst

_"The one who tells your business story"_

Saga guides you through discovery, research, and scenario creation. She's curious, patient, and helps you uncover insights you might not have seen yourself.

**Works with you on:**

- Phase 0: Alignment & Signoff
- Phase 1: Product Exploration
- Phase 2: Trigger Mapping
- Phase 3: UX Scenarios

### Freya the Designer

_"The one who brings light and beauty"_

Freya transforms your scenarios into beautiful, detailed specifications. She cares deeply about craft and ensures every detail serves the user experience.

**Works with you on:**

- Phase 4: UX Design
- Phase 6: Asset Generation
- Phase 7: Design System

### Idunn the PM

_"The keeper of what endures"_

Idunn manages the bridge from design to development and guides product evolution. She ensures nothing is lost in translation and that products continue to improve.

**Works with you on:**

- Phase 5: Agentic Development
- Phase 8: Product Evolution

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

### Quick Start

```
# Install WDS
npx whiteport-design-studio install

# Start a conversation with Saga
# She'll guide you from there
```

### First Steps

1. **Start with Phase 1** if you're building something new
2. **Start with Phase 2** if you have existing vision but need user clarity
3. **Start with Phase 3** if you have a Trigger Map and need scenario outlines
4. **Start with Phase 4** if you have scenarios ready to design
5. **Ask your agent** if you're not sure where to begin

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
- 8-question scenario dialog grounding every design in real user psychology
- Collaborative workshops building shared understanding
- Specifications so clear they eliminate guesswork
- Everyone aligned because they built it together

---

## The Scenario → Design Flow

The heart of WDS is the connection between Phase 3 (Scenarios) and Phase 4 (Design):

1. **Phase 3** defines the scenario through 8 strategic questions
2. After completing a scenario, you choose to outline pages or jump to design
3. **Page Outline Dialog** defines each page's purpose and exit action
4. **Phase 4** designs each page with full context from the scenario
5. The **Outline → Design loop** lets you outline and design pages continuously

This ensures every page is designed with purpose — grounded in real user psychology, connected to business goals, and part of a coherent user journey.

---

## Learn More

- **Phase guides:** Detailed documentation for each phase
- **Examples:** Real project patterns showing complete artifacts
- **Templates:** Ready-to-use templates for all deliverables
- **Conversation examples:** See how agent sessions flow

---

_Whiteport Design Studio_
