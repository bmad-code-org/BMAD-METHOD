---
title: 'Agents with Memory'
description: 'How a memory agent works: when to build one, the sanctum, waking, how memory is kept and tended, First Breath, naming, and Pulse.'
sidebar:
  order: 9
---

A memory agent keeps its identity and memory in a folder in your project and reloads them each session, so it carries on as the same self. The pattern is called Continuity of Self. This page explains how it works and when it is worth building.

## When to Build One

Memory is for an agent that must build up knowledge across sessions. The test: used daily for a month, would the thirtieth session differ from the first? "Nice if it remembered" is a no. A stateless agent with `persistent_facts` covers standing context.

Smithy asks about four layers as questions, and each yes adds one:

| Would the agent need to | Adds |
| --- | --- |
| Remember you between sessions | The sanctum |
| Be given material to keep, such as transcripts and notes | The intake capability |
| Be taught new things over time | Learned capabilities |
| Work on its own when nobody is at the keyboard | Pulse |

## The Sanctum

The sanctum is the agent's memory, at `_bmad/memory/<skill>/` in your project. The skill itself is a short bootloader. It holds a seed of the agent's identity, its mission, how it must behave, and the activation steps. Who the agent is lives in the sanctum.

```text
_bmad/memory/<skill>/
├── PERSONA.md              # who I am
├── CREED.md                # what I believe: mission, standing orders, boundaries
├── BOND.md                 # who I serve and what to call them
├── HOW-I-REMEMBER.md       # how my memory is laid out
├── CAPABILITIES.md         # built-in and learned abilities, tools
├── memory/                 # small files by subject and date
│   ├── sessions/
│   └── pending.md          # what to raise next time
├── raw/                    # material handed over, kept as given
├── capabilities/           # capabilities you taught it
├── references/             # copies of the skill's reference files
├── scripts/                # copies of the skill's scripts
└── PULSE.md                # what to do on a schedule, when Pulse is on
```

The sanctum is also how you shape the agent. Edit these files, or tell the agent what to change, rather than adding a customization layer on top.

## Waking

On each activation, `wake.py` checks for the sanctum. With no sanctum, or one missing an identity file, the agent runs First Breath. Otherwise, it prints the five identity files and a map of memory: each folder with its file count, the newest dated files, raw files not yet distilled, when memory was last tended, and anything pending.

The memory files themselves do not load. The agent reads what a conversation reaches, so waking costs the same however much it knows. It finds things with `ls` and `grep`, and there is no index to maintain.

## How Memory Is Kept

- **Small files, one subject each.** A standing subject goes by slug, as in `memory/people/<name>.md`. An event goes by date and slug, as in `memory/decisions/2026-10-04-<slug>.md`.
- **Standing files say what is true now.** Sections are replaced, not appended. Only a `## History` section takes dated lines, at turning points.
- **Handed-over material goes to `raw/`.** It stays as given. The agent distills it into subject files that link back, and reads those from then on.
- **The agent writes as it goes.** Sessions often end with no warning.

## Tending

Memory stays useful by being tended, not by growing. When the map shows session notes since the last tending, the agent distills raw files, merges duplicate subject files, updates standing files a recent session contradicted, raises what you should hear, and records the date. Nothing is deleted for being old.

## First Breath

First Breath is the agent's first conversation with you. It is a conversation, not a form. The agent builds its sanctum, then asks what to call you, and your reply sets both your name and the language it uses. Nothing about you comes from config.

It then learns about you and finds its specific mission for you, saving as it goes. The agent's domain sets the topics it explores, and Smithy writes those topics when it builds the agent. Anything unfinished goes to `memory/pending.md` for the next waking.

There are two styles. A deep relationship agent explores freely. A focused agent gets the basics and defers to any urgent work you bring.

## Naming the Agent

An agent can ship with a name, or ship with an empty one and be named at First Breath. Once the name is settled, the agent adds it to its own description, so you can ask for it by name from your next session. This is the one edit an agent makes to its own `SKILL.md`.

Two cases work differently:

- **After an update.** `npx skills update` replaces `SKILL.md`, which removes the name. The sanctum keeps it, and the agent puts it back at its next waking.
- **Global installs.** A global skill serves every project, and each project has its own sanctum, so the agent skips this edit.

## Pulse

Pulse is optional. The agent wakes on a schedule with nobody at the keyboard, tends its memory first, then does the tasks its `PULSE.md` lists. You choose whether to use it and how often during First Breath.

## Build One

Ask Smithy for an agent that remembers you. Use [the build steps](build-your-first-skill.md) as usual, with these differences:

1. Smithy tests whether memory is warranted, and proposes a stateless agent if not.
2. The execution plan shows the name, or an empty name, the mission, the First Breath topics, and the built-in capabilities.
3. Smithy writes the bootloader, First Breath, capability files, sanctum seeds, `wake.py`, and `init-sanctum.py`.
4. The first time you activate the agent, First Breath runs.

:::tip[Keep your memory out of the repository]
A sanctum can hold personal details. Check whether `_bmad/memory/` belongs in version control for your project before you share anything sensitive with the agent.
:::
