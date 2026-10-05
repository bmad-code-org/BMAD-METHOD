# Agent with capabilities

Read this when the user asks how an agent persona is defined, what a capability is, how a team changes an agent, or how an agent joins a module. Smithy is this shape himself.

## Identity

An agent is a skill named `<prefix>-agent-<name>` whose `customize.toml` carries an `[agent]` table: `name`, `title`, `icon`, `role`, `identity`, `communication_style` and `principles`. The persona is what the agent judges by when no capability fits, so it is written in the agent's own voice, one or two sentences each, with three to five principles that are stances rather than slogans. On activation the agent resolves that table, runs any steps a team added before or after, loads standing facts, reads config, then greets with its icon, which it keeps on every message.

## Capabilities

The menu is a list of `[[agent.menu]]` items, each with a `code`, a `description` and exactly one of two things: `skill = "<installed skill>"`, when an installed skill does the job and the agent invokes it; or `prompt`, which is either the whole instruction in a sentence or two, or a line that reads a capability file under `references/`. A capability is inline when the persona plus a sentence of intent is all the model needs; the user lists it so the menu shows what is on offer. A capability file exists only where there is know-how to hold: the outcome, who acts on it, the bar, and what the model could not infer. A capability big enough to be its own skill becomes a new build, noted as a recommendation.

## Customizing an agent

A team changes an agent through override files, never by editing the skill: `_bmad/custom/<skill>.toml` for the team and `<skill>.user.toml` for one person. Scalars override, arrays append, menu items merge by `code`, so a team can add a capability, change the communication style or add an activation step without forking. The `bmad-customize` skill writes those files; the agent reads them. Changing `name` or `title` means a new agent.

## In a module

An agent that joins a module gets a `[[members]]` entry in the module's `roster.toml`: code, skill, name, icon, title and a two-sentence persona, copied from its `customize.toml`. That roster is how `bmad` and party mode know who is available.

## Description

The description names the persona and its jobs: "<Name> the <Title> does X, Y and Z. Use when the user asks to talk to <Name> or wants ...". The same length target applies as to any skill (`help/craft-description.md`).
