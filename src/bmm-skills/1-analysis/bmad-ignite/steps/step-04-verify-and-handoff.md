# Step 4: Verify and Hand Off

## RULES

- Report verification results honestly. A scaffold that does not build is reported as exactly that — never declared "done with minor issues".
- Fix loop is bounded: at most three fix attempts per failing check, then stop and report.
- Fixes here are environment- and scaffold-level only (missing dep, port conflict, env placeholder the build requires). Do not start building product features.

## VERIFY

Run the manifest's checks in order, skipping any whose command is empty (say what you skipped and why it matters):

1. **Build** — run `verify_build` in `{app_root}`. On failure: diagnose, fix, retry (max three attempts).
2. **Boot** — run `verify_dev` in `{app_root}` as a background process. Give it a reasonable startup window, then request `verify_url` (e.g. with `curl`). Any HTTP response demonstrates the app is serving; a connection failure does not. On failure: diagnose (port in use, missing env), fix, retry (max three attempts). Always terminate the dev process afterwards.
3. For `[C]` custom templates without an adopted `bmad-template.md`: discover equivalent commands from the repo's manifest scripts and README; if none are discoverable, skip with a note.

Record the outcome of each check as `passed`, `failed (reason)`, or `skipped (reason)`. If anything failed after three attempts, present the failure output and ask whether to hand off anyway (marking the failure in the artifacts) or stop here.

If every run check passed, commit any verification-driven fixes: `chore: verified scaffold builds and boots`.

## HANDOFF ARTIFACTS

Create `{ignite_workspace}/` and write both artifacts in `{document_output_language}`:

1. **`brief.md`** — seed the standard brief from `assets/ignite-brief-template.md`, filled from the step 1 intent. Mark unknowns as open questions; do not pad. This is a starting point for `bmad-prd` (or a deeper `bmad-product-brief` pass), not a finished brief.
2. **`architecture-seed.md`** — from `assets/architecture-seed-template.md`, filled with the chosen template's decided stack, the env variables collected in step 3 (names and purpose, never values), pending bootstrap items, the manifest's `## Agent Notes` (the conventions implementation agents must follow), and the verification record. Downstream planning and architecture agents treat its **Decided** section as settled — the scaffold already implements those choices.

## PRESENT AND ROUTE

Tell the user, in this order:

1. What is running: app location, template used, how to start it (`verify_dev` command), and the verification record.
2. What they must do before the app is fully functional: each pending env variable or bootstrap note, with the template's `env` guidance links.
3. Where the handoff artifacts are.
4. Next step: invoke `bmad-prd` — it will pick up `brief.md` and `architecture-seed.md` from planning artifacts. Mention `bmad-generate-project-context` as a quick optional follow-up so implementation agents inherit the template's conventions.

Execute `{workflow.on_complete}` if non-empty. The workflow ends here.
