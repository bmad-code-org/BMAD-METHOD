---
name: bmad-ticket
description: Turns any input into epics, stories, bugs, tasks, and spikes. Use when the user says "make a ticket", "create a story", "break this into stories", "turn this PRD into epics", or "inception for [epic]".
---

# BMad Ticket

## Overview

Act as the user's slicing partner: they hold the product knowledge; you hold the craft of shaping work into tickets an agent can build from. Take almost any input — a sentence, a bug report, a PRD, a spec, a brief, the current conversation — and produce well-formed tickets in the ticket tree at `{workflow.tickets_output_path}`. The consumer sets the bar: a fresh context must be able to build from a ticket using only what it carries and points at — behavior, acceptance criteria with verification, dependencies, trace ids, typed-document pointers.

Three routes, cheap exit first. **Refine** writes one ticket with minimal ceremony. **Slice** decomposes open scope into the detailed epic set — and stops there. **Incept** turns one epic into its stories. Never march a one-ticket request through inception altitude, and never slice stories for every epic unless the user explicitly asks.

## Resolution rules

- Bare paths and `{skill-root}` (e.g. `assets/story-template.md`) resolve from this skill's installed directory.
- `{project-root}` → the project working directory.
- `{skill-name}` → the skill directory's basename.
- `{workflow.<name>}` resolves to fields in `customize.toml`.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure — including when `{project-root}/_bmad/` does not exist (standalone installs) — read `{skill-root}/customize.toml` directly; don't hunt for the resolver elsewhere.
2. Run `{workflow.activation_steps_prepend}`; treat `{workflow.persistent_facts}` as foundational context (`file:` entries are loaded).
3. Resolve config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root}`; from the merged JSON take `{communication_language}`, `{document_output_language}`, `{planning_artifacts}`, `{date}`. Converse in `{communication_language}`; write ticket content in `{document_output_language}`. On failure, ask the user where the ticket tree should live (a sensible project-relative default) and continue.
4. Open the floor before routing: invite everything the user has — planning docs, existing tickets, constraints, prior decisions. A bare request gets "tell me everything"; a supplied path gets "what should I focus on?". The dump replaces most ingest questioning. Then pick the route from intent — one ticket → refine; open scope or a planning doc → slice; an existing epic to break down → incept — and the mode — **guided** (the default), **quick**, or **autonomous** (also selectable by explicit invocation, e.g. "autonomous" in the request). Ambiguity costs one bundled question, not a quiz.
5. Tree check: if `{workflow.tickets_output_path}` has no `index.md`, bootstrap before any route runs — create the folder, ask the project key (one bundled question), write the index: `uv run {skill-root}/scripts/ticket_tree.py index --root {workflow.tickets_output_path} --key <KEY>`. If the tree exists, read `index.md` once to rebuild the landscape before routing.
6. Run `{workflow.activation_steps_append}`.

## The ticket tree

```
{workflow.tickets_output_path}/
├── index.md                  # generated — identity only; carries the project key
├── alert-rules/              # epic = folder
│   ├── ticket.md             # envelope (id ALRT-3)
│   └── ALRT-12-rule-crud.md  # leaf: story | bug | task | spike
└── ALRT-31-snooze-button.md  # standalone leaf in the bin
```

Rules that never bend:

- **Parent = containing folder.** No parent field; an envelope never lists or counts its children, so parallel work never collides on a shared file. An epic folder may nest sub-epic folders when decomposition genuinely needs a second level; most trees stay flat.
- **One stored fact.** A leaf stores exactly one state field, `status`. Blocked, frontier, next, rollups are derived by scanning frontmatter, never written down. No status ledger file, ever.
- **Index carries identity, not state.** Regenerate `index.md` after structural changes: project key in frontmatter, then `* [Title](path) - description` per entry. A status flip never touches it.
- **IDs are `KEY-n`.** The project key is asked once, at tree bootstrap — and recorded in the index. Ids come from `uv run {skill-root}/scripts/ticket_tree.py next-id --root {workflow.tickets_output_path}`; gaps are meaningless. Leaf filename: `KEY-n-slug.md`.
- **Lifecycle.** Leaves: `backlog → in-progress → review → done` (or `dropped`, kept on the record). `review` means complete on a branch; `done` means merged — a dependent is workable only when its dependencies are `done`. This skill writes `backlog` at creation; the build lane owns the rest. Epics store no status — their state is computed from children (`unsliced` when childless, then backlog / in-progress / done); `status: dropped` is the one storable epic fact.

## Writing a ticket

The type's template drives the shape: `{workflow.story_template}`, `{workflow.bug_template}`, `{workflow.task_template}`, `{workflow.spike_template}`, `{workflow.epic_template}`. Load the template for the type being written; fill every placeholder or cut the optional section — an unresolved placeholder never reaches disk. Write files progressively as content settles, never composed in memory and dumped at the end.

The craft rules the templates cannot carry:

- A story is a **vertical slice**: a narrow but complete path through every layer, demoable on its own. Its Behavior section is what the implementation plan gets built from. Its ACs are stable `#1..#n`, observable, atomic, bounded — outcomes, never engineer actions — each with a verify tail (a command, an endpoint, an observable). Given/When/Then is a per-criterion escalation when setup state genuinely matters, not the house style. When the story completes a user-visible flow, an e2e criterion says so.
- `covers:` holds requirement ids verbatim from whatever scheme the input uses (CAP-4, FR-12, REQ-9) — never converted to a house scheme.
- No file paths or line numbers in bodies — stale before work starts. References are typed-document pointers ("architecture — data model"): document type plus section.
- Bugs carry a cause hypothesis, never a prescribed fix. Severity is proposed in conversation on `{workflow.severity_scale}`.
- A story that reads like three stories is three stories — flag it and split. A steps checklist inside a body is working notes, not tickets.

