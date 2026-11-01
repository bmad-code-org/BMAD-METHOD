---
title: ""
template: prototype-plan
version: 1.0.0
description: "A quick build to test an idea, some options or a look and feel."
not_for: "Committed work that needs requirements (`prd`, `prd-light`); deciding whether and why to build (`brief`); one feature for a coding agent (`agent-spec`)."
status: draft
created: ""
updated: ""
---

<!-- purpose: Capture the ask and the goal so a prototype can be built without this conversation. -->

<!-- stance: Keep it as short as the prototype allows. A hobby one-off needs a few open-ended questions; a prototype with more riding on it gets every question it needs, until the user says execute, when you stop asking, tag what is left and finish. Keep technical questions few, or offer them rather than ask them. With no preference and nothing already built, suggest a starter project to build from, checked on the web for what is current. When a large codebase exists, offer `bmad-deep-recon` on a specific question so the build starts from what is true today. Skip Finalize's review and polish unless the user asks for them. -->

<!-- inputs: The ask, the goal and where to build it; the platform and technology when they are not obvious or the work is net new. Only the user knows what they want to learn from it. -->

<!-- writing: About a page for a hobby project, longer only when the answers need it. No requirement ids. -->

<!-- done when: A builder with only this file knows what to build, where, on what, and what it must show, and no open question would stop the build. -->

<!-- next: Once `status` is `final`, ask whether to build now. On yes, invoke `bmad-build-auto` with this file's path and the review depth the Build section names; it stops on a dirty working tree or a branch that does not fit, so check both first and offer to commit this run or make a branch. When it reports back, ask the user to decide on purpose whether to throw the prototype away, keep it or drop the idea; the `bmad` skill gives the route from there. -->

# {title}

## Table of Contents

## Ask and goal
<!-- required. What to build, in the user's words, and what they want to learn or show from it. -->

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

## Questions and answers
<!-- include when: the conversation holds answers the sections above do not. Each question asked with the user's answer. -->

## Build
<!-- required. Opens by saying this is a prototype, to build autonomously with `bmad-build-auto` once the user agrees, stopping as little as possible. Then what it may fake or skip, and the review depth: `none` for a throwaway, `quick` otherwise. -->
