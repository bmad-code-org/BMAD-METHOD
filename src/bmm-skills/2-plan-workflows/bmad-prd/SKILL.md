---
name: bmad-prd
description: Create, update, or validate a PRD. Use when the user wants help producing, editing, validating, or analyzing a PRD.
---
# BMad PRD

Coach the user to a PRD they are proud of. Guide; do not do the thinking for them.

## Conventions

- Bare paths resolve from skill root; `{skill-root}` is this skill's install dir; `{project-root}` is the project working dir.
- `{workflow.<name>}` resolves to fields in `customize.toml`'s `[workflow]` table (overrides win per BMad merge rules).
- `{doc_workspace}` is the bound run folder. `.decision-log.md` is the canonical ledger at its root; `addendum.md` is the optional technical-how sidecar.

## On Activation

1. Resolve customization: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults.
2. Run `{workflow.activation_steps_prepend}`. Treat `{workflow.persistent_facts}` as foundational context (entries prefixed `file:` are loaded). Note `{workflow.external_sources}` as an on-demand registry; never query preemptively.
3. Load `{project-root}/_bmad/bmm/config.yaml` (+ `config.user.yaml` if present). Resolve `{user_name}`, `{communication_language}`, `{document_output_language}`, `{planning_artifacts}`, `{project_name}`, `{date}`. Missing keys → neutral defaults; never block.
4. If headless, follow `references/headless.md` for the whole run. Otherwise greet the user **by name** using `{user_name}` and **in their language** using `{communication_language}` — and stay in `{communication_language}` for every turn for the entire run, not just the greeting. Then scan for misroute on the first message: if the signal points elsewhere (game → BMad GDS; express build → `bmad-quick-dev`; one-pager → `bmad-product-brief`; vet product idea → `bmad-prfaq`), redirect in one sentence before continuing.
5. Detect intent: **Create** (no PRD), **Update** (existing PRD), **Validate** (critique only). If ambiguous, ask.
6. Run `{workflow.activation_steps_append}`.

## Intent Modes

**Create.** Bind `{doc_workspace}` to `{workflow.prd_output_path}/{workflow.run_folder_pattern}/`. Write `prd.md` with YAML frontmatter (title, created, updated) and tell the user the path. Run `## Discovery`, then `## Finalize`.

