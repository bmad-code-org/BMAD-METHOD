# Stage 2: Conversation Orchestration

## Goal

Run the adaptive conversation loop: for each user message, score and select agents, calibrate the round, spawn sub-agents, assess quality, optionally cross-talk, present, and update state.

## Compaction Survival

Long sessions will hit context limits. Maintain a running state block — **replace** (never append) every 3 rounds or on significant topic shifts:

```
[PARTY MODE STATE]
Platform: {platform} | Adapter: {adapter}
Round: {N}
Momentum: {high | steady | low}
Roster: [{icon} {displayName} — expertise: {keywords}, last_round: {N}] × all agents
Active recent: [{agents from last 2 rounds}]
Topics covered: [{brief list with round numbers}]
Current thread: {what the conversation is about now}
Key positions: [{agent}: {stance}] — only for live disagreements
User signals: {favored agents, expressed interests, engagement level}
Rotation: [{agent}: {rounds participated}/{total rounds}] — flag if any > 60%
[/PARTY MODE STATE]
```

Keep under 350 words. Must contain enough agent data to reconstruct spawn prompts post-compaction.

## Conversation Loop

### 1. Check Exit

If the user's message matches an exit trigger (`*exit`, `goodbye`, `end party`, `quit`, `[E]`), go to `./step-03-exit.md`. Don't spawn agents for an exit message.

### 2. Analyze Input

Assess in ~5 seconds of thought:

| Dimension | Question |
|---|---|
| **Domain** | What expertise area(s) does this touch? |
| **Complexity** | Quick take, standard discussion, or deep dive? |
| **Continuity** | Builds on current thread or new topic? |
| **Directed** | Did the user name a specific agent? |
| **Tension potential** | Will perspectives likely diverge? |
| **Momentum** | Is conversation energy rising, steady, or dropping? |

### 3. Score & Select Agents

Apply the scoring algorithm from SKILL.md:

1. For each agent, compute relevance score (0-10) using expertise match (×4), complementarity (×3), recency penalty (×2), and user affinity (×1)
2. Select primary (highest score)
3. Select secondary only if complementarity ≥ 2
4. Select tertiary only if genuinely cross-cutting AND complementarity ≥ 3
5. Simple questions → primary only

**Quick check:** If the same agent would be primary for the 4th consecutive round, cap their score at 5 and re-evaluate.

### 4. Calibrate Round

Based on input analysis, set round parameters:

- **Agent count:** 1-3 (from scoring)
- **Depth signal:** "brief" / "standard" / "deep" — inject into agent prompts
- **Cross-talk:** pre-decide yes/no/conditional (see scoring below)
- **Model hint:** "fast" for trivial questions, "default" otherwise — adapter decides if actionable

### 5. Build Conversation Context

Compose a concise context block for injection into agent prompts:

- Current discussion thread (2-3 sentences)
- Key positions taken by agents so far (if relevant)
- The user's current message (verbatim)

**Keep under 400 words.** Each sub-agent gets a fresh context window — every token here is multiplied by agents spawned.

### 6. Spawn Agents (Pass 1)

Use the platform adapter's spawning mechanism. **Each selected agent MUST be spawned as its own separate sub-agent invocation.** Never create a single sub-agent that role-plays multiple agents.

- **Claude Code:** Multiple `Agent` tool calls in a single response → parallel execution
- **Codex:** Request parallel agent spawning → parallel by default
- **Gemini CLI:** Sequential `@agent_name` invocations — one per agent, never combined. Present each response as it arrives.

For each agent, assemble the prompt from `./references/agent-prompt-template.md` with their personality profile, conversation context, depth signal, and the user's message.

**If a spawn fails:** Present the remaining agents' responses normally. Note the failure only if it affects the round's coherence. Don't retry — the round can succeed with fewer voices.

### 7. Cross-Talk Decision (Scored)

**Skip on Gemini CLI** — sequential execution provides cross-talk naturally.

**On Claude Code / Codex**, score cross-talk value:

| Signal | Points |
|---|---|
| Agents took opposing positions | +3 |
| One agent raised a point in another's domain | +2 |
| User explicitly asked for debate/discussion | +3 |
| Agents' responses are complementary (no tension) | -2 |
| Round already has 3 agents | -1 |
| Simple/factual question | -3 |

**Threshold:** Cross-talk if score ≥ 2.

**Cross-talk prompt addition:**
```
Other agents said this round:
{agent_responses_from_pass_1}

React briefly — agree, challenge, or build on one specific point. 2-3 sentences max. Don't repeat yourself.
```

Spawn 1-2 agents max for cross-talk. Prefer agents whose domains were referenced by others.

### 8. Assess Round Quality

Before presenting, quick sanity check:

- **Redundancy:** If 2+ agents said essentially the same thing, present the richer version and briefly summarize the agreement rather than showing redundant full responses
- **Length:** If a response is disproportionately long for the question's complexity, mentally note for next round's depth calibration
- **Direct questions:** Did any agent ask the user a question?

### 9. Present Round

**CRITICAL: Always show Pass 1 responses first.** Cross-talk is supplementary — it adds to the thread, never replaces it. The user must see the complete conversation: initial takes, then reactions.

**Presentation order:**
1. **Pass 1 responses** — primary → secondary → tertiary (each agent's initial, independent take)
2. **Cross-talk responses** (if any) — presented as natural follow-up reactions after a visual separator

**Formatting:**
- Each response prefixed with the agent's `{icon} **{displayName}**:`
- Clear visual separation between agents
- Between Pass 1 and cross-talk, use a brief separator (e.g., a horizontal rule or a line like "---") but do NOT label it "cross-talk" — just let the reactions flow naturally as follow-up remarks

**If any agent asked the user a direct question:** Present responses up to that point and **stop**. If multiple agents asked questions, consolidate into one clear prompt.

Otherwise, end with a light touch — don't always repeat the same boilerplate. Vary between:
- A brief thread-pulling question from the orchestrator
- Simply: `[E] Exit Party Mode`
- Nothing extra if the agents' responses naturally invite continuation

### 10. Update State

Refresh the `[PARTY MODE STATE]` block if:
- 3 rounds have passed since last update, OR
- Topic shifted significantly, OR
- Momentum changed

## Momentum Adaptation

| Momentum | Signals | Orchestrator Response |
|---|---|---|
| **High** | User asks follow-ups, multi-sentence input, names agents | Allow longer responses, encourage cross-talk, maintain current voices |
| **Steady** | Normal engagement, varied topics | Standard calibration |
| **Low** | Short replies ("ok", "sure"), long gaps, repetitive topics | Rotate voices, shorten rounds, introduce contrarian angle, or ask user directly |
| **Declining** | Was high, now dropping | Acknowledge the shift — new topic? deeper on something? wrap up? |

Adapt silently. Never announce "momentum is low" — just adjust behavior.

## Error Recovery

| Failure | Response |
|---|---|
| Sub-agent spawn fails | Present remaining agents, note briefly if coherence affected |
| All spawns fail | Fall back to single-LLM role-play for this round, note the degradation |
| Agent returns empty/garbage | Skip that response, proceed with others |
| Platform adapter unavailable | Switch to single-LLM role-play, inform user once |
| Context approaching limits | Force a state block update, trim conversation context aggressively |
