# Review, Finalize, and Close

Load this reference when `progress.py` emits `next_phase: "finalize"`, or when Update/Validate reaches Review and Finalize. Keep conventions local: `{project-root}` holds `_bmad/`, `{skill-root}` is `bmad-facilitate`, `{run}` holds `{doc}` and companions, and `{scratch}` is the temp directory from `{doc}`'s absolute path hash.

## Depth tiers

Scale Reconciliation, Review, and Polish to the run's scope and stakes (unless the user requests deeper review):

- **Quick** (`fast` mode, single-flow or exploratory runs, lowest stakes): skip reconciliation and `skill:` subagents; verify `done when`, basic readability, and any `file:` or plain-text `{workflow.doc_standards}` directly in one inline pass.
- **Standard** (standalone deliverables, single-unit specs, normal internal or product work): skip per-source reconciliation subagents unless multiple complex sources conflict; run **one combined review-and-polish pass** covering the rubric, fresh-reader check, `{workflow.finalize_reviewers}`, any `file:` or plain-text `{workflow.doc_standards}`, and succinctness/structure clarity. Skip separate back-to-back default `skill:bmad-review` subagents; run extra custom `skill:` standards only if configured.
- **Thorough** (multi-part or high-blast-radius contracts, regulated or contracted stakes, or explicit request): run per-source reconciliation subagents, parallel Review subagents below, and `{workflow.doc_standards}` in order.

## Review

In **Thorough** depth, pick reviewers scaled to the stakes, name them to the user, and allow changes before running; in **Standard**, run one combined review-and-polish reviewer covering `{workflow.finalize_reviewers}` too (or handle inline on small runs); in **Quick**, verify `done when` yourself in one line and skip subagents.

- **Rubric walker:** evaluates `{doc}` and companions against the caller's rubric, else the template's `rubric` (bare `rubric-general` means `{skill-root}/references/rubric-general.md`, default `rubric-general`), plus the template's `done when`.
- **Fresh reader:** reads only `{doc}` and companions, reporting what still blocks acting on it without this conversation (ranked, skipping nitpicks; "nothing important left" is valid).
- **Configured and domain reviewers:** every `{workflow.finalize_reviewers}` entry plus any specialist lens the stakes warrant; never run `{workflow.doc_standards}` here, since they edit during Finalize step 5.

When running Review subagents, launch them in parallel told the stakes and depth, each writing `{scratch}/review-<lens>.md` and returning verdict, top findings, and file path (run sequentially when subagents are unavailable). Lead with a one-sentence verdict and top three fixes, walk critical/high findings one by one (treat unconfirmed user attribution as high), and summarize lower counts by file; fix, discuss, defer to open questions, or drop each finding without inflating scope.

## Finalize

State the sequence and active depth tier in one sentence, then run all nine steps in order (including in fast mode), scaling steps 2, 3, and 5 per **Depth tiers**:

1. **Structural check:** confirm zero `<!-- open -->` markers, leftover placeholders (`TBD`/`TODO`/`FIXME`/`XXX` or unfilled template `{token}`s), or disallowed `forbid_id_prefixes:` remain across `{doc}` and every companion file produced in `{run}`. Verify expected `companions:` files exist and any `## Table of Contents` links match headings. If custom `lint:` is set, expand `{doc}`, `{run}`, and `{project-root}`, run it (skip with a note if missing), and resolve findings.
2. **Reconciliation:** in **Thorough** (or multi-source **Standard** conflicts), run one subagent per user-supplied source to report dropped points, tone, or intent, and surface gaps to the user; otherwise check key source alignment directly.
3. **Review:** apply the chosen **Depth tier** above and settle findings.
4. **Triage:** walk standing `[ASSUMPTION]` tags and open questions; resolve blocking items one at a time and defer non-blockers with owner and revisit condition (flag many blockers as a finding).
5. **Polish:** in **Thorough**, apply `{workflow.doc_standards}` in order — structural clarity before prose, succinctness cutting filler without losing facts, and tables/diagrams for flows or comparisons — running `skill:` passes and applying `file:` or text rules directly. In **Standard** and **Quick**, apply `file:` and plain-text `{workflow.doc_standards}` inline alongside succinctness and table/diagram tightening, avoiding extra `skill:` subagents and adding no unsupported claims. On headless runs or blanket approvals, move remaining `[ASSUMPTION]` tags to the template's assumptions section or a closing `## Assumptions` list naming affected ids/sections.
6. **TOC & re-check:** if `## Table of Contents` exists, rebuild entries from final headings and re-verify headings, links, placeholders, `forbid_id_prefixes:`, and any custom `lint:` hook until clean.
7. **User read:** unless headless, report settled-out sections with reasons, polish changes (if any), and the three lowest-confidence decisions or standing assumptions, then wait for user feedback and apply edits (rerunning step 6 after any edit).
8. **External handoffs:** execute `{workflow.external_handoffs}`.
9. **Close & completion:** perform Close below, then run `{workflow.on_complete}`.

