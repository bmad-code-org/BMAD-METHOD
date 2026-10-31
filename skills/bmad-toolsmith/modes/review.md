# Review

Advice, not a gate. Its outcome: a report of findings on `{target}` and the user choosing which to apply.

## Pre-pass

`uv run {skill-root}/scripts/prepass.py {target}` gives one JSON. Every lens reads it first, then every prompt file of the skill.

## Lenses

Launch one subagent per lens, in parallel: `lenses/lens-architecture.md`, `lenses/lens-determinism.md`, `lenses/lens-leanness.md`, `lenses/lens-customization.md`, `lenses/lens-trigger.md`. Each gets the pre-pass JSON, `{target}`, its lens file, `lenses/lens-contract.md` and `lenses/standards.md`, and returns findings JSON per the contract. If subagents are unavailable, run the lenses inline one at a time and say so.

## Findings

Merge the lens returns, drop duplicates (same point in the same place), order by severity.

Give the findings in chat, each in two lines: what and where, then the fix; one line per lens with its verdict above them.

Write the same list as markdown to `{reports_folder}/<YYYYMMDD-HHMMSS>-<skill>-review.md`; no other format.

For a leanness finding that proposes a smaller version, offer a variant eval of that version through the `bmad-eval` skill, so the cut is measured before it is made, and CUT (`modes/cut.md`) to make it.

Offer edit mode (`modes/edit.md`) for the findings the user wants applied; apply none unasked.
