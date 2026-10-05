# Toolsmith knowledge

This document covers the skills of the `toolsmith` module: what each one gives the user, when to recommend it, and what to offer next. The topic files in this folder go deeper; each is small and named for its subject, so read the one the question is about.

## What the module is

Toolsmith is for people who author skills, agents and modules, not for people who only use them. It replaces the BMad Builder module. One agent, Smithy, builds and changes BMad content from a conversation; one skill, `bmad-eval`, measures whether the result works. Recommend Toolsmith whenever the user wants to make, change or judge a skill, whatever they call it: a skill, an agent, a persona, a workflow, a custom command, a prompt they keep pasting, a module.

## What it needs

Smithy runs inside a project where `bmad` is set up (`_bmad/` exists); without it he offers setup first. `uv` must be installed, since every script runs as `uv run`. A skill Smithy writes straight into the folder the user's agent reads from is live at once but is not tracked by the skills CLI, so updates to it are the user's own; one installed later from a repo with `npx skills add` is tracked.

## The skills

| Skill | For | When to recommend |
|---|---|---|
| `bmad-toolsmith` | Smithy, the Toolsmith. Builds a skill, agent or module from a conversation about what it is for, who uses it and what it produces. Shows a read-back (name, description, shape, registration, approach, location, files) and writes nothing until the user approves it; every line can be changed. Picks the shape as a conclusion of the conversation, never as a menu. After a build the quality lenses run on their own and Smithy fixes what they find before handing over. Also edits, converts, reviews, packages, validates and migrates skills that exist, and offers evals at the end of every build. | Any request to create or change a skill, agent, persona or module; to review or judge one; to package skills; to convert something from another tool; to migrate an old module. Ask for Smithy by name or describe the thing wanted. |
| `bmad-eval` | Runs a skill's evals and reports what they show, in four modes: baseline (does the skill beat the bare model), variant (does a stripped or prior version do as well), quality (does the output meet its rubric), trigger (does the description fire on the right requests and stay quiet on the rest). Smithy reaches it from his menu and at the end of a build, so a user rarely needs to call it directly. | The user asks whether a skill works, is worth keeping, triggers reliably, or whether a change made it better or worse. Call it directly when the user has a skill and cases already and wants numbers, not a conversation. |

## Start here

- "Make me a skill", "build an agent", "I need a module", "create a persona", "write me a custom command" → `bmad-toolsmith`. Smithy asks what it is for first; the user does not need to know what shape they want (`help/shapes.md`, `help/approaches.md`).
- "Turn this chat into a skill", "we keep doing this by hand", "I keep pasting this prompt" → `bmad-toolsmith`. The conversation is the material; Smithy mines it before asking anything.
- "Make a skill from my sessions", a transcript, session logs → `bmad-toolsmith`, the from-logs approach.
- "My skill does not trigger", "it fires on the wrong things" → `bmad-toolsmith` for the fix, or `bmad-eval` in trigger mode when the user wants the measurement first. A trigger eval, not a rewrite by feel, settles it (`help/evals.md`).
- "Is this skill any good", "review this skill", "how could it be smaller" → `bmad-toolsmith`, review mode. Findings in chat and a markdown file; nothing fails or blocks (`help/modes.md`, `help/how-to-review.md`).
- "Does my skill actually help", "is it worth keeping", "did my change make it better" → `bmad-eval`, baseline or variant mode (`help/evals.md`).
- "Which agent runs the eval", "can I run evals from Codex", "is the eval sandboxed" → `help/evals.md`, the harness section.
- "Package these", "make this a module", "ship these together" → `bmad-toolsmith`, package mode.
- "I have an old module with `module.yaml`", a setup skill, a help CSV → `bmad-toolsmith`, migrate mode. It shows the plan and waits for approval before changing anything.
- "Convert my Cursor rule", "turn my GPT into a skill", "port this slash command", "make this skill work with bmad" → `bmad-toolsmith`, convert mode (`help/how-to-convert-external.md`).
- "Is this a valid bmod", "check my skill" → `bmad-toolsmith`, validate mode.
- "Fix", "change", "extend", "add a step to" an existing skill → `bmad-toolsmith`, edit mode.
- "What makes a good skill", "how long should a skill be", "what is progressive disclosure", "how do I write the description" → the `craft-*` topics below; answer from them, and offer Smithy's review mode on a skill they have.
- "Should this be its own module", "how do I add a skill to the method", "what does registering with bmad give me" → `help/registration.md` and `help/how-to-add-to-module.md`.
- "Where is the official spec", "how does Claude Code / Codex / Cursor load skills" → `help/references.md`.

## When not to recommend it

- Implementing application code, a feature or a bug fix is `bmad-build`, even when the user says "build".
- A one-off request needs no skill. When the user wants something done once, do it; Smithy himself asks whether a skill is warranted and says so when it is not. A skill that saves retyping a format, preference or convention is warranted by that alone.
- Running or using an installed skill is not Toolsmith work; invoke that skill.
- Questions about BMad itself go to the `bmad` skill.

