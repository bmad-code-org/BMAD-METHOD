# Raven's Verdict - Deep PR Review Tool

Adversarial code review for GitHub PRs. Works with any LLM agent.

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- Any LLM agent capable of running bash commands

## Usage

```bash
# Claude Code
claude "Review PR #123 using tools/maintainer/pr-review/review-prompt.md"

# Other agents: copy review-prompt.md contents to your agent
```

See `review-prompt.md` for full details on output format, safety features, and how it works.
