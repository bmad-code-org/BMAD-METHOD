---
title: 'Shapes of a Skill'
description: 'The shapes Smithy builds: a plain skill, an agent with capabilities, a memory agent, a rendered skill with customizable steps, a script-backed utility, and single- and multi-skill modules.'
sidebar:
  order: 4
---

A shape is what a skill looks like on disk. Smithy works out the shape from the conversation about purpose, user, and output, and names it in the execution plan with one line on why. You do not need to pick one. If you name a shape up front, Smithy takes it into account and says if the conversation points elsewhere.

| Shape | What you get | Your need lands here when |
| --- | --- | --- |
| Plain skill | A `SKILL.md`, with references that load only when needed | You want an agent to do one job well on request |
| Agent with capabilities | A named persona with a greeting and a menu | You want someone to work with across turns, who owns related capabilities |
| Memory agent | An agent that keeps a memory folder and wakes as the same self | The agent must build up knowledge across sessions |
| Rendered skill | Steps rendered from switches and prose blocks | Several teams want different steps, and a fork would drift |
| Script-backed utility | A thin `SKILL.md` over tested scripts | Most of the job is mechanical |

Registration is a separate choice. Any of these shapes can stand alone as a single-skill module, join a module, or stay outside the registry. See [Modules and Registration](modules.md).

## Plain Skill

Most needs land here, including long multi-step workflows. A plain skill can hold:

| File | Holds |
| --- | --- |
| `SKILL.md` | Frontmatter with `name` and `description`, then the instructions |
| `references/<topic>.md` | A branch that only some runs need, loaded when reached |
| `scripts/<name>.py` | Work with one right answer per input, with a test beside it |
| `assets/` | Templates and files the skill emits |
| `customize.toml` | What a team can change without forking |
| `bmod.toml` | How the skill registers with BMad |

Only `SKILL.md` is required. A skill small enough to be one file is one file. A complex workflow stays a plain skill when each branch sits in its own reference, and it is the right size at any total if one run loads only what it needs.

A BMad skill resolves its configuration through the project's `_bmad/scripts` when it activates. A skill for use outside BMad has no activation section, only plain paths. A skill is one or the other.

## Agent with Capabilities

An agent is a skill named `<prefix>-agent-<name>` with a persona and a menu. Choose an agent when a user will work with it across turns and it owns several related jobs. Choose a plain skill when the job has one output and needs no persona.

The persona lives in an `[agent]` table in `customize.toml`: `name`, `title`, `icon`, `role`, `identity`, `communication_style`, and `principles`. The persona guides the agent when no capability fits, so it is written in the agent's own voice.

Each `[[agent.menu]]` item has a `code`, a `description`, and exactly one of these:

- `skill`, when an installed skill does the job and the agent invokes it.
- `prompt`, holding the whole instruction in a sentence or two, or a line that reads a file under `references/`.

A capability needs its own file only when there is know-how to hold. One big enough to stand alone should become its own skill.

The agent's description lists its name and the phrases of every capability built into it, because nothing else triggers those capabilities. A menu item that runs an installed skill adds no phrases, because that skill triggers itself. In a module, an agent also gets a `roster.toml` entry, which is how `bmad` and party mode know it exists.

## Memory Agent

A memory agent keeps its identity and memory in a project folder and reloads them each session. Build one only when the agent must build up knowledge over time. The test: used daily for a month, would the thirtieth session differ from the first? See [Agents with Memory](agents-with-memory.md).

## Rendered Skill

A rendered skill keeps its steps as a template with switches and prose blocks. Before the skill runs, `render_skill.py` fills the template from the skill's `customize.toml` merged with team and personal overrides, and the agent reads the result. A team can switch off a step, add a rule, or change wording without editing the skill. `bmad-build` is this shape.

It is worth the extra machinery only when teams really differ in which steps run. A skill with one set of steps and a few settable values is a plain skill with a `customize.toml`.

## Script-Backed Utility

A thin `SKILL.md` names the outcome and when to run which script, and tested scripts do the work. It fits jobs with one right answer per input: transforming files, counting, checking structure, and generating from fixed rules. The prose keeps the part that needs judgment, which is what to do with the result. See [Scripts](write-a-good-skill.md#use-scripts-for-work-with-one-right-answer).

## Changing Shape Later

A skill can change shape through [edit mode](modes.md#edit) when its needs grow. Adding a menu to a plain skill or memory to an agent are shape changes, and Smithy says so before making them.