## Where things land

Smithy proposes where a new skill goes in the read-back and the user confirms or changes it: the project's `skills/` source folder when the project is a skill repo, otherwise the folder the user's agent reads skills from, so the skill is live as soon as it is written, or the user's own skills folder when it is for them everywhere. The read-back also proposes how the skill registers with BMad, guessed from what is installed: its own module record, a member of an installed module, or a plain skill that help and update checks never see; the user picks (`help/registration.md`). Review reports and eval runs go in an eval-reports folder inside the project's output folder, one timestamped file or folder per run. Both locations can be overridden in the skills' customization files; the module asks no setup questions. At the end of a build Smithy tells the user where the skill is, whether it is already live, and how it is registered.

## After a skill finishes

| Just finished | Offer next |
|---|---|
| Smithy built a skill | The lenses have already run and their defects are fixed; Smithy said what changed. Next: the trigger eval he offers, then one real request to try. A baseline eval when they want proof the skill beats the bare model. For a new module record, `bmad setup <code>`. |
| Smithy edited, packaged or migrated a skill the user owns | A review, since the lenses do not run unasked over a skill Smithy did not write. Then the trigger eval if the description changed. |
| A review report | Edit mode for the findings the user accepts. The report is advice; the user picks. |
| A trigger eval with failures | Smithy revises the description from the failures and runs it again (`help/evals.md`). |
| A baseline the skill no longer wins | Retire the skill or rethink it; patching a skill the bare model matches is wasted work. |
| A migration | It converts in place, then validates and ships. Offer setup next, since the module's config questions may have changed. |

## More detail

Each topic file below sits in this folder and goes deeper on one subject. Read one only when the question is about that subject, using the path the knowledge script lists for it.

| Topic file | Read when the user asks about |
|---|---|
| `help/shapes.md` | What kinds of thing Smithy can build, in one table; which one their need lands in. Each shape then has its own file. |
| `help/shape-plain-skill.md` | A plain skill: its files, what goes in `SKILL.md`, when it gets a `customize.toml` or a `bmod.toml`. |
| `help/shape-agent.md` | An agent persona: how its identity, menu and capabilities are defined, how a team customizes it, how it joins a module's roster. |
| `help/shape-memory-agent.md` | A memory agent (Continuity of Self): the sanctum, how its memory is laid out and tended, First Breath, Pulse. |
| `help/shape-rendered-skill.md` | A skill whose steps teams switch on and off through customization. |
| `help/shape-script-utility.md` | A skill that is mostly scripts, and the rules those scripts follow. |
| `help/shape-single-skill-module.md` | One skill that is its own module: what the record adds and when it is worth it. |
| `help/shape-multi-skill-module.md` | A module of several skills: the record folder, roster, help and retired list. |
| `help/registration.md` | Whether a skill joins a module, gets its own record or stays outside the registry; what each gives; contributing to the BMad Method module versus extending it in a project. |
| `help/approaches.md` | How a build runs: lean, scaffold and guide, eval-first, the skill-creator loop, from session logs; which fits the user's situation. |
| `help/modes.md` | Working on a skill that exists: edit, convert, review, package, validate, migrate; what each does and the phrase that reaches it. |
| `help/evals.md` | `bmad-eval` in depth: what each mode answers, what a trigger eval is, why near misses matter, how many runs, which harness runs it and how that is recorded, where runs land. |
| `help/naming.md` | What to call a skill or module: why a prefix of their own, what `bmad-` means, how agents and module records are named. |
| `help/craft-progressive-disclosure.md` | How big a skill should be, what loads when, why a complex workflow is carved into files loaded only when reached. |
| `help/craft-description.md` | Writing the description that makes a skill fire: its three parts, the length target, near misses, hand-invoked skills. |
| `help/craft-scripts.md` | When a skill should script something instead of saying it, and how scripts are written and run. |
| `help/craft-customization.md` | How a skill is customized without forking it: the `customize.toml` surface, the override files, who reads and who writes them. |
| `help/how-to-personal-skill.md` | Walkthrough: a skill for the user's own use, start to live. |
| `help/how-to-add-to-module.md` | Walkthrough: a skill that joins a module, their own or the BMad Method. |
| `help/how-to-convert-external.md` | Walkthrough: a Claude, Codex or Cursor skill, rule, GPT or slash command brought to BMad. |
| `help/how-to-memory-agent.md` | Walkthrough: a memory agent from the first question to its first waking. |
| `help/how-to-review.md` | Walkthrough: reviewing a skill someone else wrote and acting on the findings. |
| `help/references.md` | The open skill specification and the skill documentation of the harnesses users run, with links. |

## When this document is not enough

For a `toolsmith` question these files and the installed skills cannot answer, say so rather than guess, and offer to ask Smithy directly: his files under `bmad-toolsmith/` are the authority on how he behaves.
