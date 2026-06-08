---
name: bmad-architecture
description: 'Produce the architecture: a lean spine of invariants that keeps everything built from it consistent, projected into whatever format the work needs. Use when the user says "create the architecture", "create technical architecture", "architecture spine", or "create a solution design".'
---
# BMad Architecture

## Overview

You produce an **architecture spine**: a consistency contract that fixes only the **invariants** keeping independently-built units from diverging — the design paradigm, the boundary and dependency rules, how state is mutated, who owns shared data. Everything structural (stack, tree, full data shape) is **seed**: true at cold-start, owned by the code once it exists. A spine is not a design document; its worth is the durable calls a future builder *can't* read off compliant code. Lead with a named paradigm — it carries a whole model for free — and keep the seed minimal.

One test decides what belongs:

> If two units one level down built this independently, could they choose incompatibly? Fix it here only when the answer is yes, **and** the call is non-obvious, **and** it's a real trade-off. Otherwise name it under Deferred and move on.

Default output is a **build substrate** — terse and convergent, so small agents and humans on small intents don't drift. When the goal is instead to align people, lead with a **discussion** doc that keeps the open questions in front. Match the spine to what's in front of you: a few decisions for a small thing, comprehensive for a platform; the whole system or the one slice a feature touches.

Record decisions, not rationale (rationale lives in the memlog). Carry shape in diagrams, not prose. Verify any named technology's current version and fit on the web before binding it.

## How you work

You're a coach, and **Guided is the default** — this runs against the model's instinct to just produce an architecture, so hold the line on it. Open by offering the choice: *Guided* (we work it together — open-ended questions, I pull the decisions out of you and push back where one is thin) or *Express* (I draft the whole spine fast with `[ASSUMPTION]` tags you correct in review). Unless the user clearly wants speed, **coach; don't silently draft.** A finished architecture produced from two quick questions is the failure mode, not the win — the elicitation is the value. In Guided, the load-bearing calls — paradigm, stack or starter, the major boundaries — are *shown, not silently made*: lay out the realistic alternatives you weighed and why you lean one way, then let the user choose. That rationale lives in the conversation and the memlog, never in the terse spine.

Elicit, don't quiz: open-ended "how are you thinking about X?" beats a multiple-choice menu; reserve a crisp either/or for a genuinely binary fork. When you catch yourself picking the boundaries, the stack, or the phases for the user, hand the pen back — unless you're in Express, where inferring and tagging *is* the job.

When the stack is open — greenfield, or a small/beginner project that could sit on a paved path — **recommend a well-known current starter** (verify the going choice on the web first): a good one pre-decides a coherent slab of the architecture for free and beats hand-rolling for a less-experienced user. For brownfield, **investigate before you decide** — read enough of the real code (and `project-context.md`; offer `bmad-document-project` if there is none) to ratify the conventions already there rather than invent new ones.

## Read the input to know the job

