# Validating tickets

Run `{workflow.checks}` through agents that were not in this conversation; each gets only its scope's arrays. When `checks.dependencies` resolves empty, stop and tell the user: an override file sets `checks` as one string, which replaces every shipped check; it must be rewritten as `checks.<scope>` arrays. `tickets.py` reads only the prerequisites that were written; one that is missing is for these agents to find.

- **A proposed set of epics, a proposed epic breakdown, or a re-slice:** on the draft, before the user is asked to approve it. This always runs; no path, mode, or setting skips it. First walk the draft through each of `checks.dependencies` yourself and fix what that finds, then give the agent the corrected draft as text. Present the draft with what the check changed and what it confirmed. Run it again when the user's changes add, remove, merge, or reorder items. At initiative slicing, check the tree's scope ownership without requiring stories or full detail in future epics.
- **A refined ticket:** before execution.
- **A container:** before closure, its implemented coverage and Done when.

How:

- One subagent per epic: its container, the draft breakdown or `tickets.toml`, every child ticket including completed work, requirement source and companions, and `checks.ticket`, `checks.set`, `checks.dependencies`. One subagent for the tree: the initiative, the draft or written epic envelopes, source, and `checks.tree`, `checks.dependencies`. A single ticket: one subagent with its source and `checks.ticket`. Closure: `checks.closure`.
- Give each agent the other `{workflow}` keys its checks rest on and say which tickets are refined; once `tickets.toml` exists, give the full `tickets.py status` command for the folder.
- Merge findings into fix (mechanical), suggest (a guideline, with its reason), or ask (needs the user). Resolve coverage gaps, missing prerequisites, and contradictions before proceeding; the user decides suggestions and scope changes.
- A declined suggestion recorded as a `Decision:` line is not raised again unless new evidence changes its basis.

The user may request any scope independently.
