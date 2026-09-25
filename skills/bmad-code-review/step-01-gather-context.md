---
diff_file: '' # set at runtime: path to the diff file
claims_file: '' # set at runtime (path or empty)
spec_file: '' # set at runtime (path or empty)
review_mode: '' # set at runtime: full or no-spec
story_key: '' # set at runtime when discovered from sprint status
---

# Step 1: Gather Context

## RULES

- The triggering prompt and the conversation before it name the review target — act on them; do not start from a blank slate.
- Writing `{diff_file}` and the claims file is the only change this step may make. Otherwise it is read-only.

## INSTRUCTIONS

1. **Find the review target.** Check in this order and stop at the first that identifies it:
   - **Request or recent conversation.** A PR (resolve via `gh pr view`; if that fails, ask for a SHA or branch), commit, branch, commit range, staged or uncommitted changes, a provided diff or file list, or a spec file. A spec sets `spec_file`; its frontmatter `baseline_commit`, if present, is the diff baseline against the working tree — a spec without one does not identify the diff.
   - **Sprint tracking.** Find a sprint status file (`*sprint-status*`) in `{{ config.implementation_artifacts }}` or `{{ config.planning_artifacts }}`. If stories have status `review`, HALT and offer them, plus a choice of another target. A picked story sets `story_key` and its context determines the diff source.
   - **Current git state.** If HEAD is not on the default branch, confirm: "I see HEAD is `<short-sha>` on `<branch>` — do you want to review this branch's changes?" If confirmed, it is a branch diff against the default branch.
   - **Ask.** Go to instruction 2.

2. HALT. Ask the user what to review: uncommitted changes, staged changes, a branch diff (which base), a commit range, or a provided diff or file list.

3. Write the diff to `{diff_file}`, a uniquely-named file in the system temp directory so concurrent reviews cannot collide. A branch diff runs from the merge-base (`<base>...HEAD`), so later commits on the base do not show up as reverted. For a file list, include untracked files. If the source does not resolve, HALT and ask for a valid one; if the diff is empty, HALT — there is nothing to review. The review lenses read that file; the diff text is never pasted into their prompts. Read `{diff_file}` yourself when you need the diff later in this workflow.

4. **Stage the claims file.** Collect the change's own narrative: for a spec baseline, branch diff, or commit range, the commit messages it covers (`git log <base>..<head>`); for other sources, whatever description of the change the user or conversation supplied. Write it verbatim to a uniquely-named file in the system temp directory and set `claims_file` to its path, or `''` if there is none. Do not analyze or summarize it — it is input for one review lens, staged as a file so the other lenses never see it.

5. **Set the spec context.**
   - The request or conversation explicitly says there is no spec → `review_mode` = `no-spec`, `spec_file` = `''`. Do not ask.
   - `spec_file` is set → verify it is readable; `review_mode` = `full`.
   - Otherwise, ask for a spec or story file path, or to continue without one, and set `spec_file` and `review_mode` accordingly. Do not assume no-spec just because none was given.

6. If `review_mode` = `full` and `{spec_file}`'s frontmatter has a `context` list, load each referenced doc and warn about any that cannot be found.

7. If `{diff_file}` exceeds about 3000 lines, warn the user and offer to chunk the review by file group. If they accept, agree on the first group, rebuild `{diff_file}` for it, and list the remaining groups for follow-up runs.

### CHECKPOINT

Present a summary before proceeding: diff stats (files changed, lines added/removed), `{review_mode}`, and loaded spec/context docs (if any). HALT and wait for user confirmation to proceed.

## NEXT

Read fully and follow `{{ rendered("step-02-review.md") }}`
