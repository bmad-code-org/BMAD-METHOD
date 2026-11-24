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

## Agent with Capabilities

An agent is a skill named `<prefix>-agent-<name>` with a persona and a menu. Choose an agent when a user will work with it across turns and it owns several related jobs. Choose a plain skill when the job has one output and needs no persona.

The persona, written in the agent's own voice, guides it when no capability fits.

### Internal and External Capabilities

A capability can live inside the agent or be a separate skill the agent runs. Only the capability in use loads, so one agent can hold many.

| | Internal | External |
| --- | --- | --- |
| Lives in | The agent's own folder | Its own skill folder |
| Used by | This agent only | Any agent or skill that invokes it |
| Fits when | The job belongs to this agent's persona and work | The job stands alone, someone would run it without the agent, or several agents need it |

Most agents mix both. A capability big enough to stand alone should become its own skill.

If you are not sure you need an agent, build the job as a plain skill first. When you later want a persona or memory on top, an agent's menu item can run that skill, and nothing about the skill changes.

## Memory Agent

A memory agent keeps its identity and memory in a project folder and reloads them each session. Build one only when the agent must build up knowledge over time. The test: used daily for a month, would the thirtieth session differ from the first? See [Agents with Memory](agents-with-memory.md).

## Rendered Skill

A rendered skill keeps its steps as templates, filled from the team's and your own settings before each run. `bmad-build` is this shape.

A team changes the skill only at the points its author declared:

- A selector, a setting with named values that picks a route.
- An instruction block the team replaces whole.
- Instructions added at activation or when the workflow completes.

A plain skill with a `customize.toml` reaches about the same result with less machinery, so Smithy builds a rendered skill only when you ask for one.

## Rendered Agent

A rendered agent is an [agent with capabilities](#agent-with-capabilities) whose capabilities are rendered the same way, so a team can change a rule inside one capability without forking the agent. A memory agent is never rendered.

## Script-Backed Utility

A thin `SKILL.md` names the outcome and when to run which script, and tested scripts do the work. It fits jobs with one right answer per input: transforming files, counting, checking structure, and generating from fixed rules. The prose keeps the part that needs judgment, which is what to do with the result. See [Scripts](write-a-good-skill.md#use-scripts-for-work-with-one-right-answer).

## Document Template

When a person talks something through and a document comes out, such as an appraisal report or a patient intake, the build is a template for `bmad-facilitate`, not a skill that coaches by hand. `bmad-facilitate` then brings the questions, the review, resuming in a new chat, and team customization. Smithy proposes the smallest fit: a template alone, an agent that carries templates when you want a persona or domain knowledge across documents, and a skill only when coaching cannot do the job. See [Write a Document Template](../customize/write-a-document-template.md).

## Changing Shape Later

A skill can change shape through [edit mode](modes.md#edit) when its needs grow. Adding a menu to a plain skill or memory to an agent are shape changes, and Smithy says so before making them.
