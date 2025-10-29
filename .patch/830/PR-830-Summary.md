# PR #830 — fix: add CommonMark-compliant markdown formatting rules

URL: https://github.com/bmad-code-org/BMAD-METHOD/pull/830
Author: @jheyworth
State: open | Mergeable: true | Commits: 1 | Files changed: 2 | +367 / -0
Head: jheyworth:fix/markdown-formatting-commonmark-compliance → Base: bmad-code-org:v6-alpha

## Summary

This PR proposes adding an explicit, critical mandate to `bmad/core/tasks/workflow.xml` that enforces six CommonMark-aligned markdown formatting rules around lists, tables, and code fences. A companion `TEST.md` file documents the problem, solution, and three-phase validation including a public test repository demonstrating cross-parser behavior.

## Problem Statement

- BMAD-generated markdown sometimes omits required blank lines around lists/tables/code fences.
- GitHub’s renderer (GFM) is lenient; strict parsers (e.g., Mac Markdown.app) break — lists collapse to plain text, structure is lost.

## Proposed Change

Insert a critical mandate under `<if tag="template-output">` in `workflow.xml` with the following rules:
1) Blank line before/after bullet lists
2) Blank line before/after numbered lists
3) Blank line before/after tables
4) Blank line before/after code blocks
5) Use `-` consistently for bullets
6) Use language identifiers for code fences

Also adds `TEST.md` documenting tests and links to evidence.

## Files Changed

- bmad/core/tasks/workflow.xml — add mandate (≈8 lines)
- TEST.md — comprehensive test evidence (new, 359 lines)

## External Resources (Evidence)

- Test repository (before/after, screenshots):
  - https://github.com/jheyworth/bmad-markdown-formatting-test
  - Before vs After diff: https://github.com/jheyworth/bmad-markdown-formatting-test/compare/dcf405f...0b30d47
  - Example files and screenshot paths in TEST.md
- CommonMark Spec v0.31.2: https://spec.commonmark.org/

### Review plan for external resources

- Read README.md and FINDINGS.md in the test repo to validate metrics and methodology
- Manually open the specific before/after files linked to confirm rendering changes
- Verify the Mac Markdown.app screenshot path and reproduce with a strict renderer (e.g., CommonMark CLI)
- Cross-check mandate text against relevant CommonMark sections (lists, code fences, tables)

## Initial Review Notes

- Impacted scope is small (single mandate) with no engine logic changes.
- Benefits: standards compliance, cross-tool compatibility, zero semantic content change.
- Risk: mandate phrasing must remain guidance (not a parser); ensure it doesn’t conflict with existing writer behavior or other mandates.

## Next Steps

- Validate that this mandate text aligns with BMAD’s writer/generator semantics (no conflicts).
- Run a quick end-to-end generation on a sample workflow to confirm no unintended format regressions.
- Consider adding automated markdown conformance checks to CI as a follow-up.
  - Option: integrate a CommonMark linter or markdownlint rule set; document exceptions if any
