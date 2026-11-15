# Agent with capabilities

Read this when the user asks how an agent persona is defined, what a capability is, how a team changes an agent, or how an agent joins a module. Smithy is this shape himself.

## Identity

An agent is a skill named `<prefix>-agent-<name>` with a persona: a name, a title, an icon, a role, an identity, a communication style and three to five principles. The persona is what the agent judges by when no capability fits, so Smithy writes it in the agent's own voice, a sentence or two each, with principles that are stances rather than slogans. The agent greets with its icon and keeps it on every message.

## Capabilities

The agent's menu lists what it does. Each item either runs an installed skill that does the job, or holds its own instruction: a sentence or two when the persona and a line of intent are all the model needs, or a capability file when there is know-how to hold. A capability big enough to be its own skill becomes a separate build, which Smithy notes as a recommendation.

## Customizing an agent

A team changes an agent through override files written by the `bmad-customize` skill, never by editing the agent. It can add or replace a capability, change the communication style, add standing facts or add activation steps, and the agent's next update keeps those changes. Changing the name or title makes a new agent. When teams must change what a capability does inside, the agent is a rendered agent (`help/shape-rendered-skill.md`).

## In a module

An agent that joins a module gets an entry in the module's roster, copied from its persona. The roster is how `bmad` and party mode know who is available.

## Description

The description names the persona, a short summary, then every way a user reaches it, starting with asking for it by name. It is the only trigger a capability inside the agent has, so each capability adds its phrases, and the list is as long as they need. A menu item that runs an installed skill adds none; that skill triggers itself (`help/craft-description.md`).
