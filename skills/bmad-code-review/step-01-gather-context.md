---
diff_file: '' # set at runtime: path to the diff file
claims_file: '' # set at runtime (path or empty)
plan_file: '' # set at runtime (path or empty)
review_mode: '' # set at runtime: full or no-plan
---

# Step 1: Gather Context

## RULES

- The triggering prompt and the conversation before it name the review target — act on them; do not start from a blank slate.
- Writing `{diff_file}` and the claims file is the only change this step may make. Otherwise it is read-only.

## INSTRUCTIONS

1. **Find the review target.** Check in this order and stop at the first that identifies it:
   - **Request or recent conversation.** A PR (resolve via `gh pr view`; if that fails, ask for a SHA or branch), commit, branch, commit range, staged or uncommitted changes, a provided diff or file list, or a plan file. A plan sets `plan_file`; a frontmatter `baseline_revision` other than `NO_VCS` makes the diff source the **plan baseline** — otherwise say so and continue, since a plan without one does not identify the diff.
   - **The ticket tree.** Run `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} status`. On a non-zero exit, continue. Otherwise offer the `tickets` rows whose `state` is `review`, `<ref>` and `<title>` each, plus a choice of another target, and HALT for the user's pick. With none, or another target chosen, continue. For a picked ticket, run `tickets.py find <ref>` (same command form) and treat its `plan` as a plan file from the request.
   - **Current git state.** If HEAD is not on the default branch, confirm: "I see HEAD is `<short-sha>` on `<branch>` — do you want to review this branch's changes?" If confirmed, it is a branch diff against the default branch.
   - **Ask.** Go to instruction 2.

2. HALT. Ask the user what to review: uncommitted changes, staged changes, a branch diff (which base), a commit range, or a provided diff or file list.

3. Write the diff to `{diff_file}`, a uniquely-named temp file outside the repository, so concurrent reviews cannot collide. A plan baseline diffs every change since `baseline_revision`, untracked files included. A branch diff runs from the merge-base (`<base>...HEAD`), so later commits on the base do not show up as reverted. For a file list, include untracked files. If the source does not resolve, HALT and ask for a valid one; if the diff is empty, HALT — there is nothing to review. The review lenses read that file; the diff text is never pasted into their prompts. Read `{diff_file}` yourself when you need the diff later in this workflow.

4. **Stage the claims file.** Collect the change's own narrative: for a plan baseline, branch diff, or commit range, the commit messages it covers (`git log <base>..<head>`, where a plan baseline's head is `HEAD`); for other sources, whatever description of the change the user or conversation supplied. Write it verbatim to another uniquely-named temp file outside the repository and set `claims_file` to its path, or `''` if there is none. Do not analyze or summarize it — it is input for one review lens, staged as a file so the other lenses never see it.

5. **Set the plan context.**
   - The request or conversation explicitly says there is no plan → `review_mode` = `no-plan`, `plan_file` = `''`. Do not ask.
   - `plan_file` is set → verify it is readable; `review_mode` = `full`.
   - Otherwise, ask for a plan file path, or to continue without one, and set `plan_file` and `review_mode` accordingly. Do not assume no-plan just because none was given.

6. If `review_mode` = `full` and `{plan_file}`'s frontmatter has a `context` list, load each referenced doc and warn about any that cannot be found.

7. If `{diff_file}` exceeds about 3000 lines, warn the user and offer to chunk the review by file group. If they accept, agree on the first group, rebuild `{diff_file}` for it, and list the remaining groups for follow-up runs.

### CHECKPOINT

Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded plan/context docs (if any). HALT and wait for user confirmation to proceed.

## NEXT

Read fully and follow `{{ rendered("step-02-review.md") }}`
