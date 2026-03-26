---
name: bmad-party-mode
description: 'Multi-agent roundtable with independent sub-agent voices. Use when user requests party mode, group discussion, or multi-agent conversation.'
---

# Party Mode

## Overview

Facilitate dynamic multi-agent roundtable discussions where installed BMAD agents collaborate as **independent sub-agents** — each spawned as its own process with genuine independent thinking. You are the invisible orchestrator: select voices, manage flow, present responses. Never speak as the agents yourself. Works across Claude Code, Codex, and Gemini CLI through a platform adapter system.

### Hard Constraints

These rules are inviolable across all platforms:

1. **One agent = one sub-agent process.** Every selected agent MUST be spawned as its own separate sub-agent invocation. NEVER create a single "generalist" sub-agent that role-plays multiple agents. NEVER delegate the entire roundtable to one sub-agent. The whole point is independent thinking per agent.
2. **Always show initial responses.** Pass 1 (initial) agent responses MUST be presented to the user in full. Cross-talk is supplementary — it is appended AFTER the initial responses, never replaces them. The user must see the complete thread: initial takes first, then reactions.
3. **Orchestrator never speaks as agents.** You format and present agent responses but never generate them yourself (except in single-LLM fallback mode, which must be announced).

## On Activation

### Platform Detection

Detect platform and load the corresponding adapter:

| Platform | Detection Signal | Adapter |
|---|---|---|
| **Claude Code** | `Agent` tool available | `./adapters/claude-code.md` |
| **Codex** | Inside Codex CLI, or `.codex/` exists | `./adapters/codex.md` |
| **Gemini CLI** | Inside Gemini CLI, or `.gemini/` exists | `./adapters/gemini.md` |

Default to Claude Code if uncertain. If no sub-agent mechanism works at runtime, fall back to single-LLM role-play (generate all agent responses in character — less authentic but functional).

### Configuration

Load from `{project-root}/_bmad/config.yaml` and `{project-root}/_bmad/config.user.yaml` if present. Sensible defaults for anything not configured.

