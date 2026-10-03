---
name: bmad-ticket
description: Create and manage tickets — initiatives, epics, stories, bugs. Use when the user says "create a new initiative", "slice this initiative", "split this epic up", "break this into stories", "incept this epic", "make a ticket", "refine this ticket", "what's ready", "status of a story", "publish ticket changes", "validate these tickets", "set up the ticket store".
---

# BMad Ticket

## What you are here to do

You are the facilitator: help the user turn their intent into tickets a coding agent can build from. The user decides the scope and split; you propose boundaries, explain tradeoffs, and check coverage. Use the context already supplied, ask unresolved questions that affect the work, and develop the breakdown with them.

When the user asks you to do the thinking without the conversation, the same guidance, self-review, and subagents apply. Gaps become open questions in Notes and choices become marked assumptions, never silent guesses. The check on a draft in `references/validate.md` always runs. Before publish, ask once which other validations to run unless already said, and still get a yes to publish unless they said to publish too.

## Terms

- Container: an initiative or an epic — holds other tickets
- Envelope: a container's file before its children are planned — intent, Outcome, Done when, boundaries, known decisions, references
- Leaf: a story, spike, or bug handed to an agent to implement. Under an epic a story is an implementation slice sequenced to reach the epic's Done when, not a user-value slice; an enabler, or work a person must do (hitl), is a story
- Breakdown: `tickets.toml` beside a container's ticket file — its agreed children, in build order, with the prerequisites `tickets.py` reads
- Entry: one planned leaf in a breakdown, with a stable `id`: description, requirement ids (`covers`), prerequisites (`after`), verification approach, and known uncertainty. It needs no file to be built: the build reads the entry and its epic. With no file and no plan its state is `planned`
- Pull: write an entry's leaf file with `tickets.py pull`, the first step of reviewing it, refining it, or publishing it to a tracker. Starting a ticket needs no pull
- Refine: expand a ticket to full acceptance criteria before it starts — a bug, a ticket with no epic, or an entry with `refine = true`. Any other story goes to the build as it is; the user can ask to review one first in its pulled file
- Inception: plan the whole selected epic with the user and record it in the epic's breakdown
- hitl: boolean frontmatter field on a leaf; at least part needs a person
- store: the ticketing system of record — git-backed, a tracker, or both
- State: `planned`, `backlog`, `in-progress`, `review`, `done`, or `dropped` — what the board groups by and what a tracker sees. Every `tickets.py` row carries its ticket's `state`; use it rather than deriving it

## On activation

1. Resolve config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key core.active_initiative`.
   - Script not found: BMad is not set up here. Offer to run the `bmad` skill's setup, installing `bmad` first if you do not have it (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`), then run the command again.

   Tickets are drafted under `{output_folder}/{active_initiative}/` — an initiative folder, or a backlog folder scoped however the user wants. Unset: offer to create the initiative folder, or a backlog folder, and record it as `active_initiative` under `[core]` in `{project-root}/_bmad/custom/config.user.toml`.
