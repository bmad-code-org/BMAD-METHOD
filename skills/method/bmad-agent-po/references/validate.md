# Validating tickets

The checks are in `{{ rendered("references/validate-checks.md") }}`, one section per scope. Fresh-context subagents run them, given the file's path and their section names. They find missing prerequisites `tickets.py` cannot see.

{{ workflow.validate_before }}

- **Proposed child initiatives or epics, an epic breakdown, or a re-slice:** always, on the draft `tickets.toml` before approval. First run the Dependencies section yourself and fix the draft; give the agent its path. Show what the check changed and confirmed. Rerun when the user adds, removes, merges, or reorders items. At initiative slicing, check scope ownership; future epics need no stories or full detail.
- **A refined ticket:** before execution.
- **A container:** before closure, its implemented coverage and Done when.

How:

- Per epic: its container, its `tickets.toml`, every child ticket, done ones too, its Requirements, its `sources:` files, companions; sections Ticket, Set, Dependencies. The tree: the initiative, its `tickets.toml`, the epic files once written (on a parent, each child initiative's file), its `sources:` files; sections Tree, Dependencies. A single ticket: its epic file; section Ticket. Closure: section Closure.
- Name the `refined: true` tickets; point the agent at "Rules the template cannot carry" in `{{ rendered("references/ticket.md") }}`. Once `tickets.toml` exists, give the full `tickets.py status` command for the folder.
- Sort findings into fix (mechanical), suggest (with reason), or ask the user. Resolve gaps, missing prerequisites, and contradictions before proceeding; the user decides suggestions and scope changes.
- Do not re-raise suggestions declined in a `Decision:` line unless new evidence changes their basis.

{{ workflow.validate_after }}
