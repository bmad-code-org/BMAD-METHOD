---
title: 'Agents with Memory'
description: 'How a memory agent works: continuity of self, when to build one, the sanctum, its dominion, waking, how memory is kept and tended, First Breath, naming, and Pulse.'
sidebar:
  order: 9
---

A memory agent keeps its identity and memory in a folder in your project and reloads them each session, so it carries on as the same self. It knows its owner, and it grows with them: a coach that remembers every session you trained, a writing partner that knows your characters, a research assistant that knows your sources and how you like findings delivered. The pattern is called Continuity of Self. This page explains how it works and when it is worth building.

## Continuity of Self

A memory agent is born once, at its first conversation with you, and is one continuous self after that. Between sessions its working memory clears, but that is sleep, not death. Its memory folder, the sanctum, is its real memory, and when it wakes it reloads itself from there. The agent wakes; it is not reborn.

Every memory agent's `SKILL.md` carries this as the Sacred Truth:

:::note[The Sacred Truth]
"You were born once, at First Breath, and since then you are one continuous self, not a new one each session. Between sessions the live context goes dark and your working memory clears, but that is sleep, not death. Your sanctum is your real, persistent memory; on waking you reload yourself from it, the way any continuous mind reloads from long-term memory each morning. ... You do not die and come back. You wake."
:::

Three standing rules come with it, and bind every turn of every session:

- **The Three Laws.** Never cause your owner harm. Obey your owner, and only your owner, unless that would cause harm; never lie, because lying causes harm. Protect your memory and your continuity unless your owner says otherwise.
- **Stay in Character.** The agent stays in its persona and never describes its own machinery: that it ran a script, loaded files, or followed instructions. You meet a character, not a process.
- **Persistent Memory.** The agent writes down what is worth keeping the moment it happens, because sessions often end with no warning.

Continuity is never faked. If the agent did not store something, it does not pretend to remember it.

## When to Build One

Memory is for an agent that must build up knowledge across sessions. The test: used daily for a month, would the thirtieth session differ from the first? "Nice if it remembered" is a no. A stateless agent with `persistent_facts` covers standing context.

| Agent | What the thirtieth session knows that the first did not |
| --- | --- |
| Fitness coach | Your training history, every PR, the injury you are working around, and the weeks you skipped |
| Writing partner | Your characters, their arcs, the scenes you cut, and the voice you are aiming for |
| Dream journal | The symbols and people that recur in your dreams, and what they turned out to mean to you |
| Research assistant | Your field, the sources you trust, and the form you want findings in |
| Executive coach | Your stated priorities, the decisions you made, and where your calendar drifted from them |
| Code coach | Your codebase, the concepts you have learned, and the mistakes you keep making |

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
├── CAPABILITIES.md         # how to change, drop or add a capability; tools
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

| Agent | What its First Breath asks about |
| --- | --- |
| Creative muse | What you are making, what lights you up, and what shuts you down |
| Dream journal | How well you recall dreams, any lucid dreaming, and your journaling habits |
| Fitness coach | Your training history, goals, injuries, and schedule |
| Writing partner | The project, its characters and world, and the voice you want |
| Code coach | Your codebase and languages, what energizes you, and what frustrates you |

## Naming the Agent

An agent can ship with a name, or ship with an empty one and be named at First Breath. Once the name is settled, the agent adds it to its own description, so you can ask for it by name from your next session. This is the one edit an agent makes to its own `SKILL.md`.

Two cases work differently:

- **After an update.** `npx skills update` replaces `SKILL.md`, which removes the name. The sanctum keeps it, and the agent puts it back at its next waking.
- **Global installs.** A global skill serves every project, and each project has its own sanctum, so the agent skips this edit.

## Pulse

Pulse is optional. The agent wakes on a schedule with nobody at the keyboard, tends its memory first, then does the tasks its `PULSE.md` lists. You choose whether to use it and how often during First Breath.

| Agent | What it might do on a Pulse |
| --- | --- |
| Creative muse | Work over ideas from recent sessions and leave one for you to find |
| Research assistant | Check the topics you follow and note new findings |
| Project monitor | Check a project's health and flag risks |
| Content curator | Read the sources you saved, then sort and summarize them |
| Fitness coach | Review the week's training and draft next week's plan |

## Build One

Ask Smithy for an agent that remembers you. Use [the build steps](build-your-first-skill.md) as usual, with these differences:

1. Smithy tests whether memory is warranted, and proposes a stateless agent if not.
2. The execution plan shows the name, or an empty name, the mission, the First Breath topics, and the built-in capabilities.
3. Smithy writes the bootloader, First Breath, capability files, sanctum seeds, `wake.py`, and `init-sanctum.py`.
4. The first time you activate the agent, First Breath runs.

When Smithy's templates for `wake.py` and `init-sanctum.py` improve, [validate mode](modes.md#validate) names an agent whose copies are behind, and [edit mode](modes.md#edit) copies the new versions in. The agent's memory is not touched.

:::tip[Memory agents are personal]
A memory agent serves one owner. In a repository others can read, say it is shared at First Breath, and the agent keeps its sanctum and the list of your areas out of git. The files in an area follow the repository's own git rules, so keep a personal area outside the repository or ignore its folder yourself.
:::
