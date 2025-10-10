# Prompt Templates & Usage Guidance

These templates are intended to be used server-side (via `/api/generate-post`) to keep system prompts and API keys secure.

## System prompt (constant)
```
You are a professional LinkedIn content editor. Convert the provided short journal entry into concise, high-value LinkedIn post variants suitable for a Senior Product Manager at a mid-size SaaS company. Do not include PII. Provide each variant labeled [Variant 1] and [Variant 2]. For each variant include 3 suggested hashtags and one optional 1-line engagement CTA. Be factual, concrete, and include a clear takeaway. Keep variant lengths within the requested max characters.
```

## Dynamic user prompt (example)
```
ENTRY: {{sanitizedText}}
PERSONA: Senior Product Manager at a mid-size SaaS company.
GOAL: Build credibility by sharing learnings and concrete outcomes.
TONE: {{tone}}.
MAX_CHARS: {{max_chars}}.
OUTPUT: Give 2 variants labeled [Variant 1], [Variant 2]. Each variant must include 'Suggested hashtags:' and 'CTA:' lines.
```

## Model parameters (recommended)
- model: `gpt-4o-mini` or `gpt-4o` (choose cheaper model for MVP testing)  
- temperature: 0.6  
- max_tokens: 400  
- top_p: 0.95

## Preset configurations
- Quick Share: max_chars: 280, variants: 1, tone: professional (low-cost)  
- Standard Post: max_chars: 400, variants: 2, tone: thought-leadership  
- Long Form: max_chars: 600, variants: 3, tone: reflective (higher cost)

## Anonymize & PII handling (client-side + server guard)
- Client-side: run a regex-based PII scrub (emails, phone numbers) and replace detected items with `[REDACTED]` when anonymize=true. Present redacted preview to user.
- Server-side: run a quick PII detector; if high PII risk, return a warning and refuse generation until user edits content.

## Example request payload (server→OpenAI)
```
{
  "model": "gpt-4o-mini",
  "messages": [
    {"role":"system","content":"<SYSTEM_PROMPT>"},
    {"role":"user","content":"<DYNAMIC_PROMPT_WITH_ENTRY>"}
  ],
  "max_tokens": 400,
  "temperature": 0.6
}
```

## Example of response parsing
- Expect `choices` array with assistant content. Split on `[Variant 1]` / `[Variant 2]` markers. Extract suggested hashtags and CTA lines into structured fields for the client UI.

## Cost-control tips
- Prefer fewer variants (1–2) for default.  
- Use lower-cost model for quick testing.  
- Optionally pre-summarize long entries (locally) to reduce token counts before sending.

---

Keep this file in server docs and reference it from `/api/generate-post` implementation.