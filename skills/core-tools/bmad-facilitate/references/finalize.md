# Review, Finalize, and Close

Load this reference when `progress.py` emits `next_phase: "finalize"`, or when Update/Validate reaches Review and Finalize. Keep conventions local: `{project-root}` holds `_bmad/`, `{skill-root}` is `bmad-facilitate`, `{run}` holds `{doc}` and companions, and `{scratch}` is the temp directory from `{doc}`'s absolute path hash.

## Depth tiers

Scale Reconciliation, Review, and Polish to the run's scope and stakes (unless the user requests deeper review):

- **Quick** (`fast` mode, single-flow or exploratory runs, lowest stakes): skip reconciliation subagents, verify `done when` and basic readability yourself in one pass with no subagents, and edit directly without running `{workflow.doc_standards}` subagents.
- **Standard** (standalone deliverables, single-unit specs, normal internal or product work): skip per-source reconciliation subagents unless multiple complex sources conflict, run **one combined review-and-polish pass** covering the rubric, fresh-reader check, and succinctness/structure clarity, and skip separate back-to-back `{workflow.doc_standards}` subagents.
- **Thorough** (multi-part or high-blast-radius contracts, regulated or contracted stakes, or explicit request): run per-source reconciliation subagents, parallel Review subagents below, and `{workflow.doc_standards}` in order.

## Review

In **Thorough** depth, pick reviewers scaled to the stakes, name them to the user, and allow changes before running; in **Standard**, run one combined review-and-polish reviewer (or handle inline on small runs); in **Quick**, verify `done when` yourself in one line and skip subagents.

- **Rubric walker:** evaluates `{doc}` and companions against the caller's rubric, else the template's `rubric` (bare `rubric-general` means `{skill-root}/references/rubric-general.md`, default `rubric-general`), plus the template's `done when`.
- **Fresh reader:** reads only `{doc}` and companions, reporting what still blocks acting on it without this conversation (ranked, skipping nitpicks; "nothing important left" is valid).
- **Configured and domain reviewers:** every `{workflow.finalize_reviewers}` entry plus any specialist lens the stakes warrant; never run `{workflow.doc_standards}` here, since they edit during Finalize step 5.

When running Review subagents, launch them in parallel told the stakes and depth, each writing `{scratch}/review-<lens>.md` and returning verdict, top findings, and file path (run sequentially when subagents are unavailable). Lead with a one-sentence verdict and top three fixes, walk critical/high findings one by one (treat unconfirmed user attribution as high), and summarize lower counts by file; fix, discuss, defer to open questions, or drop each finding without inflating scope.

## Finalize

State the sequence and active depth tier in one sentence, then run all nine steps in order (including in fast mode), scaling steps 2, 3, and 5 per **Depth tiers**:

1. **Deterministic checks & lint:** confirm zero `<!-- open -->` markers remain and every expected `companions:` file exists in `{run}`. Run `uv run "{skill-root}/scripts/check_doc.py" "{doc}"` plus each companion and `--forbid-prefix <PREFIX>` for every `forbid_id_prefixes:` item, fixing `forbidden_prefix`, `placeholders`, and `toc` hits. If `lint:` is set, expand `{doc}`, `{run}`, and `{project-root}`, execute it (run `.py` paths via `uv run "<lint>" "{doc}"` + companions, or run the command string), and resolve findings (including any `unresolved_sources`).
2. **Reconciliation:** in **Thorough** (or multi-source **Standard** conflicts), run one subagent per user-supplied source to report dropped points, tone, or intent, and surface gaps to the user; otherwise check key source alignment directly.
3. **Review:** apply the chosen **Depth tier** above and settle findings.
4. **Triage:** walk standing `[ASSUMPTION]` tags and open questions; resolve blocking items one at a time and defer non-blockers with owner and revisit condition (flag many blockers as a finding).
5. **Polish:** in **Thorough**, apply `{workflow.doc_standards}` in order — structural clarity before prose, succinctness pass cutting filler without losing facts, and tables/diagrams where prose walks flows or comparisons — invoking `skill:` standards and applying `file:` or text rules directly. In **Standard** and **Quick**, handle any remaining succinctness and table/diagram tightening directly without spawning extra `{workflow.doc_standards}` subagents, adding no unsupported claims. On headless runs or after blanket approvals, move remaining `[ASSUMPTION]` tags into the template's assumptions section or a closing `## Assumptions` list naming affected ids/sections.
6. **TOC & re-lint:** if `## Table of Contents` exists, rebuild entries from final headings and rerun `check_doc.py` (with companions and `--forbid-prefix`) plus `lint:` until `check_doc.py` (`toc`, `placeholders`, `forbidden_prefix`) and `lint:` issues clear.
7. **User read:** unless headless, report settled-out sections with reasons, polish changes (if any), and the three lowest-confidence decisions or standing assumptions, then wait for user feedback and apply edits (rerunning step 6 after any edit).
8. **External handoffs:** execute `{workflow.external_handoffs}`.
9. **Close & completion:** perform Close below, then run `{workflow.on_complete}`.

## Close

Set `updated` and `status: final` on `{doc}` and every declared `companions:` file unless a blocking open question keeps `status: draft` (name the blocker). Once `status: final`, strip all `<!-- settled out: ... -->` sections and redo step 6 if a table of contents exists.

Unless `{doc}` targeted a standalone `.md` file, build the visual view when merged `view` (fallback `{workflow.view}`, else `offer`) is `always`, or `offer` with user consent (`view = "never"` disables views globally). If any HTML view or promoted deliverable was drafted earlier while contracts were still changing, regenerate or re-sync it from the final settled contracts so status badges, tokens, and copy match before presenting. Whenever the host environment provides a native interactive artifact or preview tool, offer to present it there alongside saving `{doc}` with `.html` replacing `.md`.

Delegate rendering to a fresh subagent reading `{doc}`, companions, linked local images, any template `layout` comment or reference file, and any `{workflow.style}` or template `style` preference (verbal direction, design-system doc, CSS, reference HTML, or screenshot). Treat any reference file as design ideas or fixed brand elements (such as a masthead or palette) to compose creatively around — never rigid value injection.

Have the subagent author a creative, tailored, interactive self-contained HTML artifact (CSS, JS, and local images inlined; zero external requests) fitted to the document's domain and preferences. Keep strict full fidelity — every section, id, decision, metric, table, rule, and open question preserved with zero invented facts — and present it in the host's native artifact tool when chosen.

Delete `{scratch}`. Report every produced file path (`{doc}`, companions, HTML view) and any omitted sections with their reasons; when no template governed the run, offer `document-template` to capture the structure.

**Next-step lookup:** on interactive runs, when subagents are available and the `bmad` skill is installed, invoke a fresh-context subagent running `bmad` Close-time lookup, passing produced paths, template id, status, `{run}`, container folder, and any status payload passed by the caller, and return its 3–5 plain lines verbatim (no JSON). Without subagents or `bmad`, print the factual status and paths and remind the user to start a fresh chat (or compact) and ask `bmad` what comes next. Headless runs omit plain-line lookup output and finish with the single JSON payload required by `headless.md`.
