# BMad planning knowledge

This document is carried by the `method` module's planning skills — the ones that shape an intent and specify it well enough to build. It describes only those skills. The module's own document covers how to choose a path and how the groups relate.

## The planning skills

- `bmad-spec` — condenses any input into a short spec, and can break a spec into an ordered story list. The entry point for epic-sized (2-10 coding sessions) work and for existing material such as notes, transcripts, or PRDs from elsewhere.
- `bmad-product-brief` and `bmad-prfaq` — two alternative ways to shape a product concept. Use one, never both.
- `bmad-prd` — turns a shaped concept into product requirements.
- `bmad-ux` — records user experience decisions. Belongs after the PRD when a UI is a significant part of the work.
- `bmad-architecture` — records the how-to-build decisions that keep separately built parts consistent. Comes before epics and stories.
- `bmad-create-epics-and-stories` — breaks the PRD and architecture into epics and stories.
- `bmad-sprint-planning` — checks the planning is complete enough to implement and generates the sprint status file. Its status action summarizes sprint state at any time.
- `bmad-preview-ticketing` — preview of the ticket tree: slices an initiative into epics, incepts an epic into a breakdown of stories, spikes, and bugs, refines tickets when pulled, and runs the board on a git-backed store or a tracker. An alternative to `bmad-create-epics-and-stories` plus `bmad-sprint-planning`, not a companion to them.
- `bmad-project-context` — sets up or refreshes the repo's agent instructions. Useful any time, in any path.

## Ordering within planning

For epic-sized work, run `bmad-spec` to pin down the what, tell it to create architecture and/or UX companion files when the situation calls for it, and have it break the spec into stories. No further planning skill is required.

For project-sized work, run `bmad-product-brief` or `bmad-prfaq`, then `bmad-prd`, then `bmad-ux` when the user experience matters, then `bmad-architecture`, then `bmad-create-epics-and-stories`, and finish with `bmad-sprint-planning`.

For one-session work, no planning skill needs to run at all.

When ongoing sprint tracking is detected but sprint state is unclear, use `bmad-sprint-planning`'s status action.

A project environment may hold only a subset of these skills, supporting the user's preferred workflow. Recommend from what is installed and say plainly when a stage of the path has no installed skill.
