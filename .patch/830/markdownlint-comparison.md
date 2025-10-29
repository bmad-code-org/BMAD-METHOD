# check-md-conformance.js vs. markdownlint

## Overview

- check-md-conformance.js
  - Purpose-built, zero-dependency Node script enforcing 6 CommonMark-oriented rules proposed in PR-830.
  - Focuses on spacing and consistency that affect cross-parser rendering (lists, tables, fences, bullet markers, fence language).
  - Simple to run in CI, no config required, clear actionable output.

- markdownlint (CLI + VS Code extension)
  - General Markdown linter with robust parsing (markdown-it), rich ruleset, config files, and editor integration.
  - Great for authoring hygiene, inline disables, and team-wide conventions; partial auto-fix support.

## Rule coverage mapping

- Blank line around lists
  - check-md: YES (list-blank-before, list-blank-after)
  - markdownlint: YES (MD032)
- Blank line around fenced code blocks
  - check-md: YES (fence-blank-before, fence-blank-after)
  - markdownlint: YES (MD031)
- Fenced code block has language
  - check-md: YES (fence-language-missing)
  - markdownlint: YES (MD040)
- Bullet marker normalization ("-")
  - check-md: YES (bullet-marker → enforces "-")
  - markdownlint: YES (MD004 configurable to dash)
- Blank line around tables
  - check-md: YES (table-blank-before, table-blank-after; heuristic)
  - markdownlint: NO direct core rule (requires a custom rule or a different linter for tables)

## Parsing rigor and edge cases

- check-md-conformance.js
  - Heuristic/regex based; ignores fenced code blocks by design; detects tables via lines containing "|".
  - Supports backtick fences (```), simple numbered lists ("1."); may miss rare edge cases.
  - Very fast, zero dependencies, ideal for CI gating specific guarantees.

- markdownlint
  - Parser-backed (markdown-it) with accurate tokenization of nested structures.
  - Large ruleset far beyond PR-830 scope (headings, indentation, inline HTML, etc.).
  - Highly configurable; good developer experience with editor feedback.

## Configurability and DX

- check-md-conformance.js
  - No configuration; rules hard-coded to PR-830 goals.
  - Clear text output; no auto-fix; no editor integration.

- markdownlint
  - Configurable via .markdownlint.json; inline disables and path ignores.
  - Editor integration (VS Code) for live feedback; CLI supports --fix for some rules.

## Performance and footprint

- check-md: Single file, no deps, instant startup → perfect for CI.
- markdownlint: Adds dev deps and config, still fast; richer ecosystem.

## Recommended usage (together)

- Keep both tools, each where it shines:
  - Use check-md-conformance.js in CI to enforce PR-830’s exact guarantees across generated outputs and repo docs (especially table spacing).
  - Use markdownlint for general authoring hygiene and contributor feedback (enable MD031, MD032, MD040, MD004: dash; disable noisy rules as needed).

## Optional enhancements

- Write a small custom markdownlint rule to require blank lines before/after tables, or continue relying on the custom checker for that.
- Later, port the table rule into a markdownlint custom ruleset to consolidate linting surfaces if desired.
- Consider an opt-in "--fix" mode in check-md for low-risk insertions (blank lines + fence language), applied to a subset first.

## Next steps (proposed)

- Add minimal markdownlint config and npm scripts (authoring quality).
- Keep running tools/markdown/check-md-conformance.js in CI for generator outputs and docs (PR-830 guarantees).
- Optionally prototype a markdownlint custom rule for table blank lines.
