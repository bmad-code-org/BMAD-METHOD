# Synthesis

The report answers the decision — whether the material came from a native Run or a processed import. **Succinct is the contract**: findings and verdicts, not essays; rationale lives in the memlog; a reader gets the decision-relevant truth in minutes. For Process mode this is the whole point — the summary is what downstream consumers read so nobody reprocesses the original, and sections with nothing behind them collapse to a line rather than pad.

Assemble `research.md` in this order, shaped by `{workflow.audience}` and written in `{document_output_language}`:

1. **Executive summary** — decision-first: what the evidence says to do, the two or three findings that drive that answer, and the biggest caveat. One page maximum, readable standalone. Written last, placed first.
2. **Dimension sections** — already written during the loop; now reconciled: consistent terminology, no duplicated ground, verification statuses and any corrections from the pass applied to the text.
3. **Cross-dimension insights** — what only the *combination* shows (e.g. the market is growing but the regulatory dimension caps the reachable segment; the technically superior option loses on ecosystem health). This section is the harness earning its keep — if there are no cross-dimension insights, say so rather than manufacture them.
4. **Contrary evidence** — when the red-team pass ran and found material; the strongest surviving counter-arguments, cited.
5. **Recommendations** — each bound to the decision and, where the project has them, to the downstream artifact that consumes it (per the pack's `Feeds` entries: brief section, PRD input, architecture constraint). Each recommendation names its confidence basis; a recommendation resting on low-confidence or disputed claims says so in the same sentence.
6. **Open questions** — what the research could not answer, and what it would take to answer each.
7. **Source appendix** — the numbered source table: `[n] | claim/finding it supports | publisher | pub date | accessed | confidence`. Every inline `[n]` resolves here.
8. **Staleness map** — the claims that age fastest (from their classes' freshness windows), each with its pub date and the date it should be re-checked. This is Refresh's work order; close by noting the earliest re-check date.

Update the frontmatter (`status: complete`, `updated`, counts of verified/unverified claims), log a final `event` in the memlog, and return to `## Finalize` in SKILL.md.
