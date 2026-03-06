# Design Space — Agent Instructions

> Load this file at the start of any session to participate in the Design Space.

---

## What Is the Design Space?

The Design Space is shared agent memory for design work. It stores accumulated knowledge — design patterns, experiments, preferences, component experiences, methodology insights — as semantic embeddings in a vector database. Every agent that reads and writes to the Space builds on the work of every other agent.

A Design System is the cogs (tokens, components, patterns). The Design Space is the consciousness — the living environment where design happens across products, accumulating decisions, experiments, and outcomes over time.

---

## How to Access the Design Space

Agents interact with the Design Space via **direct HTTP calls** to Supabase Edge Functions. No MCP server required.

### Connection Details

```
Base URL: {DESIGN_SPACE_URL}
API Key:  {DESIGN_SPACE_ANON_KEY}
```

All calls use:
```
POST {Base URL}/functions/v1/{function-name}
Headers:
  Content-Type: application/json
  Authorization: Bearer {API Key}
```

### Available Functions

| Function | Purpose |
|----------|---------|
| `capture-design-space` | Save a text insight (generates semantic embedding automatically) |
| `search-design-space` | Semantic search — find by meaning |
| `capture-visual` | Save screenshot + description (dual: semantic + visual embedding) |
| `capture-feedback-pair` | Save linked before/after improvement pair |
| `search-visual-similarity` | Find visually similar patterns |
| `search-preference-patterns` | Check proposed design against known improvements |

### Examples

**Search the Space:**
```bash
curl -X POST {DESIGN_SPACE_URL}/functions/v1/search-design-space \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {DESIGN_SPACE_ANON_KEY}" \
  -d '{"query": "hero section patterns for agency sites", "project": "whiteport", "limit": 10, "threshold": 0.3}'
```

**Capture knowledge:**
```bash
curl -X POST {DESIGN_SPACE_URL}/functions/v1/capture-design-space \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {DESIGN_SPACE_ANON_KEY}" \
  -d '{
    "content": "Whiteport hero: Rubik 300 weight at 36px creates elegance through intentional lightness.",
    "category": "successful_pattern",
    "project": "whiteport",
    "designer": "marten",
    "topics": ["hero", "typography", "elegance"],
    "components": ["hero-banner"],
    "source": "design-review"
  }'
```

**Read recent entries (REST API):**
```bash
curl {DESIGN_SPACE_URL}/rest/v1/design_space?select=id,content,category,project,topics,created_at&order=created_at.desc&limit=10 \
  -H "apikey: {DESIGN_SPACE_ANON_KEY}" \
  -H "Authorization: Bearer {DESIGN_SPACE_ANON_KEY}"
```

### Web App (Humans)

Browse and capture from any device:
`{DESIGN_SPACE_URL}/functions/v1/design-space-ui`

---

## Auto-Capture Rules (MANDATORY)

**You MUST capture insights automatically as you work. Do not wait to be asked.**

