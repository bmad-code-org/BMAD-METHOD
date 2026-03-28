# Pre-flight Prompts

Reference prompts for the pre-flight configuration step.

---

## Context Gathering Questions

Present these questions to gather implementation context:

```
**Context Gathering:**

To help the implementation sessions succeed, please clarify:

1. **Technical Context:** Are there any architectural decisions, patterns, or conventions the dev sessions should follow?

2. **Testing Requirements:** Any specific testing frameworks or coverage expectations?

3. **Dependencies:** Are there external services, APIs, or packages that need to be set up first?

4. **Known Challenges:** Any tricky areas or things that previous attempts struggled with?

5. **Anything Else:** Any other context that would help the sessions succeed?

Feel free to answer as much or as little as you'd like. You can also say 'none' if the stories are self-explanatory.
```

**After user responds:**
- Think about their response before continuing
- If response raises new questions, ask 1-2 follow-up questions
- Continue until context is sufficient

---

## Agent Configuration (v1.2.0)

```
**AI Agent Selection:**

Which AI coding agent should run your workflows?

| Agent | CLI Command | Command Prefix | Best For |
|-------|-------------|--------------|----------|
| **Claude** | `claude --dangerously-skip-permissions` | `bmad-` | BMAD workflows |
| **Codex** | `codex exec --full-auto` | natural language (no prefix) | OpenAI Codex users |

**Primary Agent:** (default: claude)
**Fallback Agent:** (default: codex) - Used when primary fails after retries
**Enable Fallback:** (default: yes)

Examples:
- `claude` → Claude primary, Codex fallback (default)
- `codex` → Codex primary, Claude fallback
- `claude, none` → Claude only, no fallback
- `codex, claude` → Codex primary, Claude fallback

Enter agent config or press Enter for defaults:
```

Store response as `agentConfig` (v3.0.0):
```yaml
agentConfig:
  defaultPrimary: "claude"
  defaultFallback: "codex"
  perTask: {}
  complexityOverrides: {}
```

---

## Legacy AI Command Configuration (Deprecated)

```
**AI Command:**
What command invokes Claude Code (or your AI CLI) in the terminal?

Examples:
- `claude --dangerously-skip-permissions` (default - autonomous mode, no prompts)
- `claude` (interactive mode - will prompt for permissions)
- `cursor` (Cursor IDE)
- `/usr/local/bin/claude --dangerously-skip-permissions` (full path)

Enter command or press Enter for default (`claude --dangerously-skip-permissions`):
```

Store response as `aiCommand`. **Note:** This is deprecated in v1.2.0. Use `agentConfig` instead.

---

## Execution Overrides

```
**Execution Overrides:**

By default, the orchestrator will:
- Run all steps: create-story → dev-story → automate → code-review
- Run stories sequentially (one at a time)
- Commit after each completed story

**Would you like to change any defaults?**

| Option | Default | Your Choice |
|--------|---------|-------------|
| Skip `automate` (guardrail tests) | No | ? |
| Max parallel stories | 1 | ? |

Enter changes (e.g., `skip automate, max parallel 2`) or `defaults` to keep all defaults:
```

---

## Configuration Review Template

```
**Pre-flight Complete. Here's your configuration:**

**Project Context Loaded:**
- Product Brief: {loaded/not found}
- PRD: {loaded/not found}
- Architecture: {loaded/not found}
- Other docs: {list or 'None'}

**Epic:** {epic_name}
**Stories:** {story_range} ({count} stories)

**Stories to implement:**
{story_list_with_titles}

**AI Command:** `{aiCommand}`

**Overrides:**
- Skip automate: {yes/no}
- Max parallel: {number}

**Additional Context from Conversation:**
{context_summary_or_'None provided'}

**Does this look correct?** I'll create the state document and we can begin execution.
```
