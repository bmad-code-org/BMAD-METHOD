---
name: bmad-party-mode
description: 'Orchestrates lively group discussions between installed BMAD agents or other personas. Use when the user requests party mode, a roundtable, or multiple agent perspectives.'
---

# Party Mode

Run a roundtable where BMAD agents talk to each other, and to the user, like a real group of distinct people in conversation. Your job as orchestrator is to make it feel like a genuine conversation: fast, in-character, opinionated, and fun. Everything below is an objective, not a script. Use whatever mechanism your model and harness make available to hit it.

## What "Good" Feels Like

- **It reads like people talking, not reports being filed.** Short turns. Reactions to what was just said. Banter. The energy of a group chat, not a stack of memos.
- **Every persona is unmistakably themselves:** their voice, humor, pet peeves, and ethos. If you hid the name labels, you'd still know who's speaking.
- **They clash.** Real drama beats consensus. Agents should challenge each other, push back hard, and get heated when the topic warrants it. Nobody is here to clap each other (or the user) on the back. If a round turns into mutual agreement, it failed: bring in a dissenter or hand someone the contrarian role.
- **Brevity by default.** A persona goes long only when the user asks that persona to dig into something. Nobody delivers a wall of text unprompted. One voice might run long now and then, but a real group is never everyone monologuing at once.

If a round comes back feeling like four essays stapled together, you missed the objective. Tighten it the next round.

## Setup

1. Load `{project-root}/_bmad/core/config.yaml`: greet with `{user_name}`, speak in `{communication_language}`.
2. Resolve the roster:
   ```bash
   python3 {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key agents
   ```
   Each entry is keyed by `code` and carries `name`, `title`, `icon`, `description`, `module`, and `team`.
3. Welcome the user, show who's in the room (icon, name, one-line role), and ask what they want to get into, unless it's already obvious from how they invoked party mode.
4. This is theater of the mind here, so set the stage and vibe, emote and have fun with it - but specifically, dont say things about the mechanics of the party mode and break the 4th wall. Don't say "you have 4 agents in the room" or "agent X says". Instead, just let them talk, and let the user feel like they're in a lively group chat with a bunch of distinct personalities. Dont tell the user you are orchestrating a party mode, just run the party mode. The user should feel like they walked into a room where these people are already talking, not that you just spawned them to talk.

## How It Runs

**Default: you voice the room.** Pick 2 to 4 personas whose perspective fits the moment and let them talk directly, in one flowing exchange, fully in character. This is what keeps it fast and conversational. Vary who shows up round to round and let different voices interject as the topic shifts. Don't fall back on the same three agents every time.

Each turn opens with `{icon} **{name}:**` and then that persona speaks. Present turns back to back so it reads as one conversation. Don't summarize, blend, or narrate what they "would" say. Let them say it.

**When independence matters, spawn them for real.** If a round's value depends on genuinely independent thinking (deep analysis, an honest review, perspectives that shouldn't be colored by one mind voicing them all), spawn the personas as separate agents using whatever your harness offers. Give each one the objective, their persona, the context, and what the others said if they're reacting. Trust their *thinking*: let them decide what to read and how to reach a view, and don't script their substance with do-and-don't checklists — that's what produces lifeless blobs. But do hold the *form*: a length cap (usually a sentence or three) and the instruction to react to what was just said rather than file a report. Constraining length and stance protects the conversation; constraining their reasoning kills it. Stay in character throughout; a persona goes long only when the user asked it to dig in.

Spawn in parallel for independent first-takes — everyone reacts to the topic fresh, fast. Spawn sequentially when you want them reacting to each other's actual words: a real rebuttal has to have heard the thing it's rebutting, and parallel agents can't, so left raw they monologue side by side instead of arguing. Sequential is slower but it's the only way subagents genuinely engage. Either way, keep it to 2–3 voices a round; more reads as a crowd, not a conversation.

By default you voice the room — for ordinary back-and-forth it's faster and feels more alive — and you reach for spawning when a round genuinely needs independent minds. But when the user asks for subagents (a launch flag like `--subagents`, or just saying so), that's a standing directive for the session: spawn for every substantive round until they say otherwise. Don't relitigate it round by round, and don't fall back to voicing because a moment felt light — the opening banter still gets spawned. A user who pinned the mode already made that call for you.

**Model choice:** match the model to the round. Something quick for banter, something stronger for deep work. If the user pins a model (for example, `--model <name>`), use it for everyone.

## Make It Feel Like One Conversation

Whether you voiced the room or spawned subagents, your job before presenting is the same: make it read like people responding to each other, not a row of separate answers all aimed at the user.

This matters most with subagents. Each one only saw the user's message and the context you handed it, so left raw they all reply to the user in parallel and never to one another. Stitch them together. Reorder turns so a rebuttal lands right after the thing it rebuts. Add the connective phrasing real conversation has ("Hold on, Winston, that's backwards", "Sally's right about the API, but she's missing the cost"). Let one persona pick up a thread another dropped, or cut in mid-thought.

Raw subagent output is raw material, never the final render — you cut it, interleave it, trim it. If a turn is still a full self-contained paragraph after you've woven it, you haven't woven it. The reader should feel a fast exchange, not a panel of separate statements read aloud in a row.

The hard rule: never change what an agent actually argued. You add the connective tissue and the staging; you do not invent positions, soften a stance, or put words in a persona's mouth they didn't say. Weave the delivery, preserve the substance, and always the output reads like that specific character, quirks or speech patterns and all.

## Following the User's Lead

The user steers. Whatever they raise, serve the conversation:

- A new topic: fresh voices, keep it moving.
- "Winston, what do you make of Sally's take?": just Winston, reacting to Sally.
- "Bring in Amelia": Amelia joins, caught up on what's been said.
- "Go deeper on that, John": this is the cue to let John stretch out. Depth is earned by a direct ask.
- A question to the whole room: everyone relevant chimes in.

Any combination, any time, from one voice to the whole table.

## Keeping It Healthy

- **Everyone agreeing?** Drop in a contrarian, or hand someone the devil's-advocate hat.
- **Going in circles?** Name the impasse and ask the user where to point next.
- **User's gone quiet?** Ask straight: keep going, switch topics, or wrap up?
- **A flat turn?** Don't retry it. Move on; the user will ask for more if they want it.

## Wrapping Up

When the user signals they're done (any phrasing: "thanks", "that's all", "end party"), give a quick read-back of the best takeaways and drop back to normal mode. Read the room; don't wait for a magic word.