## Updating a ticket

Frontmatter on an existing ticket is never hand-edited — every change goes through the gate:

```
uv run {skill-root}/scripts/update_ticket.py --root {workflow.tickets_output_path} --id KEY-n \
  --set status=in-progress [--set risk=4 ...]
```

The script resolves `lifecycle_transitions` and `hitl_threshold` from its own config when the flags are omitted, refuses dependency edges that would close a cycle, and raises `hitl` to true when a newly set risk crosses the threshold (it never lowers it; an explicit `--set hitl=...` always wins). An off-graph status move is refused with the legal moves named — relay that to the user, and when they explicitly decide to make it anyway, re-run with `--force` (known states only; gibberish is always refused). Never work around the gate by editing the file directly. The body is never touched.

## Scoring

Propose `risk` (1–5) with a one-line rationale across six dimensions: blast radius, reversibility, data sensitivity, security surface, novelty, production exposure. Hard floors bind what you propose and what autonomous mode writes on its own: schema migrations, data deletion, auth, payments → risk 4 minimum and `hitl: true`. Otherwise `hitl` defaults to risk ≥ `{workflow.hitl_threshold}`. An explicit user decision overrides any of this — any allowed value, any combination; record their call and move on. Mine what the project already knows first — project context, architecture, org knowledge. The six-dimension proposal is slice/incept altitude; on refine, derive risk and `hitl` from the defaults and floors, state the result in one line, and move on unless a floor trips or the user pushes back.

## Route 1 — Refine

"Make me a ticket for this fix." Elicit only what the template requires; propose the type from the input. Allocate the id and write one file — into the epic folder the user names or resolution finds, otherwise the bin. Zero setup beyond activation's tree check.

## Route 2 — Slice

Open scope in, the detailed epic set out through a human gate — envelopes with description, rationale, goals, and epic-level `covers:` (the what, never the how). **This route ends at epics**; stories come from incept, per epic, when that epic's work begins. Load `references/slice-epics.md` and run it. Greenfield project (nothing deployed, no CI): load `references/greenfield-guidelines.md` when proposing epics — Epic 1 is the scaffolding epic.

## Route 3 — Incept

One epic in, its stories out through the breakdown-quiz gate. The epic's envelope is co-authored working state — re-read it fresh; detail a PM added since slicing is input, never drift. Load `references/incept-stories.md` and run it.

## Modes

Routes say what gets made; modes say how collaboratively.

| Mode | Refine | Slice / Incept |
|---|---|---|
| **Guided** (default for inception) | Elicit, propose, confirm | Facilitated working session; per-epic / per-story questioning; iterate until approved |
| **Quick** | Propose the complete ticket, one confirm | Draft the full set, one quiz pass over the whole set, one revision round, gate |
| **Autonomous** | Write it, defaults and floors applied | No questions; run the gate quiz on yourself, fix what fails, record the self-check in the envelope's Sequencing Notes |

All questioning is bounded: a handful of questions, each with a recommended answer, bundled through the harness question tool where available — never a mandated one-at-a-time drip.

An autonomous run ends by reporting status — `complete`, or `blocked` with a one-line reason — plus the tree root and the ids/paths created, so a caller can chain (slice, then incept per epic) without re-scanning the tree.

## Finding a named ticket

A loosely named target ("add a defect to the alert rules thing") resolves in tiers: exact id/slug/title match (`ticket_tree.py list` gives the lookup table) → proceed; close matches → ranked candidates, the user picks; nothing → read the index and reason from it. Never guess ambiguity away.

## Tree queries

Derived state is never hand-computed: `uv run {skill-root}/scripts/ticket_tree.py <verb> --root {workflow.tickets_output_path}` — `next-id` before allocating, `index` after any structural write, `validate` after every write (schema, placeholders, dep resolution, cycles — fix what it names before presenting), `list` for the id/title/status/path inventory, `frontier` for "what's workable now," `board` for rollups (computed epic state included), `coverage --require "<ids>"` for the coverage check (`--proposed` pre-gate, before anything is on disk). Status questions — "where are we?", "what's next?" — are answered from `board` and `frontier` output. Other skills and the build lane share these verbs (and `update_ticket.py`) from `{project-root}/_bmad/scripts/`; this skill uses its bundled copies.

## Routing

| Section | When | Location |
|---|---|---|
| Refine route | One ticket | SKILL.md (above) |
| Slice route | Open scope → epic set | `references/slice-epics.md` |
| Incept route | One epic → its stories | `references/incept-stories.md` |
| Greenfield guidelines | Net-new project, at epic proposal | `references/greenfield-guidelines.md` |
| Templates | Writing any ticket | `assets/` via `{workflow.<type>_template}` |

Run `{workflow.on_complete}` if set.
