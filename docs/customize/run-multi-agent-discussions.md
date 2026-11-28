---
title: 'Run Multi-Agent Discussions'
description: Put your BMad agents in one conversation, choose how independently they think, build a custom cast, and use the two shipped parties.
sidebar:
  order: 4
---

`bmad-party-mode` puts your installed BMad agents (or a custom cast of personas) into one shared conversation, in character, with you steering the discussion.

## What a Party Is

Start a multi-agent discussion and the agents from your installed modules join the same room: the PM, Architect, Developer, UX Designer, Analyst, and others. They answer in character, agree, push back on each other, and build on earlier points. You steer the room by asking follow-ups, challenging one perspective, bringing another voice forward, or shifting the topic.

Because each agent prioritizes a different angle (user experience, scope, technical tradeoffs, delivery cost), tensions surface early instead of midway through implementation.

Good uses for a multi-agent discussion include:

- Weighing decisions with real tradeoffs
- Brainstorming and asking "what are we missing?"
- Running postmortems and retrospectives
- Stress-testing a plan before committing to code

You can also open a party from inside another workflow whenever you want a second opinion.

:::note[Example]
**You:** Monolith or microservices for the MVP?

**Winston (Architect):** Start with a monolith. Microservices add operational overhead you do not need at a thousand users.

**John (PM):** Agreed. Time to market matters more than scaling bottlenecks we have not proven yet.

**Amelia (Dev):** Monolith, with clean module boundaries so we can extract a service later without a rewrite.
:::

## Start a Discussion in Plain English

Open your AI coding tool's chat and describe the room you want. `bmad-party-mode` figures out whether you want to start a discussion, switch casts, or build a new party:

| What you want | Example prompt |
| --- | --- |
| Default installed agents | "Start party mode: should we build billing in-house or integrate Stripe?" |
| A cast created on the spot | "Party mode with the bridge crew of the Enterprise to debate our release freeze." |
| One of the built-in panels | "Run party mode with the Anti-Consensus Club on our pricing tiers." |
| Your saved rooms | "Party mode, list my saved parties." |
| A new or updated reusable cast | "Party mode, create a new party for quarterly launch reviews" or "Party mode, edit the writers' room." |
| Different default party settings | Run `/bmad-customize bmad-party-mode` and say what you want changed. |

### Optional Shortcut Flags

If you prefer compact slash-command flags, `bmad-party-mode` also accepts them directly:

| Goal | Shortcut |
| --- | --- |
| Start with your default party | `/bmad-party-mode` |
| Pick a specific execution mode | `/bmad-party-mode --mode subagent` (also `session`, `agent-team`) |
| Run once and wrap up automatically | `/bmad-party-mode --non-interactive "review this PR"` |
| Open a saved party by id | `/bmad-party-mode --party code-review-crew` |
| List saved parties | `/bmad-party-mode --list-groups` |

## Choose How Independently Personas Think

Each session runs in one mode that controls whether one AI model voices every character or separate agents work independently:

| Mode | What it does | Use it when |
| --- | --- | --- |
| `session` | Default. One model voices every persona inline. | Almost always: lively conversation, brainstorming, focus groups, and panels. |
| `subagent` | Spawns a separate subagent for each persona on every substantive round. | Each persona needs its own long research or deep file inspection. |
| `agent-team` | Runs personas as a persistent team addressing each other directly (Claude Code only). | You want a live, hands-off roundtable where agents exchange messages directly. |

One model voicing every persona produces the liveliest discussion: short turns, interruptions, callbacks, and characters who actually change their minds. Separate subagents are slower, cost roughly three times as many tokens, and tend to deliver longer prepared statements rather than back-and-forth dialogue, so save `subagent` mode for sessions where each persona needs to investigate different files or sources.

When your coding tool does not support the mode you asked for, `bmad-party-mode` falls back gracefully (`agent-team` drops to `subagent`, then to `session`). You can set a default mode through `/bmad-customize bmad-party-mode` and override it for any single run.

Parties are interactive by default, keeping the room open until you wrap up. Ask for a one-shot run (or pass `--non-interactive`) when you want the room to address one prompt, summarize, and close automatically.

