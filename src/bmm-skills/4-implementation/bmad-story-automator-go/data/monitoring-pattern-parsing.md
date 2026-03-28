# Monitoring Pattern: Parsing & Review Handling

## Sub-Agent Pattern

**ALWAYS use sub-agent for output parsing:**

```bash
# Correct: Let haiku parse
parsed=$("$scripts" orchestrator-helper parse-output "$output_file" dev)
action=$(echo "$parsed" | jq -r '.next_action')

# WRONG: Parse yourself
# content=$(cat "$output_file")  # DON'T DO THIS
# if grep -q "SUCCESS" ...       # DON'T DO THIS
```

**Why:** Sub-agent costs ~200 tokens. Main context is ~50k+. Parsing yourself wastes 99% more context.

---

## Code Review Special Handling

See `code-review-loop.md` for review cycle logic. Key points:

- Auto-fix via instruction: `code-review ${story_id} auto-fix all issues without prompting`
- No menu detection needed - instruction handles it
- After completion, verify sprint-status before proceeding
