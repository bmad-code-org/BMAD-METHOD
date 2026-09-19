# BMad delivery knowledge

This document is carried by the `method` module's delivery skills — the ones that implement work and judge whether it is finished. It describes only those skills. The module's own document covers how to choose a path and how the groups relate.

## The delivery skills

- `bmad-build` — one session-sized unit of delivery: clarifies the intent, plans as needed, implements, reviews, and presents. The implementation unit every path shares.
- `bmad-build-auto` — one unattended Build unit; the worker an orchestrated loop dispatches. Do not choose it for attended work.
- `bmad-code-review` — optional extra review of any change, on top of Build's built-in review.
- `bmad-walkthrough` — guided human review of a commit, PR, file, or directory.
- `bmad-qa-generate-e2e-tests` — generates API and end-to-end tests for implemented code.
- `bmad-retrospective` — judges a completed epic as a whole against its spec.
- `bmad-correct-course` — assesses a significant midstream change and proposes where to resume.

## Choosing between the two build skills

`bmad-build` is the default and the right choice for attended work. Risky and foundational stories deserve human attention, so they belong to `bmad-build` even inside a larger run. Once the decisions and patterns are stable, an orchestrated loop dispatching `bmad-build-auto` sessions may also be used.

## After a build

`bmad-code-review` is an optional extra gate, not a required step. Offer `bmad-qa-generate-e2e-tests` when automated coverage is wanted, and `bmad-walkthrough` when a human wants to be walked through the change.

Recommend repeated `bmad-code-review` after material fixes until the remaining findings no longer affect acceptance. Both build skills already have a review step, and each `bmad-code-review` run can take half an hour or more — it pays for itself when it catches real defects, not when it produces a long tail of minor issues. More than two iterations of agentic review on the same change is often a symptom of problems outside the change, such as weak planning or a messy codebase.

When an epic completes, offer `bmad-retrospective`. When an epic — or anything midstream — exposes a significant planning change, route through `bmad-correct-course`, then resume at the earliest affected skill once the proposal is approved; do not replay unaffected work.

A project environment may hold only a subset of these skills. Recommend from what is installed and say plainly when a gate the user asked for has no installed skill.
