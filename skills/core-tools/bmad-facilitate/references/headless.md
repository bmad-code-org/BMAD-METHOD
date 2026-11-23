# Headless Runs

Load this reference when running headless or autonomous without a live user in the loop.

## Triggers and Boundaries

Headless mode applies when the caller asks for headless execution, the user requests autonomous output ("just give me X"), or no person is present (when unsure, stay interactive). Fast mode is interactive and still asks its batch of questions; headless asks nothing.

## Execution

1. Follow activation, template merge, and Create setup, loading any `guidance` and `methods` files.
2. Fill every section without asking, inferring missing inputs as best guesses tagged `[ASSUMPTION: ...]`; pick reviewers from the template's stakes alone.
3. Load `references/finalize.md` and run Review plus Finalize steps 1–6, step 8, and Close (moving all standing `[ASSUMPTION]` tags out of sections into an assumptions section or closing `## Assumptions` during Polish).

## Return Contract

If a person is actually present for review, close interactively and offer fast mode's assumption walkthrough. Otherwise finish with a single JSON payload (omitting keys for absent files) and set document status to `complete` when standalone, `partial` (`status: draft`) when critical inputs were guessed or open questions remain, or `blocked` when unclear intent yields no file.

- **Always include:** `status`, `intent`, `template`, `assumptions`, `open_questions`, `external_handoffs` (each with `directive`, `tool`, `url`, `status`), plus `reason` when `blocked`.
- **Create adds:** `document`, `companions`.
- **Update adds:** `document`, `companions`, `changes_summary`, `conflicts_with_prior_decisions`.
- **Validate adds:** `document`, `reviews`, `findings_summary` (by severity), `offer_to_update: true`.
