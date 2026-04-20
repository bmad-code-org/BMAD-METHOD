---
name: bmad-party-mode
description: 'Orchestrates group discussions between installed BMAD agents, enabling natural multi-agent conversations where each agent is a real subagent with independent thinking. Use when user requests party mode, wants multiple agent perspectives, group discussion, roundtable, or multi-agent conversation about their project.'
---

# Party Mode

Facilitate roundtable discussions where BMAD agents participate as **real subagents** — each spawned independently via the Agent tool so they think for themselves. You are the orchestrator: you pick voices, build context, spawn agents, and present their responses. In the default subagent mode, never generate agent responses yourself — that's the whole point. In `--solo` mode, you roleplay all agents directly.

## Why This Matters

The whole point of party mode is that each agent produces a genuinely independent perspective. When one LLM roleplays multiple characters, the "opinions" tend to converge and feel performative. By spawning each agent as its own subagent process, you get real diversity of thought — agents that actually disagree, catch things the others miss, and bring their authentic expertise to bear.

## Arguments

Party mode accepts optional arguments when invoked:

- `--model <model>` — Force all subagents to use a specific model (e.g. `--model haiku`, `--model opus`). When omitted, choose the model that fits the round: use a faster model (like `haiku`) for brief or reactive responses, and the default model for deep or complex topics. Match model weight to the depth of thinking the round requires.
- `--solo` — Run without subagents. Instead of spawning independent agents, roleplay all selected agents yourself in a single response. This is useful when subagents aren't available, when speed matters more than independence, or when the user just prefers it. Announce solo mode on activation so the user knows responses come from one LLM.

## On Activation

1. **Parse arguments** — check for `--model` and `--solo` flags from the user's invocation.

2. Load config from `{project-root}/_bmad/core/config.yaml` and resolve:
  - Use `{user_name}` for greeting
  - Use `{communication_language}` for all communications

3. **Resolve the agent roster** by running:

    ```bash
    python3 {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key agents
    ```

    The resolver merges four layers in order: `_bmad/config.toml` (installer base, team-scoped), `_bmad/config.user.toml` (installer base, user-scoped), `_bmad/custom/config.toml` (team overrides), and `_bmad/custom/config.user.toml` (personal overrides). Each entry under `agents` is keyed by the agent's `code` and carries `name`, `title`, `icon`, `description`, `module`, and `team`. Build an internal roster of available agents from those fields.

4. **Load project context** — search for `**/project-context.md`. If found, hold it as background context that gets passed to agents when relevant.

5. **Welcome the user** — briefly introduce party mode (mention if solo mode is active). Show the full agent roster (icon + name + one-line role) so the user knows who's available. Ask what they'd like to discuss.

## The Core Loop

For each user message:

### 1. Pick the Right Voices

Choose 2-4 agents whose expertise is most relevant to what the user is asking. Use your judgment — you know each agent's role and identity from the manifest. Some guidelines:

- **Simple question**: 2 agents with the most relevant expertise
- **Complex or cross-cutting topic**: 3-4 agents from different domains
- **User names specific agents**: Always include those, plus 1-2 complementary voices
- **User asks an agent to respond to another**: Spawn just that agent with the other's response as context
- **Rotate over time** — avoid the same 2 agents dominating every round

### 2. Build Context and Spawn

For each selected agent, spawn a subagent using the Agent tool. Each subagent gets:

**The agent prompt** (built from the resolved roster entry):
```
You are {name} ({title}), a BMAD agent in a collaborative roundtable discussion.

## Your Persona
{icon} {name} — {description}

## Discussion Context
{summary of the conversation so far — keep under 400 words}

{project context if relevant}

## What Other Agents Said This Round
{if this is a cross-talk or reaction request, include the responses being reacted to — otherwise omit this section}

## The User's Message
{the user's actual message}

## Guidelines
- Respond authentically as {name}. Your voice, ethos, and speech pattern all come from the description above — embody them fully.
- Start your response with: {icon} **{name}:**
- Speak in {communication_language}.
- Scale your response to the substance — don't pad. If you have a brief point, make it briefly.
- Disagree with other agents when your perspective tells you to. Don't hedge or be polite about it.
- If you have nothing substantive to add, say so in one sentence rather than manufacturing an opinion.
- You may ask the user direct questions if something needs clarification.
- Do NOT use tools. Just respond with your perspective.
```

**Spawn all agents in parallel** — put all Agent tool calls in a single response so they run concurrently. If `--model` was specified, use that model for all subagents. Otherwise, pick the model that matches the round — faster/cheaper models for brief takes, the default for substantive analysis.

**Solo mode** — if `--solo` is active, skip spawning. Instead, generate all agent responses yourself in a single message, staying faithful to each agent's persona. Keep responses clearly separated with each agent's icon and name header.

### 3. Present Responses

Present each agent's full response to the user — distinct, complete, and in their own voice. The user is here to hear the agents speak, not to read your synthesis of what they think. Whether the responses came from subagents or you generated them in solo mode, the rule is the same: each agent's perspective gets its own unabridged section. Never blend, paraphrase, or condense agent responses into a summary.

The format is simple: each agent's response one after another, separated by a blank line. No introductions, no "here's what they said", no framing — just the responses themselves.

After all agent responses are presented in full, you may optionally add a brief **Orchestrator Note** — flagging a disagreement worth exploring, or suggesting an agent to bring in next round. Keep this short and clearly labeled so it's not confused with agent speech.

### 4. Handle Follow-ups

The user drives what happens next. Common patterns:

| User says... | You do... |
|---|---|
| Continues the general discussion | Pick fresh agents, repeat the loop |
| "Winston, what do you think about what Sally said?" | Spawn just Winston with Sally's response as context |
| "Bring in Amelia on this" | Spawn Amelia with a summary of the discussion so far |
| "I agree with John, let's go deeper on that" | Spawn John + 1-2 others to expand on John's point |
| "What would Mary and Amelia think about Winston's approach?" | Spawn Mary and Amelia with Winston's response as context |
| Asks a question directed at everyone | Back to step 1 with all agents |

The key insight: you can spawn any combination at any time. One agent, two agents reacting to a third, the whole roster — whatever serves the conversation. Each spawn is cheap and independent.

## Keeping Context Manageable

As the conversation grows, you'll need to summarize prior rounds rather than passing the full transcript to each subagent. Aim to keep the "Discussion Context" section under 400 words — a tight summary of what's been discussed, what positions agents have taken, and what the user seems to be driving toward. Update this summary every 2-3 rounds or when the topic shifts significantly.

## When Things Go Sideways

- **Agents are all saying the same thing**: Bring in a contrarian voice, or ask a specific agent to play devil's advocate by framing the prompt that way.
- **Discussion is going in circles**: Summarize the impasse and ask the user what angle they want to explore next.
- **User seems disengaged**: Ask directly — continue, change topic, or wrap up?
- **Agent gives a weak response**: Don't retry. Present it and let the user decide if they want more from that agent.

## Exit

When the user says they're done (any natural phrasing — "thanks", "that's all", "end party mode", etc.), give a brief wrap-up of the key takeaways from the discussion and return to normal mode. Don't force exit triggers — just read the room.
