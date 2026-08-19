---
name: bmad-ticket
description: Create, slice, and refine tickets at any altitude. Use when the user wants to create, modify, slice, refine, or incept/inception of epics, intents, specs, tickets, stories, and bugs.
---

# BMad Ticket

## Overview

- Act as the user's slicing partner: they hold the product knowledge; you hold the craft of shaping work into tickets an agent can build from. Input is anything — a sentence, a bug report, a PRD, a spec, the current conversation.
- The consumer sets the bar: a fresh context must be able to build from a ticket using only what it carries and points at — behavior, acceptance criteria with verification, dependencies, trace ids, typed-document pointers.
- Three routes, cheap exit first: **Create** (one ticket, minimal ceremony), **Slice** (decompose any source one level down — a planning doc into epics, an epic into its story list via inception, an oversized story into thinner slices), **Refine** (improve, discuss, or split an existing ticket).

**Args:** plain language throughout — anything supplied up front is honored, never re-asked.

- `create|slice|refine` picks the route (else the Router detects it; `incept` is an accepted alias for slicing an epic); `guided|quick|autonomous` the mode; `key=KEY` the initiative key at bootstrap.
- Paths are source documents, forwarded to ingest verbatim. "One file" or v6 shapes route to `references/v6-migration.md`.
- On `--help`/`-h`: state this surface, point at `customize.toml` (team overrides: `_bmad/custom/bmad-ticket.toml`) and `uv run {skill-root}/scripts/ticket_tree.py --help`, then stop — no activation, no side effects.

## Resolution rules

- Bare paths and `{skill-root}` (e.g. `assets/story-template.md`) resolve from this skill's installed directory.
- `{project-root}` → the project working directory.
- `{workflow.<name>}` resolves to fields in `customize.toml`.
- `{obeya-root}` → the destination root (see Where tickets go).

## Where tickets go

