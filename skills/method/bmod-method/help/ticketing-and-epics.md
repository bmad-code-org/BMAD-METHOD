# The ticket tree

Sofia (`bmad-agent-po`) plans and tracks work in one fractal tree. Top-level containers start at `program-*`, `initiative-*`, or standalone `epic-*` under `{output_folder}/`, with nested child containers and `tickets.toml` breakdowns inside `tickets/`.

Each container keeps its own `<type>-<slug>.md` SOT, `.memlog.md`, companion run folders, and retrospective at the top of its folder:

```text
{output_folder}/
  program-<slug>/                      # optional Altitude 0
    program-<slug>.md
    prd-program-<slug>/, arch-enterprise-<slug>/
    tickets/
      tickets.toml                     # [[initiative]] entries (INIT-01..)
      initiative-<slug>/               # Altitude 1 (or top-level)
        initiative-<slug>.md
        prd-<slug>/, ux-system-<slug>/, arch-spine-<slug>/
        tickets/
          tickets.toml                 # [[epic]] entries (E01..)
          epic-<slug>/                 # Altitude 2 (or top-level)
            epic-<slug>.md
            prd-epic-<slug>/, ux-epic-<slug>/, arch-epic-<slug>/
            epic-<slug>-retrospective.md
            tickets/
              tickets.toml             # 1-2 sentence [[entry]] items
              story-<slug>.md          # Refined Story (authored at inception or pickup)
              story-<slug>-plan.md     # local build plan
  backlog/                             # standalone leaves and plans, no tickets/ folder
```

A tree in the pre-`tickets/` layout (`tickets.toml` beside the container file) triggers a `tickets.py` error naming `bmad migrate`: run `bmad migrate method` to update it.

## Containers, stories, and plans

- **Thin epics (`refined: false`):** Slicing creates thin epic stubs; Sofia refines each epic (via fresh-chat `prd-epic`, `ux-epic`, `arch-epic`, or directly when settled) before slicing stories. Epics lacking a `refined` key count as refined.
- **Entries vs Refined Stories vs Build Plans:** `tickets.toml` entries stay 1–2 outcome sentences with `verify`, `covers`, and concrete UX/architecture refs. Sofia authors Refined Stories (`story-<slug>.md`, carrying `E0X-FR-xx` and functional + measurement Given/When/Then ACs) at epic inception by default, or leaves them for pickup (`refine = true`) when requested.
- **Plans stay local:** `story-<slug>-plan.md` holds code map, tasks, status (`built` when coding finishes; user or orchestrator marks `done`), baseline revision, and review triage logs. Code review appends dated findings without changing status; `bmad-retrospective` writes `epic-<slug>-retrospective.md` without closing the epic.

See `help/ticketing-setup.md` for store setup and `help/unattended-builds.md` for `bmad-build-auto`. External issue trackers remain lightly tested.
