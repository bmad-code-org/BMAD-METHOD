---
name: bmad-spec
description: Distill any intent input into the five-field Spec kernel. Use when the user says "create a spec", "distill this into a spec", "validate this spec", or "update the spec".
---

# BMad Spec

Universal distiller. Takes any intent input — vague idea, brain dump, PRD, GDD, RFC, brief, Slack thread, customer email, meeting transcript — and produces a `spec.md` carrying the five-field kernel: Problem, Capabilities, Constraints, Non-goals, Success signal. Quality scales with input richness; the contract holds.

The operation is input-driven: read the input, produce the Spec, self-validate, present. Headless callers get JSON; interactive users get a conversational close with the spec path and an invitation to address gaps. The Spec is the machine-readable contract every downstream BMad skill consumes (UX, Architecture, Ticketing). PRDs and other ceremony docs are for humans; Specs are for machines.

## Conventions

- Bare paths (e.g. `assets/spec-template.md`) resolve from the skill root.
- `{skill-root}` is this skill's install dir; `{project-root}` is the working dir.
- `{workflow.<name>}` resolves to fields in `customize.toml`.
- `{doc_workspace}` is the bound run folder for this Spec.

## On Activation

1. Resolve customization: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly.
2. Run `{workflow.activation_steps_prepend}`. Treat `{workflow.persistent_facts}` as foundational context (`file:` entries are loaded).
3. Load `{project-root}/_bmad/config.yaml` (and `config.user.yaml` if present), root level and `bmm` section. Resolve `{user_name}`, `{communication_language}`, `{document_output_language}`, `{planning_artifacts}`, `{project_name}`, `{date}`.
4. Detect mode. **Headless** when any of: no TTY, programmatic caller (another skill or non-interactive runner), or the first message pre-supplies all inputs and asks for an artifact path back. **Interactive** otherwise — the normal case when a user is in the conversation. In interactive mode, greet by `{user_name}` in `{communication_language}`, stay in that language, and mention that `bmad-party-mode` and `bmad-advanced-elicitation` are available for deeper exploration on any field.
5. Run `{workflow.activation_steps_append}`.

## Workspace

Where the Spec lands depends on the input:

- **Input is a local file** — write `{input-basename}-spec-{datetime}.md` as a sibling of the source.
- **Input is in-chat prose or a remote source we cannot write next to** — write `{planning_artifacts}/specs/{slug}-spec-{datetime}.md`.
- **No input** — interactive: ask the user to share a file path, paste content, explain the idea in detail, or point to a source. Headless: respond with json containing error code insufficient_intent.

When a `.decision-log.md` is in scope (file-input case, source folder already has one), it is canonical memory — every decision, override, assumption, and rejected alternative captured during the run. When no decision log is in scope, the verdict surfaces in the conversational output (interactive) and the headless JSON only.

## The Operation

Read the input. If there is no input, follow the no-input branch in **Workspace** (ask or block). If the input is itself a prior Spec — or a prior Spec exists at the target sibling path — read it too; the operation becomes an update. Preserve capability IDs, new capabilities get the next unused `CAP-N`, never reuse retired IDs. Otherwise this is a create.

Distill the input into the five-field kernel using `{workflow.spec_template}` as the skeleton. When input is rich (PRD, GDD, RFC, detailed brain dump), extract directly — no elicitation. When input is sparse (a paragraph, a one-line idea), choose: **express** (best-effort distill, every gap becomes an `open_questions[]` entry) or **guided** (walk the five fields with the user one at a time). Headless defaults to express and logs the choice. Interactive asks.

When the user volunteers content that belongs in the wrapper rather than the kernel (a persona detail, a milestone, an architecture choice), capture it to a sibling `addendum.md` rather than pushing back mid-flow. Tell them at the end where it landed.

If the input is genuinely too thin to distill (e.g. "an app for hikers" with no surrounding context), stop and suggest `bmad-prd` (or sibling ceremony skill). This skill distills; it does not coach.

## Spec Law

Every Spec must satisfy these six rules. The operation aims for them; the self-validate sweep enforces them.

1. **Each capability has both `intent` and `success`.** Missing either = not a capability.
2. **Intents describe WHAT, not HOW.** Implementation prescription belongs in the wrapper or downstream architecture.
3. **Constraints actually bend design decisions.** A "constraint" that rules nothing out is decoration.
4. **Non-goals are explicit.** At least one. Absence means downstream skills fill the vacuum.
5. **Success signal is concrete enough to test or demonstrate against.** "Users love it" doesn't qualify.
6. **Capability IDs are stable and unique.** Never reused, never renumbered.

What does NOT belong in a Spec, regardless of input: personas, NFR matrices, journey diagrams, risk registers, milestones, acceptance criteria matrices, traceability tables, implementation prescription, stakeholder approval ceremony. All of that lives in the wrapper.

## Self-Validate

After every create or update, sweep the resulting Spec file against Spec Law before presenting. For each rule, judge whether the Spec passes; for anything that fails or feels weak, attempt to fix it without inventing content the input did not support. Calls you made without direct confirmation become `assumptions[]`; gaps you could not fill become `open_questions[]`. If a `.decision-log.md` is in scope (per **Workspace**), append a one-paragraph verdict to it.

This is judgment, not ceremony — no separate report, no grade tiers, no severity counts. The verdict either reads "ready for downstream" or names what's blocking that. The user sees the verdict, the assumptions, and the open questions in the final output.

## Validate-Only Mode

When the user points the skill at an existing Spec file with no change signal, run the self-validate sweep without modifying anything. Surface findings inline; if a `.decision-log.md` sits alongside the Spec, append the verdict to it. Offer to roll findings into an update.

## Output

**Interactive** — share the Spec file path conversationally. Name the capability count and the verdict in one or two sentences. If `assumptions[]` or `open_questions[]` are non-empty, list them (short — one line each) and invite the user to walk through them. Make clear that addressing them can update the source input (if it was a file), the spec, or both — whichever combination the user prefers. Do not dump JSON. Do not present a wall of numbers.

**Headless** — return JSON per `assets/headless-schemas.md`. Nothing else.

Run `{workflow.on_complete}` if set.

## Post Output

If the user wants to address assumptions or open questions, loop back into the operation with the Spec as input. If they want to update the source input, loop back with that. If they want to update both, loop back with the Spec and overwrite the source file if there is one. If they want to update neither, end the conversation. If there are any udpates to the source, and there is a `.decision-log.md` in scope, append all details of change to the source about the updates to it.