## Close

Set `updated` and `status: final` on `{doc}` and every companion file produced in `{run}` unless a blocking open question keeps `status: draft` (name the blocker). Once `status: final`, strip all `<!-- settled out: ... -->` sections and redo step 6 if a table of contents exists.

Unless `{doc}` targeted a standalone `.md` file or `{workflow.view}` is `"never"` (which disables HTML views globally), build the view when the caller's `view` (else `{workflow.view}`, else the merged template's `view`, else `offer`) is `always`, or `offer` with user consent. Re-sync any earlier HTML view from the final settled contracts before presenting, and offer the host's native artifact/preview tool alongside saving `{doc}` with `.html` replacing `.md`.

The view is the deliverable, built for its reader; `{doc}` is the record behind it:

- **Settle the form first.** Steer from the template's `layout` comment, the caller's or `{workflow.style}` style, and `{design_system}`; where `layout` gives the piece a look of its own (a fictional world, a character's setting), that look wins over `{design_system}`. When none settles the form or the user wants a say, offer two or three short directions (reader + job, centerpiece, look) or quick sketches, let them pick, and offer to save it as default via `bmad-customize`.
- **Author a reader-shaped HTML artifact.** Read `{doc}`, companions, linked local images, the chosen direction, `layout`, `{design_system}`, and any style reference (treating references as design ideas or fixed brand elements, never rigid injection). Use a fresh rendering subagent when context is long or complex; on short, fast runs you may build it directly.
- **Design contract.** Produce one self-contained `.html` file (CSS, JS, and local images inlined; zero external requests) organized around how its reader uses it rather than `{doc}`'s heading order (keep set order for PRDs/specs while adding callouts and diagrams). Regroup sections, turn flows and figures into inline SVGs or infographics, use generated images where available, add helpful interaction (linking internal ID citations to in-page anchors and external URLs directly), and never embed raw markdown to render client-side. When a browser or screenshot tool is available, inspect desktop, mobile, and every slide or view state to fix overflow, clipped text, or broken controls, rebuilding once if it still reads as styled markdown.
- **Fidelity check before presenting.** Compare the HTML beside `{doc}` and companions for two defects: anything a reader would take as fact that `{doc}` does not support, and anything important `{doc}` settled (decision, figure, rule, commitment, or open question) that the view drops or blurs (rewording and visual synthesis are fine). Check inline in **Quick** and **Standard** runs so creative work stays fast; use a separate fresh subagent in **Thorough** depth (or when context is crowded enough to need blind eyes). Fix findings before presenting.

Delete `{scratch}`. Report every produced file (`{doc}`, companions, HTML view) as a clickable link and any omitted sections with their reasons; when no template governed the run, offer `document-template` to capture the structure.

**Next-step lookup:** on interactive runs, when subagents are available and the `bmad` skill is installed, invoke a fresh-context subagent running `bmad` Close-time lookup, passing produced paths, template id, status, `{run}`, container folder, and any status payload passed by the caller, and return its 3–5 plain lines verbatim (no JSON). Without subagents or `bmad`, print the factual status and paths and remind the user to start a fresh chat (or compact) and ask `bmad` what comes next. Headless runs omit plain-line lookup output and finish with the single JSON payload required by `headless.md`.
