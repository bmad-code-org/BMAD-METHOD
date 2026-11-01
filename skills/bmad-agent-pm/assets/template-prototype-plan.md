---
title: ""
template: prototype-plan
version: 1.0.0
description: "A quick build to test an idea, some options or a look and feel."
not_for: "Committed work that needs requirements (`prd`, `prd-light`); measuring a change with real users (`experiment`); deciding whether and why to build (`brief`); one feature for a coding agent (`agent-spec`)."
rubric: rubric-planning
status: draft
created: ""
updated: ""
---

<!-- purpose: Capture the ask and the goal so a prototype can be built without this conversation. -->

<!-- stance: Keep it as short as the prototype allows. A hobby one-off needs a few open-ended questions; a prototype with more riding on it gets every question it needs, until the user says execute, when you stop asking, tag what is left and finish. Keep technical questions few, or offer them rather than ask them. With no preference and nothing already built, suggest a starter project to build from, checked on the web for what is current. When a large codebase exists, offer `bmad-deep-recon` on a specific question so the build starts from what is true today. Skip Finalize's review and polish unless the user asks for them. Remind the user that a prototype's best use is what it teaches; it need not be what goes to production. -->

<!-- inputs: The ask, the goal and where to build it; the platform and technology when they are not obvious or the work is net new. Only the user knows what they want to learn from it and what result would make them drop it. -->

<!-- writing: About a page for a hobby project, longer only when the answers need it. No requirement ids. -->

<!-- done when: A builder with only this file knows what to build, where, on what, and what it must show; the result that would drop the idea is written down; and no open question would stop the build. -->

<!-- next: Once `status` is `final`, ask whether to build now. On yes, invoke `bmad-build-auto` with this file's path and the review depth the Build section names; it stops on a dirty working tree or a branch that does not fit, so check both first and offer to commit this run or make a branch. When it reports back, ask the user to decide on purpose whether to throw the prototype away, keep it or drop the idea, and write Outcome through an Update. A prototype they like comes back to John, who plans it through the full BMad or `bmad-build` process, so it is hardened with planned quality and testing; the `bmad` skill gives the route from there. -->

# {title}

## Table of Contents

## Ask and goal
<!-- required. What to build, in the user's words; the one question it must answer; and the result that would make the user drop the idea, written before anything is built, because a bar set after the results flatters them. -->

## Timebox
<!-- optional. How much time this is worth, and what happens when it runs out. -->

## Where to build
<!-- required. The folder or repo, new or existing, and the branch. -->

## Platform and technology
<!-- include when: not obvious from where it is built, or the work is net new. Platform, stack and any starter project. -->

## Existing ground truth
<!-- include when: it builds on a large existing codebase. What must hold true about the code, from reading it or from a `bmad-deep-recon` run on a specific question, and where that research lives. -->

## Options to compare
<!-- include when: proving out a few options. Each option and what decides between them. -->

## Look and feel
<!-- include when: testing how a running app looks and feels. The feel to try, any references, and what the user wants to click through. -->

## Validation
<!-- optional. What the user wants done to check the prototype, and by whom. -->

## Decisions
<!-- include when: the conversation settled something the sections above do not. One line per decision with its reason, not a transcript. -->

## Build
<!-- required. Opens by saying this is a prototype, to build autonomously with `bmad-build-auto` once the user agrees, stopping as little as possible. Then what it may fake or skip, and the review depth: `none` for a throwaway, `quick` otherwise. -->

## Outcome
<!-- include when: the prototype has run; written through an Update. The verdict first (proven, disproven or conditional), what it taught, what was faked, the decision to keep, throw away or drop, and a line that the prototype's effort is not an estimate of the real build. -->
