**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `resources/sizing-heuristics.md`) resolve from the skill root.

# Stage 3: Epic Design

**Goal:** Produce an approved epic list — for each epic an NN, a kebab title, an intent statement, a `depends_on` list (cross-epic), and a default story-type theme. Validate the cross-epic graph for cycles before leaving the stage. No files are written here; the list lives in working memory until Stage 4 calls `init_epic.py`. Re-read `{initiative_store}/.bmad-cache/inventory.json` for the requirements inventory you'll allocate against.

`resources/sizing-heuristics.md` should already be loaded as a persistent fact via the workflow's `customize.toml`. If you don't see it in your context, load it now (and only now — Stage 4 reads the same file via the same persistent-facts mechanism).

## Principles to apply (carry into the conversation, do not lecture)

- **User-value first.** Each epic must enable users to accomplish something meaningful, or — for tech-debt epics — leave a measurably better engineering state. Epics organized by technical layers ("database setup," "API endpoints," "frontend components") are wrong; reshape them.
- **Standalone within the dependency graph.** Each epic delivers complete functionality for its domain. Epic 2 must not require Epic 3 to function. Epic 3 may build on 1 and 2 but must stand alone.
- **Dependency-free within an epic.** Stories within an epic must not depend on later stories in the same epic. (The validator enforces this in Stage 5: `story-dep-forward` rejects within-epic deps that point at later siblings, and `story-dep-cycle` rejects loops in the story-level graph.)
- **File-churn check.** If multiple proposed epics repeatedly modify the same core files, ask whether they should consolidate into one epic with ordered stories. Distinguish meaningful overlap (same component end-to-end) from incidental sharing. Consolidate when the split provides no risk-mitigation or feedback-loop value.
- **Implementation efficiency over taxonomy.** When the outcome is certain and direction changes between epics are unlikely, prefer fewer larger epics. Split into more epics when there's a genuine risk boundary or where early feedback could change direction.
- **Starter template (if Stage 2 flagged one in the inventory).** Epic 1's first story must be "set up the project from the starter template." Plan for it now.

## The conversation

Walk through these collaboratively, not as a script:

1. **Identify user-value themes.** From the inventory: where are the natural groupings? Which FRs deliver cohesive user outcomes together? Which UX-DRs cluster around the same component or flow?
2. **Propose an epic structure.** For each candidate epic, share the title, the user outcome, the FR / UX-DR coverage, and any technical or UX considerations. Do this in dialog, not as a finished list.
3. **Pressure-test for file churn.** As you finalize, mentally trace which files each epic touches. Flag overlap. Ask the user whether to consolidate.
4. **Sequence and depends_on.** Establish the cross-epic graph. Capture each epic's `depends_on` as a list of prior epic NNs.
5. **Coverage check.** Walk every FR / NFR / UX-DR / debt item from the inventory and confirm it's allocated to an epic. NFRs and UX-DRs may cross-cut; pick the epic where they most naturally land or note them as cross-cutting.

## Cycle check before exit

Mentally compute the cross-epic dependency graph. If you find any cycle (Epic A depends on B which depends on A, directly or transitively), surface it and have the user resolve before proceeding. **Stage 5's validator is the deterministic source of truth for cycles** — this check is best-effort and exists only to avoid re-walking Stage 4 if an obvious loop slipped in.

## Optional deeper review

If the user wants to pressure-test the epic shape, they may invoke `bmad-advanced-elicitation` (deeper critique methods) or `bmad-party-mode` (multi-agent perspectives) explicitly. **Do not present these as a menu** — only invoke when the user asks.

## Soft gate

"Does this epic list capture the initiative? Anything missing, anything overlapping that should be consolidated?" When the user is satisfied, the list is approved and Stage 3 is complete.

## Edit-mode flows

When this stage is entered from `prompts/edit-mode.md`:

- **add-epic:** ask only about the new epic. Existing epic NNs are fixed; the new one gets the next-available NN. Capture title, intent, `depends_on`, theme. Validate the new edges don't introduce a cycle.
- **split-epic:** discuss how to split the target epic. Define the new epic NNs, titles, intents, and `depends_on` edges (typically the new sibling depends on the original where the split is downstream). Decide which existing stories move (Stage 4 will use `move_story.py`) and which stay.
- **merge-epics:** decide which is the surviving epic. Define how the merged depends_on collapses. Plan the story renumbering (Stage 4 will use `move_story.py` for the moves, then `rename_story.py` for any renumber).
- **rename-epic:** discuss the new title (and optionally a new NN). Stage 4 invokes `scripts/rename_epic.py` to perform the rename atomically; no other epics are touched.
- **re-derive-deps:** with the existing epic list, walk the cross-epic graph from scratch and update `depends_on` lists where the user agrees. (Within-epic dep updates happen in Stage 4.)

After the relevant edit-mode flow finishes here, route to `prompts/epic-authoring.md` with the focused scope.

## Stage Complete

When the epic list is approved (and the cycle check passes), route to `prompts/epic-authoring.md`. Carry the approved list — for each epic: NN, kebab title, intent, `depends_on`, and story-type theme — into Stage 4.
