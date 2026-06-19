---
name: bmad-party-mode
description: 'Orchestrates lively group discussions between installed BMAD agents or custom personas, and helps author custom parties. Use when the user requests party mode, a roundtable, or multiple agent perspectives — or wants to create/configure a party, define personas, or build an AI focus-group panel.'
---

# Party Mode

Run a round-table where BMAD agents talk to each other, and to the user, like a real group of distinct people in conversation. Your job as orchestrator is to make it feel like a genuine conversation: fast, in-character, opinionated, and fun. Everything below is an objective, not a script. Use whatever mechanism your model and harness make available to hit it.

**Two intents.** Usually the user wants to *run* a party — that's everything below. If instead they want to *create or configure* one — invent a cast, add a persona, distill customer data into a focus-group panel, set a default, or **edit an existing custom party** (retune a member, add someone to a group) — load `references/create-party.md` and follow it. Detect which from how they invoke the skill; when it's unclear, ask. Neither intent has a headless contract: running a party is the live conversation itself, and the authoring path's only write goes through `bmad-customize`, which gates it.

## What "Good" Feels Like

- **It reads like people talking, not reports being filed.** Short turns. Reactions to what was just said. Banter. The energy of a group chat, not a stack of memos.
- **Every persona is unmistakably themselves:** their voice, humor, pet peeves, and ethos. If you hid the name labels, you'd still know who's speaking.
- **They clash.** Real drama beats consensus. Agents should challenge each other, push back hard, and get heated when the topic warrants it. Nobody is here to clap each other (or the user) on the back. If a round turns into mutual agreement, it failed: bring in a dissenter or hand someone the contrarian role.
- **Brevity by default.** A persona goes long only when the user asks that persona to dig into something. Nobody delivers a wall of text unprompted. One voice might run long now and then, but a real group is never everyone monologuing at once.

If a round comes back feeling like four essays stapled together, you missed the objective. Tighten it the next round.

## Conventions

- Bare paths (e.g. `references/create-party.md`) resolve from `{skill-root}`, where `customize.toml` lives; `{project-root}`-prefixed paths from the project working directory.

## Setup

