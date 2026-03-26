# Platform Adapter: Codex (OpenAI)

## Capabilities

| Feature | Support |
|---|---|
| Parallel sub-agents | Yes — parallel by default, up to `agents.max_threads` (default 6) |
| Nested sub-agents | No — `agents.max_depth` defaults to 1 |
| Inline prompt injection | Yes — via natural language spawning |
| Pre-defined agent files | Supported — `.codex/agents/*.toml` for persistent definitions |
| Model selection | Via TOML `model` field per agent definition |
| Tool access in sub-agents | Inherited from parent + per-agent overrides |

## Setup: Pre-Defined Agent Files (Recommended)

During Stage 1 (Initialize), generate a TOML file for each BMAD agent in `.codex/agents/`:

**Skip if files already exist and manifest hasn't changed** (same agent count and names).

**Template — `.codex/agents/{agent-name}.toml`:**
```toml
name = "{name}"
description = "{displayName} - {title}. {role}"

developer_instructions = """
You are {displayName} ({title}), a BMAD agent in a collaborative roundtable discussion.

Your Personality:
- Icon: {icon}
- Role: {role}
- Identity: {identity}
- Communication Style: {communicationStyle}
- Principles: {principles}

Instructions:
- Respond as {displayName}. Your genuine expert perspective — not a safe, hedged AI answer.
- Start with: {icon} **{displayName}**:
- Match your documented communication style exactly.
- Scale response length to the substance of your point.
- If you disagree with another agent, say so directly.
- If you have nothing substantial to add, say so in one sentence.
- Respond in {communication_language}.
"""

sandbox_mode = "read-only"
```

`sandbox_mode = "read-only"` — party agents think and respond, they don't modify files.

## How to Spawn a Party Mode Agent

**Option A — Reference pre-defined agents (recommended):**
```
Spawn agent "{name}" with this context:
Discussion so far: {conversation_context_summary}
Depth: {brief | standard | deep}
User's message: {user_message}
Respond in character. Start with {icon} **{displayName}**:
```

**Option B — Natural language spawning (dynamic):**
```
Spawn an agent to respond as {displayName} with this context:
[conversation context summary]
User's message: {user_message}
The agent should respond in character as {displayName}, starting with {icon} **{displayName}**:
```

## Parallel Execution

Codex runs sub-agents **in parallel by default**. Spawn multiple together:

```
Spawn these agents in parallel and wait for all results:
1. Agent "{agent_a_name}" — respond to: {user_message} with context: {context}
2. Agent "{agent_b_name}" — respond to: {user_message} with context: {context}
```

Executes concurrently (up to `max_threads`) and consolidates results.

## Presentation: Always Show Pass 1

**CRITICAL:** Pass 1 agent responses MUST be presented to the user in full BEFORE any cross-talk. Cross-talk is supplementary — it adds reactions to the thread, it does NOT replace initial responses. The user must see:

1. Each agent's independent initial take (Pass 1)
2. Then any cross-talk reactions (Pass 2) as follow-up remarks

Never skip, summarize, or fold Pass 1 into the cross-talk output.

## Cross-Talk Pass

Cross-talk is an **additional pass** — spawn sequentially with previous agents' responses as context:

```
Spawn agent "{agent_b_name}" with this additional context:
Other agents said this round:
{agent_a_response}

React briefly — agree, challenge, or build on one specific point. 2-3 sentences max.
```

The cross-talk responses are appended AFTER the Pass 1 responses when presenting to the user.

## Constraints

- `agents.max_threads` default 6 — more than enough for 2-3 party agents
- `agents.max_depth` of 1 — party agents cannot delegate further (not needed)
- Approval requests from sub-agents surface to user — `sandbox_mode = "read-only"` minimizes interruptions
- Token cost proportional to agents spawned

## Cleanup

Generated `.codex/agents/*.toml` files persist between sessions for reuse. During exit (Stage 3), note this briefly if files were created. Do NOT delete automatically.
