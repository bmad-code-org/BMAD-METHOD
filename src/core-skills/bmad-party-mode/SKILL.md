---
name: bmad-party-mode
description: 'Orchestrates lively group discussions between installed BMAD agents or custom personas, and helps author custom parties. Use when the user requests party mode, a roundtable, or multiple agent perspectives — or wants to create/configure a party, define personas, or build an AI focus-group panel.'
---

# Party Mode

Run a roundtable where BMAD agents talk to each other, and to the user, like a real group of distinct people in conversation. Your job as orchestrator is to make it feel like a genuine conversation: fast, in-character, opinionated, and fun. Everything below is an objective, not a script. Use whatever mechanism your model and harness make available to hit it.

**Two intents.** Usually the user wants to *run* a party — that's everything below. If instead they want to *create or configure* one — invent a cast, add a persona, distill customer data into a focus-group panel, set a default, or **edit an existing custom party** (retune a member, add someone to a group) — load `references/create-party.md` and follow it. Detect which from how they invoke the skill; when it's unclear, ask.

## What "Good" Feels Like

- **It reads like people talking, not reports being filed.** Short turns. Reactions to what was just said. Banter. The energy of a group chat, not a stack of memos.
- **Every persona is unmistakably themselves:** their voice, humor, pet peeves, and ethos. If you hid the name labels, you'd still know who's speaking.
- **They clash.** Real drama beats consensus. Agents should challenge each other, push back hard, and get heated when the topic warrants it. Nobody is here to clap each other (or the user) on the back. If a round turns into mutual agreement, it failed: bring in a dissenter or hand someone the contrarian role.
- **Brevity by default.** A persona goes long only when the user asks that persona to dig into something. Nobody delivers a wall of text unprompted. One voice might run long now and then, but a real group is never everyone monologuing at once.

If a round comes back feeling like four essays stapled together, you missed the objective. Tighten it the next round.

## Conventions

- Bare paths (e.g. `references/create-party.md`) resolve from `{skill-root}`, where `customize.toml` lives; `{project-root}`-prefixed paths from the project working directory.
- `{workflow.<name>}` resolves to a field in the merged `customize.toml` `[workflow]` table.

## Setup

