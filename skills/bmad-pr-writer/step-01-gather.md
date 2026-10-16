# Step 1: Gather

Find out what the change is and how it was checked.

- The target: the current branch against its base, a commit range, or
  a PR number the user named. For a commit message, the staged changes.
- The diff and the commit messages. Read the diff, not only the stat.
- The intent: a `bmad-build` plan, ticket, spec, or issue that the
  branch or commits name, when one exists. A plan already holds most
  of the PR: `## Intent` is the opening, `## Boundaries & Constraints`
  is what the PR leaves out, `## Verification` is the evidence, and
  `## Review Triage Log` is the review fixes.
- The evidence: the plan's verification, or check output from this
  session. Run the project's checks only when neither exists, and keep
  the exact commands and counts. Note anything that could not be run.
- Whether the diff changes what a user sees: pages, components,
  styles, or CLI output.
- The repo's own rules for PRs and commits: CONTRIBUTING, `AGENTS.md`,
  and the last few commit subjects. They win over this skill's
  structure; keep this skill's voice inside them.

Ask the user only for what the repo cannot tell you, such as what
happened on a live run.

## NEXT

Read fully and follow: `{{ rendered("step-02-draft.md") }}`
