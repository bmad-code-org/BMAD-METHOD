# The ticket tree

Sofia (`bmad-agent-po`) plans and tracks work in one tree. An initiative holds epics; each epic's `tickets.toml` holds ordered entries with ids, coverage, prerequisites, and verification. Build an entry directly. A review, a refinement, or tracker publishing adds a leaf file. Standalone stories and bugs can be direct build intent or backlog leaves.

Each container keeps its own file, `.memlog.md`, other skills' run folders and the retrospective at the top of its folder, and its breakdown in a `tickets/` folder inside it:

```
{output_folder}/initiative-<slug>/
  initiative-<slug>.md
  prd-<slug>/, ux-<slug>/, architecture-<slug>/
  tickets/
    tickets.toml                  # the epics in build order
    epic-<slug>/
      epic-<slug>.md
      ux-<slug>/                  # a run on the epic
      epic-<slug>-retrospective.md
      tickets/
        tickets.toml              # the entries in build order
        story-<slug>-plan.md
{output_folder}/backlog/          # standalone leaves and plans, no tickets/ folder
```

A tree in the earlier layout, with `tickets.toml` and epic folders directly in the initiative folder, makes `tickets.py` stop with an error naming `bmad migrate`: run `bmad migrate method` to move it.

Slicing writes each epic thin, with `refined: false`; refining it is its own stage before its stories are planned (`help/planning-skills.md`). Work bigger than one initiative gets a parent initiative whose breakdown lists child initiatives instead of epics.

Plans own status and baseline evidence and stay local on every store. Build stops at `built`; the user or orchestrator marks `done`. Code review appends dated findings to the plan without changing status. Retrospective writes `epic-<slug>-retrospective.md` directly in the epic, proposing action items without creating tickets or closing it. Keep completed plans as live state and historical evidence.

Use `help/ticketing-setup.md` for setup and `help/unattended-builds.md` for explicit Build Auto dispatch. Tracker stores remain lightly tested.