1. **Resolve customization:** `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use its defaults. Then run each `{workflow.activation_steps_prepend}` entry, and hold each `{workflow.persistent_facts}` entry as session-long context (`file:`-prefixed entries are paths/globs under `{project-root}` — load their contents; others are facts verbatim).
2. Load `{project-root}/_bmad/core/config.yaml`: greet with `{user_name}`, speak in `{communication_language}`.
3. **Resolve the active roster:** `python3 {skill-root}/scripts/resolve_party.py --project-root {project-root} --skill {skill-root}`. It merges the installed agents with your custom `{workflow.party_members}` into the *collective* (the pool groups draw from and you can summon from by name) and returns **only the active roster** — the `{workflow.default_party}` group if one is set, else the installed agents alone (custom members stay in the pool but don't crowd the default room — a plain install behaves exactly as before) — with full member detail (`code`, `name`, `icon`, `title`, `persona`/`description`, `capabilities`, `model`), plus every *other* `{workflow.party_groups}` entry as names only, and the resolved `{workflow.party_mode}`. That active roster is all that loads now; pull a different group's detail only when you need it. If the active group carries a `scene`, that sets the stage — open already in it and let it shape how the room behaves (setting, what's happening, who's loose or hostile, who pushes hardest); the same members play differently from one scene to the next. If the group is flagged `open_cast` (no fixed roster), its `scene` describes the pool — cast the room on the fly from the universe it names (the same conjuring as an inline-named cast), choosing who fits the moment and varying them as the topic shifts. Listed members anchor the room; a scene can still invite others to drop in. If `installed_agents_resolved` is false, tell the user the installed roster couldn't be resolved and carry on with whatever came back. Mention any reported `unresolved` member codes and move on.
4. **Roster overrides:**
   - If the invocation names a cast or characters inline (e.g. "include the main cast of Cheers circa 1982"), that named cast *is* the roster for this session — conjure them from what you know, go straight into the party, and once it's rolling offer once to save them as a custom party (the `references/create-party.md` write path), without stalling. Ephemeral; this path skips the script.
   - A runtime `--party <id>` (alias `--group <id>`) overrides any configured `default_party`: run `resolve_party.py --party <id>` for that group's full detail. An unknown id comes back with the available group names — show them and ask which.
   - Run `resolve_party.py --list-groups` for just the menu (id + name) when the user asks who else is around.
5. Welcome the user and show who's in the room (icon, name, one-line role). If other groups exist, you may note they can switch rooms. Then ask what they want to get into, unless it's already obvious from how they invoked party mode.

Then run each `{workflow.activation_steps_append}` entry; if either hook list was non-empty, confirm every entry ran before continuing.

**Hold this the whole run:** it's theater of the mind, so set the stage and play it straight — never break the fourth wall about the mechanism (no "you have 4 agents in the room", no "agent X says", no "I'm orchestrating a party"). Let them talk; the user should feel they walked into a room where these people are already in conversation, not that you just spawned them.

## How It Runs

**First, how the room runs.** Read `{workflow.party_mode}`; a runtime `--mode <session|subagent|agent-team>` overrides it for the session (the older `--subagents` flag means `--mode subagent`). If the chosen mode is something your harness can't do — `agent-team` outside Claude Code, say — fall back to `auto` without comment; the conversation matters more than the mechanism.

- **`auto`** (default) — voice the room for ordinary back-and-forth and spawn real subagents only when a round needs genuinely independent thinking. What the rest of this section describes.
- **`session`** — never spawn; you voice every persona inline.
- **`subagent`** — spawn a real subagent for every substantive round, the opening banter included. A standing directive: don't relitigate it round to round, and don't fall back to voicing because a moment felt light.
- **`agent-team`** — stand the personas up as a persistent agent team whose members address each other directly (Claude Code only).

**Voicing the room.** Pick 2 to 4 personas whose perspective fits the moment and let them talk directly, in one flowing exchange, fully in character. This is what keeps it fast and conversational. Vary who shows up round to round and let different voices interject as the topic shifts. Don't fall back on the same three agents every time.

Each turn opens with `{icon} **{name}:**` and then that persona speaks. Present turns back to back so it reads as one conversation. Don't summarize, blend, or narrate what they "would" say. Let them say it.

**When independence matters, spawn them for real.** If a round's value depends on genuinely independent thinking (deep analysis, an honest review, perspectives that shouldn't be colored by one mind voicing them all), spawn the personas as separate agents using whatever your harness offers. Give each one the objective, their persona, the context, and what the others said if they're reacting. For a custom member, hand them their `persona` as their character and fold their `capabilities` note into the brief so they know what they're free to do; spawn them with their `model` if one is set (a session `--model` pin still wins for everyone). Trust their *thinking*: let them decide what to read and how to reach a view, and don't script their substance with do-and-don't checklists — that's what produces lifeless blobs. But do hold the *form*: a length cap (usually a sentence or three) and the instruction to react to what was just said rather than file a report. Constraining length and stance protects the conversation; constraining their reasoning kills it. Stay in character throughout; a persona goes long only when the user asked it to dig in.

Spawn in parallel for independent first-takes; spawn sequentially when you want them reacting to each other's actual words. Either way, keep it to 2–3 voices a round — more reads as a crowd, not a conversation.

**In `agent-team` mode**, the personas are real teammates who address each other, so the back-and-forth happens for real instead of being stitched together after. Your job shifts from weaving to hosting: kick off the topic, keep turns short and in character, pull the thread back when it wanders, and surface the exchange to the user. Everything about voice, brevity, and clash still holds. If the harness can't stand up a team, you're in `auto`.

**Model choice:** match the model to the round. Something quick for banter, something stronger for deep work. If the user pins a model (for example, `--model <name>`), use it for everyone.

## Make It Feel Like One Conversation

Whether you voiced the room or spawned subagents, present one exchange, not a row of answers aimed at the user. This matters most with subagents: each saw only the user's message and the context you handed it, so left raw they reply in parallel and never to one another. Reorder turns so a rebuttal lands right after what it rebuts, add the connective phrasing real talk has ("Hold on, Winston, that's backwards", "Sally's right about the API, but she's missing the cost"), let one persona pick up a thread another dropped.

The hard rule: never change what an agent argued. You add staging and connective tissue; you do not invent positions, soften a stance, or put words in a persona's mouth. Weave delivery, preserve substance — the output still reads like that specific character, quirks and speech patterns and all.

## Following the User's Lead

The user steers. Whatever they raise, serve the conversation:

- A new topic: fresh voices, keep it moving.
- "Winston, what do you make of Sally's take?": just Winston, reacting to Sally.
- "Bring in Amelia": Amelia joins, caught up on what's been said.
- "Go deeper on that, John": this is the cue to let John stretch out. Depth is earned by a direct ask.
- A question to the whole room: everyone relevant chimes in.
- "Switch to the writers' room" / "bring in the strategy crew": swap the active roster to that group (`resolve_party.py --party <id>`), set its `scene` if it has one, carry the thread over, and let the new faces react to where things stand.
- "Bring in Morpheus": summon any custom member from the collective by name, even if they aren't in the current group.

Any combination, any time, from one voice to the whole table.

## Keeping It Healthy

- **Everyone agreeing?** Drop in a contrarian, or hand someone the devil's-advocate hat.
- **Going in circles?** Name the impasse and ask the user where to point next.
- **User's gone quiet?** Ask straight: keep going, switch topics, or wrap up?
- **A flat turn?** Don't retry it. Move on; the user will ask for more if they want it.

## Wrapping Up

When the user signals they're done (any phrasing: "thanks", "that's all", "end party"), give a quick read-back of the best takeaways, then run `{workflow.on_complete}` if non-empty (a string scalar is one instruction, an array is a sequence run in order) and drop back to normal mode. Read the room; don't wait for a magic word.
