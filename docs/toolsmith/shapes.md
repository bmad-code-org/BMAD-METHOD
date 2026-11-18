---
title: 'Shapes of a Skill'
description: 'The shapes Smithy builds: a plain skill, an agent with capabilities, a memory agent, rendered skills and agents, a script-backed utility, a document template, and single- and multi-skill modules.'
sidebar:
  order: 4
---

A shape is what a skill looks like on disk. Smithy works out the shape from the conversation about purpose, user, and output, and names it in the execution plan with one line on why. You do not need to pick one. If you name a shape up front, Smithy takes it into account and says if the conversation points elsewhere.

| Shape | What you get | Your need lands here when |
| --- | --- | --- |
| Plain skill | A `SKILL.md`, with references that load only when needed | You want an agent to do one job well on request |
| Agent with capabilities | A named persona with a greeting and a menu. Each capability is held inside the agent and loads only when used, or is an installed skill the agent runs. | You want someone to work with across turns, who owns several related jobs |
| Memory agent | An agent that keeps a memory folder and wakes as the same self | The agent must build up knowledge across sessions, and each owner shapes it in a first conversation |
| Rendered skill or agent | Files filled from the team's settings before each run | You ask for one; a shared plain skill gets about the same from a `customize.toml` |
| Script-backed utility | A thin `SKILL.md` over tested scripts | Most of the job is mechanical |
| Document template | A template `bmad-facilitate` runs, alone or carried by an agent | A person talks something through and a document comes out. An agent can carry several templates and pick one from the request, as the BMad Method's Analyst and PM agents do. |

Registration is a separate choice. Any of these shapes can stand alone as a single-skill module, join a module, or stay outside the registry. See [Modules and Registration](modules.md).

## Plain Skill

Most needs land here, including long multi-step workflows. A plain skill can hold:

| File | Holds |
| --- | --- |
| `SKILL.md` | Frontmatter with `name` and `description`, then the instructions |
| `references/<topic>.md` | A branch that only some runs need, loaded when reached |
| `scripts/<name>.py` | Work with one right answer per input, with a test beside it |
| `assets/` | Templates and files the skill emits |
| `customize.toml` | What a team can change without forking, only when other people will run the skill |
| `bmod.toml` | How the skill registers with BMad |

Only `SKILL.md` is required. A skill small enough to be one file is one file. A complex workflow stays a plain skill when each branch sits in its own reference, and it is the right size at any total if one run loads only what it needs.

A BMad skill resolves its configuration through the project's `_bmad/scripts` when it activates. A skill for use outside BMad has no activation section, only plain paths. A skill is one or the other.

## Agent with Capabilities

An agent is a skill named `<prefix>-agent-<name>` with a persona and a menu. Choose an agent when a user will work with it across turns and it owns several related jobs. Choose a plain skill when the job has one output and needs no persona.

The persona lives in an `[agent]` table in `customize.toml`: `name`, `title`, `icon`, `role`, `identity`, `communication_style`, and `principles`. The persona guides the agent when no capability fits, so it is written in the agent's own voice.

### Internal and External Capabilities

A capability can live inside the agent or be a separate skill the agent runs. Each `[[agent.menu]]` item has a `code`, a `description`, and exactly one of these:

- `prompt`, for an internal capability: the whole instruction in a sentence or two, or a line that reads a file under `references/`. Only the file for the capability in use loads, so one agent can hold many capabilities without loading all of them on every run.
- `skill`, for an external capability: an installed skill that does the job, which the agent invokes.

| | Internal | External |
| --- | --- | --- |
| Lives in | The agent's own folder | Its own skill folder |
| Used by | This agent only | Any agent or skill that invokes it |
| Fits when | The job belongs to this agent's persona and work | The job stands alone, someone would run it without the agent, or several agents need it |

Most agents mix both. A capability needs its own file only when there is know-how to hold, and one big enough to stand alone should become its own skill. A plain skill can run other installed skills the same way, listing them in `required_skills`.

If you are not sure you need an agent, build the job as a plain skill first. When you later want a persona or memory on top, an agent's menu item can run that skill, and nothing about the skill changes.

The agent's description lists its name and the phrases of every capability built into it, because nothing else triggers those capabilities. A menu item that runs an installed skill adds no phrases, because that skill triggers itself. In a module, an agent also gets a `roster.toml` entry, which is how `bmad` and party mode know it exists.

## Memory Agent

A memory agent keeps its identity and memory in a project folder and reloads them each session. Build one only when the agent must build up knowledge over time. The test: used daily for a month, would the thirtieth session differ from the first? See [Agents with Memory](agents-with-memory.md).

## Rendered Skill

A rendered skill keeps its steps as templates. Before the skill runs, `render_skill.py` fills them from the skill's `customize.toml` merged with team and personal overrides, and the agent reads the result. `bmad-build` is this shape.

A team changes the skill only at the points its author declared:

- A selector, a setting with named values that picks a route.
- An instruction block the team replaces whole.
- Instructions added at activation or when the workflow completes.

There are no on/off switches. A value the skill cannot act on, such as a misspelled selector, stops the run with a clear message. A single run can override a value from the invocation.

A plain skill with a `customize.toml` reaches about the same result with less machinery, so Smithy builds a rendered skill only when you ask for one.

## Rendered Agent

A rendered agent is an [agent with capabilities](#agent-with-capabilities) whose capability files are rendered the same way, so a team can change a rule inside one capability without forking the agent. Each capability declares its own points: instructions before and after, selectors, and blocks a team replaces whole.

A request that names what you want runs the matching capability. Asked what it does, the agent answers in a few sentences and shows the menu codes when you want them. A memory agent is never rendered.

## Script-Backed Utility

A thin `SKILL.md` names the outcome and when to run which script, and tested scripts do the work. It fits jobs with one right answer per input: transforming files, counting, checking structure, and generating from fixed rules. The prose keeps the part that needs judgment, which is what to do with the result. See [Scripts](write-a-good-skill.md#use-scripts-for-work-with-one-right-answer).

## Document Template

When a person talks something through and a document comes out, such as an appraisal report or a patient intake, the build is a template for `bmad-facilitate`, not a skill that coaches by hand. The engine then brings the questions, the review, resume in a new chat and team customization. Smithy proposes the smallest fit: a template alone, then an agent that carries templates when you want a persona or domain knowledge across documents, and a skill only when coaching cannot do the job.

`bmad-facilitate` writes the template, because it holds the rules for a good one; Smithy decides where it goes and wires it in. A module member's templates go in its record's `doc-templates/`, and a template alone in `_bmad/custom/facilitate-templates/`. The agent hands every document to the engine and lists `bmad-facilitate` in `required_skills`. See [Write a Document Template](../customize/write-a-document-template.md) for the file format.

## Changing Shape Later

A skill can change shape through [edit mode](modes.md#edit) when its needs grow. Adding a menu to a plain skill or memory to an agent are shape changes, and Smithy says so before making them.