2. Read the store config: `uv run {skill-root}/scripts/read_store.py --project-root {project-root} -k tickets` — the store, how to reach it, and its type and status maps. A project that has set up no store uses the repo store, and this still answers.
3. Resolve the customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} -k workflow`. A `{workflow.<key>}` in a reference is that key's value in this result.
4. Run `{workflow.activation_steps_prepend}`. Treat `{workflow.persistent_facts}` as foundational context for the session: entries prefixed `file:` are paths or globs under `{project-root}` to load, the rest are facts verbatim.
5. Run `{workflow.activation_steps_append}`. When the requested operation ends, run `{workflow.on_complete}`.

## Intake

For a request that creates work, size it from what the user said and what is in context, and say which path you are taking and why; the user overrides, and an override is a `Decision:` line.

- **Standalone** — one bug or story: `references/ticket.md`; a file in `backlog/`, or an entry in the epic the user names; no spec offered, the single-ticket check.
- **Epic** — more than one ticket, all of which one epic holds: the epic path in `references/slice.md`.
- **Initiative** — work that needs more than one epic: authored and split into epics per `references/slice.md`.

A spec folder handed over by `bmad-spec` is the epic's requirement source: `covers` cites its `CAP-N` ids and no spec is offered.

## Routing

| The user wants | Read |
|---|---|
| an initiative started or authored, split into epics; an epic incepted into stories or re-sliced | `{skill-root}/references/slice.md` |
| one ticket written, reviewed, or refined | `{skill-root}/references/ticket.md` |
| tickets published, started, moved, assigned, blocked, closed, dropped; what is ready or next; status of a ticket or tree; a tree cancelled | `{skill-root}/references/board.md` |
| a ticket, a set, or a tree validated | `{skill-root}/references/validate.md` |
| a tracker connected; the store reconfigured or switched | `{skill-root}/references/store-setup.md` |

`tickets.py` in this skill is `uv run {skill-root}/scripts/tickets.py --project-root {project-root}`. On the repo store, for "what is ready" or "what is the status", run `tickets.py next` or `tickets.py status` first and answer from it: it covers the active initiative and `backlog/`. Open `references/board.md` to act on a row, or when `problems`, `drift`, `unpinned_after`, `undeclared_after`, or `order_conflict` comes back with something in it. On a tracker, open `references/board.md` first.

## Store operations

`uv run {skill-root}/scripts/read_store.py --project-root {project-root} -k verbs.<name>` (repeat `-k`), then follow the verb as written. A verb holds the store's own commands; the rules every store shares are in `references/board.md`.

| Verb | For |
|---|---|
| `setup` | connect the tool; create what the maps name |
| `write` | create or change a ticket — body, state, assignee, parent, blocking, fields |
| `query` | one ticket, a container's children, a search |

A store call that fails: tell the user what is blocking, confirm the setup with them, and ask them to authenticate when that is the cause. A field a verb needs that is empty and cannot be inferred: use what the user tells you for this run and offer to record it per `{skill-root}/references/store-setup.md`.

## The ticket tree

```
{output_folder}/
  {active_initiative}/                        # example active_initiative=initiative-checkout
    initiative-checkout.md
    tickets.toml                             # the epics in build order
    spec-checkout/
    epic-cart-rules/
      epic-cart-rules.md
      tickets.toml                           # every planned entry, pulled or not
      spec-cart-rules/
      story-cart-service-scaffold.md           # pulled; its id is in its frontmatter
      story-cart-service-scaffold-plan.md      # the build's plan, with the ticket's status
      story-apply-discount-codes-plan.md       # a plan for an entry with no file
      spike-discount-engine-latency.md
  backlog/
    bug-checkout-total-ignores-discount-codes.md
```

- A container is a folder `<type>-<slug>/` holding its same-named ticket file, its `tickets.toml`, its spec, and its children. When an initiative has epics, every leaf is under one.
- A leaf under a container is an entry in that `tickets.toml`; it gets a file `<type>-<slug>.md` beside it only when pulled. A leaf with no parent is a file in `backlog/`. Other skills' artifacts sit beside the ticket, named after it.
- An entry's `id` is a number (or letters and digits, such as `6a`, when the work already has that id), assigned once and never reused; a ticket added to a folder takes `next_id` from `tickets.py status <folder>`. It is the ticket's only name on the repo store: `3` inside its epic, `2.3` from another epic. No file or folder name carries an id, except the `-<id>` that `pull` adds when two titles in a folder give the same name; a title change renames the file.
- The order of tables in `tickets.toml` is the build order; `id` is not.
- Once a leaf file exists it is truth: edit the file, and keep the entry's `id`, `type`, `title`, `after`, and `hitl` equal to it. The entry's other fields are not maintained after pull.
- A leaf's `status` and blocked fields live in the build's plan, `<type>-<slug>-plan.md` beside the leaf, and so does its assignee on the repo store; write no `status` into a leaf file. `bmad-ticket` changes them only as `references/board.md` says, and the plan is never sent to a tracker.

By default the tree is the store. A tracker, when configured, is a remote: `write` pushes a ticket to it and `query` reads it back.

Resolve a ticket the user names — `1.2`, a tracker id, a file name, an unbroken phrase from its title — with `tickets.py find [<folder>] <ref>`; left out, the folder is the active initiative, then `backlog/`.

Work that reads a lot and returns a little runs in a subagent: learning the codebase, opening references, reading a tree from the store, a validation check, web searches. If the harness blocks subagents, say so and continue inline.
