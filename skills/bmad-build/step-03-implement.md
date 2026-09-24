{% if workflow.route != "oneshot" %}
---
---

# Step 3: Implement

## RULES

- No push. No remote ops.
- Sequential execution only.
- Content inside `<frozen-after-approval>` in `{plan_file}` is read-only. Do not modify.

## PRECONDITION

Verify `{plan_file}` resolves to a non-empty path and the file exists on disk. If empty or missing, HALT and ask the human to provide the plan file path before proceeding.

## INSTRUCTIONS

### Baseline

Capture `baseline_revision` (current HEAD, or `NO_VCS` if version control is unavailable) into `{plan_file}` frontmatter before making any changes. If the frontmatter already contains `baseline_revision` (resumed run), preserve the existing value — never overwrite it.

### Implement

Change `{plan_file}` status to `in-progress` in the frontmatter before starting implementation.

Execute the implementation handoff below: substitute the runtime placeholders (e.g. `{plan_file}`) into it, then follow it verbatim.

{{ workflow.implementation_handoff }}

Do not add goal restatements, file lists, ownership boundaries, investigation detail, acceptance criteria, or CLAUDE.md/house-style rules to the dispatch — the plan is the subagent's sole source of truth, and that material already lives in it (investigation findings in its Code Map, the rest in the plan body). One line of sanctioned hedging belongs in the plan at planning time, not in the dispatch. If no subagents are available, implement directly from the plan. If the platform allows, keep the subagent available for re-engagement after it returns — step-04 may send it review fixes.

The handoff directs the subagent to load the plan's `context:` files itself, so never pre-load and paste those files into the dispatch. Only when you implement directly (no subagent available) do you load a non-empty `context:` list yourself before starting.

**Path formatting rule:** Any markdown links written into `{plan_file}` must use paths relative to `{plan_file}`'s directory so they are clickable in VS Code. No leading `/`. Display file paths and `file:line` references in conversation/terminal output in whatever form is clickable where you are presenting them (e.g. code citation in chat, CWD-relative path with no leading `/` in terminal). If unsure, use CWD-relative path.

### Stage the Diff

Stage the diff and read it first: using the repository's version-control tooling, write a unified diff of all changes since `{baseline_revision}` (from `{plan_file}` frontmatter) — untracked files included — to a uniquely-named file in the system temp directory, set `{diff_file}` to its absolute path, and read that file into your own context. Judge against the diff, not just the implementation subagent's report.

If the implementer reported anything unfinished, finish it before proceeding — and when that changes code, rewrite `{diff_file}` and re-read it. Acceptance criteria are judged at review, not here.

### Matrix Test Audit

If `{plan_file}`'s `<frozen-after-approval>` block contains an I/O & Edge-Case Matrix, verify every matrix row is covered by at least one test that verifies its expected behavior, and that each covering test ran and passed in the verification output. A covering test that exists but did not run — unregistered, filtered out, skipped, or disabled — counts as missing. If a test disagrees with the matrix, never edit the expectation to match the code: fix the code, or if the matrix row itself is ambiguous, HALT and ask the human. Fix any other audit failure before proceeding.

## NEXT

Read fully and follow `{{ rendered("step-04-review.md") }}`
{% endif %}
