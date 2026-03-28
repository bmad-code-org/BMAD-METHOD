# Workflow Commands Reference

**Related:** See `tmux-commands.md` for session naming and management.

---

## Multi-Agent Support (v1.3.0)

| Agent | CLI Command | Prompt Style |
|-------|-------------|--------------|
| **Claude** | `claude --dangerously-skip-permissions` | Command syntax: `/bmad-bmb-workflow` |
| **Codex** | `codex exec --full-auto` | Natural language prompt |

**CRITICAL: Claude and Codex use DIFFERENT prompt styles:**
- **Claude:** `bmad-create-story 6.1` (command syntax)
- **Codex:** Natural language explaining what workflow to run (see below)

**Why Codex is different:** Codex doesn't use slash commands like Claude. It takes plain text prompts and figures out what to do.

---

## Command Syntax

### Claude Syntax

**Commands take POSITIONAL ARGUMENTS, not flags. MUST be quoted.**

```bash
claude --dangerously-skip-permissions "bmad-command-name ARG1 ARG2"
```

**WRONG:** `claude bmad-dev-story --story file.md` (flags don't exist)
**WRONG:** `claude bmad-dev-story file.md` (missing quotes - args not passed)
**RIGHT:** `claude "bmad-dev-story file.md"` (quoted - args passed correctly)

### Codex Syntax (v1.3.0)

**Codex uses natural language prompts that explain the workflow to execute.**

```bash
codex exec "Execute the BMAD workflow-name workflow for story STORY_ID.

Workflow location: _bmad/bmm/workflows/path/to/workflow/
Story file: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md
[Additional instructions specific to the workflow]

Story ID: STORY_ID" --full-auto
```

**CRITICAL:** The prompt must include:
1. Which workflow to execute
2. Where the workflow files are located
3. Where to find/create story files
4. The story ID

---

## dev-story

**Claude:**
```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "bmad-dev-story STORY_ID"' Enter
```

**Codex (v1.3.0):**
```bash
codex exec "Execute the BMAD dev-story workflow for story STORY_ID.

Workflow location: _bmad/bmm/4-implementation/bmad-dev-story/
Story file: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md
Implement all tasks marked [ ]. Run tests. Update checkboxes.

Story ID: STORY_ID" --full-auto
```

---

## code-review (REQUIRED after dev-story)

**MUST use BMAD /code-review workflow. Do NOT use Task agent for reviews.**

**CRITICAL (v2.0):** Include auto-fix instruction to prevent menu prompts.

**Claude:**
```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "bmad-story-automator-review STORY_ID auto-fix all issues without prompting"' Enter
```

**Codex (v1.3.0):**
```bash
codex exec "Execute the BMAD code-review workflow for story STORY_ID.

Workflow location: _bmad/bmm/4-implementation/bmad-story-automator-review/
Story file: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md
Review implementation, find issues, fix them automatically.
auto-fix all issues without prompting

Story ID: STORY_ID" --full-auto
```

**Why `auto-fix all issues without prompting`:** The code-review workflow normally presents a findings menu. This instruction tells it to automatically fix issues without prompting.

---

## create-story

**Requires story ID as positional argument.**

**Claude:**
```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "bmad-create-story STORY_ID"' Enter
```

**Codex (v1.3.0):**
```bash
codex exec "Execute the BMAD create-story workflow for story STORY_ID.

Workflow location: _bmad/bmm/4-implementation/bmad-create-story/
- Follow workflow.md for the process
- Use template.md as the output template
- Reference checklist.md for validation steps

Create story file at: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md

Story ID: STORY_ID" --full-auto
```

**CRITICAL:** Always pass the story ID (e.g., "5.3") to ensure create-story only creates that ONE story.

---

## testarch-automate

**Claude:**
```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "bmad-tea-testarch-automate STORY_ID"' Enter
```

**Codex (v1.3.0):**
```bash
codex exec "Execute the BMAD testarch-automate workflow for story STORY_ID.

Workflow location: _bmad/tea/workflows/testarch/automate/
Story file: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md
Generate test automation for the implemented story.

Story ID: STORY_ID" --full-auto
```

---

## Variables

**Agent Configuration (v1.3.0):**

| Agent | CLI Command | Prompt Style |
|-------|-------------|--------------|
| Claude | `claude --dangerously-skip-permissions` | `/bmad-bmb-workflow` command syntax |
| Codex | `codex exec --full-auto` | Natural language (see examples above) |

`{projectPath}` = project root
`STORY_PREFIX` = story ID with dots replaced by hyphens (e.g., 6.1 → 6-1)

**Environment Variables (for scripts):**
- `AI_AGENT` = `claude` or `codex`
- `AI_COMMAND` = Full CLI command (legacy, deprecated)

---

## Notes

- Retrospectives are manual-only. Do not spawn in automated sessions.
- All commands assume session already created with `STORY_AUTOMATOR_CHILD=true`
- See `tmux-commands.md` for session creation patterns