## Build Your Own Party

You can create a reusable cast from any personas you describe, and `bmad-party-mode` saves it through [bmad-customize](./customize-bmad.md). Two ingredients make custom rooms work well:

- Give each persona a recognizable voice, priority, and style of argument; "Skeptical CFO" is vague, whereas "Refuses to approve any project without payback under eighteen months and asks for unit economics first" creates a real voice.
- Set a clear scene in one or two sentences covering the setting, tension, and who pushes hardest, so you can drop any defined persona into different rooms with different scenes.

| Cast shape | What it is |
| --- | --- |
| Themed cast | Distinct voices around a topic, such as well-known investors or a fictional ensemble. |
| One-off personas | One or two custom voices added to your pool without creating a full group. |
| Focus group from data | Hand customer feedback or survey data to the skill so it builds representative personas. |
| Review panel | Critical perspectives that debate what matters most (such as the shipped Code Review Crew). |
| Deliberation room | A structured panel that tests assumptions without voting for you (such as the Anti-Consensus Club). |
| Open-cast room | No fixed roster; the scene names a universe or setting and personas enter as the topic shifts. |

Run `/bmad-customize bmad-party-mode` whenever you want to pin a saved group as your default room, change the starting mode, or add house rules.

## The Code Review Crew

The Code Review Crew ships inactive in the persona pool so you can study it or run it on demand without crowding your default room. It brings five contrasting lenses to a code change:

| Member | Lens |
| --- | --- |
| Vex | Security: threat-models inputs and names concrete exploit paths. |
| Grumbal | The adversary: assumes the code is broken and sets out to prove it. |
| Boundary | Edge cases: checks nulls, races, oversized inputs, retries, and timezones. |
| Yui | The craftsman: focuses on clarity, naming, and removing unnecessary complexity. |
| Dana | The pragmatist: pushes back on nitpicks and separates real risks from polish. |

Open it by asking for the Code Review Crew or running `/bmad-party-mode --party code-review-crew`.

:::note[A Debate, Not a Verified Code Review]
The Code Review Crew debates tradeoffs and surfaces angles, but it does not run verification checks or produce triaged findings. For a verified, ranked code review, see [Review a Change](../build/review-a-change.md).
:::

## The Anti-Consensus Club

The Anti-Consensus Club helps on ambiguous decisions where a single assistant might agree too quickly or circle without resolving the real question. It does not vote or decide for you; it surfaces hidden assumptions, checks evidence, stops repetition, and hands the decision back to you.

| Member | Lens |
| --- | --- |
| Wildcard | Option generator: proposes alternative problem statements, assumptions, and concrete examples. |
| Level | Claim checker: checks what evidence exists, what is missing, and how confident the room should be. |
| Killjoy | Loop stopper: halts repetition, fake disagreement, and unsupported speculation. |
| Splinter | Consensus challenger: questions easy agreement and ignored tradeoffs. |

Open it by asking for the Anti-Consensus Club or running `/bmad-party-mode --party anti-consensus-club`.

## Steer the Room

During any session, you can guide the conversation naturally:

- Bring someone in: "Bring in Sally to react to this flow."
- Press one voice further: "Winston, take that database assumption apart."
- Switch rooms mid-session: "Switch to the writers' room" swaps the active group while carrying the thread over.
- Summon any saved persona by name, even if they are not part of the current group.

## Session Memory

A party with memory keeps concise notes across sessions (group dynamics, open threads, and prior decisions) so the next conversation picks up naturally without replaying a full transcript.

In a remembered party, personas who joined on the fly can be saved into the roster at wrap-up. The default installed-agent room keeps memory on unless you turn it off through `/bmad-customize bmad-party-mode`. Both built-in panels and ad-hoc inline casts start fresh each time unless you save a cast as a party and enable memory.

## Session Keepsake

When a session wraps up, `bmad-party-mode` offers to save a keepsake: a single self-contained HTML summary laid out by persona at `party-<slug>/party-<slug>.html` inside your active initiative folder (or your output folder when no initiative is active). Decline the offer if you do not need a saved copy.
