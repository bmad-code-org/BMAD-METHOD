# Platform Adapter: Claude Code

## Capabilities

| Feature | Support |
|---|---|
| Parallel sub-agents | Yes — multiple `Agent` tool calls in one response |
| Nested sub-agents | Yes (not needed for party mode) |
| Inline prompt injection | Yes — full prompt passed at spawn time |
| Pre-defined agent files | Not required |
| Model selection | Yes — `model` parameter per agent |
| Tool access in sub-agents | Based on `subagent_type` |

## How to Spawn a Party Mode Agent

Use the **Agent tool** for each selected agent:

```
Agent tool call:
  description: "{displayName} responds to discussion"
  subagent_type: "general-purpose"
  prompt: <assembled from ./references/agent-prompt-template.md>
  model: <optional — see Model Selection below>
```

**Key parameters:**
- `description` — Short label: e.g., "Winston responds to architecture question"
- `subagent_type` — Always `"general-purpose"` for party mode agents
- `prompt` — Fully assembled agent prompt with personality, context, depth signal, and user message
- `model` — Optional override (see below)

## Model Selection Strategy

Claude Code supports per-agent model selection. Use this to optimize cost and speed:

| Round calibration | Model | Rationale |
|---|---|---|
| Depth: "brief", simple factual question | `"haiku"` | Fast, cheap — no need for heavy reasoning |
| Depth: "standard", normal discussion | Omit (inherit current) | Default model handles this well |
| Depth: "deep", complex analysis | Omit (inherit current) | Full capability needed |
| Cross-talk reactions (2-3 sentences) | `"haiku"` | Short reactive responses don't need heavy models |
| Farewell responses | `"haiku"` | 1-2 sentences of in-character goodbye |

Only use `"haiku"` when the response is genuinely simple. When in doubt, omit the parameter.

## Parallel Execution

To spawn agents in parallel, include **multiple Agent tool calls in a single response message**. Claude Code executes them concurrently and returns all results together.

Example for a 3-agent round:
```
Response contains:
  Agent call 1: description="Winston responds", prompt=<winston_prompt>
  Agent call 2: description="Maya responds", prompt=<maya_prompt>
  Agent call 3: description="Rex responds", prompt=<rex_prompt>
```

All three run simultaneously. Collect all results before presenting to user.

## Cross-Talk Pass

For cross-talk, spawn agents **sequentially** (one Agent call per response) so each can see previous outputs. Include Pass 1 responses in the prompt under "Other Agents' Responses This Round".

Consider using `model: "haiku"` for cross-talk since responses are short reactions.

## Constraints

- Sub-agents return text results to the orchestrator — not visible to user until presented
- Each sub-agent gets a fresh context (no conversation history — include relevant context in prompt)
- Sub-agents should NOT use tools — instruct them to respond with text only
- Token cost scales linearly with agents spawned per round

## Optimization

- Single agent for simple questions — skip parallel overhead
- Keep conversation context under 400 words
- Use `"haiku"` for brief/reactive rounds to save tokens and time
- The orchestrator's context window is the bottleneck in long sessions — maintain the compaction state block diligently
- If a spawn fails, present remaining agents normally — don't retry or block
