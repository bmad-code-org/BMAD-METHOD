# Evidence Gathering

Phase 1 of the retrospective. Enumerate what the completed epic actually left behind, so every later analysis works from real artifacts instead of memory. Output is an inventory: what exists, what is missing, and the diff range the rest of the retro will read.

## Inventory checklist

Collect what the epic produced and note the source path or range of each:

- **Epic spec** — the epic file under `{planning_artifacts}`, including any declared acceptance criteria. If the spec declares how the epic will be judged, that governs Phase 4; if not, note that the verdict will be profiled from the diff.
- **Story files** — the story specs implemented under this epic (`{implementation_artifacts}`), each carrying its intent and context. These mark the seams between coding sessions.
- **Diff range and commits** — the full set of changes the epic introduced. Establish the range from the first and last story commits (or ask the user for it). The range must *include* the first story commit: `A..B` excludes `A`, so use the parent of the first commit as the left endpoint — `<first-commit>^..<last-commit>` — or the whole first story disappears from the diff, the commit attribution, and the verdict evidence. If the first story commit is the repo's root (no parent), drop the `^` and start the range at that commit (or use git's empty-tree object as the left side), and note it. Then run `uv run {skill-root}/scripts/git_evidence.py --repo {project-root} --range <range> --stories <story-ids>` to get, as JSON, the per-story commit attribution and the per-file change volume — added / deleted / net across the range — that Phase 2 reads. Record the range explicitly; Phase 2's aggregate views and the `bmad-review` pass both read it. When the range cannot be established, say so and narrow the scope rather than guessing.
- **Sprint status** — `{implementation_artifacts}/sprint-status.yaml`, for which stories are `done` and the current retro-key state.
- **Previous retrospective** — the prior epic's retro doc, if one exists, so Phase 4 can check whether last epic's action items landed.
- **Session logs** — conversation or session records for the epic's stories, when available. They are the only record of *why* a session took a strange turn — what was tried and abandoned. They are also the first evidence destroyed, so capture references now.

## Honest degradation

Evidence availability varies; never paper over a gap. Each later analysis declares what it needs and, when that input is absent, records a narrowed scope rather than guessing. A reader of the final retro must always be able to tell **"checked and clean"** from **"never checked."**

- Missing session logs → process-lesson mining is skipped, and the retro says so.
- No declared acceptance criteria → the verdict is profiled from the diff and stories, flagged as profiled rather than declared.
- Sub-agents unavailable → analyses that would delegate run inline over a narrowed scope, and the narrowing is recorded.

Carry the inventory forward into Phase 2 as the authoritative list of what is available to read.
