# Review

Advice, not a gate. Its outcome: a report of findings on `{target}` ordered by severity, each with its fix, and the user choosing which to apply.

## Pre-pass

`uv run {skill-root}/scripts/prepass.py {target}`: one JSON with tokens per file, a shape hint, scripts with their headers and tests, description length, and path and script findings. Every lens reads it first, then every prompt file the skill has; the lenses judge the whole skill, not the entry alone.

## Lenses

Launch one subagent per lens, in parallel: `lenses/lens-architecture.md`, `lenses/lens-determinism.md`, `lenses/lens-leanness.md`, `lenses/lens-customization.md`, `lenses/lens-trigger.md`. Each gets the pre-pass JSON, `{target}`, its lens file, `lenses/lens-contract.md` and `lenses/standards.md`, and returns findings JSON per the contract. If subagents are unavailable, run the lenses inline one at a time and say so.

## Findings

Merge the lens returns, drop duplicates (same file, same place, same point), order by severity. Give the findings in chat, each in two lines: what and where, then the fix; one line per lens with its verdict above them. Write the same list as markdown to `{reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-review.md` so the user can work from it later; no other format. A leanness finding that proposes a smaller version is a hypothesis, not a verdict: offer a variant eval through the `bmad-eval` skill with the smaller version as the variant, so the cut is measured before it is made. Offer edit mode (`modes/edit.md`) for the findings the user wants applied; apply none unasked.
