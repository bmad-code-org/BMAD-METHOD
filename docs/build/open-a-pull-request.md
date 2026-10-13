---
title: 'Open a Pull Request'
description: Use bmad-pr-writer to write the PR or commit message for finished work.
sidebar:
  order: 7
---

`bmad-pr-writer` writes the pull request for work that already exists,
or a commit message. A reviewer who did not see the work learns what
changed for the user, what changed in the code, how it was verified,
and what is still open, then gets a short list of what to do.

## When to Use It

Invoke it by name: `/bmad-pr-writer`, or say "write the PR".

Typical moments:

- **After [`bmad-build`](build-a-change.md)** — it commits but never
  pushes; this opens the PR
- **A branch you wrote by hand** — any diff against its base
- **An existing PR** — rewrite a thin description

## How it runs

1. **Gather.** Reads the diff, commits, and any plan or ticket. Uses
   recorded check output, or runs the project's checks. Reads the
   repo's own PR and commit rules.
2. **Draft.** Fills the repo's PR template when it has one, otherwise a
   built-in skeleton for a feature, a fix with evidence, an incident,
   or review fixes. Every body states what was not verified.
3. **Publish.** Shows you the text. Pushes and opens or edits the PR
   only after you approve it.

## Customize

Set these in `_bmad/custom/bmad-pr-writer.toml` under `[workflow]`:

| Key | Default | Effect |
| --- | --- | --- |
| `title_style` | `plain` | `conventional` adds `feat:`/`fix:` prefixes to titles and commits |
| `pr_template` | empty | A template to fill instead of `.github/PULL_REQUEST_TEMPLATE.md` |
| `reviewer` | empty | Ends the body with `@<reviewer> — what you need to do` |

## What It Is Not

Not a review. For agent review use
[`bmad-code-review`](review-a-change.md); for a guided human review use
[`bmad-walkthrough`](walk-through-a-change.md).
