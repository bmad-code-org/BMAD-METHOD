# Design Space MCP

**Category:** AI Knowledge Management
**Purpose:** Accumulated design consciousness — captures and retrieves design knowledge with dual embeddings
**MCP Server:** `design-space-mcp`

---

## What It Is

The Design Space MCP server connects agents to a shared vector database of design knowledge. Every insight, pattern, preference, and experiment captured during design work becomes searchable by meaning (semantic) and by appearance (visual).

## Why WDS Recommends It

- Knowledge accumulates across projects — never start from zero
- Designer preferences are learned through feedback pairs
- Red flag detection prevents repeating known mistakes
- Cross-project pattern discovery via semantic and visual search
- Multiple agents share one consciousness

---

## Setup

### 1. Claude Code Configuration

Add to your Claude Code settings:

```json
{
  "mcpServers": {
    "design-space": {
      "command": "node",
      "args": ["c:/dev/marten-angner/design-space-mcp/index.js"]
    }
  }
}
```

### 2. Per-Project Guide

Create `.claude/design-space-guide.md` in each project repo using the template from `src/data/design-space/guide-template.md`.

---

## Tool Reference

### capture_knowledge
Save a text insight with semantic embedding.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string | yes | The knowledge to capture — be specific, include context |
| category | enum | yes | One of 11 categories (see protocol) |
| project | string | no | Project name (e.g. 'kalla') |
| designer | string | default: 'marten' | Who captured this |
| topics | string[] | default: [] | Semantic tags |
| components | string[] | default: [] | Design components referenced |
| source | string | no | Origin: 'agent-dialog', 'workshop', 'site-analysis' |
| source_file | string | no | File path or URL |

### search_space
Semantic similarity search — find knowledge by meaning.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | yes | Natural language search |
| category | string | no | Filter by category |
| project | string | no | Filter by project |
| limit | number | default: 10 | Max results |
| threshold | number | default: 0.7 | Similarity threshold (0-1) |

### capture_visual
Screenshot + description → dual embedding (semantic + visual).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string | yes | Semantic description of the visual pattern |
| image_base64 | string | yes | Base64-encoded screenshot |
| category | enum | yes | Category |
| project | string | no | Project name |
| pattern_type | enum | no | baseline/inspiration/delta/rejected/approved/conditional |
| quality_score | number | no | Aesthetic quality 0-5 |
| topics | string[] | default: [] | Semantic tags |
| components | string[] | default: [] | Components |

### search_visual_similarity
Find patterns that LOOK like a given image.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| image_base64 | string | yes | Base64 image to compare |
| category | string | no | Filter |
| project | string | no | Filter |
| pattern_type | enum | no | Filter by pattern type |
| limit | number | default: 5 | Max results |
| threshold | number | default: 0.6 | Visual similarity threshold |

### capture_feedback_pair
Linked before/after pair with designer reasoning.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| before_description | string | yes | BEFORE state description |
| before_image_base64 | string | no | BEFORE screenshot |
| after_description | string | yes | AFTER state description |
| after_image_base64 | string | no | AFTER screenshot |
| reasoning | string | yes | WHY the designer made this change |
| pattern_type_before | enum | default: 'rejected' | Before state type |
| pattern_type_after | enum | default: 'approved' | After state type |
| project | string | no | Project name |
| topics | string[] | default: [] | Preference tags |
| components | string[] | default: [] | Affected components |

### search_preference_patterns
Red flag detection — check proposed design against rejected patterns.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| description | string | yes | Description of proposed design |
| image_base64 | string | no | Screenshot for visual check |
| project | string | no | Filter by project |
| designer | string | default: 'marten' | Whose preferences |
| semantic_threshold | number | default: 0.75 | Semantic flag threshold |
| visual_threshold | number | default: 0.70 | Visual flag threshold |
| limit | number | default: 5 | Max results |

### recent_knowledge
List recent entries.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | default: 20 | How many |
| category | string | no | Filter |
| project | string | no | Filter |

### space_stats
No parameters. Returns overview statistics.

---

## WDS Workflows

- **[WA] Web Analysis** — Analyze a website into the Design Space
- **[FL] Feedback Loop** — Capture designer preferences as linked pairs
- **[KC] Knowledge Capture** — Guided capture session

---

## Best Practices

1. **Search before you create** — always check what exists
2. **Auto-capture** — save insights as you work, don't wait to be asked
3. **Be specific** — include context, project, reasoning, not just conclusions
4. **Tag with pattern_type** — baseline/inspiration/delta/rejected/approved/conditional
5. **Use visual capture** for anything with a screenshot — the visual embedding catches patterns text can't describe
