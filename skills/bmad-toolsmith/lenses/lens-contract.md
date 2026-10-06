# Lens contract

The return mechanics every lens shares.

Input: the pre-pass JSON (`skill`, `shape_hint`, `files[{path, tokens, kind}]`, `skill_md_tokens`, `total_tokens`, `has_customize`, `has_scripts`, `scripts[{path, has_pep723, has_test}]`, `description_chars`, `has_use_when`, `frontmatter_ok`, `bmod_kind`, `path_findings`, `script_findings`), the target path, and the lens file. Read the metrics first, then every file in `files[]` whose `kind` is `entry` or `prompt`, and any `asset` a model will read as text. The lens covers the whole skill, not `SKILL.md`; a finding names the file it is in.

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
