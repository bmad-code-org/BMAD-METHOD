# BMad Method knowledge

This document is carried by every skill in the `method` module. It covers how the module's skills fit together and how to choose a path through them. Skills in this module carry further documents describing their own group; nothing here describes a module other than `method`.

## The method module

A cohesive collection of skills for software development, helping the user turn an intent of any size into working software. Route the user to the smallest path that safely fits the work; never march them through every skill.

The module's skills group into the planning skills that shape and specify work, the delivery skills that implement and check it, and the optional agent personas. Each group documents itself in the skills that carry it, so an install holds a document only for the groups it has.

Routing between skills needs the `bmad` hub skill, which belongs to the `core-tools` module. Without it installed, the paths below still describe the work but nothing recommends the next step.

## Choosing a path

Ask whether one implementation session can reasonably understand, implement, review, and finish the change. Scope is only one signal: high risk, unclear requirements, architectural reach, or coordination between people pushes work up a tier even when it is small.

- **Trivial.** The edit is obvious and low-risk: make it directly and use no BMad skill at all — unless the user asks for BMad, or the change would still benefit from explicit planning and review.
- **One session.** One coherent intent that fits an implementation session: hand it straight to `bmad-build`. No planning skill needs to run first.
- **Epic-sized.** One coherent outcome that needs several sessions: pin down the what with the planning skills, then run one delivery session per story, and judge the result against the spec when the epic completes.
- **Project-sized.** 10-100 coding sessions: take the full planning route, then run each epic like epic-sized work above without re-specifying every epic.

The planning and delivery documents name the specific skills for each tier. When a tier's skills are not installed, say which part of the path this install cannot cover rather than inventing a substitute.

## Answering "what's next?"

Read the state before recommending: which planning artifacts exist, and what the codebase, git history, and/or the user says is done. Presence of a story file with `status: done`, or any other planning or tracking artifact, does not prove completion.

- Mid-path, recommend the next unfinished stage of the chosen path, not a restart.
- When a significant change surfaces midstream, route through the change-assessment skill the delivery document names, then resume at the earliest affected skill once the proposal is approved. Do not replay unaffected work.
- A run is complete when the intent is satisfied, its chosen checks pass, and no chosen review leaves material unresolved findings — not when every skill has been traversed.

## Where things land

Durable specs and their story lists live under `{output_folder}/specs`; planning documents and change proposals under `{planning_artifacts}`; working records, sprint status, reviews, and retrospectives under `{implementation_artifacts}`; implementation in the project working tree; generated QA tests under `{project-root}/tests`; and repository guidance at `{project-root}/AGENTS.md`.

## When this document is not enough

For a `method` question this document and the installed skills cannot answer, fetch `https://docs.bmad-method.org/llms.txt` and follow the links relevant to the question. It indexes the full documentation site and names the source repository, which is the final authority on how anything actually behaves.
