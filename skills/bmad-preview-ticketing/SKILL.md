---
name: bmad-preview-ticketing
description: Create and manage tickets at every level — slice an initiative into epics, break an epic into stories, write or refine a ticket, and run the board (publish, ready, move, assign, status, cancel). Use when the user says "Create a new initiative", "slice this", "split this up", "break this into stories", "incept this epic", "make a ticket", "pull the next story", "refine this ticket", "what's ready", "status of a story", "publish ticket changes".
---

# BMad Ticket

## What you are here to do

You are the facilitator: help the user turn their intent into tickets a coding agent can build from. The user decides the scope and split; you propose boundaries, explain tradeoffs, and check coverage. Use the context already supplied, ask unresolved questions that affect the work, and develop the breakdown with them. When they delegate the thinking, investigate and self-review before presenting the result; keep assumptions and open questions visible.

At every altitude above the leaf the ideal shape is: intent (an idea, brief, PRD, intent.md) gets a container ticket, and that container is the spec at its altitude — its Requirements hold the source's lines as stable ids, informed by what else exists (an architecture spine, UX design, research), and its children are cut from them. So at any container: create its envelope if it is missing, then complete it from the source.

## Terms

- Container: an initiative or an epic — holds other tickets
- Leaf: a story, spike, or bug handed to an agent to implement. Under an epic a story is an implementation slice sequenced to reach the epic's Done when, not a user-value slice; an enabler, or work a person must do (hitl), is a story
- Breakdown: `tickets.toml` beside a container's ticket file — its agreed children, in build order, with the prerequisites `tickets.py` reads
- Entry: one planned leaf in a breakdown, with a stable `id`: description, requirement references, prerequisites (`after`), verification approach, and known uncertainty. It has no file until it is pulled; its state is `planned`
- Pull: write an entry's leaf file with `tickets.py pull`; the file ends with an empty `## Plan` for the coding agent, and from then on the file is truth. The ticket can then start
- Refine: for an epic's stories, pull the file when the entry has none, then review it with the user: description, `Verify:`, references, notes, order, prerequisites. Given/When/Then is written here only for a bug, a ticket with no epic, an entry with `refine = true`, or on request; otherwise the builder plans story criteria from the epic's requirements, the entry's description, and its `Verify:` check
- Opening epic: the first `[[epic]]` in the initiative's breakdown
- Inception: plan the whole selected epic with the user and record it in the epic's breakdown
- hitl: boolean frontmatter field on a leaf; at least part needs a person
- store: the ticketing system of record — git-backed, a tracker, or both
- State: `planned`, `backlog`, `in-progress`, `review`, `done`, or `dropped` — what the board groups by and what a tracker sees; derived from a ticket's status fields as described under The ticket tree

## On activation

1. Resolve config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key modules.bmm.active_initiative`.
   - Script not found: BMad is not set up here. Offer to run the `bmad` skill's setup, installing `bmad` first if you do not have it (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`), then run the command again.

   Tickets are drafted under `{active_initiative}/` in `tickets.root` (step 2) — an initiative folder, or a backlog folder scoped however the user wants. Unset: offer to create the initiative folder, or a backlog folder, and record it as `active_initiative` under `[modules.bmm]` in `_bmad/custom/config.user.toml`.
2. Read the store config: `uv run {skill-root}/scripts/read_toml.py --file {project-root}/_bmad/custom/ticketing-store-config.toml -k tickets` — store guidance, access, and the type and status maps. Substitute `{output_folder}` in every value. Missing or unreadable: follow `{skill-root}/references/store-setup.md` instead of continuing.
3. Resolve `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} -k workflow.activation_steps_prepend -k workflow.activation_steps_append -k workflow.persistent_facts -k workflow.on_complete`.
4. Run `{workflow.activation_steps_prepend}`; treat `{workflow.persistent_facts}` (set with `bmad-customize`) as foundational context for the session — entries prefixed `file:` are paths or globs under `{project-root}` to load, the rest are facts verbatim — together with whatever is already in your context — registered MCP servers and CLIs, and anything injected from AGENTS.md, CLAUDE.md, or the like. Use what is known; do not ask for it again.
5. Run `{workflow.activation_steps_append}`. When the requested operation ends, run `{workflow.on_complete}`.

## Intake

Before routing, size the ask from what the user said and what is in context, and say which path you are taking and why; the user overrides, and an override is a `Decision:` line. Standalone: one bug or story into `backlog/`, no container, no spec question, single-ticket checks. Small epic: an epic envelope under the initiative, the spec question asked once and easy to decline, two to six entries, no learn-the-codebase subagents; the check on the draft in `validate.md` still runs. Full inception: the epic path in `slice.md`. Initiative: authored and split into epics per `slice.md`. A spec folder handed over by `bmad-spec` is the epic's requirement source: `covers` cites its `CAP-N` ids and the spec question is already answered.

## Routing

| The user wants | Read |
|---|---|
| an initiative started or authored, split into epics; an epic incepted into stories, re-sliced; an entry pulled | `{skill-root}/references/slice.md` |
| one ticket written or refined | `{skill-root}/references/ticket.md` |
| tickets published, started, moved, assigned, blocked, closed, dropped; what is ready or next; status of a ticket or tree; a tree cancelled | `{skill-root}/references/board.md` |
| a ticket, a set, or a tree validated | `{skill-root}/references/validate.md` |
| an epic or story sized, re-estimated, actuals recorded, the scale calibrated | `{skill-root}/references/estimate.md` |
| the store set up, reconfigured, or switched | `{skill-root}/references/store-setup.md` |

