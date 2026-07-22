# Aggregate Views

Phase 2. An epic is many coding sessions, each validated in isolation; the defects that matter are the ones no single session — and no single diff hunk — could see. Nine sessions each add three hundred innocent lines and none ever saw the 3,000-line class they collectively built. These views are properties of the *whole* change, derived across the full diff range from Phase 1.

Prefer deterministic derivation: a script that measures the codebase is evidence; a model's impression is not. Where you compute a view inline instead of by script, record the narrowed scope. Every observation that becomes a finding carries a source reference — the file, the symbol, the commits.

## The catalog

- **Architecture delta** — how the dependency structure changed across the epic. Where a language-native dependency tool exists (dependency-cruiser, madge, pydeps, and the like), run it before and after the range and diff the graphs; otherwise derive the module/import graph from the changed files. Look for new cross-cutting dependencies, layering violations, and cycles introduced — structure the code's own conventions would forbid but no single story tripped.
- **Duplication map** — the same problem solved more than one way across stories. Two sessions independently writing near-identical logic, or a helper reimplemented because the second session did not know the first existed.
- **God-class / size growth** — files that grew past a healthy size *over the epic*, invisible per-commit because each session added only a little. The `git_evidence.py` pre-pass (Phase 1) reports added / deleted / net per file across the range — this is *change volume*, not a file's absolute size or a per-commit growth rate. Use it to rank the highest-churn files, then open those files to read their actual current size and structure before calling anything a god-class: a high-net-churn file is a candidate to inspect, not a verdict on its own. Whether a flagged file is genuinely a god-class or legitimately large stays your judgment.
- **Pattern divergence** — where the epic's code diverges from the conventions the surrounding codebase already established: naming, error handling, test structure, module boundaries. Agents learn conventions by pattern-matching the code, so divergence compounds.
- **Spec-to-implementation reconciliation** — where the as-built diverges from what the epic spec and PRD/architecture described. Requirements silently dropped, added behavior nobody specified, intent reinterpreted between stories. Each divergence is either a defect (fix), an accepted deviation (record so later runs stop re-flagging it), or a spec that should be reconciled to reality (propose in Phase 4).

## Delegation

When sub-agents are available, delegate the derivation: each returns evidence with source refs and checked scope, never a verdict — the parent consolidates and decides. Give each a narrow view and an explicit return format. When sub-agents are unavailable, compute the highest-value views inline (architecture delta and spec reconciliation first) and record which views were narrowed or skipped.
