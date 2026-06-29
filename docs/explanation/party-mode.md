---
title: "Party Mode"
description: Get your AI agents in one conversation — run them, build your own cast, and choose how independently they think
sidebar:
  order: 10
---

Party mode puts your AI agents in one room and lets them talk, to each other and to you. This page explains what a party is, the four ways it can run, how to build your own cast of personas instead of using the installed agents, and how a party remembers you between sessions.

## What is Party Mode?

Run `bmad-party-mode` and the BMad agents you already have installed gather in one conversation: the PM, Architect, Dev, UX Designer, and whoever else your selected modules bring. That installed lineup is your default party, ready with no setup. They answer in character, agree, disagree, and build on each other. You steer the room. Ask a follow-up, push back, pull one voice forward, or change the subject. The conversation runs until you end it.

It works because the personas hold different priorities. The Architect guards the design, the PM guards scope, the Dev guards what's actually buildable. Put them in the same room and the tradeoff surfaces now, in the conversation, instead of three weeks into the sprint.

**Good for:**

- Decisions with real tradeoffs
- Brainstorming and "what are we missing?"
- Post-mortems and retrospectives
- Pressure-testing a plan before you commit

Party mode is also a fast and genuinely fun way to brainstorm, since the personas have opinions and they clash. And you can start a party from inside any other workflow: mid-brainstorm, mid-PRD, while coding, working a sales angle, or shaping a creative piece. Any time you want more perspectives on what's in front of you, pull in a room without dropping what you were doing.

:::note[Example]
**You:** Monolith or microservices for the MVP?

**Architect:** Start monolith. Microservices add operating cost you don't need at a thousand users.

**PM:** Agreed. Time to market matters more than scaling we can't prove yet.

**Dev:** Monolith, but with clean module boundaries so we can split a service out later without a rewrite.
:::

## Starting a party

Invoke the skill and say what you want; it works out whether you mean to run a party or build one.

| Goal | Type this |
| --- | --- |
| Start a party in the default mode | `/bmad-party-mode` |
| Start in a specific mode | `/bmad-party-mode --mode auto` (also `session`, `subagent`, `agent-team`) |
| Run it once, non-interactively | `/bmad-party-mode --non-interactive "review this PR"` |
| Open a saved party | `/bmad-party-mode --party code-review-crew` |
| Conjure a cast on the spot | "party mode with the bridge crew of the Enterprise" |
| Create or add a party | "party mode, create a new party" |
| Edit an existing party | "party mode, edit the writers' room" |
| Customize the skill | `/bmad-customize bmad-party-mode` |

## How a party runs

A party can run in four modes. One mode is active per session, and it decides who does the thinking: a single model voicing everyone, or separate agents reasoning on their own.

| Mode | What it does | Reach for it when |
| --- | --- | --- |
| `session` | Default. One model voices every persona inline. Fast and fully conversational. | Most conversations — banter, brainstorming, quick back-and-forth. |
| `auto` | Voices inline for light rounds, spawns independent agents only when independence changes the answer. | You want speed most of the time but real independence on the hard rounds. |
| `subagent` | Spawns a separate agent for each persona every substantive round, so no single mind colors them all. | Honest reviews and focus groups, where the voices must not bleed together. |
| `agent-team` | Stands the personas up as a persistent team that address each other directly. Claude Code only. | A live, hands-off round-table where the agents talk among themselves. |

The choice matters because one model voicing five personas can quietly converge: they share a mind. Spawning real agents keeps their reasoning separate, which is the entire point of a review panel or a focus group. `session` is the cheapest and most fluid. The spawning modes cost more but protect independence, and `auto` aims for both by spawning only when a round needs it.

`session` is the default, and every other mode falls back to it when a harness can't do the rest: `agent-team` drops to `subagent`, then to `session`. The configured default lives in your customization, and a runtime override wins for that session.

:::tip[Override for one session]
Start a party with `--mode subagent` (or `auto`, `agent-team`, `session`) to override the configured default just for that run.
:::

A party is interactive by default: the opening ask is a starting topic, not a stopping point, and the room stays open round after round until you end it. Answering the first question never ends the party on its own. To run it the other way — serve one intent and stop — start with `--non-interactive`; it runs to a natural close, wraps up, and releases any spawned agents.

## Custom parties

Out of the box, a party uses your installed BMad agents. The larger use is building your own cast from any set of personas you can describe, then saving it to reuse. You author a party through the same skill. It detects whether you want to run one or build one, and writes the result to your overrides through [bmad-customize](../how-to/customize-bmad.md).

Party mode is customizable like every BMad skill. Run `/bmad-customize bmad-party-mode` to set its defaults directly: pin any group you've built as the default party so it loads without a flag, choose which mode it starts in, and set any house rules the room should hold for the whole session.

Two ideas do most of the work.

**Personas** are what make a member unmistakable: how they talk, what they value, how they argue, their pet peeves and blind spots. "Skeptical CFO" is a placeholder. "Won't approve anything without a payback under eighteen months, and says so in the first thirty seconds" is a persona. That detail is what gives a voice you'd recognize with the name labels hidden.

**Scenes** set the stage. A scene is one freeform line: the setting, what's happening, who's hostile to whom, who pushes hardest. The same members play it differently each time, so you define a person once and drop them into a bridge crew on duty, the same crew off-duty in the lounge, or a hostile buyer panel. Members combine into named groups, and you can pin one group as the default room.

