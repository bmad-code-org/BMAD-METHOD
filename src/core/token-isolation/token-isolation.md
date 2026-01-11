# Token Isolation Architecture

## Overview

Token isolation prevents context bloat in multi-agent scenarios by running agents in isolated subprocesses. Each agent gets its own 150K token context window without consuming the main session's tokens.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TOKEN ISOLATION ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────┤
│   Main Session (150K tokens preserved)                                  │
│                       │                                                  │
│                       ▼ Task Tool spawns subprocess                     │
│              ┌────────────────────┐                                      │
│              │   Agent Instance   │ ◄── Own 150K token context          │
│              │    (subprocess)    │ ◄── Doesn't consume main session    │
│              └─────────┬──────────┘                                      │
│                        │                                                 │
│                        ▼ Only summary returns                           │
│              "Task complete. Output: temp/raw/file.md"                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Core Rules

1. **ALWAYS** use Task tool to invoke agents (preserves main session tokens)
2. Agents write to files, not return full content to main session
3. Use `run_in_background: true` for parallel independent agents
4. Sequential agents receive previous output via content injection
5. Summaries returned to main session must be < 2000 tokens

## Agent Execution Template

```javascript
Task({
    description: "agent-name: brief task description",
    prompt: agentPrompt,
    subagent_type: "general-purpose",
    model: "sonnet",  // or "haiku" for quick tasks
    run_in_background: false  // true for parallel
});
```

## Collaboration Patterns

### Sequential Pattern
```
Agent A → Agent B → Agent C
```
Use when each step depends on previous output.

### Parallel Pattern
```
Agent A ─┐
Agent B ─┼→ Synthesis
Agent C ─┘
```
Use when analyses are independent.

### Debate Pattern
```
Proposer ↔ Challenger → Refined Output
```
Use for critical decisions requiring adversarial review.

### War Room Pattern
```
All Agents → Intensive Collaboration → Solution
```
Use for complex urgent problems.

## Output Management

### File-Based Output
Agents should write outputs to:
- `{output_folder}/temp/` - Temporary working files
- `{output_folder}/raw/` - Raw agent outputs
- `{output_folder}/final/` - Validated final outputs

### Summary Protocol
When an agent completes:
1. Write full output to designated file
2. Return only: status, file path, key findings (< 2000 tokens)
3. Main session can read file if details needed

## Token Budget Tracking

| Threshold | Action |
|-----------|--------|
| 0-80% | Normal operation |
| 80-90% | Warning: Consider wrapping up |
| 90-100% | Critical: Summarize and hand off |
| 100%+ | HALT: Must spawn new subprocess |

## Best Practices

1. **Pre-plan agent work** - Know what each agent needs to do
2. **Minimize cross-agent data** - Pass file references, not content
3. **Use haiku for simple tasks** - Reduces cost and latency
4. **Batch related work** - One agent, multiple related tasks
5. **Checkpoint frequently** - Save progress to files regularly
