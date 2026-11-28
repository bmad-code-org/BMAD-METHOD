---
title: 'Design UX and Architecture'
description: Decide whether your work needs UX design or shared technical architecture, run Sally and Winston on an initiative, an epic, or standalone work, and have Sofia attach their files so builds follow them.
sidebar:
  order: 4
---

Use this page to decide whether your project needs UX design or shared technical architecture before planning stories. Most small changes need neither. Work where multiple epics or coding sessions must follow the same visual system or technical contracts benefits from writing those shared choices down once.

| Work | UX and architecture |
| --- | --- |
| A clear, local change following established patterns | Usually unnecessary |
| Several related components with known constraints | Optional, depending on coordination risk |
| Several epics sharing screens, contracts, or system boundaries | Keeps independent builds consistent |
| A regulated, high-risk, or enterprise initiative | Follow your governance; architecture is normally required |

[Sally, UX Designer](../agents/sally-ux-designer.md) (`bmad-agent-ux-designer`) coaches you through user experience, brand identity, visual direction, screen flows, websites, and UI audits. [Winston, System Architect](../agents/winston-architect.md) (`bmad-agent-architect`) helps settle shared technical decisions, feature designs, technology choices, migrations, and security reviews. Neither changes how `bmad-build` works: each build session still delivers one story at a time, while reading the same UX and architecture files so separately built parts fit together.

Both Sally and Winston also work standalone whenever you want design or architecture help without creating an initiative or ticket tree.

## When to Run Them and in What Order

At both the initiative and epic levels, run UX design before architecture so the user experience shapes the technical choices. Architecture normally runs after Sofia writes and slices the initiative because Winston reads the epic boundaries to see what they share. UX can run right after slicing or even earlier to inform a PRD. BMad does not lock you into one sequence: swap the order whenever a hard technical constraint determines what the interface can do, and if you are building on existing code you plan to keep, run architecture before Sofia slices so Winston records the technical decisions already in the codebase.

Sofia prompts you at the right moments automatically:

- After slicing an initiative, she offers fresh chats with Sally (for UI initiatives without UX files yet) and Winston (when no shared architecture exists yet).
- Before slicing an individual epic into stories, she offers Sally if the epic introduces screens or user flows not yet covered, and Winston if the epic introduces non-trivial API contracts, schemas, migrations, or state flows.

You can always decline either offer when there are no open design or technical questions, and Sofia records your choice in the ticket's notes.

## Design the Experience with Sally

Work with [Sally](../agents/sally-ux-designer.md) (`bmad-agent-ux-designer`) whenever the interface matters to the outcome; skip her for pure backend changes or internal scripts with no user-facing surface. She captures your vision rather than imposing a house style, recording it in two peer documents: `DESIGN.md` for how the product looks (visual tokens, typography, spacing, components) and `EXPERIENCE.md` for how it behaves (structure, loading and empty states, error handling, interactions, accessibility, and key flows). If a visual mockup ever conflicts with the written spec, the document wins. When you already have an existing design system, `DESIGN.md` references its tokens and records only your additions, while `EXPERIENCE.md` covers only what behaves differently.

Sally matches the depth of design work to what you actually need:

| UX work | What Sally covers |
| --- | --- |
| Quick single-flow UX | A fast, lightweight spec and wireframe for a small tool or single screen |
| Full product and epic UX | Guided coaching covering screen states, edge cases, interactive color themes, visual direction explorations, wireframes, and interactive HTML key-screen mockups |
| Brand identity (`BRAND.md`) and websites | Positioning, color palettes with contrast checks, typography pairings, scalable SVG logos, interactive HTML brand books, and landing-page blueprints |
| User motivation maps and UI audits | Mapping what drives and blocks users before designing screens, or auditing an existing app or frontend codebase for usability, responsiveness, and accessibility issues |
| External design-tool handoffs | Two-way workflows with Google Stitch, Claude Design, and Figma that turn briefs into visual explorations and fold exported tokens or frames back into `DESIGN.md` and `EXPERIENCE.md` |

