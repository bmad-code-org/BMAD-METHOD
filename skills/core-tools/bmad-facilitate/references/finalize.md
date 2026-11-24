# Review, Finalize, and Close

Load this reference when `progress.py` emits `next_phase: "finalize"`, or when Update/Validate reaches Review and Finalize. Keep conventions local: `{project-root}` holds `_bmad/`, `{skill-root}` is `bmad-facilitate`, `{run}` holds `{doc}` and companions, and `{scratch}` is the temp directory from `{doc}`'s absolute path hash.

## Review

Pick reviewers scaled to the stakes, name them to the user, and allow changes before running; at the lowest stakes, check `done when` yourself in one line and skip subagents.

- **Rubric walker:** evaluates `{doc}` and companions against the caller's rubric, else the template's `rubric` (bare `rubric-general` means `{skill-root}/references/rubric-general.md`, default `rubric-general`), plus the template's `done when`.
- **Fresh reader:** reads only `{doc}` and companions, reporting what still blocks acting on it without this conversation (ranked, skipping nitpicks; "nothing important left" is valid).
- **Configured and domain reviewers:** every `{workflow.finalize_reviewers}` entry plus any specialist lens the stakes warrant; never run `{workflow.doc_standards}` here, since they edit during Finalize step 5.

Run reviewers in parallel subagents told the stakes and depth, each writing `{scratch}/review-<lens>.md` and returning verdict, top findings, and file path (run sequentially when subagents are unavailable). Lead with a one-sentence verdict and top three fixes, walk critical/high findings one by one (treat unconfirmed user attribution as high), and summarize lower counts by file; fix, discuss, defer to open questions, or drop each finding without inflating scope.

## Finalize

State the sequence in one sentence, then run all nine steps in order (including in fast mode):

1. **Deterministic checks & lint:** confirm zero `<!-- open -->` markers remain and every expected `companions:` file exists in `{run}`. Run `uv run "{skill-root}/scripts/check_doc.py" "{doc}"` plus each companion and `--forbid-prefix <PREFIX>` for every `forbid_id_prefixes:` item, fixing `forbidden_prefix`, `placeholders`, and `toc` hits. If `lint:` is set, expand `{doc}`, `{run}`, and `{project-root}`, execute it (run `.py` paths via `uv run "<lint>" "{doc}"` + companions, or run the command string), and resolve findings (including any `unresolved_sources`).
2. **Reconciliation:** run one subagent per user-supplied source to report dropped points, tone, or intent, and surface gaps to the user (skip at lowest stakes unless requested).
3. **Review:** name the chosen reviewers, run the Review phase above, and settle findings.
4. **Triage:** walk standing `[ASSUMPTION]` tags and open questions; resolve blocking items one at a time and defer non-blockers with owner and revisit condition (flag many blockers as a finding).
5. **Polish:** apply `{workflow.doc_standards}` in order — structural clarity before prose, succinctness pass cutting filler without losing facts, and tables/diagrams where prose walks flows or comparisons. Invoke `skill:` standards (skipped only at lowest stakes) and apply `file:` or text rules directly, adding no unsupported claims. On headless runs or after blanket approvals, move remaining `[ASSUMPTION]` tags into the template's assumptions section or a closing `## Assumptions` list naming affected ids/sections.
6. **TOC & re-lint:** if `## Table of Contents` exists, rebuild entries from final headings and rerun `check_doc.py` (with companions and `--forbid-prefix`) plus `lint:` until `check_doc.py` (`toc`, `placeholders`, `forbidden_prefix`) and `lint:` issues clear.
7. **User read:** unless headless, report settled-out sections with reasons, polish changes, and the three lowest-confidence decisions, then wait for user feedback and apply edits (rerunning step 6 after any edit).
8. **External handoffs:** execute `{workflow.external_handoffs}`.
9. **Close & completion:** perform Close below, then run `{workflow.on_complete}`.

## Close

Set `updated` and `status: final` unless a blocking open question keeps `status: draft` (name the blocker). Once `status: final`, strip all `<!-- settled out: ... -->` sections and redo step 6 if a table of contents exists.

Unless `{doc}` targeted a standalone `.md` file, build the visual view when merged `view` (fallback `{workflow.view}`, else `offer`) is `always`, or `offer` with user consent (`view = "never"` disables views globally). Whenever the host environment provides a native interactive artifact or preview tool, offer to present it there alongside saving `{doc}` with `.html` replacing `.md`.

Delegate rendering to a fresh subagent reading `{doc}`, companions, linked local images, any template `layout` comment or reference file, and any `{workflow.style}` or template `style` preference (verbal direction, design-system doc, CSS, reference HTML, or screenshot). Treat any reference file as design ideas or fixed brand elements (such as a masthead or palette) to compose creatively around — never rigid value injection.

Have the subagent author a creative, tailored, interactive self-contained HTML artifact (CSS, JS, and local images inlined; zero external requests) fitted to the document's domain and preferences. Keep strict full fidelity — every section, id, decision, metric, table, rule, and open question preserved with zero invented facts — and present it in the host's native artifact tool when chosen.

Delete `{scratch}`. Report every produced file path (`{doc}`, companions, HTML view) and any omitted sections with their reasons; when no template governed the run, offer `document-template` to capture the structure.

**Next-step lookup:** on interactive runs, when subagents are available and the `bmad` skill is installed, invoke a fresh-context subagent running `bmad` Close-time lookup, passing produced paths, template id, status, `{run}`, container folder, and any status payload passed by the caller, and return its 3–5 plain lines verbatim (no JSON). Without subagents or `bmad`, print the factual status and paths and remind the user to start a fresh chat (or compact) and ask `bmad` what comes next. Headless runs omit plain-line lookup output and finish with the single JSON payload required by `headless.md`.
