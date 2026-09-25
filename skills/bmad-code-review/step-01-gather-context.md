---
diff_file: '' # set at runtime: path to the diff file
claims_file: '' # set at runtime (path or empty)
plan_file: '' # set at runtime (path or empty)
review_mode: '' # set at runtime: full or no-plan
---

# Step 1: Gather Context

## RULES

- The prompt that triggered this workflow IS the intent — not a hint.
- Writing `{diff_file}` and the claims file is the only change this step may make. Otherwise it is read-only.

## INSTRUCTIONS

1. **Find the review target.** The conversation context before this skill was triggered IS your starting point — not a blank slate. Check in this order — stop as soon as the review target is identified:

   **Tier 1 — Explicit argument.**
   Did the user pass a PR, commit SHA, branch, plan file, or diff source this message?
   - PR reference → resolve to branch/commit via `gh pr view`. If resolution fails, ask for a SHA or branch.
   - Commit or branch → use directly.
   - Plan file → set `plan_file` to it. A frontmatter `baseline_revision` other than `NO_VCS` makes the diff source **plan baseline**; otherwise say so and continue the cascade.
   - Also scan the argument for diff-mode keywords that narrow the scope:
     - "staged" / "staged changes" → Staged changes only
     - "uncommitted" / "working tree" / "all changes" → Uncommitted changes (staged + unstaged)
     - "branch diff" / "vs main" / "against main" / "compared to <branch>" → Branch diff (extract base branch if mentioned)
     - "commit range" / "last N commits" / "<from-sha>..<to-sha>" → Specific commit range
     - "this diff" / "provided diff" / "paste" → User-provided diff (do not match bare "diff" — it appears in other modes)
   - When multiple keywords match, prefer the most specific (e.g., "branch diff" over bare "diff").

   **Tier 2 — Recent conversation.**
   Do the last few messages reveal what the user wants to be reviewed? Look for plan paths, commit refs, branches, PRs, or descriptions of a change. Apply the same diff-mode keyword scan and routing as Tier 1.

   **Tier 3 — The ticket tree.**
   Run `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} status`. On a non-zero exit, fall through. Otherwise offer the `tickets` rows whose `state` is `review`, `<ref>` and `<title>` each, alongside choosing another target, and HALT for the user's pick. With none, or another target chosen, fall through. For a picked ticket, run `tickets.py find <ref>` (same command form) and treat its `plan` as a Tier 1 plan file.

   **Tier 4 — Current git state.**
   If version control is unavailable, skip to Tier 5. Otherwise, check the current branch and HEAD. If the branch is not `main` (or the default branch), confirm: "I see HEAD is `<short-sha>` on `<branch>` — do you want to review this branch's changes?" If confirmed, treat as a branch diff against `main`. If declined, fall through.

   **Tier 5 — Ask.**
   Fall through to instruction 2.

   Never ask extra questions beyond what the cascade prescribes. If a tier above already identified the target, skip the remaining tiers and proceed to instruction 3 (construct diff).

2. HALT. Ask the user: **What do you want to review?** Present these options:
   - **Uncommitted changes** (staged + unstaged)
   - **Staged changes only**
   - **Branch diff** vs a base branch (ask which base branch)
   - **Specific commit range** (ask for the range)
   - **Provided diff or file list** (user pastes or provides a path)

3. Write the diff for the chosen source to `{diff_file}` — a uniquely-named file in the system temp directory, so concurrent reviews cannot collide. The review layers read that file; the diff text is never pasted into their prompts.
   - For **plan baseline**: write a unified diff of all changes since `baseline_revision`, untracked files included (`git diff <baseline_revision> > {diff_file}`, then `git diff --no-index /dev/null <path> >> {diff_file}` for each untracked file). If the revision does not resolve, HALT and ask the user for a diff source.
   - For **staged changes only**: run `git diff --cached > {diff_file}`.
   - For **uncommitted changes** (staged + unstaged): run `git diff HEAD > {diff_file}`.
   - For **branch diff**: verify the base branch exists, then run `git diff <base-branch>...HEAD > {diff_file}`. If it does not exist, HALT and ask the user for a valid branch.
   - For **commit range**: verify the range resolves, then run `git diff <range> > {diff_file}`. If it does not resolve, HALT and ask the user for a valid range.
   - For **provided diff**: validate the content is non-empty and parseable as a unified diff. If it is not parseable, HALT and ask the user to provide a valid diff. Write the validated diff to `{diff_file}`.
   - For **file list**: validate each path exists in the working tree. Run `git diff HEAD -- <path1> <path2> ... > {diff_file}`. If any paths are untracked (new files not yet staged), append them with `git diff --no-index /dev/null <path> >> {diff_file}`. If the diff is empty (files have no uncommitted changes and are not untracked), ask the user whether to review the full file contents or to specify a different baseline.
   - After writing `{diff_file}`, verify it is non-empty regardless of source type. If empty, HALT and tell the user there is nothing to review.
   - Read `{diff_file}` yourself whenever you need the diff for your own context — triage and presentation later in this workflow.

4. **Stage the claims file.** Collect the change's own narrative: for a plan baseline, branch diff, or commit range, the commit messages it covers (`git log <base>..<head>`, where a plan baseline's head is `HEAD`); for other sources, whatever description of the change the user or conversation supplied. Write it verbatim to a uniquely-named file in the system temp directory and set `claims_file` to its path. If there is no narrative, set `claims_file` = `''`. Do not analyze or summarize the narrative — it is input for one review layer, staged as a file precisely so the other layers never see it.

5. **Set the plan context.**
   - If the triggering request or recent conversation **explicitly** states there is no plan (e.g. "no plan", "without a plan", "no-plan"): set `review_mode` = `no-plan` and clear `plan_file` (set it to `''`). Do **not** ask for a plan. Do **not** infer no-plan mode merely because the invocation omitted a plan path.
   - Else if `plan_file` is already set (from Tier 1, 2, or 3): verify the file exists and is readable, then set `review_mode` = `full`.
   - Else (neither a plan path nor an explicit no-plan declaration is present): ask the user to choose:
     1. Provide a plan file path for context; or
     2. Continue without a plan.
     - If the user provides a path: set `plan_file` to that path, verify the file exists and is readable, then set `review_mode` = `full`.
     - If the user explicitly chooses to continue without a plan: set `review_mode` = `no-plan`.

6. If `review_mode` = `full` and the file at `{plan_file}` has a `context` field in its frontmatter listing additional docs, load each referenced document. Warn the user about any docs that cannot be found.

7. Sanity check: if `wc -l {diff_file}` exceeds approximately 3000 lines, warn the user and offer to chunk the review by file group.
   - If the user opts to chunk: agree on the first group, rebuild `{diff_file}` narrowed to that group, and list the remaining groups for the user to note for follow-up runs.
   - If the user declines: proceed as-is with the full diff.

### CHECKPOINT

Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded plan/context docs (if any). HALT and wait for user confirmation to proceed.

## NEXT

Read fully and follow `{{ rendered("step-02-review.md") }}`