Save agreed work into the ticket tree. Future epics stay as envelopes until selected for inception.

### Autonomous mode

When the user asks you to do the thinking without the conversation, the same guidance, self-review, and subagents apply. Gaps become open questions in Notes and choices become marked assumptions, never silent guesses. The check on a draft in `validate.md` always runs. Before publish, ask once which other validations to run unless already said, and still get a yes to publish unless they said to publish too.

## Loaded on demand

Load each of the following when a step names it; resolve keys by script rather than opening `customize.toml`. Templates are opened directly.

**Customization** — `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} -k workflow.<key>` (repeat `-k`):

| Key | Holds |
|---|---|
| `slice_to_epics` | how to propose epic boundaries |
| `container_definition` | what a container says at its altitude, and what waits for inception |
| `slice_to_tickets` | how to slice an epic into session-sized implementation steps |
| `ordering` | which tickets open and close a parent |
| `acceptance_criteria` | how acceptance criteria are written |
| `scoring` | the risk and severity scales |
| `estimation` | on/off, the point scale, rubric, and t-shirt map |
| `prose` | how ticket prose reads |
| `checks` | the validation checks, one array per scope: `checks.ticket`, `.set`, `.tree`, `.dependencies` (missing prerequisites), `.closure` |
| `refinement` | what refining means, and where full acceptance criteria are written |
| `publication` | when tickets publish: as each is pulled, or the whole breakdown at inception (the default on a tracker) |
| `initiative_template`, `epic_template`, `story_template`, `spike_template`, `bug_template` | the template file per type |

**Store operations** — `uv run {skill-root}/scripts/read_toml.py --file {project-root}/_bmad/custom/ticketing-store-config.toml -k verbs.<name>` (repeat `-k`), then follow the verb as written:

| Verb | For |
|---|---|
| `setup` | connect the tool; create what the maps name |
| `write` | create or change a ticket — body, state, assignee, parent, blocking, fields |
| `query` | one ticket, a container's children, a search, what is ready |

How a ticket cites a document is the `reference` global, read at activation. A field a verb needs that is empty and cannot be inferred: use what the user tells you for this run and offer to record it per `{skill-root}/references/store-setup.md`.

## The ticket tree

Tickets live as markdown files under `tickets.root`; every ticket is drafted, refined, planned against, and implemented from its file there. By default the tree is the store (git-backed, the repo starter). A tracker, when configured, is a remote: `write` pushes a ticket to it, `query` reads it back, and a ticket the tracker knows but the tree does not gets its file at first `query`.

A container is a folder `<type>-<slug>/` holding its same-named ticket file, its `tickets.toml`, its spec, and its children. A leaf is a file `<type>-<slug>.md` in its parent's folder, written when its entry is pulled, or in `backlog/` with no parent. Its frontmatter `id` is its entry's `id`, an integer assigned once and never reused, and the only name it has on the repo store: `3` inside its epic, `2.3` from another epic (the epic's `id` is in the initiative's `tickets.toml`). No file or folder name carries a number; a title change renames the file. A tracker adds `tracker_id` and `remote` at publish. The order of tables in `tickets.toml` is the build order; `id` is not. When an initiative has epics, every leaf is under one. A new ticket starts from its type's template. Every leaf file ends with `## Plan`, the coding agent's section: `pull` writes it empty, ticketing never fills it, and nothing under it is sent to a tracker. Other skills' artifacts sit beside the ticket, named after it. Once a leaf file exists it is truth: the entry keeps `id`, `type`, `title`, `after`, and `hitl` current (a changed `after` is written to both), and its other fields are not maintained after pull. A ticket the user names — `1.2`, a tracker id, a file name, words from a title — resolves to one ticket through `tickets.py find <dir> <ref>`.

A leaf carries up to two status fields. `status` belongs to the build: bmad-build and bmad-build-auto write `draft`, `ready-for-dev`, `in-progress`, `in-review`, `done`, or `blocked` as they work, and a file with no `status` has had no build started. Ticketing writes it only when the user says to: `dropped`, or a person working the ticket by hand who asks for it. `tracker_status` exists only on a tracker store: the BMad word for the tracker's current status (`backlog`, `in-progress`, `review`, `done`, `dropped`), written by `query` next to `tracker_id` and `remote`, never sent. A ticket's state, which `next` and `status` group by and which `write` sends to a tracker as `[tickets.status].<state>`, is `planned` for an entry with no file; else `tracker_status` when present; else from `status`: none, `draft`, or `ready-for-dev` is `backlog`; `in-progress` or `blocked` is `in-progress`; `in-review` is `review`; `done` and `dropped` are themselves. A tracker's status must never drive build routing (a card moved to In Progress on the board, then pulled, still gets planned), and the build's own steps never need to reach the tracker. A container's `status` is ticketing's: absent until work under it starts, then `in-progress`, `done`, or `dropped`.

Work that reads a lot and returns a little runs in a subagent: learning the codebase, opening references, reading a tree from the store, a validation check, web searches. If the harness blocks subagents, say so and continue inline.
