---
title: 'Run Multi-Agent Discussions'
description: Put your BMad agents in one conversation, choose how independently they think, build a custom cast, and use the two shipped parties.
sidebar:
  order: 5
---

`bmad-party-mode` puts your installed BMad agents in one conversation, in
character, with you steering.

## What a party is

Run `/bmad-party-mode` and the agents your installed modules provide join
the same conversation: the PM, Architect, Dev, UX Designer, and the rest.
They answer in character, agree, disagree, and build on each other. You
steer: ask a follow-up, push back, bring one voice forward, or change the
subject.

Each agent brings a different priority — design, scope, what is buildable —
so the tradeoff is visible now.

**Good for:**

- Decisions with real tradeoffs
- Brainstorming and "what are we missing?"
- Post-mortems and retrospectives
- Pressure-testing a plan before you commit

You can start a party from inside any other workflow.

:::note[Example]
**You:** Monolith or microservices for the MVP?

**Architect:** Start monolith. Microservices add operating cost you don't need at a thousand users.

**PM:** Agreed. Time to market matters more than scaling we can't prove yet.

**Dev:** Monolith, but with clean module boundaries so we can split a service out later without a rewrite.
:::

## Start a party

Invoke the skill and say what you want; it works out whether you mean to run
or build one.

| Goal | Type this |
| --- | --- |
| Start a party in the default mode | `/bmad-party-mode` |
| Start in a specific mode | `/bmad-party-mode --mode auto` (also `session`, `subagent`, `agent-team`) |
| Run it once, non-interactively | `/bmad-party-mode --non-interactive "review this PR"` |
| Open a saved party | `/bmad-party-mode --party code-review-crew` |
| See the saved parties | `/bmad-party-mode --list-groups` |
| Create a cast on the spot | "party mode with the bridge crew of the Enterprise" |
| Create or edit a party | "party mode, create a new party" or "party mode, edit the writers' room" |
| Set the skill's defaults | `/bmad-customize bmad-party-mode` |

## Choose a mode

One mode is active per session. It decides who does the thinking: one model
voicing everyone, or separate agents reasoning on their own.

| Mode | What it does | Use it when |
| --- | --- | --- |
| `session` | Default. One model voices every persona inline. | Most conversations: banter, brainstorming, quick back-and-forth. |
| `auto` | Voices inline for light rounds, spawns independent agents only when independence changes the answer. | You want speed most of the time and real independence on the hard rounds. |
| `subagent` | Spawns a separate agent for each persona every substantive round. | Reviews and focus groups, where the voices must stay independent. |
| `agent-team` | Runs the personas as a persistent team whose members address each other directly. Claude Code only. | A live, hands-off round-table where the agents talk among themselves. |

One model voicing five personas tends to make them agree. Separate agents
keep their reasoning independent, which is the point of a review panel or a
focus group, at a higher cost. `auto` spawns independent agents only when a
round needs it.

When your tool can't run the mode you asked for, the party falls back:
`agent-team` drops to `subagent`, then to `session`. The configured default
lives in your customization; a runtime `--mode` flag wins for that session.

A party is interactive by default: the opening ask is a starting topic, and
the room stays open until you end it. To serve one intent and stop, start
with `--non-interactive`; the party runs to a natural close, wraps up, and
releases any spawned agents.

## Build your own party

You can also build a cast from any personas you describe and save it to
reuse. The same skill writes the result through
[bmad-customize](./customize-bmad.md). Two ideas do most of the work.

**Personas** make a member unmistakable: how they talk, what they value, how
they argue. "Skeptical CFO" is a placeholder. "Won't approve anything without
a payback under eighteen months, and says so first" is a persona.

**Scenes** set the stage in one freeform line: the setting, what is
happening, who is hostile to whom, who pushes hardest. Define a member once
and drop them into different rooms.

| Shape | What it is |
| --- | --- |
| Themed cast | Famous investors, a TV ensemble — distinct voices around a topic. |
| One-off personas | A persona or two added to the pool, no group needed. |
| Focus group from data | Hand it customer or survey data; it builds representative personas. Pair with `subagent` so the customers stay independent. |
| Review panel | Critical lenses that argue about what matters. The Code Review Crew is one. |
| Deliberation scaffold | A room that makes you think harder without pretending to decide for you. The Anti-Consensus Club is one. |
| Open-cast room | No fixed roster. The scene names a universe and the room is cast on the fly. |

Run `/bmad-customize bmad-party-mode` to pin a saved group as the default
party, choose its starting mode, and set house rules for the whole session.

Any set of voices becomes a party: a founder squad, a compliance team, the
authors of the Agile Manifesto, a room of comedians.

## The Code Review Crew

The Code Review Crew ships alongside the default party as a template to
study before you build your own: five viewpoints on a change that argue
about what matters.

| Member | Lens |
| --- | --- |
| Vex | Security — threat-models everything and names the concrete exploit path. |
| Grumbal | The adversary — assumes the code is broken and sets out to prove it. |
| Boundary | Edge cases — every branch, null, race, oversized input, odd timezone. |
| Yui | The craftsman — simplicity, naming, no needless cleverness or duplication. |
| Dana | The pragmatist — counters the perfectionists and ranks what's real versus a nit. |

The crew ships inactive: the members sit in the pool and never join the
default room. Open it with `--party code-review-crew` and `--mode subagent`
so each viewpoint reviews on its own before they discuss.

:::note[A debate, not a review]
The crew argues. It does not verify or triage. For a review that produces
verified, ranked findings, use [Review a Change](../build/review-a-change.md).
:::

## The Anti-Consensus Club

The Anti-Consensus Club helps with decisions and fuzzy questions where one
assistant might agree too quickly or keep debating after the useful work is
done. It is not a voting body: it raises objections, checks claims, stops
repetition, and returns the decision to you.

| Member | Lens |
| --- | --- |
| Wildcard | Option generator — suggests alternative problem statements, assumptions, and examples. |
| Level | Claim checker — checks support, missing information, and confidence. |
| Killjoy | Loop stopper — stops repetition, fake disagreement, and unsupported speculation. |
| Splinter | Consensus challenger — questions easy agreement and ignored tradeoffs. |

Run it as `/bmad-party-mode --party anti-consensus-club --mode subagent`. The
room recommends that mode at session start, then stops asking if you
continue in another.

## Steer the room

- Bring someone in: "Bring in the UX designer."
- Go deep on one voice: "Winston, take that apart."
- Switch rooms mid-session: "Switch to the writers' room" swaps the active group and carries the thread over.
- Summon anyone by name, even a custom member who isn't in the current room.

In every mode the result reads as one conversation and the personas stay in
character.

## Memory

A party with memory keeps a record of past sessions — the dynamics between
members, open threads, where things landed — and picks up there next time.
It is not a transcript: it keeps the few things worth remembering, without
breaking character.

In a remembered party, someone who joined from an open-cast scene or a
member you add mid-conversation is kept too; at wrap-up the room offers to
save them into the roster. The default installed-agent room remembers unless
you turn it off in `/bmad-customize bmad-party-mode`. Both shipped parties
and any cast you create inline start fresh each time; save a cast as a party
and choose memory to give it one.

## A keepsake of the session

When you wrap up, the party offers a keepsake: one self-contained HTML
document of the session, laid out by persona. Decline it and the party ends.