### Shapes a party can take

| Shape | What it is |
| --- | --- |
| Themed cast | Famous investors, a TV ensemble — distinct voices gathered around a topic. |
| One-off personas | A persona or two added to the pool, no group needed. |
| Focus group from data | Hand it customer or survey data; it clusters people by what drives their behavior and builds representative personas. Pair it with `subagent` mode so the customers stay independent. |
| Review panel | Purpose-built critical lenses that argue about what matters. The shipped Code Review Crew is one. |
| Deliberation scaffold | A room that makes the human think harder without pretending to be an autonomous decision council. The shipped Anti-Consensus Club is one. |
| Open-cast room | No fixed roster. The scene names a universe and the room is cast on the fly as the topic shifts. |

A focus group is the case that pays off most. Feed in real profiles and you get a standing panel of representative customers to test an idea against before you build it, each reacting from their own goals and budget instead of agreeing with the last voice.

## Parties you could build

A party is only personas and a scene, so the range is wide, and none of it needs a new skill or module:

- A founder squad to stress-test a startup idea.
- A compliance team to find the holes before an audit does.
- The authors of the Agile Manifesto, debating a software concept.
- A room of comedians as a writing-partner group.
- Great minds of the past, to work through a question in philosophy or untangle a hard problem.
- A business management team to plan the quarter.

These are starting points. Any set of voices you can describe becomes a party: write the personas, give the room a scene, and you have it.

## The Code Review Crew

Your default party is the agents your installed modules provide. The Code Review Crew is a custom party BMad ships alongside that default — a working template to study before you build your own, not a replacement for it. It's a review panel: five lenses that attack a change from different angles and argue about what actually matters, instead of rubber-stamping it.

| Member | Lens |
| --- | --- |
| Vex | Security — threat-models everything and names the concrete exploit path. |
| Grumbal | The adversary — assumes the code is broken and sets out to prove it. |
| Boundary | Edge cases — every branch, null, race, oversized input, odd timezone. |
| Yui | The craftsman — simplicity, naming, no needless cleverness or duplication. |
| Dana | The pragmatist — counters the perfectionists and ranks what's real versus a nit. |

The crew ships defined but inactive. The members sit in the pool and cost nothing until you summon the group, and they never crowd your default room. Run it with `subagent` mode so each lens reviews on its own before the five clash over the findings.

## The Anti-Consensus Club

The Anti-Consensus Club helps with decisions, strategy, designs, and fuzzy questions where one assistant might agree too quickly or keep debating after the useful work is done. It is not a voting body. Its job is to raise useful objections, check claims, stop repetition, and return the decision to the human.

| Member | Lens |
| --- | --- |
| Wildcard | Option generator — suggests alternative problem statements, assumptions, and examples. |
| Level | Claim checker — checks support, missing information, and confidence. |
| Killjoy | Loop stopper — stops repetition, fake disagreement, and unsupported speculation. |
| Splinter | Consensus challenger — questions easy agreement and ignored tradeoffs. |

Run it as `/bmad-party-mode --party anti-consensus-club --mode subagent` when the platform supports it. The room recommends that at session start, then stops nagging if you continue in another mode.

## Steering the conversation

You drive the room the whole way:

- Bring someone in: "Bring in the UX designer."
- Go deep on one voice: "Winston, take that apart." A direct ask is the cue for one persona to stretch out.
- Switch rooms mid-session: "Switch to the writers' room" swaps the active group and carries the thread over.
- Summon anyone by name, even a custom member who isn't in the current room.

Whichever mode is running, the orchestrator presents the result as one conversation rather than a stack of separate answers, and it keeps the personas in character — it won't break the fourth wall to narrate the mechanism.

:::tip[Mix more than one room]
You aren't limited to a single group. Pull members from several parties into the same conversation, or name a cast on the spot, and let them mix. Picture the Golden Girls thrown into an architecture review with Martin Fowler and Linus Torvalds, sparring over a change request: you can imagine how that goes.
:::

## The room remembers

Give a party a memory and it picks up where you left off. It keeps its own record of your past sessions — the dynamics that built up between members, the threads you left open, and where earlier conversations landed. Reopen it a week later and that history is intact: two members who came to blows last time still open a little frosty, and a sharp line from a past session can resurface as an organic callback.

It's memory, not a transcript. The room carries the few things worth remembering, not a log of everything said, so the next conversation feels continuous without dragging the whole past into it. It happens on its own, in the background — nothing to save, and the room never breaks character to announce it.

A character who turns up on the fly is remembered too — a walk-on from an open-cast scene, or someone you add mid-conversation. At the end of a session the room offers to keep the new arrivals, folding them into the party so they can come back next time.

Memory is set per party. When you create or save a party you're asked whether it should remember; the default installed-agent room remembers unless you turn it off. Set or change any of this through `/bmad-customize bmad-party-mode`.

## A keepsake of the session

When you wrap up, the orchestrator offers a keepsake: a single self-contained HTML document of the session to keep or share. It lays the conversation out by persona rather than dumping a raw transcript. Decline it and the party simply ends.

:::tip[Better decisions]
The value of a party is the disagreement. Diverse perspectives in one room catch what a single line of thinking misses.
:::