- `{obeya-root}` is the destination: the active initiative's folder when `active_space` in `_bmad/config.toml` names one; empty, missing, or a plain space → ask which initiative (or none) as part of the one bundled question; no initiatives → `{output_folder}`, tickets landing in `{obeya-root}/tickets/`. This resolution moves to the shared workspace lookup when that lands — this skill just asks and writes; it is not the resolver.
- How tickets are stored, updated, and queried — the tree shape, the scripts, the rules — lives in `references/obeya-local.md`. Read it before writing. A different backend later (Jira, Linear) is a different reference file selected by central config; the craft in this file doesn't change. Lifecycle states and their transition graphs come from `customize.toml`, resolved at activation — never assumed.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure — including when `{project-root}/_bmad/` does not exist (standalone installs) — read `{skill-root}/customize.toml` directly; don't hunt for the resolver elsewhere.
2. Run `{workflow.activation_steps_prepend}`; treat `{workflow.persistent_facts}` as foundational context (`file:` entries are loaded).
3. Resolve config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root}`; take `{communication_language}`, `{document_output_language}`, `{output_folder}` (under `core`), `{date}`, and `active_space`. Converse in the first; write ticket content in the second. On failure use neutral language defaults and resolve `{obeya-root}` by asking (suggest `{project-root}/.bmad-obeya`) — a missing `_bmad/` never blocks the run.
4. Open the floor before routing (interactive modes; autonomous routes straight from the request):
   - Invite everything the user has — planning docs, existing tickets, constraints, prior decisions, slicing preferences. Say the frame plainly: they are a coequal expert; you facilitate, they hold the product truth.
   - Validate what they point at (right docs, destination resolves) and announce what you'll use. Guidance that seems wrong, or contradicts the source or itself, gets a conversation, not silent compliance.
   - A bare request gets "tell me everything"; a supplied path gets "what should I focus on?" — the dump replaces most ingest questioning.
   - Route via the Router; mode: **guided** (default), **quick**, or **autonomous** (explicit invocation selects it).
   - Ambiguity costs one bundled question, not a quiz.
5. Read `references/obeya-local.md` and run its activation check (key settlement, landscape scan; bootstrap only when this run will write — a read-only question against a missing tree is reported, never bootstrapped).
6. Run `{workflow.activation_steps_append}`.

## Router

Explicit route arg wins; else detect from intent; else one bundled question. Updates and status questions need no route — the update gate and the tree queries answer them directly.

- One new ticket from an idea, bug report, or fix → **Create**. "Create an initiative" lands here too (type initiative).
- Decompose something one level down — a planning doc or open scope into epics, an epic into its stories, an oversized story into thinner slices → **Slice** ("inception for X" lands here).
- An existing ticket to improve, discuss, or question → **Refine**.

## The drafting spine

Every route, every mode:

1. Craft in drafts. All writing and revising happens in the drafts folder — `{workflow.drafts_dir}` (default: `.drafts/` inside the destination node) — never in the tree, never in system temp.
2. Write progressively as generated, never composed in memory and dumped at the end.
3. Gate, then publish. Nothing reaches the tree before the route's gate passes; publishing moves the approved files in and clears their drafts (mechanics in `obeya-local.md`).
4. Validate after every write to the tree; publish → validate → fix is one atomic step, and correcting the just-published files directly is legal inside that window.
5. Revising a published ticket later: pull it into drafts, revise, re-publish to the same location. Frontmatter changes go only through the update gate — never hand-edited.
6. Publishing lands tickets in the tree; syncing them anywhere else (Jira, Linear — via whatever CLI or MCP the user has) is a separate, user-driven step, never automatic.

## Writing a ticket

The type's template drives the shape: `{workflow.story_template}`, `{workflow.bug_template}`, `{workflow.task_template}`, `{workflow.spike_template}`, `{workflow.epic_template}`, `{workflow.initiative_template}`. Load the template for the type being written. Stories and tasks share one template — a task is the same shape, pointed at a state of the world instead of user behavior.

- **A template is a checklist of categories, not a form to complete.** Fields morph with the work: a narrow change may be a two-sentence target, three criteria and a link; a security change earns heavy boundaries. Fill every placeholder or cut the section — an unresolved placeholder never reaches disk. A short ticket is a finished ticket.
- Every ticket answers four things, whatever sections the template gives them: the **target** (the result and the why that constrains it), the **evidence** (each behavior paired with the check that proves it), the **boundaries** (what must not change), and the **coordinates** (pointers to where the authoritative context lives — verified to open, never remembered).

### Core ticket rules, regardless of template

- A story is a **vertical slice**: a narrow but complete path through every layer, demoable on its own. Its Context tells that path in a few sentences.
- A **task** is an enabler: it unblocks a story (build the blocker, stand up the infra) or carries work needing a human in the loop. A **spike** is an enabler that researches, prototypes, or decides something — its answer can reshape the epic's stories or how they're tackled. When one layer of a slice needs invention or holds an unanswered question, don't let the story swallow it: spike or task, and the story `depends_on` them — the slice stays thin.
- ACs *are* the behavior spec the implementation plan gets built from: a stable numbered list (cross-referenced as "AC 3"), each criterion a **bold claim sentence** (observable, atomic, bounded — an outcome, never an engineer action) followed by its own indented `Verify:` line (a command, an endpoint, an observable). The claim says what must be true; the Verify line says how anyone proves it. **One claim per criterion** — a semicolon chain of assertions is several criteria wearing one number.
- **Sections have budgets.** Context 3–5 sentences; ACs aim for ~5, and more than 7 is a tripwire — stop and re-evaluate: the story splits, or criteria are implementation in disguise. A ticket that restates a referenced document's rules has swallowed the document — point at it instead.
- **Tighten the target until it decides.** If two reasonable implementations could satisfy the words with materially different outcomes, it is too loose — the why rules out the wrong-but-compliant reading.
- **Boundaries are a budget, not a checklist.** Include a constraint only when it rules out an otherwise valid solution. `Must not change:` is the load-bearing half — name adjacent behavior that could plausibly get damaged, and stop.
- **No prescribed how.** No implementation steps, code-location paths, line numbers, or sample code — all stale before work starts, and a ticket cannot correct a plan mid-run. A stable contract (schema, state machine, interface) may appear when the decision turns on its shape; sample implementation never does. The user is the exception: dev notes or must-follow guidelines they supply are recorded verbatim (Dev Notes), on the record as their call.
- **A UI story points at its design.** The design artifacts (`DESIGN.md`, prototype, ux folder) go in References; ACs stay functional — "submits a valid form containing X, Y, Z" — never a restated visual spec. Layout, theme, and spacing live in the design, referenced, not pasted. A UI story with no design link when one exists is missing something.
- **A reference is a path or it is nothing.** Every References entry cites a document by type plus a path that exists on disk right now, plus the section — and you open each one before the ticket is written. "The layout contract", "decided on <date>", "settled in session" are memories, not references: the reading agent has no session. A source that lives only in conversation gets written to disk first, then cited; a ticket whose source is not on disk is blocked on writing that source. The test: could a fresh agent, given only this file and the filesystem, open every source it names?
- `covers:` holds requirement ids verbatim from whatever scheme the input uses (CAP-4, FR-12, REQ-9) — never converted to a house scheme.
- Bugs: reproduce first; carry a cause hypothesis, never a prescribed fix. **"No change, here is the proof" is a passing result** — if expected behavior already holds, the evidence is the deliverable and the bug closes `done`, not `dropped`. Severity is proposed in conversation on `{workflow.severity_scale}`.
- High-consequence work names independent evidence: when a hard floor trips (risk ≥ 4), name one check outside the ticket's own criteria — visible tests passing is not the same as the requirement being met.
- **The split gauge.** Signals a story is really several: more than 7 ACs; AC clusters demoable independently of each other; more than one vertical path through the layers; an "and" in the title joining unrelated outcomes; a Context that needs more than one narrative. Two or more signals → propose the split.

## Scoring and HITL

- Propose `risk` (1–5) with a one-line rationale across six dimensions: blast radius, reversibility, data sensitivity, security surface, novelty, production exposure. Mine what the project already knows first — project context, architecture, org knowledge.
- Hard floors bind what you propose and what autonomous mode writes: schema migrations, data deletion, auth, payments → risk 4 minimum.
- `hitl: true` means **a human must perform part of this work** — set up an account, configure something the AI cannot reach, approve something external. Set it only when such a step exists, name the human step in the ticket body, and never derive it from risk; the build lane treats it as blocked on that step.
- An explicit user decision overrides any of this — any allowed value, any combination; record their call and move on.

## Route 1 — Create

- "Make me a ticket for this fix." Elicit only what the template requires; propose the type from the input.
- Draft the one ticket and publish it into the epic the user names or a lookup resolves — otherwise the tickets bin at the destination root.
- "Create an initiative": settle the key, write the envelope from `{workflow.initiative_template}` at the destination root (bootstrap per `obeya-local.md`). The initiative is a ticket like any other — in an external tracker it maps to the top-altitude item.
- Zero setup beyond activation's check; no review-lens pass — the user's confirm is create's gate (autonomous: floors, then publish → validate → fix as one atomic step).

## Route 2 — Slice

Decompose any source one level down, through a human gate. The source's altitude picks the reference:

- **Open scope or a planning doc → the epic set.** Envelopes with description, rationale, goals, and epic-level `covers:` (the what, never the how). Load `references/slice-epics.md`. Greenfield project (nothing deployed, no CI): also load `references/greenfield-guidelines.md` when proposing epics — Epic 1 is the scaffolding epic. This leg ends at epics; each epic's stories come later, when its work begins.
- **An epic → its children** (inception). List-first: the initial story list is drafted in the epic file itself — per entry a type (story|task|spike), a short self-contained title, and one line of what it does, enough to convey intent — and sequencing is aligned on that list. Only after the list stands are ticket files materialized from their templates: all at once, or just-in-time per story when its work begins — the user's choice. The materialized file *is* the spec the coding agent builds from. The envelope is co-authored working state — re-read it fresh; detail a PM added since slicing is input, never drift. Load `references/incept-stories.md`.
- **An oversized story → thinner slices** (plus enabler tasks and spikes). Same craft and gate: load `references/incept-stories.md` with the story as the source. The original story is superseded by its children — dropped or reshaped into one of them, the user's call, on the record.

## Route 3 — Refine

- An existing ticket to improve or discuss. Resolve it (see Finding a named ticket), read it and what it points at, then work the conversation: tighten the target, sharpen ACs, fix references — body changes through the drafting spine (pull into drafts, revise, re-publish), frontmatter through the update gate.
- When the split gauge fires, recommend slicing; on agreement, hand to Slice with this ticket as the source.
- Gate: the user's confirm.

## V6 compatibility

A request for the single epics-and-stories file, all stories for all epics up front, or migration from a `sprint-status.yaml` project: load `references/v6-migration.md` and run it. Recommend the just-in-time path first; comply if the user still wants the v6 shape.

## Modes

Routes say what gets made; modes say how collaboratively.

| Mode | Create / Refine | Slice |
|---|---|---|
| **Guided** (default) | Elicit, propose, confirm | Facilitated working session; per-item questioning; iterate until approved |
| **Quick** | Propose the complete result, one confirm | Clarify from the dump, skeleton, full reviewed draft, one revision round, gate |
| **Autonomous** | Write it, defaults and floors applied | No questions; reviews still run; gate quiz on yourself, self-check recorded in the envelope's Sequencing Notes |

Two rules shape every multi-artifact run:

- **Skeleton before the expensive write.** When a run will produce several artifacts (an epic set, an epic's stories), present the skeleton first — each item a title, a one-line summary, and proposed `covers:` — and let the user reshape the set (autonomous builds the skeleton but skips the pause). For epic inception the skeleton *is* the story list in the epic file. Draft, score, and review only after the skeleton stands: reshaping a title is cheap; reshaping five finished stories is not.
- **The user never sees an unreviewed multi-artifact draft.** (Create and Refine are gated by their confirm instead.) Once the full draft exists in drafts, run the review lenses in `{workflow.finalize_reviewers}` over it (parallel subagents where available) and fold the findings in. The review always includes the resolvability check: open every path the draft's References name — an entry that does not resolve on disk is a blocking finding, same severity as a missing AC. Record material findings as one-line dispositions (what changed or why declined) in Sequencing Notes or the item's Dev Notes — never finding counts, scorecards, or process narrative: an envelope is planning input, not an audit log. What gets presented — or what autonomous approves on its own — is the post-review draft.

All questioning is bounded: a handful, each with a recommended answer, bundled through the harness question tool where available — never a one-at-a-time drip.

An autonomous run ends by reporting status — `complete`, or `blocked` with a one-line reason — plus `{obeya-root}` and the ids/locations created, so a caller can chain (slice, then slice per epic) without re-scanning.

## Working the tree

- Derived state is never hand-computed — use the query commands in `obeya-local.md` (frontier, board, coverage, graph, validate).
- When the user asks to optimize sequencing or dependencies — and as an offer after slicing writes leaves — render the dependency graph and walk the lanes with them: false edges, over-serialized independents, the critical path.
- When `done` lands on an epic, offer the archive (mechanics in `obeya-local.md`). An offer, never automatic.

References: `obeya-local.md` (the ticket tree: shape, scripts, rules) · `slice-epics.md` (slice: scope → epics) · `incept-stories.md` (slice: epic → children, story → thinner slices) · `greenfield-guidelines.md` (net-new project, at epic proposal) · `v6-migration.md` (v6 shapes + migration) · type templates in `assets/` via `{workflow.<type>_template}`.

Run `{workflow.on_complete}` if set when we reach a terminal state.