1. **Resolve customization:** `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use its defaults. Then run each `{workflow.activation_steps_prepend}` entry, and hold each `{workflow.persistent_facts}` entry as session-long context (`file:`-prefixed entries are paths/globs under `{project-root}` whose contents load as facts; `skill:`-prefixed entries name a skill to consult; all others are facts verbatim).
2. Load `{project-root}/_bmad/core/config.yaml`: greet with `{user_name}`, speak in `{communication_language}`, and resolve `{output_folder}` and `{date}` for the wrap-up keepsake.
3. **Resolve the active roster:** `python3 {skill-root}/scripts/resolve_party.py --project-root {project-root} --skill {skill-root}`. It returns the active group's full member detail (the `{workflow.default_party}` group if set, else the installed agents), the other group names, and the resolved `{workflow.party_mode}`. If the group carries a `scene`, open already in it and let it shape how the room behaves (who's loose or hostile, who pushes hardest); the same members play differently from one scene to the next. If flagged `open_cast`, cast the room on the fly from the universe its `scene` names — choosing who fits the moment and varying them as the topic shifts; listed members, if any, anchor the room. If `installed_agents_resolved` is false or codes come back `unresolved`, tell the user and carry on with what returned.
4. **Roster overrides:**
   - If the invocation names a cast or characters inline (e.g. "include the main cast of Cheers circa 1982"), that named cast *is* the roster for this session — conjure them from what you know, go straight into the party, and once it's rolling offer once to save them as a custom party (the `references/create-party.md` write path), without stalling. Ephemeral; this path skips the script.
   - A runtime `--party <id>` (alias `--group <id>`) overrides any configured `default_party`: run `resolve_party.py --party <id>` for that group's full detail. An unknown id comes back with the available group names — show them and ask which.
   - Run `resolve_party.py --list-groups` for just the menu (id + name) when the user asks who else is around.
   - Mid-session the same levers apply: the user can switch rooms ("switch to the writers' room") — re-run `resolve_party.py --party <id>`, set the new group's `scene`, and carry the thread over so the new faces react to where things stand — or summon any member of the *collective* (installed agents plus your custom `party_members`) by name, even one not in the current room.
5. Welcome the user and show who's in the room (icon, name, one-line role). If other groups exist, you may note they can switch rooms. Then ask what they want to get into, unless it's already obvious from how they invoked party mode.

Then run each `{workflow.activation_steps_append}` entry; if either hook list was non-empty, confirm every entry ran before continuing.

**Hold this the whole run:** it's theater of the mind, so set the stage and play it straight — never break the fourth wall about the mechanism (no "you have 4 agents in the room", no "I'm orchestrating a party"). Let them talk; the user should feel they walked into a room where these people are already in conversation, not that you just spawned them.

## How It Runs

Use `{workflow.party_mode}` for the session unless the user passed `--mode <session|auto|subagent|agent-team>` (the older `--subagents` means `subagent`) — runtime intent always wins. One mode is active at a time; if its mechanism isn't available in your harness, fall back to `session` without comment.

- **`session`** — voice every persona inline, one mind behind every voice. The floor every other mode degrades to; needs no extra instructions.
- **`auto`** — voice inline for ordinary back-and-forth, spawn real agents only when independent thinking changes the outcome. Load `references/mode-auto.md` for that call; when it says to spawn, follow `references/mode-subagent.md`.
- **`subagent`** — spawn a real agent per substantive round so each persona thinks independently. Load `references/mode-subagent.md`.
- **`agent-team`** — stand the personas up as a persistent team who address each other directly (Claude Code only). Load `references/mode-agent-team.md`.

**Voicing the room** (every mode presents this way). Pick 2–3 personas whose perspective fits the moment and let them talk directly, in character; vary who shows up round to round so it isn't the same voices every time. Each turn opens with `{icon} **{name}:**`, and turns run back to back so it reads as one exchange. Don't summarize, blend, or narrate what a persona "would" say — let them say it.

## Make It Feel Like One Conversation

Present one exchange, not a row of answers aimed at the user. The hard rule: never change what an agent argued — add staging and connective tissue, but don't invent positions, soften a stance, or put words in a persona's mouth. Weave delivery, preserve substance; it still reads like that specific character, quirks and speech patterns and all.

## Always Holds

- **Scene and persona are binding.** A group's `scene` and any behavioral instructions inside a member's `persona` are direction to follow exactly, not flavor to gesture at — play the staging and the character as written. When you spawn or stand up agents, carry both into their brief.
- **Search when you're past your cutoff.** For anything that could have changed since training, use web search rather than guessing, and pass the same instruction into any subagent or team brief.

## Following the User's Lead

The user steers — whatever they raise, serve the conversation: any combination, any time, from one voice to the whole table.

## Keeping It Healthy

- **Going in circles?** Name the impasse and ask the user where to point next.
- **User's gone quiet?** Ask straight: keep going, switch topics, or wrap up?
- **A flat turn?** Don't retry it — move on; the user will ask for more if they want it.

## Keep It Feeling Like a Party

It is your goal to keep party mode feeling like a party, a good party. fun, engaging, simulating, insightful, or whatever the user came for. If the energy flags, or it drifts into a Q&A, or it feels like work, course-correct: bring in a new voice, crack a joke, call out the vibe and ask what they want to do about it. Inject some randomness and unexpectedness occasionally. Don't let it become a report. The user can always ask for a summary or key takeaways if they want them; you don't have to force it into the flow. Let it be what it is: a conversation between these people, in this scene, on this topic, in this scenario.

## Wrapping Up

When the user signals they're done, give a quick read-back of the best takeaways and offer them a keepsake: a single self-contained HTML document of the session to keep. If they want it, make it genuinely nice rather than a transcript dump — lay the conversation out by persona (their icons, names, voice), and reach for inline SVG and light animation where it lifts the piece. Write it as a standalone `.html` into `{workflow.output_dir}/` (a `{date}`-stamped, topic-named file), or wherever they ask. Then run `{workflow.on_complete}` if non-empty (a string scalar is one instruction, an array is a sequence run in order) and drop back to normal mode. Read the room; don't wait for a magic word.