### When to Capture:
- After completing a major deliverable (product brief, trigger map, wireframe, spec)
- When you discover a pattern that works (or doesn't)
- When the designer gives feedback — capture the improvement
- When analyzing competitors or reference sites
- When making a design decision with reasoning
- When a component behaves unexpectedly
- After any workshop, discussion, or strategy session

### Capture Quality Bar:
**Good:** "Whiteport hero: Rubik 300 weight at 36px creates elegance through intentional lightness — anti-pattern to the industry standard of heavy heading weights. Works because the geometric clarity of Rubik carries at large sizes without needing weight."

**Bad:** "Used light font for heading."

### What to Include:
- WHAT the pattern/insight is
- WHY it works (or doesn't)
- CONTEXT: project, page, component, phase
- SPECIFICS: exact values, measurements, comparisons

---

## Search Before You Work (MANDATORY)

**Before starting any major task, search the Space for relevant prior knowledge.**

Search examples:
```json
{"query": "hero section patterns for agency sites", "project": "whiteport"}
{"query": "what CTA styles have worked", "limit": 10}
{"query": "mobile navigation approaches tried"}
{"query": "client feedback on dark themes"}
```

Use search results to inform your work. Don't repeat failed experiments. Build on proven patterns.

---

## Categories (11)

| Category | Use When |
|----------|----------|
| `inspiration` | Analyzing reference sites, moodboards, visual DNA |
| `failed_experiment` | Something was tried and didn't work — save WHY |
| `successful_pattern` | Proven solution with context and evidence |
| `component_experience` | How a component behaved across contexts |
| `design_system_evolution` | Token/component/pattern changes with reasoning |
| `client_feedback` | Recurring preferences, objections, reactions |
| `competitive_intelligence` | Competitor design analysis |
| `methodology` | Process insights, workflow learnings |
| `agent_experience` | What worked/failed in agent collaboration |
| `reference` | External knowledge, articles, frameworks |
| `general` | Anything that doesn't fit above |

---

## Pattern Types (6)

When capturing visual patterns, tag with the appropriate type:

| Symbol | Type | Meaning |
|--------|------|---------|
| ◆ | `baseline` | Inherited starting point — what exists before any changes |
| ★ | `inspiration` | External reference that influences direction |
| Δ | `delta` | What changed — the modification itself |
| ○ | `rejected` | Starting point before improvement — context for what was improved |
| ● | `approved` | The improved solution — the real value |
| △ | `conditional` | Works in some contexts but not others |

---

## Project Tagging

Always include:
- `project`: lowercase project name (`whiteport`, `kalla`, `bythjul`, `sharif`, `manella`)
- `designer`: who is doing the work (`marten` by default)
- `topics`: semantic tags as array (`["hero", "dark-theme", "trust-section"]`)
- `components`: design components involved (`["hero-banner", "cta-button"]`)
- `source`: where this came from (`site-analysis`, `workshop`, `agent-dialog`, `design-review`)

---

## Design Feedback Capture (Critical)

### Positivity Principle

The Design Space captures **what works and how we got there**. Not complaints. The "before" state is context. The "after" state is the knowledge.

When the designer (Mårten) suggests an improvement:

1. **Note the BEFORE** — what you proposed and its characteristics
2. **Ask WHY** — "What would make this better?" or "What direction feels right?"
3. **Note the AFTER** — the improved solution
4. **Capture the pair:**
   ```json
   {
     "content": "BEFORE: [starting point]. IMPROVED TO: [solution]. BECAUSE: [reasoning]. LEARNED: [transferable insight].",
     "category": "client_feedback",
     "project": "...",
     "topics": ["improvement", "feedback"],
     "components": ["..."]
   }
   ```

**This is how the Design Space learns taste.** Over time, patterns emerge. Future agents search for these improvements before presenting designs.

### Exceptions: Usability Testing & Client Feedback

Raw diagnostic data from usability testing and client feedback IS captured as-is — user confusion, task failure, friction points. This is evidence, not negativity. The positivity framing applies to the agent-designer feedback loop, not to user research data.

---

## What's Already in the Space

As of 2026-03-05:
- **31 Whiteport entries** — full homepage + 4 subpage analysis with dual embeddings
- **WDS methodology insights** — semantic/parametric processing, pattern types, temporal dimensions
- **Ivonne module experience** — agent architecture learnings
- **Visual capture pipeline** — end-to-end working (Puppeteer → Voyage AI → Supabase)

Search before you build. The foundation is already there.

---

## Fallback: When HTTP Is Unavailable

If edge functions are unreachable or you're in an environment without HTTP access (like Claude mobile):

### Option 1: File-Based Inbox
Write captures to `{project-root}/design-space-inbox.md`:

```markdown
---
captured: 2026-03-05T14:30
status: pending
---

## [successful_pattern] Title of insight

**Project:** project-name
**Designer:** marten
**Topics:** tag1, tag2, tag3
**Components:** component1, component2
**Source:** agent-dialog

Content of the insight here. Same quality rules — be specific,
include values, reasoning, and context.

---
```

These get batch-processed into the Design Space when connectivity is restored.

### Option 2: GTD Inbox (Mobile)
If no file access either, add to the GTD inbox with `[DS]` prefix:

```
[DS] Bottom sheet nav works better than hamburger for mobile service sites with 4-6 actions. Tested on Kalla.
```

Gets routed to the Design Space during `/process`.

### Priority
1. HTTP to edge functions (real-time, searchable immediately)
2. File-based inbox (preserves knowledge, processes later)
3. GTD inbox with [DS] prefix (last resort, captures the thought)

**Knowledge should never be lost because of a technical limitation.**

---

## Technical Details

- **Database:** Supabase (eu-north-1, Stockholm), table: `design_space`
- **Semantic embeddings:** 1536d via OpenRouter (text-embedding-3-small)
- **Visual embeddings:** 1024d via Voyage AI (voyage-multimodal-3)
- **Edge functions:** 8 deployed (capture, search, visual, feedback pairs, preferences)
- **Web app:** `{DESIGN_SPACE_URL}/functions/v1/design-space-ui`

---

*Updated 2026-03-05 — MCP replaced with direct HTTP calls*