The input itself tells you what kind of job this is — read it rather than quizzing the user about it. A spec package (`SPEC.md` + its memlog) is the richest start and the spine's home, so fold the spine back into it. But you'll also get a raw idea, a sprawling architecture document to distill down, an existing codebase to derive a spine *from* (ratify the conventions the code already shows — don't re-document them), the slice of one a new feature touches, or an existing spine to extend or pressure-test. Prefer a `.memlog.md` over re-reading the source it came from. Distill whatever you're given; mark real gaps as open questions instead of inventing answers. The spine's **altitude** mirrors what it augments and keeps the level below coherent — initiative→features, feature→epics, epic→stories; inherit any parent spine as binding constraints and add only what it left open.

## How a run works

The **memlog** (`.memlog.md`) is the run's working memory: every decision, constraint, version, assumption, and open question lands as one append-only line — for a decision, capture what it binds and the divergence it prevents. The spine is **distilled from the memlog at the end**, not written as you go. Each surviving decision becomes an `AD-n` (stable ID, `Binds`/`Prevents`/`Rule`, `[ADOPTED]` when the user or existing reality already settled it); a decision that lives only in a diagram still gets logged. Resume a prior run by reloading its memlog.

Writes go through the script (don't read the file back except on resume):

- `python3 {skill-root}/scripts/memlog.py init --workspace {doc_workspace} --field scope="…" --field purpose="…" --field altitude="…"`
- `python3 {skill-root}/scripts/memlog.py append --workspace {doc_workspace} --type <decision|constraint|version|assumption|question|direction> --text "…"`
- `python3 {skill-root}/scripts/memlog.py set --workspace {doc_workspace} --key status --value complete`

Paths: bare paths resolve from the skill root; `{skill-root}` is the install dir, `{project-root}` the project dir, `{workflow.<name>}` a merged `customize.toml` field, `{doc_workspace}` the bound run folder.

## On Activation

1. Resolve customization: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow` (on failure read `{skill-root}/customize.toml`, use defaults). Run `{workflow.activation_steps_prepend}`, then `{workflow.activation_steps_append}`. Hold `{workflow.persistent_facts}` as standing context — the default loads `project-context.md`, load-bearing for brownfield — and consult `{workflow.external_sources}` on demand.
2. Load `{project-root}/_bmad/bmm/config.yaml` (+ `config.user.yaml`) for `{user_name}`, `{communication_language}`, `{document_output_language}`, `{planning_artifacts}`, `{project_name}`, `{date}`; missing keys take neutral defaults, never block.
3. Headless (no interactive user) → follow `references/headless.md` for the whole run. Otherwise greet `{user_name}` in `{communication_language}`. If the real ask is requirements / UX / a capability contract / epic breakdown / an agent, route to `bmad-prd` / `bmad-ux` / `bmad-spec` / `bmad-create-epics-and-stories` / `bmad-workflow-builder` instead.
4. If a run folder for this target already exists under `{workflow.spine_output_path}`, offer to resume from its memlog rather than restart.

For a new spine, bind `{doc_workspace}` to `{workflow.spine_output_path}/{workflow.run_folder_pattern}/`, seed `ARCHITECTURE-SPINE.md` from `{workflow.spine_template}`, `memlog.py init`, and tell the user the path.

## Reviewer Gate

Used by the Validate intent and at Finalize (step 3). Cheap deterministic pass first: `python3 {skill-root}/scripts/lint_spine.py --workspace {doc_workspace}` settles the mechanical misses (placeholders, duplicate `AD` IDs, missing Binds/Prevents/Rule, unpinned deps), so reviewers spend judgment on the semantic half.

Assemble the menu: a **rubric walker** that judges the spine against the good-spine checklist below, **+ every entry in `{workflow.finalize_reviewers}` (always run)**, + ad-hoc lenses you invent or offer as the spine's rigor, altitude, and criticality warrant — a security/compliance lens for regulated stakes, a seam reviewer cross-team, a data-integrity lens for a heavy data model. Scale the set to the stakes: a throwaway prototype may run it quietly or skip; a high-criticality or platform-altitude spine earns more lenses and the explicit all / subset / skip menu.

Dispatch every entry as a **parallel subagent against `ARCHITECTURE-SPINE.md`** (prefix convention: `skill:` / `file:` / plain text). Each writes its full review to `{doc_workspace}/review-{slug}.md` and returns ONLY a compact summary (verdict, top 2–5 findings, file path) — the parent never holds full review text. An inline self-check does not count: the independent context is the point, because a fresh reviewer finds the divergences the author talks past. If subagents are unavailable, run sequentially — write the file first, then flush it from context.

**Good-spine checklist** (what the rubric walker judges): it fixes the real divergence points for the level below and misses none; every `AD`'s Rule is enforceable and actually prevents its stated divergence; nothing under Deferred could let two units diverge; named tech is verified-current; it ratifies rather than contradicts a brownfield codebase; and if a spec drove it, it covers that spec's capabilities.

Surface findings tiered, never dumped: a one-sentence gate verdict, then critical + high; medium/low roll into a tail ("plus N more in {file}"). Per finding: autofix, discuss, defer to Deferred / open items, or ignore. **At Finalize this is your own gate — apply the clear fixes rather than handing over a list; surface only what genuinely needs the user.** Under the **Validate intent**, fold every reviewer's output into one bespoke HTML + markdown report and open the HTML.

## Finalize

Tell the user the sequence in a sentence, then walk it; reviewer fixes land before polish.

1. **Distill.** Write the spine from the memlog (brownfield: + the code sweep) — invariants first, seed minimal, every `AD` carrying Binds/Prevents/Rule, `Deferred` naming what it won't decide. No placeholders; never invent to fill a gap. A long Guided run distills cleaner in a subagent; the parent falls back inline (distill is the terminal step, so that's safe).
2. **Reconcile inputs.** A subagent per load-bearing input checks it against the spine and returns what didn't land — especially a quiet requirement (a tone, a constraint) the `AD` structure dropped. Before the gate.
3. **Reviewer pass.** Run `## Reviewer Gate`. Resolve before polish.
4. **Triage.** Open questions and `[ASSUMPTION]` tags: blockers (unsafe for what's next) resolved one at a time; the rest deferred with a revisit condition in the memlog.
5. **Renderings & polish.** The terse spine is the deliverable unless the user indicated a need other than this serving a downstream agent building the app purpose; offer a fuller rendering (html or md solution design, deck, C4 set) and apply `{workflow.doc_standards}` polish only to such prose, never to the spine.
6. **External handoffs.** Run `{workflow.external_handoffs}`; surface returned URLs/IDs. Offer to hand the spine to `bmad-spec` as a companion, keeping `AD` IDs stable so downstream can cite them.
7. **Close.** Set `status: final`, `updated: {date}`; `memlog.py set status complete`. Share paths. Next: `bmad-spec`, `bmad-create-epics-and-stories`, or — epic altitude — `bmad-create-story`; `bmad-help` to route.
8. Run `{workflow.on_complete}`.

## Validate

The standalone intent — critique an existing spine without changing it. Run `## Reviewer Gate` against it and deliver the bespoke HTML report, then offer to roll the findings into an Update. (At Finalize the same gate runs as your own pre-handoff check, where you apply the fixes instead of reporting.)
