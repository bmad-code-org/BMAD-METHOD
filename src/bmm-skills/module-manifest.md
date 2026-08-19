---
module: bmm
update_source: github:bmad-code-org/bmad-skills/skills
---

# bmm

bmm connects product planning with implementation and delivery for work ranging
from a bounded change to a planned product increment. Its shipped roster is
`bmad-agent-analyst`, `bmad-agent-architect`, `bmad-agent-dev`,
`bmad-agent-pm`, `bmad-agent-ux-designer`, `bmad-architecture`, `bmad-build`,
`bmad-build-auto`, `bmad-checkpoint-preview`, `bmad-code-review`,
`bmad-correct-course`, `bmad-create-epics-and-stories`,
`bmad-generate-project-context`, `bmad-prd`, `bmad-prfaq`,
`bmad-product-brief`, `bmad-project-context`, `bmad-qa-generate-e2e-tests`,
`bmad-retrospective`, `bmad-spec`, `bmad-sprint-planning`, and `bmad-ux`.
Each skill defines itself; this manifest records only how they fit together.

When the work needs a full planning route, `bmad-product-brief` and
`bmad-prfaq` are alternatives, so do not require both. The resulting intent can
lead to `bmad-prd`, then to `bmad-ux` when user-experience decisions matter, and
to `bmad-architecture` before `bmad-create-epics-and-stories` and
`bmad-sprint-planning`. Skip `bmad-ux` when the change has no material
experience or interface consequences, and skip this longer route whenever
accepted, build-ready intent already supplies the decisions its later work
depends on.

The longer route is not the default for every run. Existing material can enter
at `bmad-spec` once its intent is accepted, and a small change with build-ready
intent can start without first invoking `bmad-product-brief`, `bmad-prfaq`,
`bmad-prd`, `bmad-ux`, `bmad-architecture`,
`bmad-create-epics-and-stories`, or `bmad-sprint-planning`. From either entry,
choose `bmad-build` when the run may pause for decisions; choose
`bmad-build-auto` only when intent is settled enough that an unresolved choice
should block the run. `bmad-generate-project-context` is a compatibility entry
that always hands off to `bmad-project-context`; new routes use
`bmad-project-context` when repository instructions in
`{project-root}/AGENTS.md` are needed by the chosen route.

After implementation, `bmad-code-review` is an optional additional gate, while
`bmad-qa-generate-e2e-tests` is conditional on the accepted testing needs.
`bmad-checkpoint-preview` is conditional on a human walkthrough during or after
implementation. Repeat `bmad-code-review` after material fixes until its
remaining findings no longer affect acceptance. `bmad-retrospective` can follow
a completed epic or the records equivalent work leaves even if it was not run
as an epic; route its findings to
`bmad-correct-course` only when they expose a significant planning or sprint
change. A significant midstream change can take the same route. Resume at the
earliest affected skill only after the `bmad-correct-course` proposal has been
approved and applied, rather than replaying unaffected work.

A bmm run is complete when the selected scope satisfies its acceptance
conditions, its required checks pass, and no chosen review leaves material
unresolved findings; it does not need to traverse every skill. Durable specs
land under `{output_folder}/specs`; planning documents and change proposals
under `{planning_artifacts}`; workflow records and summaries under
`{implementation_artifacts}`; implementation in the project working tree;
generated QA tests under `{project-root}/tests`; and repository guidance at
`{project-root}/AGENTS.md`.