During `bmad setup`, you can point the `design_system` setting to any `DESIGN.md`, brand guide, CSS token file, or folder of design files so future UX runs, HTML views, and visual outputs inherit your brand automatically. When design decisions change later, ask Sally to update the files rather than editing tickets by hand.

## Settle Shared Technical Decisions with Winston

When several epics or coding sessions build against the same system without shared guardrails, each makes a reasonable local choice that collides with the others: REST in one place and GraphQL in another, `snake_case` meeting `camelCase`, or session cookies clashing with JWTs. Ask [Winston](../agents/winston-architect.md) (`bmad-agent-architect`) to write a short shared architecture document for the initiative that records only the calls two builders could make incompatibly.

Winston applies a strict filter so the document stays short: if two people built separate parts independently, could they pick incompatible approaches? A decision belongs in shared architecture only when the answer is yes, the choice is non-obvious, and it involves a real trade-off. Each recorded call gets a stable decision ID that epics and stories can cite, and the document explicitly lists what it leaves to individual coding sessions.

Coaching is the default, so you do not need an architecture background. For each major call (application style, tech stack or starter template, data ownership, service boundaries, hosting, or AI/agent guardrails), Winston lays out realistic options, explains what each costs, states his lean with reasons, and lets you decide. On a new project, he recommends a current, well-supported starter that settles a coherent baseline cleanly. On an existing codebase, he reads the code first and ratifies the conventions already working in production instead of rewriting them, deciding only what your new work adds or changes.

Beyond shared architecture for an initiative or epic, Winston also handles standalone technical work:

| Technical work | What Winston covers |
| --- | --- |
| Enterprise architecture | Cross-domain boundaries and shared contracts spanning a multi-initiative program |
| Solution designs (RFCs) and technology evaluations | Structured proposals for peer review and weighted build-vs-buy comparisons |
| API designs and migration plans | Public APIs, webhook contracts, versioning policies, parity checks, and zero-downtime cutover plans |
| Security reviews, production readiness, and postmortems | Practical threat modeling, launch readiness gates, Architecture Decision Records (ADRs), incident reviews, and codebase audits for AI coding agents |

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app:

**You:**

```text wrap
/bmad-agent-ux-designer design the door tablet's check-in screen
```

Sally records the screen's four states in `EXPERIENCE.md`: free, booked and waiting for check-in, checked in, and just freed. In a fresh chat:

**You:**

```text wrap
/bmad-agent-architect settle the decisions the check-in epics share
```

**Winston:** One call your epics could make differently is where the no-show timer runs. On the server, an offline tablet can never free a room on its own; on the tablet, check-in keeps working offline. I lean server. Which do you want?

**You:** Server.

He records that decision in the initiative's architecture document. Then, in a chat with Sofia:

**You:**

```text wrap
/bmad-agent-po adopt the design and the architecture
```

**Sofia:** Added both to the initiative's references; both epics cite the server-timer decision, and door check-in cites the tablet design.
:::

## Attach the Files to Your Plan

A UX design or shared architecture helps coding sessions only when they know to read it. When Sally or Winston finishes, ask Sofia to adopt their files:

```text wrap
/bmad-agent-po adopt the design and architecture
```

Sofia links the files into the initiative or epic references and makes sure every affected story cites them. Coding sessions then load those visual tokens, screen states, and technical contracts beside the story automatically. Winston reminds you to take this step when his document finishes.

Either specialist can also run on a single epic whenever the initiative-level design or architecture left details open. Epic-level files live inside that epic's folder: Winston inherits the initiative's decisions and records only what the epic adds, and Sally covers the specific screen flows, states, and mockups that epic introduces.

:::caution[Common mistakes]
Deciding API conventions "as you go", documenting every minor implementation detail, or writing an architecture document once and never updating it are the three ways this step breaks down. Record only the decisions that cross boundaries, and whenever one changes mid-flight, update it with Sally or Winston and tell Sofia ([Learn and Adjust](../learn/learn-and-adjust.md#a-change-mid-flight)).
:::
