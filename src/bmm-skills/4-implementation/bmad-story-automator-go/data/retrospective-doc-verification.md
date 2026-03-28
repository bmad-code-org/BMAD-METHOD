# Retrospective Doc Verification

Companion to `retrospective-automation.md`. Contains doc verification patterns and output parsing guidance.

## Doc Verification Patterns

After retrospective generates documents, verify updates against code:

### Documents to Check

| Doc Type | Pattern | Verification Method |
|----------|---------|---------------------|
| Architecture | `*architecture*.md` | Compare decisions against implementation |
| API Docs | `*api*.md`, `*openapi*.yaml` | Verify endpoints match code |
| README | `README.md` | Check setup/usage instructions |
| Config Docs | `*config*.md` | Verify env vars and settings |

### Verification Prompt Template

```
Verify whether this documentation update is needed:

**Document:** {doc_path}
**Proposed Change:** {change_summary}
**Reason:** {reason}

Instructions:
1. Read the current document at {doc_path}
2. Read the relevant implementation code referenced
3. Compare doc against actual implementation
4. Determine if update is genuinely needed

Output JSON:
{
  "should_update": true|false,
  "confidence": "high"|"medium"|"low",
  "reason": "explanation",
  "discrepancies": ["list", "of", "specific", "issues"]
}

If discrepancies exist, apply the fix directly.
```

### Confidence Thresholds

- **High confidence**: Auto-apply update
- **Medium confidence**: Auto-apply with log note
- **Low confidence**: Skip update, log for manual review

---

## Output Parsing

### Parse Doc Proposals from Retrospective Output

Look for sections in retrospective output:

```
## Documentation Updates Needed

### {doc_path}
- **Change:** {summary}
- **Reason:** {reason}
- **Impact:** {impact}
```

Extract into structured format:
```json
{
  "proposals": [
    {
      "path": "{doc_path}",
      "summary": "{summary}",
      "reason": "{reason}",
      "impact": "{impact}"
    }
  ]
}
```

### Retrospective Completion Markers

Successful completion indicators:
- "Retrospective Complete" in output
- "epic-{N}-retro-*.md" file created
- Sprint status updated with retrospective done

Failure indicators:
- Session timeout
- Error messages in output
- No retro file created after 30+ minutes

---

