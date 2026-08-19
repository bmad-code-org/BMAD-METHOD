---
module: core
update_source: github:bmad-code-org/BMAD-METHOD/skills
---

# core

core skills support work in any module and can be used in any combination,
especially when the work benefits from exploration, evidence, multiple
perspectives, refinement, review, or persistent adaptation. Its shipped roster is `bmad`,
`bmad-advanced-elicitation`, `bmad-brainstorming`, `bmad-customize`,
`bmad-deep-recon`, `bmad-forge-idea`, `bmad-party-mode`, and `bmad-review`.
Each skill defines itself; this manifest records only how they fit together.

There is no required first skill. `bmad` can orient a run across whichever
module skills are installed and is revisited after package changes, but it is
not a mandatory first step in every route. Work that begins without a settled
direction can move from `bmad-brainstorming` into `bmad-forge-idea`, with
`bmad-deep-recon` before or after either when outside evidence could change the
choice. Skip `bmad-brainstorming` when candidate directions already exist, and
skip `bmad-deep-recon` when additional evidence would not affect the decision.
A run may instead begin directly with `bmad-customize` when the work is to
change behavior that should persist, or bring in `bmad-party-mode` at any point
where several perspectives are more useful than a single route.

After another skill produces a draft, decision, or plan,
`bmad-advanced-elicitation` and `bmad-review` are optional gates rather than
mandatory successors. Repeat `bmad-advanced-elicitation` when a revision
exposes unresolved assumptions, and repeat `bmad-review` after material changes
until its remaining findings no longer affect the stated acceptance condition.
Skip either gate when the artifact is low-risk and already meets that condition.

A core run is complete when its selected outcome meets the stated acceptance
condition and no chosen refinement or review has material unresolved findings;
completion never requires visiting the full roster or producing a durable
artifact. Durable outputs land at the configured
`{output_folder}/brainstorming`, `{output_folder}/forge`, and
`{output_folder}/party-mode` locations; research lands at
`{planning_artifacts}/research`, or `{output_folder}/research` in core-only use
when bmm configuration is absent; and persistent adaptations land at
`{project-root}/_bmad/custom`.
