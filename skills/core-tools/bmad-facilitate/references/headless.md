# Headless Runs

Load this reference when running headless or autonomous without a live user in the loop.

## Triggers and Boundaries

Headless mode applies when the caller asks for headless execution, the user requests autonomous output ("just give me X"), or no person is present (when unsure, stay interactive). Fast mode is interactive and still asks its batch of questions; headless asks nothing.

## Execution

Dispatch by intent (keep Validate strictly read-only):

- **Create:** follow activation, template merge, and Create setup (loading any `guidance` and `methods` files). Fill every section without asking, inferring missing inputs as best guesses tagged `[ASSUMPTION: ...]`, pick reviewers from stakes alone, then load `finalize.md` and run Review, Finalize steps 1–6, step 8, and Close (moving standing `[ASSUMPTION]` tags into an assumptions section or closing `## Assumptions` during Polish).
- **Update:** follow `update-validate.md` (Context Extraction and Update) without asking, pick reviewers from stakes alone, then load `finalize.md` and run Review, Finalize steps 1–6, step 8, and Close.
- **Validate:** follow `update-validate.md` (Context Extraction and Validate) read-only. Load `finalize.md` for Review (plus deterministic checks as needed) without editing files, and skip Polish and Close.

## Return Contract

If a person is actually present for review, close interactively and offer fast mode's assumption walkthrough. Otherwise finish with a single JSON payload (omitting keys for absent files).

Set JSON `"status"` to `"complete"` (persisting frontmatter `status: final` on Create/Update), `"partial"` (keeping frontmatter `status: draft` when critical inputs were guessed or open questions remain), or `"blocked"` (when unclear intent yields no file).

- **Always include:** `status`, `intent`, `template`, `assumptions`, `open_questions`, `external_handoffs` (each with `directive`, `tool`, `url`, `status`), plus `reason` when `blocked`.
- **Create adds:** `document`, `companions`.
- **Update adds:** `document`, `companions`, `changes_summary`, `conflicts_with_prior_decisions`.
- **Validate adds:** `document`, `reviews`, `findings_summary` (by severity), `offer_to_update: true`.
