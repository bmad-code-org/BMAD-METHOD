# Validating tickets

The checks are in `{skill-root}/references/validate-checks.md`, one section per scope: Ticket, Set, Tree, Dependencies, Closure. Agents that were not in this conversation run them; each is given that file's path and the names of its sections, and reads them there. `tickets.py` reads only the prerequisites that were written; one that is missing is for these agents to find.

- **A proposed set of epics, a proposed epic breakdown, or a re-slice:** on the draft, before the user is asked to approve it. This always runs; no path, mode, or setting skips it. First walk the draft through the Dependencies section yourself and fix what that finds, then give the agent the corrected draft as text. Present the draft with what the check changed and what it confirmed. Run it again when the user's changes add, remove, merge, or reorder items. At initiative slicing, check the tree's scope ownership without requiring stories or full detail in future epics.
- **A refined ticket:** before execution.
- **A container:** before closure, its implemented coverage and Done when.

How:

- One subagent per epic: its container, the draft breakdown or `tickets.toml`, every child ticket including completed work, requirement source and companions, and the sections Ticket, Set, and Dependencies. One subagent for the tree: the initiative, the draft or written epic envelopes, source, and the sections Tree and Dependencies. A single ticket: one subagent with its source and the section Ticket. Closure: the section Closure.
- A team's own checks are in `{workflow.checks}`, one array per scope with the same names; give each agent the entries for its sections as text.
- Where tickets carry full criteria (`refined: true`), say which they are and point the agent at "Rules the template cannot carry" in `{skill-root}/references/ticket.md` for the criteria and risk rules. Once `tickets.toml` exists, give the full `tickets.py status` command for the folder.
- Merge findings into fix (mechanical), suggest (a guideline, with its reason), or ask (needs the user). Resolve coverage gaps, missing prerequisites, and contradictions before proceeding; the user decides suggestions and scope changes.
- A declined suggestion recorded as a `Decision:` line is not raised again unless new evidence changes its basis.

The user may request any scope independently.
