**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/validate_initiative.py`) resolve from the skill root.

# Stage 6: Finalize

**Goal:** Hand off cleanly. Show the user what was produced, confirm initial statuses, point them at the most useful next workflow, and run any user-defined post-completion hook.

## Step 1: Print the produced tree

Use the validator's `--tree` mode rather than re-reading every file:

```
python3 scripts/validate_initiative.py --initiative-store {initiative_store} --tree
```

Print the output verbatim. It already includes types and statuses for every node:

```
{initiative_store}/epics/
├── 01-user-authentication/  (epic, draft)
│   ├── 01-define-user-and-session-models.md  (task, draft)
│   ├── 02-register-with-email.md  (feature, draft)
│   └── 03-sign-in-with-email.md  (feature, draft)
└── 02-billing-stripe/  (epic, draft)
    ├── 01-customer-and-subscription-models.md  (task, draft)
    └── 02-checkout-session.md  (feature, draft)
```

## Step 2: Print an initiative stats block

Run summary mode and emit a compact stats line so the user has a satisfying signal of completeness:

```
python3 scripts/validate_initiative.py --initiative-store {initiative_store} --summary-only
```

From the JSON, surface a 3-line block such as:

```
2 epics, 5 stories: 3 features, 2 tasks. Coverage: 100% (8/8 inventory codes mentioned).
Median story body: ~600 chars. No oversized stories.
```

Pull the coverage number from `summary.mentioned_requirements` vs the inventory at `{initiative_store}/.bmad-cache/inventory.json` (if present); skip the coverage line when no inventory exists.

## Step 3: Confirm initial statuses

Every story and epic starts at `draft`. Promotion is owned by downstream skills (`bmad-dev-story` etc.) — this skill never auto-promotes. Two normal next steps from here:

- **Leave everything `draft`.** The user iterates further before any dev work begins. Most common.
- **Promote a small first batch to `ready`.** If the user wants immediate dev-story handoff for the first epic's first story (or two), edit those files' `status: draft` → `status: ready` directly. Do not touch others.

Ask: "Want to leave these all as draft, or promote a small first batch to ready for immediate dev handoff?"

## Step 4: Named hand-offs

Tell the user what they have and what's most likely next, naming the specific skills:

- **Implement a story.** `bmad-dev-story` reads any story file by path and implements it end-to-end.
- **Plan a sprint.** `bmad-sprint-planning` reads the tree and proposes a sprint slice based on dependencies and statuses.
- **Status rollup.** The future `bmad-initiative-status` reads `status:` from every file to summarize the initiative.
- **Quick fixes.** `bmad-quick-dev` (when v7'd) reads the `epic.md` Shared Context block instead of re-deriving per story.

If you're unsure which the user needs, point them at `bmad-help` to surface the broader BMad surface.

## Step 5: Clean up the cache

Delete `{initiative_store}/.bmad-cache/inventory.json`. The cache exists to bridge working memory across stages; once Stage 5 has accepted coverage and Stage 6 is finalizing, it has served its purpose. Keep the parent `.bmad-cache/` directory for future runs.

If a fresh edit-mode session needs the inventory back, Stage 4's recovery path will rebuild it.

## Step 6: Run on_complete

```
python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete
```

If the resolved `workflow.on_complete` value is non-empty, follow it as the final terminal instruction before exiting.

## Stage Complete

The workflow is done. If the user asks for further changes, route back through `prompts/edit-mode.md` (Stage 0's mode detection now sees `edit` because the v7 tree exists). Otherwise exit.
