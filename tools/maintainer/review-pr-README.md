# Raven's Verdict - Deep PR Review Tool

Adversarial code review for GitHub PRs. Works with any LLM agent.

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- Any LLM agent capable of running bash commands

## Usage

Point your agent at `review-prompt.md` and ask it to review a specific PR:

> "Read tools/maintainer/pr-review/review-prompt.md and apply it to PR #123"

See `review-prompt.md` for full details on output format, safety features, and how it works.
