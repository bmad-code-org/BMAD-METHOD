**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `agents/artifact-analyzer.md`) resolve from the skill root.

# Stage 2: Discovery

**Goal:** Build a complete-enough requirements inventory in working memory — every FR, NFR, additional architecture-derived requirement, and UX-DR that the epic-and-story tree will need to cover. **Do not write this to a file.** v7 has no monolithic place for it; the inventory gets distributed into per-epic `epic.md` files in Stage 4.

## Subagent fan-out

Launch one `agents/artifact-analyzer.md` subagent. Pass it: the initiative intent from Stage 1, `{planning_artifacts}` and `{project_knowledge}` as scan paths, and any specific paths the user pointed to in Stage 1.

The subagent returns structured JSON — see its file for the contract. Hold the returned object in working memory; you will reference its fields directly in Stage 3 (for epic shaping) and Stage 4 (for AC-to-requirement coverage mapping).

## Graceful degradation

- **Subagents unavailable.** Read the most relevant 1–2 documents in the main context (PRD if present, then architecture). For very large docs, read TOC and section headings first; full-read only sections the initiative intent makes relevant. Note which sections you skimmed.
- **No PRD.** If the initiative is tech-debt-heavy or task-heavy and no PRD exists, do not block. Ask the user for an explicit list of debt items, target areas, or research questions, and use that list as the inventory in place of FRs. Format the list with synthetic codes (`D1`, `D2`, ... or `R1`, `R2`, ... for research questions) so Stage 4's coverage mapping has something to reference.
- **No UX doc.** Tech-only initiatives may have none. Empty `ux_design_requirements` is fine.

## Synthesis

When the subagent returns (or inline scanning completes):

1. **Merge with what the user told you in Stage 1.** Volunteered FRs or design ideas are part of the inventory.
2. **Hold the merged inventory in working memory** as a single conceptual list with three sections: requirements (FRs + debt items), constraints (NFRs + governance), and UX-DRs.
3. **Note the starter-template flag**, if present — Stage 4's first epic will need a setup story.
4. **Identify gaps.** Anything the inventory doesn't cover that you'd expect for an initiative of this type? (Auth flows in a product without auth requirements? Migration steps without data-migration requirements?)

## Present a brief summary

Tell the user in 4–8 lines: how many FRs, NFRs, UX-DRs were extracted, the starter-template note if any, governance constraints if any, and any gaps you noticed. Do not dump the full inventory — they have the source documents.

Ask: "Anything missing or wrong here, or shall we move on to designing the epic list?" Soft gate.

## Stage Complete

When the user confirms (or stays silent after the soft prompt), route to `prompts/epic-design.md`. The inventory remains in working memory throughout the rest of the workflow.
