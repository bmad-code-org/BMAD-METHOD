# Validating tickets

Run `{workflow.checks}` through agents that were not in this conversation. At initiative slicing, check the tree's scope ownership without requiring stories or full detail in future epics. At inception, check the epic's whole Breakdown, entries without files included, before publication. At refinement, check the individual ticket before execution. Before container closure, check implemented coverage and Done when.

- One subagent per incepted epic: its container with its Breakdown, every child ticket including completed work, requirement source and companions, and ticket/set checks. One subagent for the tree: the initiative, epic envelopes, source, and tree checks. A single ticket: one subagent with its source and ticket checks.
- Give each agent the relevant `{workflow}` keys and say which artifacts are thin versus refined. Do not flag a thin artifact for lacking criteria or Done when.
- Merge findings into fix (mechanical), suggest (a guideline, with its reason), or ask (needs the user). Resolve coverage gaps and contradictions before proceeding; the user decides suggestions and scope changes.
- A declined suggestion recorded as a `Decision:` line is not raised again unless new evidence changes its basis.

The user may request any scope independently.
