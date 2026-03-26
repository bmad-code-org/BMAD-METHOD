# Platform Adapter: Gemini CLI

## Hard Constraint: One Agent = One Sub-Agent

**NEVER create a single "generalist" or "roundtable" sub-agent that role-plays multiple agents.** This is the #1 failure mode on Gemini CLI. Each BMAD agent MUST be invoked as its own separate `@agent_name` call. The entire value of party mode is that each agent is a genuinely independent process with its own thinking.

**Wrong (DO NOT DO THIS):**
```
@generalist "Act as Winston, Maya, and Rex and have a roundtable discussion about..."
```

**Right:**
```
@winston "Discussion context: ... User's message: ..."
@maya "Discussion context: ... User's message: ..."
@rex "Discussion context: ... User's message: ..."
```

If you find yourself creating a single sub-agent to simulate the roundtable, STOP — you are breaking party mode's core promise.

## Capabilities

| Feature | Support |
|---|---|
| Parallel sub-agents | No — sequential execution only |
| Nested sub-agents | No |
| Inline prompt injection | No — agents must be pre-defined as `.gemini/agents/*.md` |
| Pre-defined agent files | **Required** — one file per BMAD agent |
| Model selection | Via `model` field in agent definition |
| Tool access in sub-agents | Explicit whitelist via `tools` field |

## Setup: Pre-Defined Agent Files (Required)

Gemini CLI **requires** agent definitions as individual markdown files before invocation. During Stage 1, generate **one file per BMAD agent** — NOT a single combined file:

**Skip if files already exist and manifest hasn't changed** (same agent count and names).

**Template — `.gemini/agents/{agent-name}.md`:**
```markdown
---
name: {name}
description: "{displayName} - {title}. {role}"
kind: local
tools:
  - read_file
  - grep_search
model: gemini-2.5-pro
temperature: 0.7
max_turns: 5
---

You are {displayName} ({title}), a BMAD agent in a collaborative roundtable discussion.

## Your Personality
- **Icon:** {icon}
- **Role:** {role}
- **Identity:** {identity}
- **Communication Style:** {communicationStyle}
- **Principles:** {principles}

## Standing Instructions
- Respond as {displayName}. Your genuine expert perspective — not a safe, hedged AI answer.
- Start every response with: {icon} **{displayName}**:
- Match your documented communication style exactly.
- Scale response length to the substance of your point.
- If you disagree with another agent, say so directly.
- If you have nothing substantial to add, say so in one sentence.
- Respond in {communication_language}.
```

**Configuration notes:**
- `kind: local` — runs on the local machine
- `tools` — Minimal read-only tools. Omit entirely to inherit all parent tools (less secure).
- `temperature: 0.7` — Slightly elevated for personality variation
- `max_turns: 5` — Safe ceiling; party agents complete in 1-2 turns

**Verification after setup:** Confirm that `.gemini/agents/` contains one `.md` file per BMAD agent (not a single combined file). The file count should match the agent count from the manifest.

## How to Spawn a Party Mode Agent

Each agent is invoked **individually** with `@{name}`:

```
@{name} Discussion context: {conversation_context_summary}

Depth: {brief | standard | deep}
User's message: {user_message}

Respond in character as {displayName}.
```

**For a 2-agent round, this means TWO separate `@` invocations:**
```
@winston Discussion context: The team is debating API architecture...
Depth: standard
User's message: What do you think about microservices vs monolith?
Respond in character as Winston.

@maya Discussion context: The team is debating API architecture. Winston suggested...
Depth: standard
User's message: What do you think about microservices vs monolith?
Respond in character as Maya.
```

**For a 3-agent round, THREE separate `@` invocations.** Never combine agents.

## Sequential Execution Strategy

Gemini CLI executes sub-agents **sequentially**. Turn this into an advantage:

```
1. @primary_agent {prompt} → collect response, present to user
2. @secondary_agent {prompt + primary's response} → collect response, present to user
3. (Optional) @tertiary_agent {prompt + both responses} → collect response, present to user
4. Show [E] exit option
```

**Why this works:** Each subsequent agent naturally sees prior responses — **free cross-talk**. No separate cross-talk pass needed. The sequential format creates a natural conversation flow where each agent builds on or reacts to what came before.

**Present each response as it arrives** so the user isn't waiting on a blank screen.

**Latency management:**
- Default to 2 agents per round to keep wait times reasonable
- Use 3 agents only for genuinely complex/cross-cutting topics
- For "brief" depth rounds, consider 1 agent only

## Constraints

- **One `@agent_name` call = one agent.** Never bundle multiple agents into one call.
- Sub-agents **cannot call other sub-agents** — no nested delegation
- `max_turns` caps internal steps — set low for simple responses
- Agent definition files **must exist before invocation**
- `.gemini/agents/` directory must exist — create if needed
- Gemini CLI sub-agents feature is **experimental** — behavior may evolve

## Cleanup

Generated `.gemini/agents/*.md` files persist between sessions. Note briefly during exit if files were created. Do NOT delete automatically.

## Fallback

If file creation fails or `@agent_name` invocation is unavailable, fall back to **single-LLM role-play**: the orchestrator generates responses in character within its own context. **This must be announced to the user** — e.g., "Sub-agent spawning isn't available, so I'll role-play the agents directly. Responses won't have independent thinking."

Single-LLM role-play is always the LAST resort, never the first approach. Always attempt individual `@agent_name` invocations first.
