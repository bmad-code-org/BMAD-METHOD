# Replanning

Leave the remaining tickets true and nothing already built rewritten. No proposal file.

{{ workflow.replan_before }}

1. **Name the change** briefly: what changed, its source and evidence. Read the ticket, its `.memlog.md`, breakdown, finished children, and any architecture or design it touches; ask only what the tree cannot tell you. Say whether what is required changed or only how it is delivered, and propose a way forward (adjust remaining entries, roll back built work, or cut scope) with the reason; the user decides. An in-progress ticket: ask whether its build stops; never edit its plan.
2. **What is required.** When the change alters what the ticket requires, run `spec.md` on it with the change as input: lines re-render with ids kept, naming entries whose `covers` cite a changed id. Otherwise say so and skip.
3. **Re-slice** each affected epic per Re-slicing in `slice.md`; an obsolete or new epic changes the initiative's breakdown per Initiative into epics there.
4. **Drop** what no longer belongs per Close, drop, move in `board.md`, and clear what waited on it.
5. **Record the reason** as a dated `Decision:` line in the Notes of each container touched, in step 1's words. If the architecture spine or design is invalidated, note it in the container's Notes and offer `bmad-architecture` or `bmad-ux`; never edit the companion.

Then report what changed, was dropped, and is ready.

{{ workflow.replan_after }}
