**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `agents/artifact-analyzer.md`) resolve from the skill root.

# Stage 2: Discovery

**Goal:** Build a complete-enough requirements inventory and **persist it to disk** so it survives context compaction across the rest of the workflow. The persisted inventory is the source of truth that Stages 4 (per-story coverage), 5 (coverage gate), and 6 (cleanup) read back. v7 has no monolithic on-tree document for it — it lives in a sidecar cache.

## Pre-flight

Before launching the artifact-analyzer, tell the user (in 3–5 lines) what you're about to scan: the resolved `{planning_artifacts}` path, the resolved `{project_knowledge}` path, and any user-pointed paths from Stage 1. This lets a misconfigured path surface immediately rather than as an empty result. Skip the pre-flight in `{yolo}=true` and `{mode}=headless`.

## Subagent fan-out

Launch one `agents/artifact-analyzer.md` subagent. Pass it: the initiative intent from Stage 1, `{planning_artifacts}` and `{project_knowledge}` as scan paths, and any specific paths the user pointed to in Stage 1.

The subagent returns structured JSON — see its file for the contract.

## Graceful degradation

- **Subagents unavailable.** Read at most 2 documents in the main context (PRD first; architecture only if the PRD didn't cover the relevant ground). Issue both `Read` calls in the same message. For very large docs (>50 pages), read TOC and section headings first; full-read only sections the initiative intent makes relevant. Note which sections you skimmed.
- **No PRD.** If the initiative is tech-debt-heavy or task-heavy and no PRD exists, do not block. Ask the user for an explicit list of debt items, target areas, or research questions, and use that list as the inventory in place of FRs. Format with synthetic codes (`D1`, `D2`, ... or `R1`, `R2`, ... for research) so Stage 4's coverage mapping has something to reference.
- **No UX doc.** Tech-only initiatives may have none. Empty `ux_design_requirements` is fine.

## Synthesize and persist

When the subagent returns (or inline scanning completes):

1. **Merge volunteered details from Stage 1** into the inventory. FRs, debt items, and design ideas the user mentioned in conversation are first-class.
2. **Identify gaps** the inventory doesn't cover that you'd expect for this initiative type (auth flows in a product without auth requirements? migration steps without data-migration requirements?). Note these for the soft gate; do not invent codes.
3. **Persist the inventory** to `{initiative_store}/.bmad-cache/inventory.json` (create the parent directory if needed). Use the schema below verbatim. This file is the canonical source for Stages 4, 5, and 6.

### inventory.json schema

```json
{
  "version": 1,
  "title": "<initiative title from Stage 1>",
  "intent": "<initiative intent from Stage 1>",
  "story_type_mix": "feature-heavy|task-heavy|spike-heavy|mixed",
  "starter_template_note": "<one-liner or null>",
  "requirements": {
    "functional":     [{"code": "FR1",   "text": "..."}],
    "non_functional": [{"code": "NFR1",  "text": "..."}],
    "ux_design":      [{"code": "UX-DR1","text": "..."}],
    "debt":           [{"code": "D1",    "text": "..."}],
    "research":       [{"code": "R1",    "text": "..."}]
  },
  "additional_requirements": ["<bullet — architecture-derived requirement with no code>"],
  "governance_constraints": ["<bullet>"],
  "documents_found": [{"path": "...", "kind": "prd|architecture|ux|...", "relevance": "..."}],
  "noted_gaps": ["<gap you flagged but did not invent a code for>"]
}
```

Lists may be empty. Each requirement entry must have a unique `code`.

## Present a brief summary

Tell the user in 4–8 lines: counts (FRs, NFRs, UX-DRs, debt items), the starter-template note if any, governance constraints if any, and any gaps. Do not dump the full inventory — they have the source documents. Mention the cache path so they know where the inventory lives.

In `{yolo}=true` collapse to a single line: "Inventory: N FRs, M NFRs, K UX-DRs (cached at `.bmad-cache/inventory.json`)."

In `{mode}=headless` skip the summary entirely.

Soft gate (interactive only): "Anything missing or wrong here, or shall we move on to designing the epic list?"

## Stage Complete

When the user confirms (or `{yolo}=true` auto-confirms), route to `prompts/epic-design.md`. The inventory remains on disk; later stages re-read it rather than relying on working memory.
