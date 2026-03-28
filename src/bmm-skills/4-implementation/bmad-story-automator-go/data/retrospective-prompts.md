# Retrospective Prompts

Prompts used by step-05-retrospective for automated retrospective execution.

---

## YOLO Mode Retrospective Prompt

Use this prompt when spawning the retrospective session:

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

## Doc Verification Prompt

Use this prompt when spawning doc verification subagents:

```
Verify whether this documentation update is needed:

**Document:** ${proposed_doc.path}
**Proposed Change:** ${proposed_doc.summary}
**Reason:** ${proposed_doc.reason}

Instructions:
1. Read the current document at ${proposed_doc.path}
2. Read the relevant implementation code referenced
3. Compare doc against actual implementation
4. Determine if update is genuinely needed

Output JSON:
{
  "should_update": true|false,
  "confidence": "high"|"medium"|"low",
  "reason": "explanation",
  "discrepancies": ["list", "of", "specific", "issues"] // only if should_update
}

If discrepancies exist, apply the fix directly. Output should_update=true only if you made changes.
```

---

## Usage Notes

- **YOLO Prompt:** Replace `{epic_number}` with actual epic number
- **Doc Verification Prompt:** Replace `${proposed_doc.*}` variables with actual values
- Both prompts are designed for fully automated execution (no user input expected)
