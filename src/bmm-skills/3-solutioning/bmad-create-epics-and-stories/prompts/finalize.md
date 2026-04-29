**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/validate_initiative.py`) resolve from the skill root.

# Stage 6: Finalize

**Goal:** Hand off cleanly. Show the user what was produced, confirm initial statuses, point them at the next workflow, and run any user-defined post-completion hook.

## Step 1: Print the produced tree

Walk `{initiative_store}/epics/` and present a concise tree — epic folders in order, story files under each. For each line, include the file's `status` from front matter. Something like:

```
{initiative_store}/epics/
├── 01-user-authentication/  (epic, draft)
│   ├── 01-define-user-and-session-models.md  (task, draft)
│   ├── 02-register-with-email.md  (feature, draft)
│   ├── 03-sign-in-with-email.md  (feature, draft)
│   └── 04-password-reset-via-email.md  (feature, draft)
└── 02-billing-stripe/  (epic, draft)
    ├── 01-customer-and-subscription-models.md  (task, draft)
    └── 02-checkout-session.md  (feature, draft)
```

Numbers, types, and statuses come from each file's front matter — re-read if you don't already have them in working memory.

## Step 2: Confirm initial statuses

Every story and epic starts at `draft`. Promotion is owned by downstream skills (`bmad-dev-story` etc.) — this skill never auto-promotes. Two normal next steps from here:

- **Leave everything `draft`.** The user iterates further before any dev work begins. Most common.
- **Promote a small first batch to `ready`.** If the user wants immediate dev-story handoff for the first epic's first story (or two), edit those files' `status: draft` → `status: ready` directly. Do not touch others.

Ask: "Want to leave these all as draft, or promote a small first batch to ready for immediate dev handoff?"

## Step 3: Point forward

Tell the user what they have and what comes next:

- **Per-story dev handoff:** `bmad-dev-story` reads any story by path and implements it.
- **Epic-context cache:** `bmad-quick-dev`, when v7'd, will read the `epic.md` Shared Context block instead of re-deriving per story.
- **Status rollup:** the future `bmad-initiative-status` reads `status:` from every file to summarize the initiative.

Then invoke `bmad-help` so the user sees the broader BMad surface available to them.

## Step 4: Run on_complete

Run:

```
python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete
```

If the resolved `workflow.on_complete` value is non-empty, follow it as the final terminal instruction before exiting.

## Stage Complete

The workflow is done. If the user asks for further changes, route back through `prompts/edit-mode.md` (Stage 0's mode detection now sees `edit` because the v7 tree exists). Otherwise exit.
