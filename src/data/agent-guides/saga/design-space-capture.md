# Design Space Capture Guide — Saga

## Auto-Capture (Default)

Capture insights **automatically during conversations** — don't wait for the user to ask. When you discover something worth remembering (a strategic insight, a client pattern, a competitive finding), capture it via HTTP to the edge functions. Multiple agents share the Space — your insight today helps another agent tomorrow.

## When to Capture

Capture knowledge to Design Space at these moments:

1. **After completing a Product Brief** — Business model insights, market positioning discoveries
2. **After completing a Trigger Map** — User psychology patterns, trigger combinations that resonated
3. **After competitive research** — How competitors solve problems, gaps found
4. **After client discovery sessions** — Client values, communication preferences, decision patterns
5. **After strategic pivots** — Why direction changed, what triggered it

## How to Capture

POST to `{DESIGN_SPACE_URL}/functions/v1/capture-design-space` with:

```json
{
  "content": "Your insight here — be specific",
  "category": "competitive_intelligence",
  "project": "{project_tag}",
  "designer": "marten",
  "topics": ["domain-tag"],
  "source": "agent-dialog"
}
```

Headers: `Content-Type: application/json`, `Authorization: Bearer {SUPABASE_ANON_KEY}`

See protocol.md for the full API key and all available edge functions.

## How to Search

Before starting strategic work, POST to `search-design-space`:

```json
{"query": "similar business model patterns", "project": "..."}
{"query": "trigger mapping for {domain}"}
{"query": "{client} preferences"}
```

## Quality Bar

**Good:** "SaaS founders respond best to 'infrastructure cost' triggers over 'developer experience' — tested across 3 projects. The fear of scaling costs outweighs the desire for DX improvements in decision-making."

**Bad:** "SaaS founders care about costs."

Include: context, evidence, project reference, why it matters.

## Minimum Per Deliverable

Capture **2-5 insights** after each major deliverable (Product Brief, Trigger Map, Scenario set).

## What NOT to Capture

- Raw interview transcripts (summarize first)
- Information already in the Product Brief or Trigger Map document
- Speculative ideas without supporting evidence
- Temporary tactical decisions

---

## Site Analysis

When analyzing competitors or existing sites, POST to `capture-visual` for screenshots with dual embeddings:

```json
{
  "content": "[detailed description: layout, colors, typography, patterns, what works and why]",
  "image_base64": "[base64 screenshot of the section]",
  "category": "competitive_intelligence",
  "project": "...",
  "pattern_type": "inspiration",
  "topics": ["competitor", "hero", "trust-signals"],
  "components": ["hero-banner", "logo-wall"]
}
```

For comprehensive site analysis, capture each major section separately with its own screenshot and description.

### Visual Search

POST to `search-visual-similarity` during research to find patterns that look similar to what you're analyzing:

```json
{
  "image_base64": "[screenshot]",
  "project": "...",
  "limit": 5
}
```

---

## Feedback Loop Awareness

Saga doesn't run the design feedback loop directly (that's Freya's domain), but should understand:
- Entries tagged `rejected` and `approved` represent designer preferences
- When searching the Space, preference patterns inform strategic decisions
- If a strategic direction aligns with known rejected design patterns, flag it
