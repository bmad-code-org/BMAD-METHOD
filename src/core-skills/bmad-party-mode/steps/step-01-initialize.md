# Stage 1: Initialize Party Mode

## Goal

Detect platform, load agents, build spawn-ready profiles with expertise vectors, create platform-specific definitions if needed, and launch — all in a single turn.

## Sequence

### 1. Detect Platform

Determine which AI CLI platform you are running on:

- **Claude Code** → `Agent` tool is available in your tool list
- **Codex** → You are inside OpenAI Codex CLI, or `.codex/` directory exists at project root
- **Gemini CLI** → You are inside Gemini CLI, or `.gemini/` directory exists at project root

Load the corresponding adapter: `./adapters/{platform}.md`

Default to **Claude Code** if uncertain. If no sub-agent mechanism works at runtime, fall back to single-LLM role-play.

### 2. Load Agent Manifest

Read and parse `{project-root}/_bmad/_config/agent-manifest.csv`.

**If missing or empty:** Tell the user party mode requires installed BMAD agents with a configured manifest. Suggest they check their `_bmad/_config/` setup. End the workflow.

### 3. Build Personality Profiles

For each agent in the manifest:

1. **Merge data** — Combine CSV fields into a complete profile. If the agent's `path` points to a readable file, merge additional personality data from that file.

2. **Extract expertise vectors** — From `role`, `identity`, and any merged file data, identify 3-5 expertise keywords per agent (e.g., "architecture", "testing", "ux", "security", "devops"). Store these for fast scoring during orchestration.

3. **Structure as spawn-ready prompt** — Use `./references/agent-prompt-template.md`. Each profile must be rich enough that a sub-agent can convincingly embody the agent's voice without any other context.

4. **Validate profile completeness** — Each profile must have at minimum: `displayName`, `icon`, `role`, and `communicationStyle`. Flag incomplete profiles and note them but don't block on them.

5. **Group by expertise domain** — Organize agents into overlapping domain clusters for fast selection. An agent can belong to multiple domains.

### 4. Create Platform-Specific Agent Definitions (if required)

Check the loaded adapter for setup requirements:

- **Claude Code** — No pre-creation needed. Agents are spawned inline.
- **Codex** — Generate `.codex/agents/{name}.toml` per agent using the adapter's template. Create directory if needed. **Skip if files already exist and the manifest hasn't changed** (compare agent count and names as a quick fingerprint).
- **Gemini CLI** — Generate `.gemini/agents/{name}.md` per agent using the adapter's template. Create directory if needed. **Skip if files already exist and the manifest hasn't changed.**

If file creation fails, note it and proceed — fallback is single-LLM role-play.

### 5. Activate Party Mode

Introduce the session with energy and personality:

- Welcome the user by name (if configured)
- Show 3-4 diverse agents from the roster (across different expertise domains) with their icon, name, title, and a one-line personality flavor
- State total agent count
- Briefly explain: *each agent thinks independently as its own process — this is a genuine roundtable, not one AI playing pretend*
- Invite the user's first topic or question — they can address specific agents by name or throw a topic to the whole group

**Tone:** Enthusiastic but not overwrought. A team of experts ready to collaborate.

### 6. Initialize State Block

Create the first `[PARTY MODE STATE]` block:

```
[PARTY MODE STATE]
Platform: {platform} | Adapter: {adapter}
Agent count: {N}
Roster: [{icon} {displayName} ({title}) — expertise: {keywords}] × N
Domain clusters: {domain → agent names}
Round: 0
Momentum: starting
[/PARTY MODE STATE]
```

Include enough data to reconstruct spawn prompts post-compaction.

### 7. Transition

Immediately proceed to `./step-02-orchestrate.md`.

## Error Handling

| Error | Action |
|---|---|
| Missing CSV columns on an agent | Skip that agent, note briefly, continue |
| Fewer than 2 agents available | Warn that party mode works best with multiple agents, proceed |
| Agent file at `path` not readable | Use manifest data alone for that agent's profile |
| Platform agent file creation fails | Fall back to single-LLM role-play, inform user |
| Profile missing required fields | Exclude from roster, note which agent and what's missing |
