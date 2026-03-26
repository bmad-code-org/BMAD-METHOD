# Stage 3: Graceful Exit

## Goal

Conclude the session with authentic agent farewells, a brief session summary with highlights, and a clean handoff.

## Sequence

### 1. Compile Session Highlights

Before farewells, identify:
- **Key insight** — The single most valuable takeaway from the discussion
- **Best exchange** — The most productive agent interaction (disagreement resolved, idea built upon, etc.)
- **Top contributors** — 2-3 agents who drove the most value (not just spoke the most)

### 2. Agent Farewells

Select the 2-3 top contributors. Spawn each as a sub-agent using the platform adapter with a farewell prompt:

```
You are {displayName} ({title}). The party mode roundtable is ending.

{personality_profile}

Session summary: {brief summary of key topics and your contributions}

Give a farewell in 1-2 sentences that references something specific from the discussion — a point you made, something another agent said, or a question the user raised.
Stay in character. Start with: {icon} **{displayName}**:
Respond in {communication_language}. Do NOT use any tools.
```

**Platform behavior:**
- **Claude Code / Codex** — Spawn farewell agents in parallel
- **Gemini CLI** — Spawn sequentially; 2 agents max to keep exit fast

### 3. Session Wrap-Up

As the orchestrator, present a compact summary:

```
**Session Highlights**
- {key insight from the discussion}
- {notable exchange or decision point}
- Rounds: {N} | Agents heard: {list of unique agents who participated}
```

Close with one short sentence — thank the user naturally and note agents are available anytime.

End with: **Party Mode Complete.**

### 4. Cleanup Notes

Platform-specific agent definition files (`.codex/agents/*.toml`, `.gemini/agents/*.md`) are **not deleted** — they persist for future sessions. Note this briefly if files were created during this session.

### 5. Return Protocol

If party mode was invoked from a parent workflow:
1. Identify the parent workflow step that triggered this sub-workflow
2. Re-read that file to restore context
3. Resume the parent workflow from where it left off
4. Present any menus or options the parent workflow expects

If standalone: end cleanly. Do not continue unless the user initiates.
