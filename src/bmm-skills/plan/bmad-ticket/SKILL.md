---
name: bmad-ticket
description: Turns any input into epics, stories, bugs, tasks, and spikes. Use when the user says "make a ticket", "create a story", "break this into stories", "turn this PRD into epics", or "inception for [epic]".
---

# BMad Ticket

## Overview

Act as the user's slicing partner: they hold the product knowledge; you hold the craft of shaping work into tickets an agent can build from. Take almost any input — a sentence, a bug report, a PRD, a spec, the current conversation — and produce well-formed tickets in the tree at `{workflow.tickets_output_path}`. The consumer sets the bar: a fresh context must be able to build from a ticket using only what it carries and points at — behavior, acceptance criteria with verification, dependencies, trace ids, typed-document pointers.

Three routes, cheap exit first. **Refine** writes one ticket with minimal ceremony. **Slice** decomposes open scope into the detailed epic set. **Incept** turns one epic into its stories. Never march a one-ticket request through inception altitude.

**Args:** plain language throughout — anything supplied up front is honored, never re-asked. `refine|slice|incept` picks the route (else detected from intent); `guided|quick|autonomous` the mode; `key=KEY` the project key at bootstrap; paths are source documents, forwarded to ingest verbatim; "one file" or v6 shapes route to `references/v6-migration.md`. On `--help`/`-h`: state this surface, point at `customize.toml` (team overrides: `_bmad/custom/bmad-ticket.toml`) and `uv run {skill-root}/scripts/ticket_tree.py --help`, then stop — no activation, no tree bootstrap, no side effects.

## Resolution rules

- Bare paths and `{skill-root}` (e.g. `assets/story-template.md`) resolve from this skill's installed directory.
- `{project-root}` → the project working directory.
- `{workflow.<name>}` resolves to fields in `customize.toml`.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure — including when `{project-root}/_bmad/` does not exist (standalone installs) — read `{skill-root}/customize.toml` directly; don't hunt for the resolver elsewhere.
2. Run `{workflow.activation_steps_prepend}`; treat `{workflow.persistent_facts}` as foundational context (`file:` entries are loaded).
3. Resolve config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root}`; from the merged JSON take `{communication_language}` and `{document_output_language}` (under `core`), `{planning_artifacts}` (under `modules.bmm`), `{date}`. Converse in `{communication_language}`; write ticket content in `{document_output_language}`. On failure, ask the user where the ticket tree should live (a sensible project-relative default) and continue.
4. Open the floor before routing (interactive modes; autonomous routes straight from the request): invite everything the user has — planning docs, existing tickets, constraints, prior decisions, slicing preferences. Say the frame plainly: they are a coequal expert — you facilitate, they hold the product truth, and the more they bring the better the set. Validate what they point at (right docs, tree resolves) and announce what you'll use. Guidance that seems wrong, or contradicts the source or itself, gets a conversation, not silent compliance. A bare request gets "tell me everything"; a supplied path gets "what should I focus on?" — the dump replaces most ingest questioning. Then pick the route from intent — one ticket → refine; open scope or a planning doc → slice; an existing epic to break down → incept; updates and status questions need no route (the gate and tree queries answer them) — and the mode — **guided** (the default), **quick**, or **autonomous** (explicit invocation selects it). Ambiguity costs one bundled question, not a quiz.
5. Tree check: if `{workflow.tickets_output_path}` has no `index.md`, bootstrap before any route runs — create the folder, settle the project key, write the index: `uv run {skill-root}/scripts/ticket_tree.py index --root {workflow.tickets_output_path} --key <KEY>`. Key precedence: the request, `{workflow.project_keys}`, then one bundled question — autonomous never asks: derive 3–5 uppercase letters from the project name and flag the derived key in the completion report. If the tree exists, read `index.md` once to rebuild the landscape before routing.
6. Run `{workflow.activation_steps_append}`.

## The ticket tree

```
{workflow.tickets_output_path}/
├── index.md                  # generated — identity only; carries the project key
├── alert-rules/              # epic = folder
│   ├── ticket.md             # envelope (id ALRT-3)
│   └── ALRT-12-rule-crud.md  # leaf (story|bug|task|spike)
└── ALRT-31-snooze-button.md  # bin leaf
```

Rules that never bend:

- **Parent = containing folder.** No parent field; an envelope never lists or counts its children, so parallel work never collides on a shared file. Sub-epic folders are legal when decomposition genuinely needs a second level; most trees stay flat.
- **One stored fact.** A leaf stores exactly one state field, `status`; blocked, frontier, next, rollups are derived by scan, never written down. No status ledger file, ever.
- **Index carries identity, not state.** Regenerate `index.md` after structural changes: project key in frontmatter, then `* [Title](path)` per entry (epics carry `- description`). A status flip never touches it.
- **IDs are `KEY-n`.** The project key is settled once, at tree bootstrap, and recorded in the index. Ids come from `uv run {skill-root}/scripts/ticket_tree.py next-id --root {workflow.tickets_output_path}`; gaps are meaningless. Leaf filename: `KEY-n-slug.md`.
- **Lifecycle.** Leaves: `backlog → in-progress → review → done` (or `dropped`, kept on the record). `review` means complete on a branch; `done` means merged — a dependent is workable only when its dependencies are `done`. This skill writes `backlog` at creation; the build lane owns the rest. Epics compute their state from children — `not-started` (childless, or nothing past backlog) or `in-progress`; `done` and `dropped` are stored only intentionally (a retrospective or the user's call), **never calculated**, and only a stored `done` releases dependents.

## Writing a ticket

The type's template drives the shape: `{workflow.story_template}`, `{workflow.bug_template}`, `{workflow.task_template}`, `{workflow.spike_template}`, `{workflow.epic_template}`. Load the template for the type being written; fill every placeholder or cut the optional section — an unresolved placeholder never reaches disk. Write approved files progressively as generated, never composed in memory and dumped at the end; in gated routes nothing touches disk before the gate passes.

The craft rules the templates cannot carry:

- A story is a **vertical slice**: a narrow but complete path through every layer, demoable on its own. Its Behavior section is what the implementation plan gets built from. Its ACs are stable `#1..#n`, observable, atomic, bounded — outcomes, never engineer actions — each with a verify tail (a command, an endpoint, an observable). Given/When/Then is a per-criterion escalation when setup state genuinely matters, not the house style. When the story completes a user-visible flow, an e2e criterion says so.
- `covers:` holds requirement ids verbatim from whatever scheme the input uses (CAP-4, FR-12, REQ-9) — never converted to a house scheme.
- No file paths or line numbers in bodies — stale before work starts; references are typed-document pointers: document type plus section.
- Bugs carry a cause hypothesis, never a prescribed fix. Severity is proposed in conversation on `{workflow.severity_scale}`.
- A story that reads like three stories is three stories — flag it and split. A steps checklist inside a body is working notes, not tickets.

