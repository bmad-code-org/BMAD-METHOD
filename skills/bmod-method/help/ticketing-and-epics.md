# The ticket tree

`bmad-preview-ticketing` plans and tracks work in one tree. An initiative holds epics; each epic's `tickets.toml` holds ordered entries with ids, coverage, prerequisites, and verification. Build an entry directly. Refinement or tracker publishing may add a leaf file. Standalone stories and bugs can be direct build intent or backlog leaves.

Plans own status and baseline evidence and stay local on every store. Build stops at `built`; the user or orchestrator marks `done`. Code review appends dated findings to the plan without changing status. Retrospective writes `epic-<slug>-retrospective.md` directly in the epic, proposing action items without creating tickets or closing it. Keep completed plans as live state and historical evidence.

Use `help/ticketing-setup.md` for setup and `help/unattended-builds.md` for explicit Build Auto dispatch. Tracker stores remain lightly tested.
