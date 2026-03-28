# Retrospective Automation Data

This file provides instructions for running retrospectives in YOLO mode (fully automated, no user input expected).

---

## YOLO Mode Principles

1. **No User Input Expected**: The retrospective must complete autonomously
2. **Data-Driven Decisions**: All decisions based on sprint-status, story files, and artifacts
3. **Safe Failure**: If anything goes wrong, log and skip - never escalate
4. **Claude Only**: Retrospectives DO NOT support Codex - always use Claude agent

---

## Agent Constraints

### MUST Use Claude

Retrospectives have complex multi-agent "party mode" interactions that require:
- Natural language dialogue synthesis
- Multi-step reasoning across story analysis
- Document generation with rich context

Codex is **not compatible** with these requirements. Always spawn retrospective sessions with `--agent "claude"`.

### Timeout Configuration

Retrospectives analyze all stories in an epic and generate comprehensive reports:
- **Base timeout**: 60 minutes (3600000ms)
- **Extended timeout for large epics (>10 stories)**: 90 minutes (5400000ms)

---

## YOLO Mode Prompt Template

When spawning a retrospective in YOLO mode, use this prompt:

```
bmad-retrospective {epic_number}

Run the retrospective in #YOLO mode.
Assume the user will NOT provide any input to the retrospective directly.
For ALL prompts that expect user input, make reasonable autonomous decisions based on:
- Sprint status data
- Story files and their dev notes
- Previous retrospective if available
- Architecture and PRD documents

Key behaviors:
- When asked to confirm epic number: auto-confirm based on sprint-status
- When asked for observations: synthesize from story analysis
- When asked for decisions: make data-driven choices
- When presented menus: select the most appropriate option based on context
- Skip all "WAIT for user" instructions - continue autonomously

After the retrospective has run and created documents, you MUST:
1. Create a list of documentation that may need updates based on implementation learnings
2. For each doc in the list, verify whether updates are actually needed by:
   - Reading the current doc content
   - Comparing against actual implementation code
   - Checking for discrepancies between doc and code
3. Update docs that have verified discrepancies
4. Discard proposed updates where code matches docs

Focus on these doc types:
- Architecture decisions that changed during implementation
- API documentation that diverged from specs
- README files with outdated instructions
- Configuration documentation

EVERYTHING SHOULD BE AUTOMATED. THIS IS NOT A SESSION WHERE YOU SHOULD BE EXPECTING USER INPUT.
```

---

## Multi-Epic Support

When multiple epics are provided to story-automator:

### Tracking Multiple Epics

State document should track:
```yaml
epics:
  - epicNumber: 1
    storyRange: ["1-1", "1-2", "1-3"]
    status: "completed"
    retrospectiveStatus: "completed"
  - epicNumber: 2
    storyRange: ["2-1", "2-2"]
    status: "in_progress"
    retrospectiveStatus: "pending"
```

### Aggregation Rules

1. **Complete epics during run**: If epic N completes while stories from epic N+1 are being processed, trigger retrospective for epic N
2. **Batch retrospectives**: After all stories complete, run retrospectives for all completed epics in order
3. **Independent failures**: If retrospective for epic N fails, continue to epic N+1 retrospective

### Safe Skip on Failure

If a retrospective fails:
1. Log: `⚠️ Retrospective for Epic {N} skipped: {reason}`
2. Update state: `retrospectives.epic-{N}.status = "skipped"`
3. Update state: `retrospectives.epic-{N}.reason = "{reason}"`
4. Continue to next epic - **NEVER ESCALATE**

---

## Documentation Verification

See `retrospective-doc-verification.md` for doc verification patterns and output parsing.

## Error Handling

### Network Errors

If retrospective session fails due to network:
1. Wait 60 seconds
2. Retry once
3. If retry fails, mark as skipped

### Session Crashes

If retrospective session crashes:
1. Check output file for partial progress
2. If retro doc was partially created, mark as partial
3. Log crash reason
4. Skip to next epic

### Timeout

If retrospective exceeds timeout:
1. Check if core analysis completed
2. If retro doc exists, mark as partial success
3. Skip doc verification phase
4. Continue to next epic