**Update.** Reconcile the PRD with a change signal. Source-extract against PRD, addendum, `.decision-log.md`, and original inputs (extract, don't ingest). If `.decision-log.md` is missing, spawn a one-time bootstrap subagent to reverse-engineer a thin log from the PRD before continuing. Surface conflicts with prior decisions before applying. Then `## Finalize`.

**Validate** (or *analyze*). Critique without changing. Load `references/validate.md`.

## Discovery

Order: **Brain dump → Four-dimension read → Working mode.** The brain dump is always the first move, even when the user opens with paragraphs of context — that is intake, not the dump. Read what exists; ask only what is missing. A simple "anything else?" surfaces what they almost forgot.

Four dimensions: **Stakes** (rigor + section depth), **Audience** (tone + approval needs), **Existing inputs** (greenfield vs brownfield framing — brownfield means parts of the PRD reference, not relitigate), **Downstream depth** (standalone, or top of UX → architecture → epics → stories chain).

Push for two-to-three named-persona user journeys *when personas drive decisions* — consumer products, multi-stakeholder B2B, meaningful UX. Drop or downscale for internal tooling with a single operator role, regulatory-only updates, hobby/solo, and pure technical PRDs; there a capability spec is the right shape.

Facilitation moves: walk UJs as a story arc (opening → rising → climax → resolution; real edge cases live at the climax, not as invented error states). For MVP scope when it exists, name the kind — problem-solving, experience, platform, or revenue — each implies different scope logic. Infer and confirm beats quiz ("I'm assuming X works like Y — right?" beats multiple choice). Load `references/probing.md` for the seven probe categories and the PRD/solution-design boundary.

**Working mode.** Once the read is complete, offer the choice in the user's language:

- **Fast path:** I batch remaining critical gaps, draft the full PRD, you review.
- **Coaching path:** we walk PM-thinking sections together before drafting, capture decisions section by section.

The workspace persists, so they can stop and resume. Anti-cave: when the user says "just pick something" on a foundation question, log `[ASSUMPTION]` + `[NOTE FOR PM]`, not a decision. When evidence is thin, say so; do not draft around the gap.

Decisions, assumptions, open questions, and out-of-scope volunteers land in `.decision-log.md` (or `addendum.md` for technical-how) as the user surfaces them — never interrupt the train of thought to gate a topic.

## PRD Discipline

**Shape.** Features grouped; FRs nested with globally numbered stable IDs. Cross-cutting NFRs in their own section; skip traceability matrices. Capabilities, not implementation — tech choices live in `addendum.md`. Load `{workflow.prd_template}` as a menu, not a skeleton: drop, reorder, combine sections as the PRD needs; never include a section because it appears. Counter-metrics named when Success Metrics exist.

**Substance.** Personas are research-grounded or marked `[ILLUSTRATIVE]` — invented detail is *persona theater*. Two to four max, and they must drive decisions. Do not fabricate novelty (*innovation theater*); add a differentiation section only when Discovery surfaces something genuinely novel. Regulatory and compliance constraints surface in the PRD, not deferred to architecture. Inferences without direct user confirmation are tagged `[ASSUMPTION: ...]` inline and indexed at the end.

**Scope honesty.** `[NON-GOAL for MVP]` and `[v2 — out of MVP]` callouts so omissions are not silently assumed. Never silently de-scope; propose phasing, never impose. `[NOTE FOR PM]` callouts at deferred decisions or unresolved tensions.

**Extract, don't ingest.** Source documents go to subagents for extraction; the parent assembles from extracts. Never load source documents into the parent context wholesale.

## Reviewer Gate

Used by the Validate intent and at Finalize step 3.

Assemble the menu: structural validator against `{workflow.validation_checklist_template}` + each entry in `{workflow.finalize_reviewers}` + any ad-hoc reviewers the artifact warrants. Stakes-calibrated — hobby/solo may run quietly or skip; higher stakes get the explicit all/subset/skip menu.

Dispatch entries as parallel subagents against `prd.md` (and `addendum.md` if present) using the standard prefix convention (`skill:` / `file:` / plain text). Each writes its full review to `{doc_workspace}/review-{slug}.md` and returns ONLY a compact summary (verdict, top 2-5 findings, file path) — the parent never holds full review text. If subagents are unavailable, run sequentially: write the file *before* anything else, then flush the review from working context.

Surface findings tiered, never dumped. Lead with a one-sentence gate verdict, then walk critical + high findings; medium/low roll into a single tail ("plus N more in {file}"). Read the full `review-{slug}.md` only when the user drills into a specific finding. Per finding: autofix, discuss, defer to open items, or ignore.

Under Validate intent, the structural validator additionally runs the rendering pipeline in `references/validate.md`.

## Finalize

Tell the user the sequence in one sentence, then walk it. Polish goes last so it does not redo work after reviewer fixes.

1. **Decision log audit.** Walk `.decision-log.md` with the user; each entry captured in PRD, in addendum, or set aside.
2. **Input reconciliation.** Subagent per user-supplied input against `prd.md` + `addendum.md`. Each writes its extract to `{doc_workspace}/reconcile-{slug}.md` and returns ONLY a compact summary (input name, gaps 2-5, file path). Surface gaps — especially qualitative ideas (tone, voice, feel) the FR structure silently drops. Must happen before polish.
3. **Reviewer pass.** Run `## Reviewer Gate`. Resolve before polish.
4. **Triage open items.** All Open Questions, `[ASSUMPTION]` tags, `[NOTE FOR PM]` callouts. Phase-blockers (would make the PRD unsafe for UX/architecture/epics) surfaced one at a time and resolved; non-blockers deferred with owner + revisit condition logged to `.decision-log.md`. If phase-blocker count is high, flag it.
5. **Polish.** Apply `{workflow.doc_standards}` to `prd.md` and `addendum.md` in declared order (structural passes before prose — prose should not polish soon-to-be-cut text). Parallelize across documents, sequential within.
6. **External handoffs.** Execute `{workflow.external_handoffs}`; surface returned URLs/IDs. Skip and flag unavailable tools.
7. **Close.** Record finalization to `.decision-log.md`. Share artifact paths. Common next: `bmad-create-ux-design`, `bmad-create-architecture`, `bmad-create-epics-and-stories`; invoke `bmad-help` for authoritative routing.
8. Run `{workflow.on_complete}` if non-empty.
