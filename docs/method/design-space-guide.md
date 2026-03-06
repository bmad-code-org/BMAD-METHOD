# Design Space — The Design Consciousness

**By:** Whiteport Collective (2026)

---

## The Core Idea

A design system is a projection — tokens, components, patterns. It's the cogs.

The Design Space IS the consciousness — the living environment where design happens across products, accumulating decisions, experiments, and outcomes over time.

Where a design system says "use 8px spacing," the Design Space remembers **why**: the failed experiment with 4px, the client feedback that led to the change, the A/B test that confirmed it.

---

## Architecture

### Dual Embedding Model

Every entry in the Design Space can have two independent representations:

| Embedding | What It Captures | Technology |
|-----------|-----------------|------------|
| **Semantic** (1536d) | What it means — descriptions, reasoning, context | OpenRouter / text-embedding-3-small |
| **Visual** (1024d) | What it looks like — colors, layout, typography, imagery | Voyage AI / voyage-multimodal-3 |

Semantic embeddings capture conceptual similarity: "navy hero with centered text" matches "dark hero with centered heading." Visual embeddings capture aesthetic similarity: two designs can mean different things but look the same.

Together they detect patterns that either alone would miss.

### Memory Categories

| Category | What Gets Captured |
|----------|-------------------|
| `inspiration` | Visual references, competitor patterns, moodboards |
| `failed_experiment` | What didn't work and why |
| `successful_pattern` | Validated solutions worth reusing |
| `component_experience` | How components behave in real use |
| `design_system_evolution` | Token changes with reasoning |
| `client_feedback` | Designer reactions, preference patterns |
| `competitive_intelligence` | How competitors solve problems |
| `methodology` | Process improvements, workflow discoveries |
| `agent_experience` | Agent collaboration learnings |
| `reference` | External resources worth remembering |
| `general` | Anything that doesn't fit above |

### Pattern Types

Every visual capture is tagged with its role in the design journey:

| Symbol | Type | Meaning |
|--------|------|---------|
| ◆ | `baseline` | Inherited starting point |
| ★ | `inspiration` | External reference |
| Δ | `delta` | What changed |
| ○ | `rejected` | Designer didn't like it |
| ● | `approved` | Designer liked it |
| △ | `conditional` | Works in some contexts |

---

## The Design Feedback Loop

The most powerful capability. When the designer works with Freya:

1. **Freya creates** a design
2. **Designer reviews** and requests a change
3. **Freya captures BEFORE** (semantic + visual, tagged `rejected`)
4. **Freya asks WHY** — naturally, not as interrogation
5. **Designer explains** (or Freya infers from the change)
6. **Freya applies** the change
7. **Freya captures AFTER** (semantic + visual, tagged `approved`)
8. **Both saved** as a linked pair (shared `pair_id`)
9. **Patterns emerge**: "Designer consistently prefers X over Y"
10. **Future designs** are pre-checked against known rejections

### The Learning Curve

**Cold start (0-10 pairs):** Individual preferences. "Likes light headings."

**Accumulation (10-50 pairs):** Clusters form. "Prefers understated elegance."

**Taste profile (50+ pairs):** Agent predicts preferences before asking.

**Design DNA (100+ pairs):** New agents inherit the designer's aesthetic sensibility from day one.

### Red Flag Detection

Before presenting ANY new design, the agent searches for matches against rejected patterns:
- **Semantic red flag:** Description matches previously rejected descriptions
- **Visual red flag:** Screenshot looks like previously rejected screenshots
- If either triggers → adjust before showing the designer

---

## How WDS Uses It

| Phase | Agent | Design Space Interaction |
|-------|-------|------------------------|
| 0 Alignment | Saga | Search for similar past projects |
| 1 Product Brief | Saga | Search competitive intelligence, capture business insights |
| 2 Trigger Map | Saga | Search user psychology patterns, capture trigger discoveries |
| 3 Scenarios | Both | Search similar flows, capture scenario decisions |
| 4 UX Design | Freya | Search + visual search, capture decisions, **run feedback loop** |
| 5 Agentic Dev | Freya | Search agent experiences, capture collaboration insights |
| 6 Assets | Freya | Search generation learnings, capture prompt patterns |
| 7 Design System | Freya | Search evolution history, capture token decisions |
| 8 Evolution | Freya | Search everything, capture product evolution insights |

---

## Core Principles

**Craft follows the designer.** Knowledge accumulates with the person who did the work, not the client who paid for it.

**Auto-capture by default.** Agents capture insights as they work — the designer never has to ask.

**Search before you create.** Always check what exists before starting new work.

**The feedback loop is not an interruption — it is the learning.**

---

## Technical Foundation

- **Database:** Supabase with pgvector (eu-north-1, Stockholm)
- **MCP Server:** `design-space-mcp` with 8 tools
- **Semantic:** OpenRouter (text-embedding-3-small, 1536d)
- **Visual:** Voyage AI (voyage-multimodal-3, 1024d)

---

## Related

- [Protocol](../../src/data/design-space/protocol.md) — Full technical specification
- [Feedback Loop Guide](../../src/data/design-space/feedback-loop-guide.md) — Complete feedback loop protocol
- [Tool Reference](../tools/design-space-mcp.md) — MCP tool documentation
- [Module 19](../learn/module-19-design-space/) — Tutorial and learning module