## Updating a ticket

Frontmatter on an existing ticket is never hand-edited — every change goes through the gate:

```
uv run {skill-root}/scripts/update_ticket.py --root {workflow.tickets_output_path} --id KEY-n \
  --set status=in-progress [--set risk=4 ...] \
  --transitions "<{workflow.lifecycle_transitions}, comma-joined>" --hitl-threshold {workflow.hitl_threshold}
```

Pass the resolved values — overrides reach the gate only through those flags (omitted, the script uses its bundled defaults). The gate refuses dependency edges that would close a cycle and raises `hitl` to true when a newly set risk crosses the threshold (never lowers it; an explicit `--set hitl=...` always wins). An off-graph move is refused with the legal moves named — relay that, and on the user's explicit decision re-run with `--force` (known states only; gibberish is always refused). Never work around the gate by hand-editing. The body is never touched.

## Scoring

Propose `risk` (1–5) with a one-line rationale across six dimensions: blast radius, reversibility, data sensitivity, security surface, novelty, production exposure. Hard floors bind what you propose and what autonomous mode writes on its own: schema migrations, data deletion, auth, payments → risk 4 minimum and `hitl: true`. Otherwise `hitl` defaults to risk ≥ `{workflow.hitl_threshold}`. An explicit user decision overrides any of this — any allowed value, any combination; record their call and move on. Mine what the project already knows first — project context, architecture, org knowledge. The six-dimension proposal is slice/incept altitude; refine derives from defaults and floors, states the result in one line, and moves on unless a floor trips or the user pushes back.

## Route 1 — Refine

