---
title: 'Ways to Build a Skill'
description: 'The approaches Smithy offers: a conversation then a lean build, scaffold and guide, eval-driven, the skill-creator loop, and a skill from session logs.'
sidebar:
  order: 3
---

An approach is the path from an idea to a skill. Every approach starts with the same discovery conversation and execution plan, and ends with the same review, validation, and hand-off, unless noted below. Smithy proposes one in the execution plan. Lean is the default, and you can name another at any time.

| Approach | What happens | Choose it when |
| --- | --- | --- |
| Lean | Smithy writes the smallest skill that does the job, tries it on one real input, and ships it. | You want the skill and will judge it by using it. |
| Scaffold and guide | Smithy lays out the files and leaves the writing to you. | You want to write the skill yourself. |
| Eval-first | Smithy writes the cases first, then builds until they pass. | The output can be checked and you want proof. |
| Skill-creator loop | Smithy drafts, measures with and without the skill, changes it, and tunes the description. | You want to iterate on measured results. |
| From session logs | Smithy finds what you keep asking for in your logs and proposes a skill. | You want to capture work you already do. |

## Lean

Smithy writes the smallest skill that does the job and shows you the draft and description before anything else, while a change is still cheap. If you have a real input, Smithy tries the skill on it once and fixes what the run shows. This is the default, so you only need to say what you want:

> Build me a skill that writes release notes from the pull requests merged since the last tag.

You get a working skill, reviewed and validated, with a trigger eval offered. With no real input to try, Smithy tells you the skill has not run.

## Scaffold and Guide

Use menu code `SCAFFOLD`, or say "scaffold a skill". Smithy creates the folder, the frontmatter, the `bmod.toml`, and the starting files, with placeholders left visible, and tells you where the know-how goes. The checks fail until you replace every `[TODO:` marker.

## Eval-First

Smithy writes test cases from your real requests before the skill exists, confirms them with you, then builds until the skill passes them. Use it when the output can be checked: file transforms, extraction, generated code, fixed steps. Writing style and coaching cannot be graded well, so those skills do better with lean.

> Build it eval-first. Here are three real requests it should handle.

You get the skill, its cases under `evals/` at the repository root, and the run that passed.

## Skill-Creator Loop

This is the loop from Anthropic's skill-creator, using BMad's shapes and eval runner. Smithy drafts the skill, measures it with and without the skill loaded, changes it and measures again, then tunes the description so it fires on the right requests. You see the winning description before it is applied. If you have a skill-creator `evals.json`, `bmad-eval` can convert it.

## The Eval Loop

Eval-first and the skill-creator loop repeat one loop: run the skill and the bare model on the same inputs, grade the outputs and read the transcripts, change one thing, and run again. It stops when every check passes on three runs, or when you say it is good enough. If the skill stays behind the bare model, the model has caught up, and Smithy proposes retiring the skill.

![The eval loop](/diagrams/toolsmith-eval-loop.svg)

## From Session Logs

Smithy reads your past sessions with any agent and proposes skills for the work you keep doing by hand, using the corrections you gave as the know-how. Use menu code `LOGS`, or ask in your own words:

> Look at my sessions from the past few weeks and propose skills that would make my life easier.

You get the ideas your logs support, strongest first, each with what it would do and how it would help. Pick one and Smithy builds it the lean way, or pick none and the list is saved to Smithy's reports folder. When the corrections show a skill you already have falling short, Smithy proposes fixing that skill instead of making a new one.

:::tip[Keep repeating yourself?]
You do not need logs to capture something you do by hand. Say "turn this chat into a skill" or "I keep pasting this prompt", and Smithy mines the conversation first.
:::
