# Agent Configuration Prompts

---

## 🚨 PREREQUISITE (MUST BE MET BEFORE DISPLAYING)

Before showing agent configuration prompts, you MUST have:

1. ✅ **Complexity Matrix displayed** - User has seen the story complexity breakdown
2. ✅ **`stories_json` populated** - Programmatic complexity data from `bin/story-automator parse-story --rules`
3. ✅ **Complexity summary available** - Counts of Low/Medium/High stories

**If these are not met, DO NOT proceed with agent configuration. Go back and complete step 3.**

---

## Agent Configuration Display (v6.0.0)

**IMPORTANT:** This prompt MUST reference the actual complexity data. Do not show generic prompts.

**IMPORTANT:** Select the correct table variant based on `skip_automate`:
- If `skip_automate` is **false**: show the **WITH auto** table
- If `skip_automate` is **true**: show the **WITHOUT auto** table

**IMPORTANT:** Before displaying options, check for saved presets:
```bash
presets_result=$("{buildStateDoc}" agent-config list --file "{agentConfigPresets}")
preset_count=$(echo "$presets_result" | jq -r '.count')
```
- If `preset_count > 0`: include **[L]oad saved** option in the menu
- If `preset_count == 0`: omit [L] option (show only S/U/C)

### Variant A: WITH auto column (skip_automate=false)

```
**AI Agent Configuration (Based on Your Complexity Analysis)**

Your stories by complexity:
- Low: {low_count} stories
- Medium: {medium_count} stories
- High: {high_count} stories

**Agent Details:**
- **Claude:** `claude --dangerously-skip-permissions` + `bmad-` command prefix
- **Codex:** `codex exec --full-auto` + natural language prompt (no command prefix)

**Suggested Complexity-Based Configuration:**

| Complexity | create | dev | auto | review | Rationale |
|------------|--------|-----|------|--------|-----------|
| Low | claude | claude | claude | claude | Claude handles simple tasks well |
| Medium | codex | codex | codex | codex | Codex for moderate complexity (Claude fallback) |
| High | codex | codex | codex | codex | Codex for complex work (Claude fallback) |
| Retro | claude | - | - | - | Retrospectives always use Claude |

**Options:**
1. **[S]uggested** - Apply complexity-based defaults above
2. **[U]niform** - Same agent for ALL stories (you specify which)
3. **[C]ustom** - Define your own per-complexity or per-task settings
{IF_PRESETS}4. **[L]oad saved** - Use a previously saved configuration{END_IF_PRESETS}

Enter choice ({IF_PRESETS}S/U/C/L{ELSE}S/U/C{END_IF}) or provide custom overrides:
```

**Conditional display rule:** `{IF_PRESETS}` blocks render only when `preset_count > 0`.

### Variant B: WITHOUT auto column (skip_automate=true)

```
**AI Agent Configuration (Based on Your Complexity Analysis)**

Your stories by complexity:
- Low: {low_count} stories
- Medium: {medium_count} stories
- High: {high_count} stories

**Agent Details:**
- **Claude:** `claude --dangerously-skip-permissions` + `bmad-` command prefix
- **Codex:** `codex exec --full-auto` + natural language prompt (no command prefix)

**Suggested Complexity-Based Configuration:**

| Complexity | create | dev | review | Rationale |
|------------|--------|-----|--------|-----------|
| Low | claude | claude | claude | Claude handles simple tasks well |
| Medium | codex | codex | codex | Codex for moderate complexity (Claude fallback) |
| High | codex | codex | codex | Codex for complex work (Claude fallback) |
| Retro | claude | - | - | Retrospectives always use Claude |

**Options:**
1. **[S]uggested** - Apply complexity-based defaults above
2. **[U]niform** - Same agent for ALL stories (you specify which)
3. **[C]ustom** - Define your own per-complexity or per-task settings
{IF_PRESETS}4. **[L]oad saved** - Use a previously saved configuration{END_IF_PRESETS}

Enter choice ({IF_PRESETS}S/U/C/L{ELSE}S/U/C{END_IF}) or provide custom overrides:
```

## Load Saved Preset Prompt (Option L)

**Prerequisite:** `preset_count > 0` (checked before displaying main menu).

```bash
presets_result=$("{buildStateDoc}" agent-config list --file "{agentConfigPresets}")
```

Display:
```
**Saved Agent Configurations:**

{numbered list from presets_result, e.g.:}
1. all-claude (saved 2026-03-10)
2. codex-heavy (saved 2026-03-08)

[D]elete a preset

Enter preset number to load, or [B]ack to return to options:
```

**Wait.**

**IF number selected:**
```bash
preset_name="{selected preset name}"
loaded=$("{buildStateDoc}" agent-config load --file "{agentConfigPresets}" --name "$preset_name")
agent_config_json=$(echo "$loaded" | jq -r '.config')
```
Display loaded config summary, then proceed with this as `agent_config_json`.

**IF D selected:**
Ask which preset number to delete, then:
```bash
"{buildStateDoc}" agent-config delete --file "{agentConfigPresets}" --name "$delete_name"
```
Redisplay this prompt (or return to main options if no presets remain).

**IF B selected:** Return to main S/U/C/L menu.

---

## Save Configuration Prompt

**When to show:** After the user completes a **[C]ustom** or **[U]niform** configuration (NOT after [S]uggested or [L]oad).

```
**Save this configuration for future runs?**

Enter a name to save (e.g., `all-claude`, `codex-heavy`) or [N]o to skip:
```

**Wait.**

**IF name provided:**
```bash
"{buildStateDoc}" agent-config save --file "{agentConfigPresets}" --name "$save_name" --config-json "$agent_config_json"
```
Display: "Configuration saved as **{save_name}**."

**IF N or empty:** Skip, continue.

---

## Uniform Agent Prompt (Option U)

```
**Uniform Agent Configuration**

Use the same agent for ALL {total_count} stories regardless of complexity.

Which agent for all tasks?
- `claude` - Claude for everything (more capable, slower)
- `codex` - Codex for everything (faster, simpler)
- `claude, false` - Claude only, no fallback
- `codex, claude` - Codex primary, Claude fallback

Enter agent config:
```

## Custom Configuration Prompt (Option C)

```
**Custom Agent Configuration**

Define agents per complexity level and/or per task.

**Per-Complexity Format:** `complexity.task: primary, fallback`
- `low.dev: claude, false` → Claude for low-complexity dev, no fallback
- `medium.create: codex, claude` → Codex for medium-complexity create
- `high.review: claude, false` → Claude for high-complexity review

**Per-Task Format (applies to all complexities):** `task: primary, fallback`
- `review: claude, false` → Claude for ALL reviews
- `dev: codex, claude` → Codex for ALL dev

**Complexity levels:** low, medium, high
**Tasks:** create, dev, auto, review

Enter overrides (comma-separated):
```
