# Orchestrator Rules Appendix

## Session Naming
**See `tmux-commands.md` for complete session naming documentation.**

Pattern: `sa-{project_slug}-{timestamp}-e{epic}-s{N}-{type}` where type = `create`, `dev`, `auto`, `review-{cycle}`

## Workflow Command Arguments

**CRITICAL:** ALWAYS pass required positional arguments to BMAD workflows.

### Story ID Requirement

**create-story, dev-story, code-review, testarch-automate** — All require the story ID as a positional argument.

**WRONG:**
```bash
bmad-create-story
```
This causes create-story to create ALL stories in the epic, not just one.

**CORRECT:**
```bash
bmad-create-story 5.3
```
This creates ONLY story 5.3.

### Validation After create-story

**After create-story session completes:**
1. Count story files BEFORE spawning session
2. Count story files AFTER session completes
3. Verify exactly ONE new file created
4. IF 0 or >1 files → Escalate with file list

**This prevents runaway story creation** where create-story creates 5.3, 5.4, 5.5, etc. instead of just the requested story.

## State Updates

After EVERY action:
1. Update `currentStep` in state document
2. Log action with timestamp
3. Update story progress table

## Escalation Protocol

**See `data/escalation-triggers.md` for complete trigger definitions and behavior.**

### Quick Reference

| Category | Marker Action | State | When |
|----------|---------------|-------|------|
| CRITICAL | **DELETE** | PAUSED | Cannot proceed (retries exhausted) |
| PREFERENCE | Keep | IN_PROGRESS | Could proceed either way |

### CRITICAL Escalation (Key Steps)

1. Delete marker: `rm "{project_root}/.claude/.story-automator-active"`
2. Set state to PAUSED
3. Present menu (stop hook won't interfere)
4. On resume: recreate marker, set IN_PROGRESS

### Dev-Story Smart Retry

Before escalating, check if story is blocking:
- **Blocking:** Retry up to 3 times → then CRITICAL
- **Not blocking:** Retry once → then PREFERENCE (can skip)

## Session Monitoring & Output Parsing

**CRITICAL:** These topics have dedicated reference files. Load them when needed:

- **Session Monitoring:** See `data/monitoring-pattern.md`
  - FORBIDDEN patterns (capture-pane, etc.)
  - Status script usage and CSV format
  - Decision tree for poll results
  - Polling loop with state tracking

- **Output Parsing:** See `data/monitoring-pattern.md` (Sub-Agent Invocation section)
  - NEVER parse output yourself
  - ALWAYS use sub-agents (Task tool, haiku)
  - Verification checkpoint before proceeding

- **Sub-Agent Prompts:** See `data/subagent-prompts.md`
  - Session Output Parser
  - Code Review Analyzer (also see `subagent-prompts-analysis.md`)