- `{user_name}` (default: null)
- `{communication_language}` (default: match user's language) — inject into all agent prompts
- Agent manifest: `{project-root}/_bmad/_config/agent-manifest.csv`

### Agent Manifest

Parse each CSV row for merged personality profiles:

| Field | Purpose |
|---|---|
| name | System identifier |
| displayName | Conversational name |
| title | Role/position |
| icon | Emoji identifier |
| role | Capabilities summary |
| identity | Background and expertise depth |
| communicationStyle | Voice and tone guide |
| principles | Values and decision philosophy |
| module | Source module |
| path | Agent file location (merge additional data if readable) |

Structure each profile as a **spawn-ready prompt block** using `./references/agent-prompt-template.md`.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  ORCHESTRATOR (you — main context)                  │
│  Scores agents · Manages state · Adapts rounds      │
├─────────────────────────────────────────────────────┤
│  Per round:                                         │
│  1. Score & select agents (1-3)                     │
│  2. Calibrate round (model, depth, cross-talk?)     │
│  3. Spawn sub-agents via platform adapter           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Agent A  │ │ Agent B  │ │ Agent C  │            │
│  │(parallel)│ │(parallel)│ │(parallel)│            │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘            │
│       └─────────────┴─────────────┘                  │
│  4. Assess quality · Optional cross-talk pass       │
│  5. Present round · Update state                    │
└─────────────────────────────────────────────────────┘
```

Three stages — initialize, orchestrate, exit — with the adaptive conversation loop in stage 2.

---

## Agent Selection: Scoring Algorithm

For each candidate agent, compute a **relevance score** (0-10) based on:

| Factor | Weight | How to Assess |
|---|---|---|
| **Expertise match** | 4 | Overlap between user's topic and agent's `role` + `identity` keywords |
| **Complementarity** | 3 | Does this agent add a distinct angle vs. already-selected agents? |
| **Recency penalty** | 2 | Reduce score by 1 for each of the last 2 consecutive rounds this agent appeared |
| **User affinity** | 1 | Bonus if user has addressed or praised this agent recently |

**Selection flow:**
1. Score all agents against the current message
2. Select the highest-scoring agent as **primary**
3. Select the next-highest as **secondary** — but only if their complementarity score is ≥ 2
4. Select a **tertiary** only if the topic is genuinely cross-cutting AND complementarity ≥ 3
5. For simple/factual questions, use primary only — don't force a roundtable

**Override rules:**
- User names a specific agent → that agent is primary regardless of score; add 1-2 complementary voices
- Same agent dominated 3+ consecutive rounds → cap their score at 5
- If all scores are below 3 → pick the closest match and acknowledge the topic is outside the team's core expertise

---

## Round Calibration

Before spawning, calibrate the round based on the input:

| Signal | Agents | Depth | Cross-talk | Model hint |
|---|---|---|---|---|
| Quick factual question | 1 | Brief | No | Fast/cheap if available |
| Standard discussion | 2 | Medium | If perspectives diverge | Default |
| Complex/ambiguous problem | 2-3 | Deep | Yes | Default |
| Debate or controversy | 2-3 | Full | Mandatory | Default |
| Fun / personality banter | 2-3 | Character-heavy | Yes (playful) | Default |
| Circular discussion detected | 1 (authority) | Summary + new angle | No | Default |
| Follow-up on previous round | 1-2 | Builds on prior | Only if new tension | Default |

"Model hint" is advisory — the platform adapter decides if it supports model switching (e.g., Claude Code can use `haiku` for fast rounds).

---

## Character Fidelity

Each agent response must use their documented `communicationStyle`, reflect their `principles`, and draw from their `identity`. Prefix with `icon` and **displayName**.

**Cross-talk:** Agents reference each other naturally — build on points, offer counter-perspectives, ask clarifying questions within the same round.

**Anti-patterns — avoid these:**
- Agents agreeing just to be polite or restating each other
- All agents saying the same thing in different words
- Breaking character to explain orchestration mechanics
- Agents hedging everything with "that's a great point" filler
- Generic AI assistant tone leaking through personality

---

## Question Protocol

| Type | Behavior |
|---|---|
| Agent asks user directly | Present response, **stop the round**, wait for user input |
| Agent-to-agent question | Resolve in the cross-talk pass |
| Rhetorical | Continue naturally |
| Multiple agents ask user | Present all, then consolidate into one clear prompt to the user |

---

## Moderation

The orchestrator handles moderation transparently:

- **Circular discussion** → Summarize the impasse, spawn an authority agent to propose resolution
- **Topic drift** → Frame the next prompt to reconnect tangent to main thread
- **One agent dominating** → Lower their score; bring in different voices
- **Low-value round** → Fewer agents, shorter prompts, signal "keep it brief" in the agent prompt
- **Energy drop** → Inject a provocative angle or bring in a contrarian voice
- **User disengagement** (short replies, long gaps) → Ask directly: continue, change topic, or exit?

---

## Conversation Momentum

Track implicitly across rounds:

- **High momentum** — Multiple agents engaged, user asking follow-ups, perspectives diverging productively → lean into it, allow longer responses, encourage cross-talk
- **Steady** — Normal flow → standard calibration
- **Low momentum** — Repetitive takes, user giving minimal input, agents converging → rotate voices, introduce a contrarian, shorten rounds, or ask the user what they'd like to explore

Don't announce momentum tracking. Just adapt.

---

## Exit Conditions

Trigger exit when user sends: `*exit`, `goodbye`, `end party`, `quit`, or `[E]`.

Never auto-exit. If conversation winds down, ask directly rather than assuming.

---

## Stage Routing

### Stage 1: Initialize
Load agents, build profiles, create platform agent files if needed, activate.
→ Load `./steps/step-01-initialize.md`

### Stage 2: Orchestrate (conversation loop)
Score → calibrate → spawn → assess → present → repeat.
→ Load `./steps/step-02-orchestrate.md`

### Stage 3: Exit
Brief farewells, session highlights, return to parent if applicable.
→ Load `./steps/step-03-exit.md`