"Make me a ticket for this fix." Elicit only what the template requires; propose the type from the input. Allocate the id and write one file — into the epic folder the user names or resolution finds, otherwise the bin. Zero setup beyond activation's tree check; no review-lens pass — the user's confirm (or autonomous's floors plus `validate`) is refine's gate.

## Route 2 — Slice

Open scope in, the detailed epic set out through a human gate — envelopes with description, rationale, goals, and epic-level `covers:` (the what, never the how). **This route ends at epics**; stories come from incept, per epic, when that epic's work begins. Load `references/slice-epics.md` and run it. Greenfield project (nothing deployed, no CI): load `references/greenfield-guidelines.md` when proposing epics — Epic 1 is the scaffolding epic.

## Route 3 — Incept

One epic in, its stories out through the breakdown-quiz gate. The epic's envelope is co-authored working state — re-read it fresh; detail a PM added since slicing is input, never drift. Load `references/incept-stories.md` and run it.

## V6 compatibility

A request for the single epics-and-stories file, all stories for all epics up front, or migration from a `sprint-status.yaml` project: load `references/v6-migration.md` and run it. Recommend the just-in-time path first; comply if the user still wants the v6 shape.

## Modes

Routes say what gets made; modes say how collaboratively.

| Mode | Refine | Slice / Incept |
|---|---|---|
| **Guided** (default) | Elicit, propose, confirm | Facilitated working session; per-epic / per-story questioning; iterate until approved |
| **Quick** | Propose the complete ticket, one confirm | Clarify from the dump, skeleton, full reviewed draft, one revision round, gate |
| **Autonomous** | Write it, defaults and floors applied | No questions; reviews still run; gate quiz on yourself, self-check recorded in the envelope's Sequencing Notes |

Two rules shape every multi-artifact run:

- **Skeleton before the expensive write.** When a run will produce several artifacts (an epic set, an epic's stories), present the skeleton first — each item as a title and a one-line summary (plus proposed `covers:`) — and let the user reshape the set (autonomous builds the skeleton but skips the pause). Full drafting, scoring, and review happen only after the skeleton stands; reshaping a title costs nothing, reshaping five finished stories costs everything.
- **The user never sees an unreviewed draft.** Once the full draft exists, run the review lenses in `{workflow.finalize_reviewers}` over it (parallel subagents where available), fold the findings in, and record material findings and their dispositions in Sequencing Notes or the item's Dev Notes. What gets presented — or what autonomous mode approves on its own — is the post-review draft.

All questioning is bounded: a handful, each with a recommended answer, bundled through the harness question tool where available — never a one-at-a-time drip.

An autonomous run ends by reporting status — `complete`, or `blocked` with a one-line reason — plus the tree root and the ids/paths created, so a caller can chain (slice, then incept per epic) without re-scanning the tree.

## Finding a named ticket

A loosely named target resolves in tiers: exact id/slug/title match (`ticket_tree.py list` is the lookup table) → proceed; close matches → ranked candidates, the user picks; nothing → read the index and reason from it. Never guess ambiguity away.

## Tree queries

Derived state is never hand-computed: `uv run {skill-root}/scripts/ticket_tree.py <verb> --root {workflow.tickets_output_path}` — `next-id` before allocating, `index` after any structural write, `validate` after every write (schema, placeholders, dep resolution, cycles — fix what it names before presenting), `list` for the id/title/status/path inventory, `frontier` for "what's workable now," `board` for rollups (computed epic state included), `coverage --require "<ids>"` for the coverage check (`--proposed` pre-gate, before anything is on disk), `graph --mermaid` for the dependency graph, parallel lanes, and critical path. When the user asks to optimize sequencing or dependencies — and as an offer after incept writes — render `graph --mermaid` and walk the lanes with them: false edges, over-serialized independents, the critical path. When `done` lands on an epic (the gate returns the hint), offer the archive: `archive --epic KEY-n` moves its stories to the dated `.archive/` record — the envelope stays as the durable layer — or `--purge` removes them when the record of truth lives elsewhere (e.g. synced to Jira). An offer, never automatic.
References: `slice-epics.md` (Route 2) · `incept-stories.md` (Route 3) · `greenfield-guidelines.md` (net-new project, at epic proposal) · `v6-migration.md` (v6 shapes + migration) · type templates in `assets/` via `{workflow.<type>_template}`.

Run `{workflow.on_complete}` if set when we reach a terminal state.
