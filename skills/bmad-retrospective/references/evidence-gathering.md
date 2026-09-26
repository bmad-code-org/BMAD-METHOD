# Evidence Gathering

Phase 1 of the retrospective. Enumerate what the completed epic produced, so every later analysis works from real artifacts instead of memory. Output is an inventory: what exists, what is missing, and the diff ranges the rest of the retro will read.

## Inventory checklist

Collect what the epic produced and note the source path or range of each:

- **Epic file** — `epic-<slug>.md` in the epic folder, the folder's name plus `.md`: Description, Outcome, Done when, Boundaries, and Notes. Done when governs Phase 4; when the file has none, note that the verdict will be profiled from the diff.
- **Initiative requirements** — the Requirements section of the initiative file in the epic folder's parent. Each ticket's `covers` names ids there.
- **Entries** — the `tickets` rows of `tickets.py status <folder>`, and for each, `tickets.py find <folder> <ref>` with the row's `ref` (same command form as the workflow): its `description`, `verify`, and `covers` are what the build was given.
- **Story files** — `find`'s `story_file` when it is not null: the refined intent of a ticket a person refined.
- **Plans** — `find`'s `plan` for each ticket: its frontmatter (`status`, `baseline_revision`) and the sections Review Triage Log, Verification, Plan Change Log, and the dated `### <date>` blocks under `## Code Review`, absent when no review ran. These mark the boundaries between build sessions.
- **Diff ranges and commits** — the full set of changes the epic introduced, one range per plan (see Ranges from the plans below). For each range, run `uv run --no-cache {skill-root}/scripts/git_evidence.py --repo {project-root} --range <range> --stories <story-ids>` to get, as JSON, the commits in the range and the per-file change volume — added / deleted / net across the range — that Phase 2 reads. Record each range explicitly; Phase 2's aggregate views and the `bmad-review` pass both read them. When a range cannot be established, say so and narrow the scope rather than guessing. Read the output keys precisely: each commit carries `is_merge` and `stories` — *every* id its subject names, so a commit spanning two stories counts for both. `files` sums non-merge commits only. `merge_files` is each measured merge's diff against its first parent, so it *restates* the churn that merge brought in plus whatever the conflict resolution added — never add it into `files`, and never read it as merge-introduced work on its own. `merges_measured` counts the merges on the range head's first-parent spine; `merge_count` counts every merge in the range, so a gap between the two means merges went unmeasured. `binary_revisions` is unmeasured churn, not zero churn.
- **Previous retrospective** — `<folder name>-retrospective.md` in the previous epic's folder, if one exists, located as the workflow's Inputs say, so Phase 4 can check whether last epic's action items landed.
- **Session logs** — conversation or session records for the epic's tickets, when available. They are the only record of *why* a session took an unexpected turn — what was tried and abandoned. They are also the evidence most likely to be deleted or expire, so capture references now.

## Ranges from the plans

Each plan records its own `baseline_revision`, the commit its build started from, so there is no single epic-wide range. Order the plans by their baselines' place in history, oldest first (`git merge-base --is-ancestor A B` says A is older) — the order the builds started, which need not be the row order. A plan's range runs from its baseline to the next baseline in that order; the last plan's range runs to `HEAD`, marked inferred rather than recorded. When later work has landed since, end it at the last commit that belongs to this epic's tickets, judged from the plans and commit subjects, and record the cut. A plan whose `baseline_revision` is missing or `NO_VCS` gets no commit or diff evidence — record that too. Two plans sharing a baseline give the earlier one an empty range: that ticket simply has no commits of its own. Group the tickets sharing an identical range and run `git_evidence.py` once per distinct range, passing that group's `ref`s (`3.4`, as `status` spells them) as one comma-separated `--stories` value. A commit's `stories` is usually empty, since subjects rarely name a ref; the range is the attribution, and an empty list is not missing evidence. Ranges may overlap or diverge; count a shared commit or file change once in the aggregate views while keeping each ticket's range as its provenance.

## Missing evidence

Evidence availability varies; never hide a gap. Each later analysis declares what it needs and, when that input is absent, records a narrowed scope rather than guessing. A reader of the final retro must always be able to tell **"checked and clean"** from **"never checked."**

- Missing session logs → process-lesson analysis is skipped, and the retro says so.
- No Done when in the epic file → the verdict is profiled from the diff and plans, flagged as profiled rather than declared.
- Sub-agents unavailable → analyses that would delegate run inline over a narrowed scope, and the narrowing is recorded.

Carry the inventory forward into Phase 2 as the authoritative list of what is available to read.
