---
title: 'Agents with Memory'
description: 'How a memory agent works: when to build one, the sanctum, its dominion, waking, how memory is kept and tended, First Breath, naming, and Pulse.'
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

It also asks whether the agent owns or tends anything beyond its own memory. Those places are its dominion, described below. An agent that owns nothing, such as a pure companion, gets none of the dominion rules.

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
├── capabilities/           # capabilities you taught it, and changes to built-in ones
└── PULSE.md                # what to do on a schedule, when Pulse is on
```

The sanctum is also how you shape the agent. Edit these files, or tell the agent what to change, rather than adding a customization layer on top.

The sanctum holds only what the agent learns. Built-in capabilities and scripts stay in the skill, so an update reaches an agent that already exists. To change a built-in capability, the agent writes its own version with the same code to `capabilities/`. To drop one, that file says `retired: true`.

## Dominion

An agent's dominion is its sanctum plus the areas it owns or tends: a whole workspace, a section of it, a few folders, or a private space such as a journal. The facts of the work go there, not in the sanctum, so people and other agents can read them without the agent and they survive a wiped sanctum.

Areas are listed in the agent's customization. An area whose path is the same in every install ships in the skill's `customize.toml`. You add your own at First Breath. They go in `_bmad/custom/<skill>.toml` when the repository is private to you, or in `_bmad/custom/<skill>.user.toml`, which git ignores, when it is shared:

```toml
[[agent.dominion]]
id = "journal"
path = "journal/"     # relative to the project, absolute, or ~; "." is the whole workspace
access = "write"      # write: the agent maintains it; read: it consults it
private = true        # other agents keep out
about = "My diary"
```

An override with an area's `id` replaces the whole entry, so restate every key. Add `retired = true` to drop an area the skill ships.

Each area the agent writes has a `README.md` giving its layout; a whole-workspace area uses the project's AGENTS.md instead. When the project's AGENTS.md has rules for an area, they win. When an area and the sanctum disagree, the area wins. A private area's content stays in it: the sanctum keeps what the agent learned about supporting you, in its own words, and waking shows only a file count for the area. `private` is an instruction to other agents, not access control.

## Waking

On each activation, `wake.py` checks for the sanctum. With no sanctum, one missing an identity file, or a First Breath that never finished, the agent runs First Breath. Otherwise, it prints the five identity files, the capabilities table, a map of memory and a map of the dominion. The capabilities table is built from the skill's references and the sanctum's `capabilities/` at every waking, so it is never out of date. The memory map shows each folder with its file count, the newest dated files, raw files not yet distilled, when memory was last tended, and anything pending. The dominion map shows each area's location, access, folders and newest dated files, only a count for a private area, and flags an area that is missing, has no README, or has a malformed entry.

The memory files themselves do not load. The agent reads what a conversation reaches, so waking costs the same however much it knows. It finds things with `ls` and `grep`, and there is no index to maintain.

## How Memory Is Kept

- **Small files, one subject each.** A standing subject goes by slug, as in `memory/people/<name>.md`. An event goes by date and slug, as in `memory/decisions/2026-10-04-<slug>.md`.
- **Standing files say what is true now.** Sections are replaced, not appended. Only a `## History` section takes dated lines, at turning points.
- **Material about the work goes to its area**, as the area's README lays out.
- **Material about you and the agent goes to `raw/`.** It stays as given. The agent distills it into subject files that link back, and reads those from then on.
- **The agent writes as it goes.** Sessions often end with no warning.

## Tending

Memory stays useful by being tended, not by growing. When the map shows session notes since the last tending, the agent distills raw files, merges duplicate subject files, updates standing files a recent session contradicted, raises what you should hear, and records the date. Nothing is deleted for being old.

## First Breath

First Breath is the agent's first conversation with you. It is a conversation, not a form. The agent builds its sanctum, then asks what to call you, and your reply sets both your name and the language it uses. Nothing about you comes from config.

It then learns about you and finds its specific mission for you, saving as it goes. It confirms the areas it ships with, asks what else it should own or tend, and writes them to your customization. It asks once whether the repository is private to you or shared. In a private repository the sanctum is committed and the agent can load in every chat through AGENTS.md or a project hook. In a shared one the sanctum is added to `.gitignore`, your areas go in the ignored `.user.toml`, and loading in every chat goes only in your personal harness settings. It shows each change before making it.

First Breath is finished before anything else. Until it is, it is the agent's only job: if you ask for other work, it does it once the questions are done. If you stop early, the next session brings it back to the questions it has not asked. The wrap-up writes `memory/.born`, and only then does the agent wake as itself.

Every memory agent's First Breath follows the same steps. What differs is the questions Smithy writes for its domain: a companion or coach asks about you, a working agent asks how you work.

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

:::tip[Memory agents are personal]
A memory agent serves one owner. In a repository others can read, say it is shared at First Breath, and the agent keeps its sanctum and your areas out of git.
:::
