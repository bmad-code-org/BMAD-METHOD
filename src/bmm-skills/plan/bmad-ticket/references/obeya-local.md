# The ticket tree (local obeya)

Tickets are markdown files in a tree at `{obeya-root}` (resolved at activation — see SKILL.md "Where tickets go"). This file defines the tree's grammar and how to work it with the bundled scripts.

Script form, throughout: `uv run {skill-root}/scripts/ticket_tree.py <command> --root {obeya-root}`.

The scan reads a node's `ticket.md` and `tickets/**` only; dot-folders (`.drafts/`, `.archive/`) and sibling document folders are invisible to it.

## The tree

```
{obeya-root}/                      # the initiative folder (or the tickets bin's parent)
├── ticket.md                      # the initiative node (type: initiative) — carries the key
├── prd/ · spec/ · brief/          # other skills' output folders — never scanned as tickets
└── tickets/
    ├── alert-rules/               # epic = folder
    │   ├── ticket.md              # the epic node (id ALRT-3)
    │   └── tickets/
    │       └── ALRT-12-rule-crud.md   # leaf (story|bug|task|spike)
    └── ALRT-31-snooze-button.md   # bin leaf — a leaf needs no epic
```

## Rules that never bend

- **A node is a folder.** Its own ticket is `ticket.md`; children live in `<node>/tickets/`. Same shape at every altitude (initiative, epic, sub-epic) — depth is never a special case. A tree of loose leaves with no epics is a legitimate shape. Force depth only where the work earns it.
- **Parent = containing folder.** No parent field, and a node never carries tracking for its children — no statuses, counts, or rollups. (An epic body's inception Stories list is slicing intent, not tracking: a materialized ticket file supersedes its entry, and scans read files only.)
- **One stored fact.** A leaf stores exactly one state field, `status`. Blocked, frontier, next, rollups are derived by scan, never written down. No status ledger file, ever.
- **The folder is the listing.** No `index.md`, nothing to keep current. `index --out <file>` renders a navigation map on demand — optional; the tree never depends on it.
- **IDs are `KEY-n`.** The key is the initiative node's id prefix — one stored fact, never a second `key:` field to drift. Gaps in `n` are meaningless. Leaf filename: `KEY-n-slug.md`.
- **The initiative node is optional.** Without one, tickets sit in `{obeya-root}/tickets/` as a bin and the key derives from ids already issued. Everything else works unchanged. The envelope is created by the Create route on request (from `{workflow.initiative_template}`) or by an initiative-scoped skill.

## Lifecycles

- Leaves: `backlog → in-progress → review → done` (or `dropped`, kept on the record). `review` = complete on a branch; `done` = merged. A dependent is workable only when its dependencies are `done`.
- Nodes: `backlog → ready → in-progress → done` (or `dropped`). `ready` = inception finished, work can start. It records a decision and gates nothing — an unready epic with workable stories blocks nobody.
- **Every node move is somebody's decision, never calculated.** An epic is `done` because a person looked at the outcome and agreed — so `done` can never flip when a child lands later, and archiving stays safe. Progress against children (3 of 5 done) is derived by `board`, stored nowhere: information about a node, not its state.
- This skill writes `backlog` at creation, both altitudes. The build lane and the user own the rest.

## Activation check — bootstrap and key settlement

- If `{obeya-root}/tickets/` does not exist and the run will write, create it. That is the whole bootstrap — no index to write. A read-only question against a missing tree just reports that.
- Settle the key (writing runs only): if the initiative node (`{obeya-root}/ticket.md`) exists, its id prefix *is* the key — ask nothing. On an existing tree without one, the key is the prefix of the ids already issued. Otherwise precedence: the request → `{workflow.project_keys}` → one bundled question. Autonomous never asks: derive 3–5 uppercase letters from the initiative name — or, when none exists, from the request's subject or the obeya folder's name — and flag the derived key in the completion report.
- If the tree already exists, run `list` once to rebuild the landscape before routing.

## Publishing drafts

- Pre-gate drafts live in the drafts folder (see SKILL.md's spine; default `<destination node>/.drafts/`) — never in system temp.
- Ids are issued at publish time: `next-id` before every id — never invent or reuse ids by hand.
- Gate approval = move the approved files into the destination `tickets/` and delete their drafts — remove the drafts folder only when it holds nothing else. Nothing reaches `tickets/` before the gate passes.
- Publishing a node (an epic): create `<destination tickets/>/<slug>/` and place its draft as that folder's `ticket.md`.
- Destination: the `tickets/` folder of the epic the user names or a lookup resolves; otherwise the bin (`{obeya-root}/tickets/`) — the default spot for epic-less tickets.

## Updating a ticket — the gate

Frontmatter on an existing ticket is never hand-edited — every change goes through:

```
uv run {skill-root}/scripts/update_ticket.py --root {obeya-root} --id KEY-n \
  --set status=in-progress [--set risk=4 ...] \
  --transitions "<{workflow.lifecycle_transitions}, comma-joined>" \
  --node-transitions "<{workflow.node_lifecycle_transitions}, comma-joined>"
```

- Pass the resolved values — overrides reach the gate only through those flags (omitted, the script uses bundled defaults).
- The gate picks the graph from the ticket's type: leaves walk `--transitions`, nodes walk `--node-transitions`; each altitude's vocabulary is refused at the other (`review` on an epic, `ready` on a story).
- It refuses dependency edges that would close a cycle.
- An off-graph move is refused with the legal moves named — relay that; on the user's explicit decision re-run with `--force` (known states only; gibberish is always refused).
- Never work around the gate by hand-editing. The body is never touched.
- **Archive** is an update consequence: when `done` lands on an epic the gate returns the hint — offer it, never run it automatically. `archive --epic KEY-n` (a `ticket_tree.py` command) moves the epic's stories to the dated `.archive/` record; the envelope stays as the durable layer. `--purge` removes them instead, when the record of truth lives elsewhere.

## Tree queries

- `list` — id / title / status / path inventory; also the lookup table for resolving a named ticket (id / slug / title).
- `validate` — after every write to the tree (publish, update, archive): schema, placeholders, dep resolution, cycles. Fix what it names before presenting.
- `frontier` — "what is workable now": every ticket not started whose dependencies are all done.
- `board` — rollups: each node's stored state plus its derived child counts.
- `coverage --require "<ids>"` — requirement-coverage check; `--proposed "<ids the proposed set covers>"` runs it pre-gate over the proposal, before anything is in the tree.
- `graph --mermaid` — dependency graph, parallel lanes, critical path.
- `index --out <file>` — navigation map on disk, when someone wants one (optional; nothing depends on it).
- `render --out <file>` — the single epics-and-stories markdown view, when someone wants one file to read or share (generated; the tree stays the source of truth).

## Handoff paths

- A leaf's path: `{obeya-root}/tickets/<epic>/tickets/KEY-n-slug.md`, or the bin leaf `{obeya-root}/tickets/KEY-n-slug.md`.
- The build lane reads the ticket file as its whole work definition — nothing is exported, nothing is copied.
- `frontier` is the standing answer to "what should I work on next."
