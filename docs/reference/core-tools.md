---
title: Core Tools
description: Reference for the core module's built-in skills.
sidebar:
  order: 3
---

Every BMad installation includes the **core module** — a small set of skills that work across all projects, all modules, and all phases. This page covers those eight core skills: the five kernel tools plus the three **thinking skills** (brainstorming, forge idea, party mode).

:::tip[Quick Path]
Run any tool by typing its skill name (e.g., `bmad-help`) in your IDE. No agent session required.
:::

## Overview

**Core module (always installed):**

| Tool | Purpose |
| --- | --- |
| [`bmad-help`](#bmad-help) | Get context-aware guidance on what to do next |
| [`bmad-advanced-elicitation`](#bmad-advanced-elicitation) | Push LLM output through iterative refinement methods |
| [`bmad-editorial-review`](#bmad-editorial-review) | Two-pass editorial review — structure, then prose |
| [`bmad-review`](#bmad-review) | Multi-lens critical review — adversarial, edge-case, and verification-gap |
| [`bmad-customize`](#bmad-customize) | Create and verify BMad customization overrides |

**Thinking skills:**

| Tool | Purpose |
| --- | --- |
| [`bmad-brainstorming`](#bmad-brainstorming) | Facilitate interactive brainstorming sessions |
| [`bmad-forge-idea`](#bmad-forge-idea) | Pressure-test an idea until it hardens, proves out, or dies cheaply |
| [`bmad-party-mode`](#bmad-party-mode) | Orchestrate multi-agent group discussions |

:::note[Moved and removed]
`bmad-spec` now ships with the BMM module as a Phase 2 planning workflow — see the [Workflow Map](./workflow-map.md#phase-2-planning). The `bmad-shard-doc` and `bmad-index-docs` utilities have been removed. The former `bmad-editorial-review-prose`, `bmad-editorial-review-structure`, `bmad-review-adversarial-general`, `bmad-review-edge-case-hunter`, and `bmad-review-verification-gap` skills are merged into `bmad-editorial-review` and `bmad-review`; the old IDs still resolve via hidden forwarders for compatibility.
:::

## bmad-help

**Your intelligent guide to what comes next.** — Inspects your project state, detects what's been done, and recommends the next required or optional step.

**Use it when:**

- You finished a workflow and want to know what's next
- You're new to BMad and need orientation
- You're stuck and want context-aware advice
- You installed new modules and want to see what's available

**How it works:**

1. Scans your project for existing artifacts (PRD, architecture, stories, etc.)
2. Detects which modules are installed and their available workflows
3. Recommends next steps in priority order — required steps first, then optional
4. Presents each recommendation with the skill command and a brief description

**Input:** Optional query in natural language (e.g., `bmad-help I have a SaaS idea, where do I start?`)

**Output:** Prioritized list of recommended next steps with skill commands

## bmad-advanced-elicitation

**Push the LLM to reconsider, refine, and improve its recent output.** — BMad's shared refinement checkpoint: other skills invoke it at natural pauses, and you can call it directly on anything recent in the conversation.

**Use it when:**

- LLM output feels shallow or generic
- You want to explore a topic from multiple analytical angles
- You're refining a critical document and want deeper thinking
- You want a known method by name — Socratic, first principles, pre-mortem, red team

**How it works:**

1. Targets the most recent output in the conversation unless you point it at something else
2. Offers a short menu of best-fit elicitation methods for the content
3. Applies the chosen methods against the target
4. Hands back the improved version so the invoking flow resumes where it paused

**Input:** The recent output to refine (default), or any content you point it at; optionally a named method

**Output:** Enhanced version of the content with improvements applied

## bmad-editorial-review

**Two-pass editorial review — structure, then prose.** — A clinical editor that reviews a document's shape and its sentences, returning suggested fixes you accept or reject row by row. Content is sacrosanct: it never challenges your ideas, only how they're organized and expressed.

**Use it when:**

- You've drafted a document and want it tightened and polished
- A document was produced from multiple subprocesses and needs structural coherence
- You want to reduce length while preserving comprehension
- You need clarity fixes without style-opinion changes

**How it works:**

1. **Structure pass** — proposes cuts, merges, moves, and condensing; asks whether the document's shape serves its purpose
2. **Prose pass** — copy-edits for communication issues that impede comprehension, using the Microsoft Writing Style Guide as the baseline (a provided style guide overrides it)
3. Runs both passes, structure first, by default; ask for a structure-only or prose-only review to run one
4. Proposes, never executes — the author decides what to accept

**Input:**

- `content` (required) — Document to review
- `style_guide` (optional) — Project-specific style guide
- `reader_type` (optional) — `humans` (default) for clarity/flow, or `llm` for precision/consistency
- `purpose` / `target_audience` / `length_target` (optional) — calibrate the structure pass

**Output:** Findings table with suggested fixes, plus estimated reduction when structural changes are proposed

## bmad-review

**Multi-lens critical review over any diff, doc, or artifact.** — Runs independent review lenses — each a distinct method and stance — and reports every finding in one canonical shape. Zero findings is a valid outcome; it never pads to look thorough.

**The shipped lenses:**

| Lens | Method |
| --- | --- |
| **Adversarial** | Skeptical review that assumes problems exist — hunts what's missing, not just what's wrong |
| **Edge case** | Walks every branching path and boundary condition, reports only unhandled paths |
| **Verification gap** | Finds changed behavior that could regress without reliable verification catching it |

**Use it when:**

- You need quality assurance before finalizing a deliverable
- You want exhaustive edge-case coverage of code or logic
- You want to know whether a change is adequately verified
- You want all three perspectives at once (the default)

**How it works:**

1. Loads the content and identifies its type — diff, file, function, or document
2. Selects lenses: the ones you name, or every enabled lens that fits the content
3. Runs each lens independently — in parallel via subagents when the platform supports it
4. Assembles one findings array; overlap between lenses is signal, not duplication

**Input:**

- `content` (required) — Diff, branch, uncommitted changes, file, spec, story, or any document
- `lenses` (optional) — one or more lens codes or names; default is a full review
- `also_consider` (optional) — Additional areas to keep in mind

**Output:** JSON findings array (each finding carries `lens`, `location`, `trigger_condition`, `guard_snippet`, `potential_consequence`) and/or a markdown report grouped by lens

:::note[Used by other workflows]
Code Review workflows in other modules run these lenses automatically. Custom lenses can be added — and shipped ones tuned or disabled — through the skill's `customize.toml`.
:::

## bmad-customize

**Create and verify customization overrides.** — Helps you change how an installed BMad agent or workflow behaves without hand-authoring TOML.

**Use it when:**

- You want to change an agent or workflow behavior
- You need to add persistent facts, activation hooks, or custom menu items
- You want the right override scope selected and verified automatically

**How it works:**

1. Scans installed BMad skills for customizable surfaces
2. Selects the right scope for your requested change
3. Writes override files under `_bmad/custom/`
4. Verifies the merged configuration

**Input:** Natural language description of the customization you want

**Output:** TOML override files under `_bmad/custom/`

For a detailed guide on customizing BMad, see [How to Customize BMad](../how-to/customize-bmad.md).

## Thinking Skills

The three skills below round out the core module — general-purpose thinking tools that any phase or module can lean on.

### bmad-brainstorming

**Generate diverse ideas through interactive creative techniques.** — A facilitated brainstorming session that loads proven ideation methods from a technique library and guides you toward 100+ ideas before organizing.

**Use it when:**

- You're starting a new project and need to explore the problem space
- You're stuck generating ideas and need structured creativity
- You want to use proven ideation frameworks (SCAMPER, reverse brainstorming, etc.)

**How it works:**

1. Sets up a brainstorming session with your topic
2. Loads creative techniques from a method library
3. Guides you through technique after technique, generating ideas
4. Applies anti-bias protocol — shifts creative domain every 10 ideas to prevent clustering
5. Produces an append-only session document with all ideas organized by technique

**Input:** Brainstorming topic or problem statement, optional context file

**Output:** a self-contained `brainstorm.html` keepsake of the session, an optional `brainstorm-intent.md` for downstream skills, and a `.memlog.md` session record

:::note[Quantity Target]
The magic happens in ideas 50–100. The workflow encourages generating 100+ ideas before organization.
:::

### bmad-forge-idea

**Pressure-test an idea until it hardens, proves out, or dies cheaply.** — An adversarial interrogator drives a half-formed idea one question at a time, bringing two characters to every branch, until what survives is something you can act on with conviction.

**Use it when:**

- You hold an idea and want it stress-tested before you invest in it
- You want an honest read on whether to kill it
- You need a thinking partner that pushes back instead of agreeing

**How it works:**

1. Establishes the goal up front and steers the questioning to match it
2. Works one question at a time in dependency order, putting a recommended answer on the table to push against
3. Brings two voices to every branch — one from your installed roster, one conjured by the topic
4. Challenges fuzzy terms and tests claims against an existing project's material
5. Lands as Hardened, Killed, or Clearer, with a self-contained report you can keep

**Input:** The idea, in any domain — a feature, a business model, a research hypothesis, a life decision

**Output:** A `forged-idea.md` distillate when an idea hardens (optional), plus a `forge-report.html` keepsake every run

### bmad-party-mode

**Orchestrate multi-agent group discussions.** — Loads all installed BMad agents and facilitates a natural conversation where each agent contributes from their unique expertise and personality.

**Use it when:**

- You need multiple expert perspectives on a decision
- You want agents to challenge each other's assumptions
- You're exploring a complex topic that spans multiple domains

**How it works:**

1. Loads the agent manifest with all installed agent personalities
2. Analyzes your topic to select 2–3 most relevant agents
3. Agents take turns contributing, with natural cross-talk and disagreements
4. Rotates agent participation to ensure diverse perspectives over time
5. Exit with `goodbye`, `end party`, or `quit`

**Input:** Discussion topic or question, along with specification of personas you would like to participate (optional)

**Output:** Real-time multi-agent conversation with maintained agent personalities
