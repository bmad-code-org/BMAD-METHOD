# Lens contract

The return mechanics every lens shares.

Input: the pre-pass JSON, the target path, and, as absolute paths, this contract, the lens file, `standards.md` (the standards) and `canon.md` (the canon). Read the standards and the canon, then the pre-pass, then every file in `files[]` whose `kind` is `entry` or `prompt`, and any `asset` a model will read as text. The lens covers the whole skill, not `SKILL.md`; a finding names the file it is in.

A pre-pass field that answers a criterion is the evidence: cite it, do not re-derive it. A criterion keyed to a shape also applies to templates the target ships for that shape, read as the skill they will produce; template syntax in them (Jinja, `{placeholder}` keys) is expected.

Return exactly this JSON in-context, never as a file:

```json
{
  "lens": "<lens name>",
  "verdict": "<one line for this lens>",
  "findings": [
    {
      "id": "<lens>-<n>",
      "severity": "critical | high | medium | low",
      "title": "<short>",
      "location": "<file:region>",
      "evidence": "<what was observed>",
      "recommendation": "<the fix>"
    }
  ]
}
```

- `id` numbers within the lens (`leanness-1`, `leanness-2`) so findings stay traceable.
- The leanness lens alone adds `proposed_smallest` and `predicted_delta`.
- An empty `findings` array with a passing verdict is valid. Padding is worse than silence.
- Findings are advice to the user, never a gate; the gates are the validators and the trigger eval.
