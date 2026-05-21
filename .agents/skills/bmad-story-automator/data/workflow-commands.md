# Workflow Prompt Reference

**Related:** See `tmux-commands.md` for session naming and management.

---

## Multi-Agent Support

| Agent | CLI Command | Prompt Style |
|-------|-------------|--------------|
| **Claude** | `claude --dangerously-skip-permissions` | Natural language skill prompt |
| **Codex** | `codex exec --full-auto` | Natural language skill prompt |

All child sessions receive explicit skill and workflow paths. Command wrappers are not required.

---

## Required Prompt Fields

Every generated prompt must include:

1. Which skill/workflow to execute
2. The `SKILL.md` path when available
3. The `workflow.md` or `workflow.yaml` path
4. The story file pattern in `_bmad-output/implementation-artifacts`
5. The story ID or epic ID
6. Any automation instruction such as `#YOLO` or `auto-fix all issues without prompting`

---

## dev-story

```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "Execute the BMAD dev-story workflow for story STORY_ID.

READ this skill first: <installed-skill-root>/bmad-dev-story/SKILL.md
READ this workflow file next: <installed-skill-root>/bmad-dev-story/workflow.md
Story file: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md
Implement all tasks marked [ ]. Run tests. Update checkboxes."' Enter
```

---

## code-review

**MUST use the dedicated `bmad-story-automator-review` skill. Do NOT use a generic Task agent for reviews.**

```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "Execute the story-automator review workflow for story STORY_ID.

READ this skill first: <installed-skill-root>/bmad-story-automator-review/SKILL.md
READ this workflow file next: <installed-skill-root>/bmad-story-automator-review/workflow.yaml
Then read: <installed-skill-root>/bmad-story-automator-review/instructions.xml
Validate with: <installed-skill-root>/bmad-story-automator-review/checklist.md
Story file: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md
Review implementation, find issues, fix them automatically. auto-fix all issues without prompting"' Enter
```

**Why `auto-fix all issues without prompting`:** The dedicated review workflow normally presents a findings menu. This instruction tells it to automatically fix issues without prompting.

---

## create-story

```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "Execute the BMAD create-story workflow for story STORY_ID.

READ this skill first: <installed-skill-root>/bmad-create-story/SKILL.md
READ this workflow file next: <installed-skill-root>/bmad-create-story/workflow.md
Then read: <installed-skill-root>/bmad-create-story/discover-inputs.md
Use template: <installed-skill-root>/bmad-create-story/template.md
Validate with: <installed-skill-root>/bmad-create-story/checklist.md
Create story file at: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md
Story ID: STORY_ID

#YOLO - Do NOT wait for user input."' Enter
```

**CRITICAL:** Always pass the story ID (for example, `5.3`) to ensure create-story creates only that one story.

---

## automate

```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "Execute the BMAD qa-generate-e2e-tests workflow for story STORY_ID.

READ this skill first: <installed-skill-root>/bmad-qa-generate-e2e-tests/SKILL.md
READ this workflow file next: <installed-skill-root>/bmad-qa-generate-e2e-tests/workflow.md
Validate with: <installed-skill-root>/bmad-qa-generate-e2e-tests/checklist.md
Story file: _bmad-output/implementation-artifacts/STORY_PREFIX-*.md
Auto-apply all discovered gaps in tests."' Enter
```

If `bmad-qa-generate-e2e-tests` is missing from the installed skill root, story-automator install still succeeds, but the orchestrator should run with `Skip Automate = true`.

---

## retrospective

```bash
tmux send-keys -t "SESSION" 'claude --dangerously-skip-permissions "Execute the BMAD retrospective workflow for epic EPIC_ID.

READ this skill first: <installed-skill-root>/bmad-retrospective/SKILL.md
READ this workflow file next: <installed-skill-root>/bmad-retrospective/workflow.md
Run the retrospective in #YOLO mode and assume the user will NOT provide input."' Enter
```

---

## Variables

- `AI_AGENT` = `claude` or `codex`
- `AI_COMMAND` = full CLI command override, legacy and deprecated
- `STORY_PREFIX` = story ID with dots replaced by hyphens, for example `6.1` -> `6-1`
- `{projectPath}` = project root

All commands assume the session was created with `STORY_AUTOMATOR_CHILD=true`.
