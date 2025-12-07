# Raven's Verdict - Deep PR Review Tool

Adversarial code review for GitHub PRs. Works with any LLM agent.

> **Status: Experimental.** We're still figuring out how to use this effectively. Expect the workflow to evolve.

## How It Works

Point your agent at `review-pr.md` and ask it to review a specific PR:

> "Read tools/maintainer/review-pr.md and apply it to PR #123"

The tool will:

1. Check out the PR branch locally
2. Run an adversarial review (find at least 5 issues)
3. Transform findings into professional tone
4. Preview the review and ask before posting

See `review-pr.md` for full prompt structure, severity ratings, and sandboxing rules.

## When to Use

**Good candidates:**

- PRs with meaningful logic changes
- Refactors touching multiple files
- New features or architectural changes

**Skip it for:**

- Trivial PRs (typo fixes, version bumps, single-line changes)
- PRs you've already reviewed manually
- PRs where you haven't agreed on the approach yet — fix the direction before the implementation

## Workflow Tips

**Always review before posting.** The preview step exists for a reason:

- **[y] Yes** — Post as-is (only if you're confident)
- **[e] Edit** — Modify findings before posting
- **[s] Save only** — Write to file, don't post

The save option is useful when you want to:

- Hand-edit the review before posting
- Use the findings as input for a second opinion ("Hey Claude, here's what Raven found — what do you think?")
- Cherry-pick specific findings

**Trust but verify.** LLM reviews can miss context or flag non-issues. Skim the findings before they hit the PR.

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- Any LLM agent capable of running bash commands
