# Party mode

Open this when the user asks what `bmad-party-mode` is good for, how to use it with other skills, or how parties, memory, and sharing a party work.

## What it is for

Several distinct voices argue a question out with the user in the room, so an angle surfaces that one voice would miss. It works alone or beside any other skill, at any point. It debates; it does not verify facts or rank findings.

- Before planning: "get the team's take on this idea" before writing a brief or a spec.
- Mid-decision: two options for a stack or a scope cut, argued by the people who would live with each.
- On a draft: have the room react to a PRD, a design, or a plan, then carry the best objections back to the skill that owns the document.
- A focus group: a panel of customer personas reacts to a feature or a pitch.
- After the work: a team discussion of what a finished epic taught.
- For its own sake: a writers' room, a debate, a panel of invented experts on any topic.

Other skills can pull the same cast in. `bmad-brainstorming` and `bmad-advanced-elicitation` mention party mode when it is installed, and `bmad-forge-idea` uses the same personas and parties as its challengers.

## Who is in the room

- The default room is the installed agents. With none installed, a shipped party or a cast the user names inline ("party mode with a skeptical CFO and a first-time user") works.
- A party is a saved cast with a scene that sets how the room behaves. Two ship with the skill: `code-review-crew` and `anti-consensus-club`.
- An installed module can bring its own personas and parties. They appear in party mode as soon as the module is installed, with no setup.
- The user can set which party opens by default (`default_party`), or name one when starting.

## Custom parties

The user can tell party mode to help define a party: "party mode, create a new party", or "build a focus group from these interview notes". It drafts the personas with the user and saves them as a customization:

- In the user's own customization, for a personal party.
- In the team's committed customization, so the whole organization gets the party on pull.

It can also save someone who joined a session on the fly.

## Memory

- A party can remember earlier sessions as a short log of outcomes and memorable moments, not a transcript.
- The default room remembers unless memory is turned off. A saved party remembers only when its memory is turned on. Shipped parties start fresh each time.
- Memory is toggled through customization, for the default room and per party. To wipe it, delete the party's folder under `{output_folder}/party-mode/memories/`.

## Independent voices

One model voicing every persona tends to make them agree. When divergent views are the point, such as a review or a focus group, recommend running each persona as its own agent ("party mode with subagents"). It costs more tokens and time.

## Sharing a party as a module

To distribute personas and parties beyond one repository, package them as a BMad module. A module with a `roster.toml` and no skills is valid: it adds guests and parties to party mode for everyone who installs it. See `help/modules.md`.
