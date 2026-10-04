# Toolsmith knowledge

This document covers the skills of the `toolsmith` module: what each one gives the user, when to recommend it, and what to offer next.

## What the module is

Toolsmith is for people who author skills, agents and modules, not for people who only use them. It replaces the BMad Builder module. One agent, Smithy, builds and changes BMad content from a conversation; one skill, `bmad-eval`, measures whether the result works. Recommend Toolsmith whenever the user wants to make, change or judge a skill, whatever they call it: a skill, an agent, a persona, a workflow, a custom command, a prompt they keep pasting, a module.

## The skills

| Skill | For | When to recommend |
|---|---|---|
| `bmad-toolsmith` | Smithy, the Toolsmith. Builds a skill, agent or module from a conversation about what it is for, who uses it and what it produces. Shows a read-back (name, description, shape, approach, location, files) and writes nothing until the user approves it; the user can change the plan at any point. Picks the shape as a conclusion of the conversation, never as a menu. After a build the quality lenses run on their own and Smithy fixes what they find before handing over. Also edits, converts, reviews, packages, validates and migrates skills that exist, and offers evals at the end of every build. | Any request to create or change a skill, agent, persona or module; to review or judge one; to package skills; to convert something from another tool; to migrate an old module. Ask for Smithy by name or describe the thing wanted. |
| `bmad-eval` | Runs a skill's evals and reports what they show, in four modes: baseline (does the skill beat the bare model), variant (does a stripped or prior version do as well), quality (does the output meet its rubric), trigger (does the description fire on the right requests and stay quiet on the rest). Smithy reaches it from his menu and at the end of a build, so a user rarely needs to call it directly. | The user asks whether a skill works, is worth keeping, triggers reliably, or whether a change made it better or worse. Call it directly when the user has a skill and cases already and wants numbers, not a conversation. |

## Start here

- "Make me a skill", "build an agent", "I need a module", "create a persona", "write me a custom command" → `bmad-toolsmith`. Smithy asks what it is for first; the user does not need to know what shape they want (`help/shapes.md`, `help/approaches.md`).
- "Turn this chat into a skill", "we keep doing this by hand", "I keep pasting this prompt" → `bmad-toolsmith`. The conversation is the material; Smithy mines it before asking anything.
- "Make a skill from my sessions", a transcript, session logs → `bmad-toolsmith`, the from-logs approach.
- "My skill does not trigger", "it fires on the wrong things" → `bmad-toolsmith` for the fix, or `bmad-eval` in trigger mode when the user wants the measurement first. A trigger eval, not a rewrite by feel, settles it (`help/evals.md`).
- "Is this skill any good", "review this skill", "how could it be smaller" → `bmad-toolsmith`, review mode. It writes a report of advice; nothing fails or blocks (`help/modes.md`).
- "Does my skill actually help", "is it worth keeping", "did my change make it better" → `bmad-eval`, baseline or variant mode (`help/evals.md`).
- "Package these", "make this a module", "ship these together" → `bmad-toolsmith`, package mode.
- "I have an old module with `module.yaml`", a setup skill, a help CSV → `bmad-toolsmith`, migrate mode. It shows the plan and waits for approval before changing anything.
- "Convert my Cursor rule", "turn my GPT into a skill", "port this slash command" → `bmad-toolsmith`, convert mode.
- "Is this a valid bmod", "check my skill" → `bmad-toolsmith`, validate mode.
- "Fix", "change", "extend", "add a step to" an existing skill → `bmad-toolsmith`, edit mode.

## When not to recommend it

- Implementing application code, a feature or a bug fix is `bmad-build`, even when the user says "build".
- A one-off request needs no skill. When the user wants something done once, do it; Smithy himself asks whether a skill is warranted and says so when it is not.
- Running or using an installed skill is not Toolsmith work; invoke that skill.
- Questions about BMad itself go to the `bmad` skill.

## Where things land

Smithy proposes where a new skill goes in the read-back and the user confirms or changes it: the project's `skills/` source folder when the project is a skill repo, otherwise the folder the user's agent reads skills from, so the skill is live as soon as it is written, or the user's own skills folder when it is for them everywhere. Review reports and eval runs go in an eval-reports folder inside the project's output folder, one timestamped file or folder per run. Both locations can be overridden in the skills' customization files; the module asks no setup questions. At the end of a build Smithy tells the user where the skill is and whether it is already live.

## After a skill finishes

| Just finished | Offer next |
|---|---|
| Smithy built a skill | The lenses have already run and their defects are fixed; Smithy said what changed. Next: the trigger eval he offers, then one real request to try. A baseline eval when they want proof the skill beats the bare model. |
| Smithy edited, packaged or migrated a skill the user owns | A review, since the lenses do not run unasked over a skill Smithy did not write. Then the trigger eval if the description changed. |
| A review report | Edit mode for the findings the user accepts. The report is advice; the user picks. |
| A trigger eval with failures | Smithy revises the description from the failures and runs it again (`help/evals.md`). |
| A baseline the skill no longer wins | Retire the skill or rethink it; patching a skill the bare model matches is wasted work. |
| A migration | It converts in place, then validates and ships. Offer setup next, since the module's config questions may have changed. |

## More detail

Each topic file below sits in this folder and goes deeper on one subject. Read one only when the question is about that subject, using the path the knowledge script lists for it.

| Topic file | Read when the user asks about |
|---|---|
| `help/shapes.md` | What kinds of thing Smithy can build: plain skill, agent, memory agent, rendered skill, script-backed utility, single-skill and multi-skill module; which one their need lands in. |
| `help/approaches.md` | How a build runs: lean, scaffold and guide, eval-first, the skill-creator loop, from session logs; which fits the user's situation. |
| `help/modes.md` | Working on a skill that exists: edit, convert, review, package, validate, migrate; what each does and the phrase that reaches it. |
| `help/evals.md` | `bmad-eval` in depth: what each mode answers, what a trigger eval is, why near misses matter, how many runs, where runs land. |
| `help/naming.md` | What to call a skill or module: why a prefix of their own, what `bmad-` means, how agents and module records are named. |

## When this document is not enough

For a `toolsmith` question this document, its topic files, and the installed skills cannot answer, fetch the documentation site at `https://docs.bmad-method.org/` and follow the Toolsmith pages relevant to the question. The source repository it links to is the final authority on how anything actually behaves.
